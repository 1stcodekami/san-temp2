// src/app/component/ceramics.tsx
"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Initialize the image URL builder with your Sanity project configuration
const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source); // Returns the image URL for the Sanity image source
}

interface CeramicsProps {
  heading?: string; // Optional heading
}

const Ceramics2: React.FC<CeramicsProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const query = `*[_type == 'product']{
        _id,
        image,
        description,
        "category": category->name,
        price,
        name,
        slug
      }`;
      const data = await client.fetch<Product[]>(query);
      setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-20">
      {/* Responsive Grid Columns */}
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          // Only display first 4 products
          <div key={product._id}>
            {product.slug ? (
              <Link href={`/products/${product.slug.current}`}>
                <div className="bg-[#F5F5F5] flex justify-center items-center">
                  <div className="w-full h-[375px] relative transform hover:scale-105 transition-all duration-300">
                    {/* Display Image */}
                    {product.image && (
                      <Image
                        src={urlFor(product.image)
                          .width(300)
                          .height(200)
                          .url()}
                        alt={product.name}
                        layout="fill"
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="bg-[#F5F5F5] flex justify-center items-center">
                <div className="w-full h-[375px] relative">
                  {/* Display Image */}
                  {product.image && (
                    <Image
                      src={urlFor(product.image)
                        .width(300)
                        .height(200)
                        .url()}
                      alt={product.name}
                      layout="fill"
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
            )}
            {/* Text below the image */}
            <div className="mt-4 text-start">
              <h1 className="font-medium text-base sm:text-lg">
                {product.name}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                £{product.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* View Collection Button */}
      <div className="mt-8 flex justify-center lg:justify-start">
        <button className="bg-[#F9F9F9] h-[56px] w-[200px] flex justify-center items-center text-black hover:bg-gray-300 transition-all">
          View Collection
        </button>
      </div>
    </div>
  );
};

export default Ceramics2;
