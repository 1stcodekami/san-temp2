import { client } from "@/sanity/lib/client";
import sharp from "sharp";

// Define the product type according to your schema
type Product = {
  _id: string;
  name: string;
  image: string; // URL of the product image
  price: number;
  description: string;
  features: string[];
  dimensions: { width: string; height: string; depth: string };
  category: { name: string; slug: string };
  tags: string[];
};

// Fetch and migrate data
export const fetchData = async (): Promise<void> => {
  try {
    const products = await fetchPaginatedData();

    const transaction = client.transaction();

    for (const product of products) {
      const {
        _id,
        name,
        image,
        price,
        description,
        features,
        dimensions,
        category,
        tags,
      } = product;

      try {
        // Upload image to Sanity
        const imageAsset = await uploadImage(image);

        if (!imageAsset) {
          console.warn(`Skipping product due to image upload failure: ${name}`);
          continue;
        }

        // Find or create the category document in Sanity
        const categoryRef = await findOrCreateCategory(category);

        // Add product creation to the transaction
        transaction.createOrReplace({
          _type: "product", // Schema name
          _id, // Use the existing _id for consistency
          name,
          description,
          price, // Ensure price is a number
          image: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageAsset._id,
            },
          },
          features, // Map features array
          dimensions, // Map dimensions object
          category: categoryRef, // Reference category document
          tags, // Map tags array
        });

        console.log(`Prepared migration for product: ${name}`);
      } catch (err) {
        console.error(`Failed to prepare product: ${name}`, err);
      }
    }

    // Commit the transaction
    await transaction.commit();
    console.log("Successfully migrated all products.");
  } catch (error) {
    console.error("Error in fetchData:", error);
  }
};

// Function to fetch paginated product data
const fetchPaginatedData = async (): Promise<Product[]> => {
  const limit = 50;
  let offset = 0;
  let products: Product[] = [];
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`https://hackathon-apis.vercel.app/api/products?offset=${offset}&limit=${limit}`);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);

    const batch: Product[] = await res.json();
    products = [...products, ...batch];
    offset += limit;
    hasMore = batch.length === limit;
  }

  return products;
};

// Function to upload and resize an image
const resizeImage = async (imageBuffer: Buffer): Promise<Buffer> => {
  return await sharp(imageBuffer)
    .resize({ width: 1000, withoutEnlargement: true })
    .toBuffer();
};

const uploadImage = async (imageUrl: string): Promise<any | null> => {
  try {
    const res = await fetch(imageUrl);

    if (!res.ok) {
      console.warn(`Failed to fetch image from URL: ${imageUrl}`);
      return null;
    }

    const blob = await res.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    const resizedBuffer = await resizeImage(buffer);

    const imageAsset = await client.assets.upload("image", resizedBuffer, {
      filename: imageUrl.split("/").pop() || "image",
      contentType: res.headers.get("content-type") || "image/jpeg",
    });

    return imageAsset;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

// Function to find or create a category document in Sanity
const findOrCreateCategory = async (category: { name: string; slug: string }) => {
  try {
    // Check if the category exists
    const existingCategory = await client.fetch(
      '*[_type == "category" && slug.current == $slug][0]',
      { slug: category.slug }
    );

    if (existingCategory) {
      return { _type: "reference", _ref: existingCategory._id };
    }

    // Create a new category if it doesn't exist
    const newCategory = await client.create({
      _type: "category",
      name: category.name,
      slug: {
        _type: "slug",
        current: category.slug,
      },
    });

    return { _type: "reference", _ref: newCategory._id };
  } catch (error) {
    console.error("Error in findOrCreateCategory:", error);
    throw error;
  }
};

// Execute fetchData
fetchData();
