"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";

// Initialize the image URL builder with your Sanity project configuration
const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source); // Returns the image URL for the Sanity image source
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const query = `*[_type == 'product']{
        image,
        description,
        "category": category->name, // Use 'category->name' to fetch the category name
        price,
        features,
        dimensions,
        tags,
        slug,
        name,
        quantity,
        _id
      }`;
      const data: Product[] = await client.fetch(query);
      setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg shadow-md">
            {/* Display Image */}
            {product.image && product.image.asset && (
              <Image
                src={urlFor(product.image).width(300).height(200).url()} // Generate image URL with Sanity's Image URL Builder
                alt={product.name}
                width={300}
                height={200}
                className="rounded"
              />
            )}
            <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="font-bold text-lg">${product.price}</p>
            <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
            
            {/* Display Category */}
            {product.category && (
              <p className="text-sm text-gray-500">Category: {product.category.name}</p> // Display the category name (access 'name')
            )}

            <div className="mt-2">
              <p className="font-semibold">Features:</p>
              <ul className="list-disc ml-4">
                {product.features?.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="mt-2">
              <p className="font-semibold">Dimensions:</p>
              <p>Width: {product.dimensions?.width}</p>
              <p>Height: {product.dimensions?.height}</p>
              <p>Depth: {product.dimensions?.depth}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
