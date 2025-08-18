import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FC } from "react";

type WeatherProps = {
  city?: string;
  condition?: string;
  temperature?: string;
  humidity?: string;
  wind?: string;
};

export const WeatherComponent: FC<WeatherProps> = ({
  city,
  condition,
  temperature,
  humidity,
  wind,
}) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Weather in {city ?? "Unknown"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-gray-700">
        {condition && (
          <p>
            <span className="font-medium">Condition:</span> {condition}
          </p>
        )}
        {temperature && (
          <p>
            <span className="font-medium">Temperature:</span> {temperature}
          </p>
        )}
        {humidity && (
          <p>
            <span className="font-medium">Humidity:</span> {humidity}
          </p>
        )}
        {wind && (
          <p>
            <span className="font-medium">Wind:</span> {wind}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
