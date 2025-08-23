import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FC } from "react";
import { Cloud, Thermometer, Droplets, Wind } from "lucide-react";
import { motion } from "motion/react";
import { MagicCard } from "@/components/magicui/magic-card";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="w-full max-w-sm bg-white/90 backdrop-blur-sm border border-slate-200/50 rounded-xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Cloud className="h-3 w-3 text-white" />
            </div>
            Weather in {city?.toLocaleUpperCase() ?? "Unknown"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm text-slate-600">
          {condition && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <Cloud className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Condition:</span> {condition}
            </motion.div>
          )}
          {temperature && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Thermometer className="h-4 w-4 text-red-500" />
              <span className="font-medium">Temp:</span>{" "}
              <span className="text-base font-semibold text-slate-800">
                {temperature}
              </span>
            </motion.div>
          )}
          {humidity && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex items-center gap-2"
            >
              <Droplets className="h-4 w-4 text-blue-400" />
              <span className="font-medium">Humidity:</span> {humidity}
            </motion.div>
          )}
          {wind && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex items-center gap-2"
            >
              <Wind className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Wind:</span> {wind}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
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
      Math.min(prev + itemsPerView, (products?.length || 0) - itemsPerView)
    );
  };

  const visibleProducts = products?.slice(
    startIndex,
    startIndex + itemsPerView
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full"
    >
      {/* Header with arrows */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <ShoppingBag className="h-3 w-3 text-white" />
          </div>
          Products
        </h2>
        <div className="flex gap-2">
          <Button 
            size="icon" 
            onClick={handlePrev} 
            disabled={startIndex === 0}
            variant="outline"
            className="border-slate-200 hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={handleNext}
            disabled={startIndex + itemsPerView >= (products?.length || 0)}
            variant="outline"
            className="border-slate-200 hover:bg-slate-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {visibleProducts?.map((product, index) => (
          <motion.div
            key={product.product_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div
              key={product.product_id}
              className="group relative overflow-hidden rounded-lg border border-neutral-200 transition-all duration-300 hover:shadow-md dark:border-neutral-800"
            >
              <div className="aspect-[4/5] overflow-hidden bg-gray-100">
                <Image
                  src={`/${product.image_url}`}
                  alt={product.name}
                  width={400}
                  height={500}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-gray-500 mt-1 text-sm">Available in stock: {product.stock}</p>
                <p className="mt-2 text-black font-semibold">₹{product.price.toFixed(2)}</p>
                  <Button className="w-full mt-3 bg-black text-white hover:bg-gray-800" onClick={() => {
                    const newMessage = {
                      type: "human",
                      content: `Add ${product.name} to cart`,
                    };
                    submit({ messages: [newMessage] });
                  }}>Add to Cart</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="sm:col-span-3 mt-4"
      >
        <p className="text-center text-sm text-slate-500">
          Click a product card to see more details.
        </p>
      </motion.div>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-sm"
    >
      <Card className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/50 p-6 shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <ShoppingCart className="w-3 h-3 text-white" />
            </div>
            <h2 className="text-lg font-medium text-slate-800">Order summary</h2>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3 mb-6">
          {items.map((item, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex justify-between items-center"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-slate-800">
                    {item.name}
                  </h3>
                  <span className="text-xs text-slate-400">×{item.quantity}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-800">
                ${item.subtotal.toFixed(2)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 pt-4">
          <div className="flex justify-between items-center">
            <p className="text-base font-medium text-slate-800">Total</p>
            <p className="text-lg font-semibold text-slate-800">
              ${total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Checkout Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6"
        >
          <ShimmerButton
            onClick={(e) => {
              e.stopPropagation();
              const newMessage = {
                type: "human",
                content: `Continue to checkout my cart!`,
              };
              submit({ messages: [newMessage] });
            }}
            className="w-full"
          >
            Continue to checkout
          </ShimmerButton>
        </motion.div>
      </Card>
    </motion.div>
  );
};
