import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FC } from "react";
import { Cloud, Thermometer, Droplets, Wind } from "lucide-react";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Tag } from "lucide-react";

import { useStreamContext } from "@langchain/langgraph-sdk/react-ui";
import { ShoppingBag, Hash, DollarSign } from "lucide-react";

type Product = {
  image_url: string; // image url
  product_id: number;
  name: string;
  price: number;
  stock: number;
};

type ProductCarouselProps = {
  products?: Product[];
};

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
  console.log("WeatherComponent props:", {
    city,
    condition,
    temperature,
    humidity,
    wind,
  });

  return (
    <Card className="w-full max-w-sm shadow-lg  border-0 rounded-2xl">
      <CardHeader className="pb-1">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Weather in {city?.toLocaleUpperCase() ?? "Unknown"}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        {condition && (
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            <span className="font-medium">Condition:</span> {condition}
          </div>
        )}
        {temperature && (
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            <span className="font-medium">Temp:</span>{" "}
            <span className="text-base font-semibold text-gray-900">
              {temperature}
            </span>
          </div>
        )}
        {humidity && (
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 " />
            <span className="font-medium">Humidity:</span> {humidity}
          </div>
        )}
        {wind && (
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 " />
            <span className="font-medium">Wind:</span> {wind}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const ProductCarousel: FC<ProductCarouselProps> = ({ products }) => {
  console.log("ProductCarousel products:", products);
  const { submit } = useStreamContext();
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerView = 3; // how many cards visible at once

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - itemsPerView, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + itemsPerView, products?.length - itemsPerView)
    );
  };

  const visibleProducts = products?.slice(
    startIndex,
    startIndex + itemsPerView
  );

  return (
    <div className="relative w-full">
      {/* Header with arrows */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Products
        </h2>
        <div className="flex gap-2">
          <Button size="icon" onClick={handlePrev} disabled={startIndex === 0}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            onClick={handleNext}
            disabled={startIndex + itemsPerView >= products?.length}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {visibleProducts?.map((product) => (
          <Card
            key={product.product_id}
            className="relative w-[161px] h-[256px] group hover:translate-y-[-2px] transition-all duration-200 shadow-lg border-0 rounded-xl overflow-hidden"
          >
            {/* Optimized image with Next.js */}
            <Image
              src={`/${product.image_url}`}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 161px"
            />

            {/* Overlay gradient and text */}
            <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-1 p-3 text-white bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-sm font-semibold truncate">{product.name}</p>
              <div className="flex items-center gap-2 text-xs">
                <p className="flex items-center gap-1">
                  <Tag className="w-3 h-3 text-yellow-400" />${product.price}
                </p>
                <p className="flex items-center gap-1">
                  <Package className="w-3 h-3 text-blue-400" />
                  {product.stock}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation(); // prevent card click (details)
                const newMessage = {
                  type: "human",
                  content: `Add ${product.name} to cart`,
                };
                submit({ messages: [newMessage] });
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
             px-4 py-2 rounded-lg text-white font-medium 
             opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              Add to Cart
            </Button>
          </Card>
        ))}
      </div>
      <div className="sm:col-span-3 mt-3">
        <p className="text-center text-sm text-gray-600">
          Click a product card to see more details.
        </p>
      </div>
    </div>
  );
};

import { ShoppingCart } from "lucide-react";

interface CartItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface CartProps {
  items: CartItem[];
  total: number;
}

export const CartComponent: FC<CartProps> = ({ items, total }) => {
  const { submit } = useStreamContext();

  return (
    <div className="w-full max-w-sm bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3 mb-6">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-900">
                  {item.name}
                </h3>
                <span className="text-xs text-gray-400">×{item.quantity}</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900">
              ${item.subtotal.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center">
          <p className="text-base font-medium text-gray-900">Total</p>
          <p className="text-lg font-semibold text-gray-900">
            ${total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={(e) => {
          e.stopPropagation(); // prevent card click (details)
          const newMessage = {
            type: "human",
            content: `Continue to checkout my cart!`,
          };
          submit({ messages: [newMessage] });
        }}
        variant="outline"
        className="w-full mt-6  text-black py-3 px-4 rounded-md text-sm font-medium  transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      >
        Continue to checkout
      </Button>
    </div>
  );
};
