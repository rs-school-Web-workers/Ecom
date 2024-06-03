export interface CardItem {
  name: string;
  description: string;
  priceWithDiscount: string;
  priceWithoutDiscount: string;
  imageLink: string;
}

export interface ICatalogFilter {
  colors: string[];
  sizes: string[];
  cloth: string[];
  brand: string[];
  min: number;
  max: number;
}

export const DressColors: string[] = [
  'black',
  'grey',
  'blue',
  'green',
  'beige',
  'pink',
  'white',
  'fuchsia',
  'brown',
  'grey',
  'khaki',
  'purple',
  'red',
  'yellow',
  'orange',
  'turquoise',
];

export const DressSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const DressBrand = [
  'PUMA',
  'oodji',
  'The North Face',
  'United Color of Benetton',
  'Sela',
  'Mango',
  'Colin`s',
  'RNT 23',
  'Armani Exchange',
  'Primo Emporio',
  's.Oliver',
  'Marselesa',
  'Sisley',
  'Antony Morato',
  'Lee',
  'Levi`s',
  'Nume',
  'Pink Frost',
  'Franco La`Rinchi',
  'EA7',
  'Fila',
  'Kappa',
];

export const dresses = ['T-shirt', 'Trunks', 'Jackets', 'Pants', 'Shirts', 'Sport-suits', 'For-swimming'];

export const sortValue = ['asc', 'des', 'alph'];

export const styles = ['Casual', 'Formal', 'Gym'];

export const styleSubcategory = [
  ['T-shirt', 'Trunks'],
  ['Jackets', 'Pants', 'Shirts'],
  ['Sport-suits', 'For-swimming'],
];

export const defaultStateFilter: ICatalogFilter = {
  colors: [],
  sizes: [],
  cloth: [],
  brand: [],
  min: 1,
  max: 1000,
};
