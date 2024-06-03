export interface IProduct {
  name: string;
  price: string;
  discount: string;
  definition: string;
  colors: string[];
  sizes: string[];
  images: string[];
  brand: string;
}

export type Variant = {
  color: string;
  price: string;
  discounted?: string;
  brand: string;
  images: string[];
  sizes: string[];
};
