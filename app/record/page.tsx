// app/screen-recorder/page.tsx
// A lightweight, client-only Next.js screen recorder with YouTube-friendly export options.
// Features
// - Record screen (screen/window/tab)
// - Optional system audio (from the display capture)
// - Optional microphone audio (mixed with system audio)
// - Pause / Resume / Stop
// - Adjustable video bitrate & frame rate
// - Instant download as WebM (works on YouTube)
// - Optional in-browser MP4 conversion using ffmpeg.wasm (H.264 + AAC)
// - Minimal, clean Tailwind UI
//
// Notes
// - YouTube accepts WebM (VP8/VP9) uploads, so MP4 conversion is optional.
// - MP4 conversion runs fully in-browser and can be slow; use only if you must.
// - Some browsers/OSes restrict capturing system audio; keep the toggle flexible.
// - Tested on Chromium-based browsers.

'use client';

import React, { useEffect, useRef, useState } from 'react';

// Lazy FFmpeg only when needed
let ffmpegSingleton: any = null;
async function getFFmpeg() {
  if (ffmpegSingleton) return ffmpegSingleton;
  const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  ffmpegSingleton = { ffmpeg, fetchFile };
  return ffmpegSingleton;
}

export default function ScreenRecorderPage() {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [includeSystemAudio, setIncludeSystemAudio] = useState(true);
  const [includeMic, setIncludeMic] = useState(true);
  const [frameRate, setFrameRate] = useState(30);
  const [bitrate, setBitrate] = useState(6_000_000); // 6 Mbps default
  const [fileName, setFileName] = useState('recording');

  const [duration, setDuration] = useState(0); // seconds
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [mp4BlobUrl, setMp4BlobUrl] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);

  const displayVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  const composedStreamRef = useRef<MediaStream | null>(null);
  const displayStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopEverything();
    };
  }, []);

  function clearTimer() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function startTimer() {
    clearTimer();
    setDuration(0);
    timerRef.current = window.setInterval(() => setDuration((d) => d + 1), 1000);
  }

  function humanTime(totalSeconds: number) {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  async function buildComposedStream() {
    // 1) Get the display (screen/window/tab) stream; may include system audio if requested.
    const displayStream = await (navigator.mediaDevices as any).getDisplayMedia({
      video: { frameRate },
      audio: includeSystemAudio ? { echoCancellation: false, noiseSuppression: false } : false,
    });
    displayStreamRef.current = displayStream;

    // Show a live preview of the captured display
    if (displayVideoRef.current) {
      displayVideoRef.current.srcObject = displayStream;
      displayVideoRef.current.onloadedmetadata = () => displayVideoRef.current?.play();
    }

    // 2) Optionally get the microphone stream
    let micStream: MediaStream | null = null;
    if (includeMic) {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = micStream;
    }

    // 3) Mix audio (display system audio + mic) if both exist
    const displayTracks = displayStream.getVideoTracks();
    const videoTrack = displayTracks[0];

    let finalAudioTrack: MediaStreamTrack | null = null;
    const hasDisplayAudio = displayStream.getAudioTracks().length > 0;

    if (hasDisplayAudio || micStream) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const destination = audioContext.createMediaStreamDestination();

      if (hasDisplayAudio) {
        const displayAudioSource = audioContext.createMediaStreamSource(new MediaStream(displayStream.getAudioTracks()));
        displayAudioSource.connect(destination);
      }
      if (micStream) {
        const micSource = audioContext.createMediaStreamSource(micStream);
        micSource.connect(destination);
      }

      finalAudioTrack = destination.stream.getAudioTracks()[0] || null;
    }

    const composed = new MediaStream();
    if (videoTrack) composed.addTrack(videoTrack);
    if (finalAudioTrack) composed.addTrack(finalAudioTrack);

    composedStreamRef.current = composed;
    if (previewVideoRef.current) {
      previewVideoRef.current.srcObject = composed;
      previewVideoRef.current.onloadedmetadata = () => previewVideoRef.current?.play();
    }
  }

  async function startRecording() {
    try {
      setBlobUrl(null);
      setMp4BlobUrl(null);
      await buildComposedStream();

      const composed = composedStreamRef.current!;
      const options: MediaRecorderOptions = {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: bitrate,
      } as any;

      // Fallback if browser can't do vp9
      if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
        options.mimeType = 'video/webm;codecs=vp8,opus';
      }

      const mr = new MediaRecorder(composed, options);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: options.mimeType });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        clearTimer();
        setRecording(false);
        setPaused(false);
      };

      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
      setPaused(false);
      startTimer();
    } catch (err) {
      console.error(err);
      alert('Failed to start recording. Check permissions and try again.');
      stopEverything();
    }
  }

  function pauseResume() {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    if (mr.state === 'recording') {
      mr.pause();
      setPaused(true);
    } else if (mr.state === 'paused') {
      mr.resume();
      setPaused(false);
    }
  }

  function stopRecording() {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    mr.stop();
    mediaRecorderRef.current = null;
    // Stop tracks to free the picker capture
    [composedStreamRef.current, displayStreamRef.current, micStreamRef.current].forEach((s) => {
      s?.getTracks().forEach((t) => t.stop());
    });
  }

  function stopEverything() {
    try {
      clearTimer();
      mediaRecorderRef.current?.stop();
    } catch {}
    [composedStreamRef.current, displayStreamRef.current, micStreamRef.current].forEach((s) => {
      s?.getTracks().forEach((t) => t.stop());
    });
    mediaRecorderRef.current = null;
    setRecording(false);
    setPaused(false);
  }

  function downloadWebM() {
    if (!blobUrl) return;
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${fileName || 'recording'}.webm`;
    a.click();
  }

  async function convertToMP4() {
    if (!blobUrl) return;
    setConverting(true);
    try {
      const res = await fetch(blobUrl);
      const webmData = await res.blob();

      const { ffmpeg, fetchFile } = await getFFmpeg();
      ffmpeg.FS('writeFile', 'input.webm', await fetchFile(webmData));
      // Fast-ish H.264 + AAC encode. You can tweak crf/preset.
      await ffmpeg.run(
        '-i', 'input.webm',
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23',
        '-c:a', 'aac', '-b:a', '192k',
        'output.mp4'
      );
      const mp4Data = ffmpeg.FS('readFile', 'output.mp4');
      const mp4Blob = new Blob([mp4Data.buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(mp4Blob);
      setMp4BlobUrl(url);
    } catch (e) {
      console.error(e);
      alert('MP4 conversion failed. You can still upload the WebM to YouTube.');
    } finally {
      setConverting(false);
    }
  }

  function downloadMP4() {
    if (!mp4BlobUrl) return;
    const a = document.createElement('a');
    a.href = mp4BlobUrl;
    a.download = `${fileName || 'recording'}.mp4`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Screen Recorder (Next.js) — simple & YouTube-ready</h1>
          <div className="text-sm opacity-70">{recording ? 'Recording…' : 'Idle'}</div>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 bg-neutral-900 rounded-2xl p-4 shadow">
            <div className="text-sm mb-2 opacity-80">Live Preview</div>
            <video ref={previewVideoRef} className="w-full aspect-video bg-black rounded-xl" muted playsInline/>
            <div className="mt-3 flex items-center justify-between">
              <div className="font-mono text-lg">{humanTime(duration)}</div>
              <div className="flex items-center gap-3">
                {!recording && (
                  <button onClick={startRecording} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition font-medium">Start</button>
                )}
                {recording && (
                  <>
                    <button onClick={pauseResume} className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 transition font-medium">
                      {paused ? 'Resume' : 'Pause'}
                    </button>
                    <button onClick={stopRecording} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 transition font-medium">Stop</button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 rounded-2xl p-4 shadow space-y-4">
            <div>
              <label className="text-sm opacity-80">File name</label>
              <input
                className="mt-1 w-full bg-neutral-800 rounded-xl px-3 py-2 outline-none focus:ring-2 ring-emerald-500"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="recording"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm">Include system audio</label>
              <input type="checkbox" checked={includeSystemAudio} onChange={(e) => setIncludeSystemAudio(e.target.checked)} />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">Include microphone</label>
              <input type="checkbox" checked={includeMic} onChange={(e) => setIncludeMic(e.target.checked)} />
            </div>

            <div>
              <label className="text-sm">
                Frame rate: <span className="font-mono">{frameRate} fps</span>
              </label>
              <input
                type="range"
                min={10}
                max={60}
                step={1}
                value={frameRate}
                onChange={(e) => setFrameRate(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm">
                Video bitrate: <span className="font-mono">{Math.round(bitrate / 1_000_000)} Mbps</span>
              </label>
              <input
                type="range"
                min={2_000_000}
                max={16_000_000}
                step={1_000_000}
                value={bitrate}
                onChange={(e) => setBitrate(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="text-xs opacity-70">
              Tip: YouTube happily accepts <span className="font-mono">.webm</span> uploads. Use MP4 only if your editor demands it.
            </div>
          </div>
        </div>

        {/* Hidden raw display preview (helps users see what is being captured). */}
        <details className="mb-4">
          <summary className="cursor-pointer opacity-70">Show raw display stream (debug)</summary>
          <video ref={displayVideoRef} className="w-full mt-2 rounded-xl bg-black" muted playsInline />
        </details>

        <div className="bg-neutral-900 rounded-2xl p-4 shadow mb-8">
          <div className="flex flex-wrap gap-3 items-center">
            <button
              disabled={!blobUrl}
              onClick={downloadWebM}
              className="px-4 py-2 rounded-xl bg-sky-600 disabled:opacity-40 hover:bg-sky-500 transition font-medium"
            >
              Download WebM
            </button>
            <button
              disabled={!blobUrl || converting}
              onClick={convertToMP4}
              className="px-4 py-2 rounded-xl bg-indigo-600 disabled:opacity-40 hover:bg-indigo-500 transition font-medium"
            >
              {converting ? 'Converting…' : 'Convert to MP4 (beta)'}
            </button>
            <button
              disabled={!mp4BlobUrl}
              onClick={downloadMP4}
              className="px-4 py-2 rounded-xl bg-emerald-600 disabled:opacity-40 hover:bg-emerald-500 transition font-medium"
            >
              Download MP4
            </button>
            {blobUrl && (
              <a
                href={blobUrl}
                target="_blank"
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition font-medium"
              >
                Open WebM in new tab
              </a>
            )}
            {mp4BlobUrl && (
              <a
                href={mp4BlobUrl}
                target="_blank"
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition font-medium"
              >
                Open MP4 in new tab
              </a>
            )}
          </div>
          <div className="text-sm opacity-70 mt-3">
            WebM files are lightweight and upload directly to YouTube. MP4 conversion happens fully in your browser using ffmpeg.wasm.
          </div>
        </div>

        <footer className="opacity-60 text-sm">
          Privacy: Nothing leaves your computer. All capture and conversion are local.
        </footer>
      </div>
    </div>
  );
}
