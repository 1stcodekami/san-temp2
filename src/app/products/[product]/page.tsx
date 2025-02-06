// src/app/products/[product]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: SanityImageSource;
  slug: {
    current: string;
  };
  category?: string;
}

interface PageParams {
  params: {
    product: string;
  };
}

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export default function ProductPage({ params }: PageParams) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    client
      .fetch<Product>(
        `*[_type == "product" && slug.current == $slug][0]{
          _id,
          name,
          price,
          description,
          image,
          slug,
          "category": category->name
        }`,
        { slug: params.product }
      )
      .then(setProduct)
      .catch(console.error);
  }, [params.product]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image
            src={urlFor(product.image).url()}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-2xl">£{product.price}</p>
          <p className="text-gray-600">{product.description}</p>
          <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}