export interface Product {
  _id: string;
  title: string;
  price: number;
  priceWithoutDiscount: number;
  badge?: string;
  image?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
      url?: string;
    };
  };
  category?: {
    name: string;
  };
  description?: string;
  inventory: number;
  tags?: string[];
}
export interface Order {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  bankName: string;
  bankDetails: string;
  totalPrice: number;
  items: Product[];
  _createdAt: string;
}
