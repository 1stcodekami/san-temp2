// src/app/test/page.tsx
"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface Dimensions {
  width?: number;
  height?: number;
  depth?: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity?: number;
  image: SanityImageSource;
  slug?: {
    current: string;
  };
  category?: string;
  features?: string[];
  dimensions?: Dimensions;
  tags?: string[];
}

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source); // Returns the image URL for the Sanity image source
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const query = `*[_type == 'product']{
        _id,
        name,
        description,
        price,
        quantity,
        image,
        slug,
        "category": category->name,
        features,
        dimensions,
        tags
      }`;
      const data = await client.fetch<Product[]>(query);
      setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-4 rounded-lg shadow-md"
          >
            {/* Display Image */}
            {product.image && (
              <Image
                src={urlFor(product.image)
                  .width(300)
                  .height(200)
                  .url()}
                alt={product.name}
                width={300}
                height={200}
                className="rounded"
              />
            )}
            <h2 className="text-xl font-semibold mt-2">
              {product.name}
            </h2>
            <p className="text-gray-600 mt-1">
              {product.description}
            </p>
            <p className="font-bold text-lg mt-2">£{product.price}</p>
            {product.quantity !== undefined && (
              <p className="text-sm text-gray-500">
                Quantity: {product.quantity}
              </p>
            )}

            {/* Display Category */}
            {product.category && (
              <p className="text-sm text-gray-500 mt-1">
                Category: {product.category}
              </p>
            )}

            {/* Features List */}
            {product.features && product.features.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Features:</p>
                <ul className="list-disc ml-4">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dimensions */}
            {product.dimensions && (
              <div className="mt-2">
                <p className="font-semibold">Dimensions:</p>
                {product.dimensions.width && (
                  <p>Width: {product.dimensions.width} cm</p>
                )}
                {product.dimensions.height && (
                  <p>Height: {product.dimensions.height} cm</p>
                )}
                {product.dimensions.depth && (
                  <p>Depth: {product.dimensions.depth} cm</p>
                )}
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Tags:</p>
                <ul className="flex flex-wrap gap-2 mt-1">
                  {product.tags.map((tag, index) => (
                    <li
                      key={index}
                      className="bg-gray-200 px-2 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
