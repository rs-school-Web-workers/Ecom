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
  id: number;
  color: string;
  price: number;
  discounted?: number;
  brand: string;
  images: string[];
  sizes: string[];
};
