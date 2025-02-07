"use client";

import { useState, useEffect } from "react";
import { sanityClient } from "@/sanity/lib/client";
import { ordersQuery, productsQuery } from "@/queries";
import type { Order, Product } from "@/types";

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");

  useEffect(() => {
    const fetchData = async () => {
      const [ordersRes, productsRes] = await Promise.all([
        sanityClient.fetch<Order[]>(ordersQuery),
        sanityClient.fetch<Product[]>(productsQuery),
      ]);
      setOrders(ordersRes);
      setProducts(productsRes);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-lg shadow-lg ${activeTab === "orders" ? "bg-black font-semibold text-white" : "bg-white"}`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-lg shadow-lg ${activeTab === "products" ? "bg-black font-semibold text-white" : "bg-white"}`}
          >
            Products ({products.length})
          </button>
        </div>

        {activeTab === "orders" ? (
          <OrderTable orders={orders} />
        ) : (
          <ProductSection products={products} />
        )}
      </div>
    </div>
  );
};

interface OrderTableProps {
  orders: Order[];
}

const OrderTable = ({ orders }: OrderTableProps) => (
  <div className="bg-white rounded-lg shadow overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Customer
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Contact
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Total
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Items
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {orders.map((order) => (
          <tr key={order._id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="font-medium">{order.name}</div>
              <div className="text-sm text-gray-500">{order.address}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div>{order.email}</div>
              <div className="text-sm text-gray-500">{order.phone}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">${order.totalPrice}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-wrap gap-2">
                {order.items?.map((item) => (
                  <span
                    key={item._id}
                    className="bg-gray-100 px-2 py-1 rounded text-sm"
                  >
                    {item.title}
                  </span>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


interface ProductSectionProps {
  products: Product[];
}

const ProductSection = ({ products }: ProductSectionProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map((product) => (
      <div key={product._id} className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold">${product.price}</span>
          <span className="text-sm text-gray-500">
            Stock: {product.inventory}
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default AdminDashboard;
