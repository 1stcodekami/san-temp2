// src/types.ts
export interface Product {
  id: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: {
    asset: {
      _ref: string;
    };
  };
  features?: string[];
  tags?: string[];
  slug?: {
    current: string;
  };
  category?: { name: string };
  dimensions?: {
    width: string;
    height: string;
    depth: string;
  };
}

// New CartItem interface that uses a string for the image URL.
export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number; // Add this line
}
