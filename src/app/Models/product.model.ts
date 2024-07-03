export interface Product {
  id: number;
  nom: string;
  prix: number;
  old_price?: number;
  sku: string;
  category_id: number;
  tags: Tag[];
  color?: string;
  image_initiale: string;
  description: string;
  category: Category;
  tag: Tag;
  images: Image[];
}

export interface Category {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Image {
  id: number;
  product_id: number;
  image: string;
}
