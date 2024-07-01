export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  order_items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    nom: string;
    prix: number;
    image_initiale: string;
  };
}
