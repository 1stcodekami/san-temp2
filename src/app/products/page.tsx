// src\app\products\page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import imageUrlBuilder from "@sanity/image-url";

// Define product type (note the addition of the slug)
interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: {
    asset: {
      _ref: string;
    };
  };
  slug: {
    current: string;
  };
  category?: string;
}

// Configure image URL builder
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; // Adjust this value as needed

  useEffect(() => {
    client
      .fetch<Product[]>(
        `*[_type == "product"]{
          _id,
          name,
          price,
          description,
          image,
          slug,
          "category": category->name
        }`
      )
      .then((data) => setProducts(data))
      .catch(console.error);
  }, []);

  // Calculate indices for current page items
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Handler for page change
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handlers for previous and next buttons
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="text-center p-10">
        <h1 className="font-bold text-4xl mb-4">All Product</h1>
      </div>

      <section
        id="Projects"
        className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5"
      >
        {currentProducts.map((product) => (
          // Wrap the card directly in a Link
          <Link key={product._id} href={`/products/${product.slug.current}`}>
            <div className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl cursor-pointer">
              {product.image && (
                <img
                  src={urlFor(product.image).url()}
                  alt={product.name}
                  className="h-80 w-72 object-cover rounded-t-xl"
                />
              )}
              <div className="px-4 py-3 w-72">
                <div className="flex justify-between">
                  <p className="text-lg font-bold text-black truncate block capitalize">
                    {product.name}
                  </p>
                  <FaRegHeart size={20} />
                </div>
                <div className="flex items-center">
                  <p className="text-lg font-semibold text-black cursor-auto my-3">
                    ${product.price}
                  </p>
                  <div className="ml-auto">
                    <MdOutlineShoppingCart
                      size={24}
                      className="text-gray-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <ul className="flex space-x-5 justify-center font-[sans-serif] mb-10">
          {/* Previous Button */}
          <li
            onClick={handlePrevious}
            className={`flex items-center justify-center shrink-0 bg-gray-100 w-9 h-9 rounded-md cursor-pointer ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 fill-gray-400"
              viewBox="0 0 55.753 55.753"
            >
              <path
                d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                data-original="#000000"
              />
            </svg>
          </li>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <li
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber)}
                className={`flex items-center justify-center shrink-0 cursor-pointer text-base font-bold px-[13px] h-9 rounded-md border hover:border-blue-500 ${
                  currentPage === pageNumber
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "text-gray-800"
                }`}
              >
                {pageNumber}
              </li>
            );
          })}

          {/* Next Button */}
          <li
            onClick={handleNext}
            className={`flex items-center justify-center shrink-0 border w-9 h-9 rounded-md cursor-pointer ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:border-blue-500"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 fill-gray-400 rotate-180"
              viewBox="0 0 55.753 55.753"
            >
              <path
                d="M12.745 23.915c.283-.282.59-.52.913-.727L35.266 1.581a5.4 5.4 0 0 1 7.637 7.638L24.294 27.828l18.705 18.706a5.4 5.4 0 0 1-7.636 7.637L13.658 32.464a5.367 5.367 0 0 1-.913-.727 5.367 5.367 0 0 1-1.572-3.911 5.369 5.369 0 0 1 1.572-3.911z"
                data-original="#000000"
              />
            </svg>
          </li>
        </ul>
      )}
    </>
  );
}
