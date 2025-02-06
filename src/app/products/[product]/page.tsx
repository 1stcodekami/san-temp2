// src/app/products/[product]/page.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
// import Link from "next/link";
import Ceramics from "../../component/ceramics";
import Brand from "../../component/brand";
import Club from "../../component/club";
import CartButton from "@/app/component/CartButton";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import { Product } from "@/types";

// Initialize the image URL builder with your Sanity client configuration
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

interface PageProps {
  params: { product: string };
}

const Page: React.FC<PageProps> = ({ params }) => {
  // Assume params.product contains the product slug.
  const { product: productSlug } = params;
  const [data, setData] = useState<Product | null>(null);

  // State to manage selected quantity
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  useEffect(() => {
    async function fetchProduct() {
      // Query a single product whose slug.current matches the dynamic route parameter
      const query = `*[_type == "product" && slug.current == $slug][0]{
        image,
        description,
        "category": category->name,
        price,
        name,
        slug,
        features,
        dimensions,
        tags,
        quantity,
        _id
      }`;
      const productData: Product = await client.fetch(query, { slug: productSlug });
      setData(productData);
    }
    fetchProduct();
  }, [productSlug]);

  if (!data) return <div>Loading...</div>;

  // Handler to update selected quantity
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setSelectedQuantity(value);
    } else {
      setSelectedQuantity(1);
    }
  };
  

  // Alternatively, you can use increment/decrement functions
  const incrementQuantity = () => {
    setSelectedQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setSelectedQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <>
      {/* Main Product Section */}
      <div className="min-h-[70vh] w-full flex flex-col md:flex-row items-center justify-center px-4 sm:px-8 lg:px-16 py-8">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          {data.image && data.image.asset && (
            <Image
              src={urlFor(data.image).url()}
              alt="product"
              width={1000}
              height={1000}
              className="h-full w-full object-contain"
            />
          )}
        </div>

        {/* Product Details Section */}
        <div className="w-full md:w-1/2 flex flex-col items-start text-left px-4 sm:px-8 py-8">
          <h1 className="font-normal text-[28px] sm:text-[36px] text-[#2A254B]">
            {data.name}
          </h1>
          <p className="font-normal text-[20px] sm:text-[24px] text-left">
            £{data.price}
          </p>
          <p className="text-[#2A254B] font-bold mt-4">Description</p>
          <p className="text-[#2A254B] mt-4">{data.description}</p>
          {/* Display features if available */}
          {data.features && (
            <div className="mt-4">
              {data.features.map((feature, index) => (
                <p key={index} className="text-[#2A254B]">
                  {feature}
                </p>
              ))}
            </div>
          )}

          {/* Dimensions and Quantity Selection Section */}
          <div className="mt-8">
            <p className="font-bold text-center">Dimensions</p>
            <div className="flex flex-wrap justify-start gap-4 mt-4 text-[#2A254B]">
              <div>
                <p>Height</p>
                <p className="font-semibold">{data.dimensions?.height}</p>
              </div>
              <div>
                <p>Width</p>
                <p className="font-semibold">{data.dimensions?.width}</p>
              </div>
              <div>
                <p>Depth</p>
                <p className="font-semibold">{data.dimensions?.depth}</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-4">
              <p className="font-bold">Quantity</p>
              <div className="flex items-center mt-2">
                {/* Decrement Button */}
                <button
  className={`px-3 py-1 border border-gray-400 text-xl ${selectedQuantity <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
  onClick={decrementQuantity}
  disabled={selectedQuantity <= 1}
>
  -
</button>

                {/* Quantity Display/Input */}
                <input
                  type="number"
                  min="1"
                  value={selectedQuantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center border-t border-b border-gray-400"
                />
                {/* Increment Button */}
                <button
                  className="px-3 py-1 border border-gray-400 text-xl"
                  onClick={incrementQuantity}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="flex justify-center md:justify-start mt-8">
            {/* Pass a cart item with the selected quantity */}
            <CartButton
              cartItem={{
                id: data._id,
                name: data.name,
                price: data.price,
                image:
                  data.image && data.image.asset
                    ? urlFor(data.image).width(300).height(200).url()
                    : "",
                description: data.description,
                quantity: selectedQuantity, // Include the selected quantity
              }}
            />
          </div>
        </div>
      </div>

      {/* Additional Components */}
      <div className="mt-12">
        <Ceramics heading="You might also like" />
        <Brand />
        <Club />
      </div>
    </>
  );
};

export default Page;
