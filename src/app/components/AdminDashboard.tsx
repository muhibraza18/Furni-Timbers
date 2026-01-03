"use client";

import { useState, useEffect } from "react";
import { sanityClient } from "@/sanity/lib/client";
import Image from "next/image";
import { ordersQuery, productsQuery } from "@/queries";
import type { Order, Product } from "@/types";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Search, 
  TrendingUp,
  Edit,
  X,
  Plus,
  Save,
  Trash2,
  Upload,
  AlertCircle
} from "lucide-react";

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products">("overview");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        sanityClient.fetch<Order[]>(ordersQuery),
        sanityClient.fetch<Product[]>(productsQuery),
      ]);
      setOrders(ordersRes);
      setProducts(productsRes);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await sanityClient.delete(productId);
      await fetchData();
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10 shadow-lg">
        <div className="p-6 border-b border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
            F
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Furni Timbers</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem 
            active={activeTab === "overview"} 
            onClick={() => setActiveTab("overview")}
            icon={<LayoutDashboard size={20} />}
            label="Overview"
          />
          <NavItem 
            active={activeTab === "orders"} 
            onClick={() => setActiveTab("orders")}
            icon={<ShoppingCart size={20} />}
            label="Orders"
            badge={totalOrders}
          />
          <NavItem 
            active={activeTab === "products"} 
            onClick={() => setActiveTab("products")}
            icon={<Package size={20} />}
            label="Products"
            badge={totalProducts}
          />
        </nav>
        <div className="p-4 border-t border-slate-200">
          <div className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-3 flex items-center gap-3 border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">
              AD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate">admin@furnitimbers.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <p className="text-slate-500 text-sm mt-1">Manage your store efficiently</p>
            </div>
            {activeTab === "products" && (
              <button 
                onClick={handleCreateProduct}
                className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-slate-800 hover:to-slate-600 transition-all shadow-lg hover:shadow-xl"
              >
                <Plus size={20} /> Add Product
              </button>
            )}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Revenue"
                value={`$${totalRevenue.toLocaleString()}`}
                icon={<DollarSign className="text-green-600" size={24} />}
                trend="+12.5%"
                desc="From last month"
                bgColor="bg-gradient-to-br from-green-50 to-emerald-50"
                borderColor="border-green-200"
              />
              <StatCard
                title="Total Orders"
                value={totalOrders.toString()}
                icon={<ShoppingCart className="text-blue-600" size={24} />}
                trend="+5.2%"
                desc="From last month"
                bgColor="bg-gradient-to-br from-blue-50 to-cyan-50"
                borderColor="border-blue-200"
              />
              <StatCard
                title="Total Products"
                value={totalProducts.toString()}
                icon={<Package className="text-purple-600" size={24} />}
                trend="Stable"
                desc="Inventory count"
                bgColor="bg-gradient-to-br from-purple-50 to-pink-50"
                borderColor="border-purple-200"
              />
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && <OrderTable orders={orders} />}
          
          {/* Products Tab */}
          {activeTab === "products" && (
            <ProductSection 
              products={products} 
              loading={loading}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          )}

        </div>
      </main>

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onSave={async () => {
            await fetchData();
            setShowProductModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

// --- Product Modal Component ---
interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: () => void;
}

const ProductModal = ({ product, onClose, onSave }: ProductModalProps) => {
  // Helper function to get image URL from product
  const getProductImageUrl = (prod: Product | null): string => {
    if (!prod) return "";
    if (prod.image?.asset?.url) return prod.image.asset.url;
    return "";
  };

  const [formData, setFormData] = useState<{
    title: string;
    price: number;
    inventory: number;
    description: string;
    tags: string;
    category: string;
  }>({
    title: product?.title ?? "",
    price: product?.price ?? 0,
    inventory: product?.inventory ?? 0,
    description: product?.description ?? "",
    tags: product?.tags?.join(", ") ?? "",
    category: (product?.category as string | undefined) ?? "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(getProductImageUrl(product));
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageAsset;
      
      // Upload image if new file selected
      if (imageFile) {
        console.log("Uploading image...");
        imageAsset = await sanityClient.assets.upload('image', imageFile);
        console.log("Image uploaded:", imageAsset);
      }

      const productData: {
        _type: string;
        title: string;
        price: number;
        inventory: number;
        description: string;
        tags: string[];
        category?: string;
        image?: {
          _type: string;
          asset: {
            _type: string;
            _ref: string;
          };
        };
      } = {
        _type: "products",
        title: formData.title,
        price: Number(formData.price),
        inventory: Number(formData.inventory),
        description: formData.description,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      };

      // Only add category if it's not empty
      if (formData.category.trim()) {
        productData.category = formData.category;
      }

      // Only add image if it exists
      if (imageAsset) {
        productData.image = {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset._id,
          },
        };
      }

      console.log("Product data to save:", productData);

      if (product?._id) {
        // Update existing product
        console.log("Updating product:", product._id);
        const result = await sanityClient
          .patch(product._id)
          .set(productData)
          .commit();
        console.log("Update result:", result);
        alert("Product updated successfully!");
      } else {
        // Create new product
        console.log("Creating new product...");
        const result = await sanityClient.create(productData);
        console.log("Create result:", result);
        alert("Product created successfully!");
      }

      onSave();
    } catch (error) {
      console.error("Detailed error saving product:", error);
      
      // Show more detailed error message
      if (error instanceof Error) {
        alert(`Failed to save product: ${error.message}`);
      } else {
        alert("Failed to save product. Check console for details.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {product ? "Edit Product" : "Create New Product"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {product ? "Update product details" : "Add a new product to your inventory"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Product Image
            </label>
            <div className="flex flex-col items-center gap-4">
              {imagePreview ? (
                <div className="relative w-full h-64 bg-slate-100 rounded-xl overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-slate-100 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
                  <Upload size={48} className="text-slate-400 mb-2" />
                  <p className="text-slate-500 text-sm">No image selected</p>
                </div>
              )}
              <label className="cursor-pointer bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center gap-2">
                <Upload size={20} />
                {imagePreview ? "Change Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="Modern Chair"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value === "" ? 0 : parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="99.99"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Inventory *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.inventory}
                onChange={(e) => setFormData({ ...formData, inventory: e.target.value === "" ? 0 : parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="Chairs"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
              placeholder="Describe your product..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="modern, comfortable, wooden"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-slate-900 to-slate-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-slate-800 hover:to-slate-600 transition-all shadow-lg disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  {product ? "Update Product" : "Create Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Sub Components ---
interface NavItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const NavItem = ({ active, onClick, icon, label, badge }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
      active 
        ? "bg-slate-900 text-white shadow-lg" 
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      {label}
    </div>
    {badge !== undefined && badge > 0 && (
      <span className={`text-xs font-bold py-1 px-2 rounded-full ${
        active ? "bg-white text-slate-900" : "bg-slate-200 text-slate-700"
      }`}>
        {badge}
      </span>
    )}
  </button>
);

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  desc: string;
  bgColor: string;
  borderColor: string;
}

const StatCard = ({ title, value, icon, trend, desc, bgColor, borderColor }: StatCardProps) => (
  <div className={`${bgColor} p-6 rounded-2xl border-2 ${borderColor} shadow-lg hover:shadow-xl transition-shadow`}>
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">{title}</p>
        <h3 className="text-4xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className="p-3 bg-white rounded-xl shadow-sm">{icon}</div>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-green-600 flex items-center gap-1 bg-white px-2 py-1 rounded-lg">
        <TrendingUp size={12} /> {trend}
      </span>
      <span className="text-xs text-slate-600">{desc}</span>
    </div>
  </div>
);

interface OrderTableProps {
  orders: Order[];
}

const OrderTable = ({ orders }: OrderTableProps) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
      <h3 className="font-bold text-slate-900 text-lg">Recent Orders</h3>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search orders..." 
          className="pl-10 pr-4 py-2 text-sm border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent w-64" 
        />
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-600 border-b-2 border-slate-200">
          <tr>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Contact</th>
            <th className="px-6 py-4">Total</th>
            <th className="px-6 py-4">Items</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-16 text-center">
                <AlertCircle className="mx-auto text-slate-300 mb-3" size={48} />
                <p className="text-slate-500 font-medium">No orders found</p>
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{order.name}</div>
                  <div className="text-xs text-slate-500 truncate max-w-[200px]">{order.address}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-700">{order.email}</div>
                  <div className="text-xs text-slate-500">{order.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-lg text-slate-900">${order.totalPrice}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2 max-w-[250px]">
                    {order.items?.slice(0, 2).map((item) => (
                      <span
                        key={item._id}
                        className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg text-xs font-medium text-slate-700"
                      >
                        {item.title}
                      </span>
                    ))}
                    {order.items && order.items.length > 2 && (
                      <span className="text-xs text-slate-500 font-medium">+{order.items.length - 2} more</span>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

interface ProductSectionProps {
  products: Product[];
  loading?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductSection = ({ products, loading, onEdit, onDelete }: ProductSectionProps) => {
  const getImageUrl = (product: Product) => {
    if (product.image?.asset?.url) return product.image.asset.url;
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        [...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 h-96 animate-pulse"></div>
        ))
      ) : products.length === 0 ? (
        <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-300">
          <Package className="mx-auto w-16 h-16 text-slate-300 mb-4" />
          <p className="text-slate-500 font-semibold text-lg">No products available</p>
          <p className="text-slate-400 text-sm mt-2">Create your first product to get started</p>
        </div>
      ) : (
        products.map((product) => {
          const imageUrl = getImageUrl(product);
          return (
            <div key={product._id} className="bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden group">
              
              <div className="h-56 bg-slate-50 relative w-full overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                    <Package size={64} />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    ${product.price}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2">{product.title}</h3>
                
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Package size={16} className="text-slate-400" />
                    <span className="font-medium">Stock: {product.inventory}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex gap-3">
                  <button 
                    onClick={() => onEdit(product)}
                    className="flex-1 border-2 border-slate-300 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button 
                    onClick={() => onDelete(product._id)}
                    className="flex-1 bg-red-500 text-white font-semibold py-2.5 rounded-xl hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AdminDashboard;











// "use client";

// import { useState, useEffect } from "react";
// import { sanityClient } from "@/sanity/lib/client";
// import Image from "next/image"; // Import Next.js Image component
// import { ordersQuery, productsQuery } from "@/queries";
// import type { Order, Product } from "@/types";
// import { 
//   LayoutDashboard, 
//   Package, 
//   ShoppingCart, 
//   DollarSign, 
//   Search, 
//   MoreVertical,
//   TrendingUp,
//   Edit,
//   Eye
// } from "lucide-react";

// const AdminDashboard = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products">("overview");

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // We are explicitly fetching the imageUrl in the query
//         const [ordersRes, productsRes] = await Promise.all([
//           sanityClient.fetch<Order[]>(ordersQuery),
//           sanityClient.fetch<Product[]>(productsQuery),
//         ]);
//         setOrders(ordersRes);
//         setProducts(productsRes);
//       } catch (error) {
//         console.error("Failed to fetch admin data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
//   const totalOrders = orders.length;
//   const totalProducts = products.length;

//   return (
//     <div className="flex min-h-screen bg-[#F3F4F6] text-gray-800 font-sans">
      
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-10 shadow-sm">
//         <div className="p-6 border-b border-gray-100 flex items-center gap-3">
//           <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">F</div>
//           <h2 className="text-lg font-bold tracking-tight text-gray-900">Furni Timbers</h2>
//         </div>
//         <nav className="flex-1 p-4 space-y-1">
//           <NavItem 
//             active={activeTab === "overview"} 
//             onClick={() => setActiveTab("overview")}
//             icon={<LayoutDashboard size={18} />}
//             label="Overview"
//           />
//           <NavItem 
//             active={activeTab === "orders"} 
//             onClick={() => setActiveTab("orders")}
//             icon={<ShoppingCart size={18} />}
//             label="Orders"
//             badge={totalOrders}
//           />
//           <NavItem 
//             active={activeTab === "products"} 
//             onClick={() => setActiveTab("products")}
//             icon={<Package size={18} />}
//             label="Products"
//             badge={totalProducts}
//           />
//         </nav>
//         <div className="p-4 border-t border-gray-100">
//           <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-xs">AD</div>
//             <div className="flex-1 overflow-hidden">
//               <p className="text-sm font-bold text-gray-900 truncate">Admin User</p>
//               <p className="text-xs text-gray-500 truncate">admin@furnitimbers.com</p>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 md:ml-64 p-4 md:p-8">
//         <div className="max-w-7xl mx-auto space-y-8">
          
//           {/* Header */}
//           <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">
//                 {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard
//               </h1>
//               <p className="text-gray-500 text-xs">Overview of your store performance.</p>
//             </div>
//             <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
//               + Add New
//             </button>
//           </div>

//           {/* Overview Tab */}
//           {activeTab === "overview" && (
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <StatCard
//                 title="Total Revenue"
//                 value={`$${totalRevenue.toLocaleString()}`}
//                 icon={<DollarSign className="text-gray-900 bg-gray-100 p-1 rounded" />}
//                 trend="+12.5%"
//                 desc="From last month"
//                 color="text-emerald-600 bg-emerald-50 border-emerald-100"
//               />
//               <StatCard
//                 title="Total Orders"
//                 value={totalOrders.toString()}
//                 icon={<ShoppingCart className="text-gray-900 bg-gray-100 p-1 rounded" />}
//                 trend="+5.2%"
//                 desc="From last month"
//                 color="text-blue-600 bg-blue-50 border-blue-100"
//               />
//               <StatCard
//                 title="Total Products"
//                 value={totalProducts.toString()}
//                 icon={<Package className="text-gray-900 bg-gray-100 p-1 rounded" />}
//                 trend="Stable"
//                 desc="Inventory count"
//                 color="text-gray-600 bg-gray-100 border-gray-200"
//               />
//             </div>
//           )}

//           {/* Orders Tab */}
//           {activeTab === "orders" && <OrderTable orders={orders} />}
          
//           {/* Products Tab */}
//           {activeTab === "products" && <ProductSection products={products} loading={loading} />}

//         </div>
//       </main>
//     </div>
//   );
// };

// // --- Sub Components ---

// interface NavItemProps {
//   active: boolean;
//   onClick: () => void;
//   icon: React.ReactNode;
//   label: string;
//   badge?: number;
// }

// const NavItem = ({ active, onClick, icon, label, badge }: NavItemProps) => (
//   <button
//     onClick={onClick}
//     className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
//       active 
//         ? "bg-gray-100 text-gray-900 border-l-4 border-gray-900" 
//         : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//     }`}
//   >
//     <div className="flex items-center gap-3">
//       {icon}
//       {label}
//     </div>
//     {badge !== undefined && badge > 0 && (
//       <span className={`text-xs font-bold py-0.5 px-2 rounded-full ${
//         active ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-600"
//       }`}>
//         {badge}
//       </span>
//     )}
//   </button>
// );

// interface StatCardProps {
//   title: string;
//   value: string;
//   icon: React.ReactNode;
//   trend: string;
//   desc: string;
//   color: string;
// }

// const StatCard = ({ title, value, icon, trend, desc, color }: StatCardProps) => (
//   <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//     <div className="flex items-start justify-between">
//       <div>
//         <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{title}</p>
//         <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
//       </div>
//       <div>{icon}</div>
//     </div>
//     <div className="mt-4 flex items-center gap-2">
//       <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${color} flex items-center gap-1`}>
//         <TrendingUp size={10} /> {trend}
//       </span>
//       <span className="text-xs text-gray-400">{desc}</span>
//     </div>
//   </div>
// );

// interface OrderTableProps {
//   orders: Order[];
// }

// const OrderTable = ({ orders }: OrderTableProps) => (
//   <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//     <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
//       <h3 className="font-bold text-gray-900">Recent Orders</h3>
//       <div className="relative">
//         <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//         <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 w-48" />
//       </div>
//     </div>
//     <div className="overflow-x-auto">
//       <table className="w-full text-left text-sm text-gray-600">
//         <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
//           <tr>
//             <th className="px-6 py-4">Customer</th>
//             <th className="px-6 py-4">Contact</th>
//             <th className="px-6 py-4">Total</th>
//             <th className="px-6 py-4">Items</th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-100">
//           {orders.length === 0 ? (
//             <tr>
//               <td colSpan={4} className="px-6 py-10 text-center text-gray-400 bg-gray-50/50">
//                 No orders found in database.
//               </td>
//             </tr>
//           ) : (
//             orders.map((order) => (
//               <tr key={order._id} className="hover:bg-gray-50 transition-colors">
//                 <td className="px-6 py-4">
//                   <div className="font-bold text-gray-900">{order.name}</div>
//                   <div className="text-xs text-gray-400 truncate max-w-[150px]">{order.address}</div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="font-medium text-gray-700">{order.email}</div>
//                   <div className="text-xs text-gray-400">{order.phone}</div>
//                 </td>
//                 <td className="px-6 py-4 font-bold text-gray-900">
//                   ${order.totalPrice}
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex flex-wrap gap-1 max-w-[200px]">
//                     {order.items?.slice(0, 2).map((item) => (
//                       <span
//                         key={item._id}
//                         className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-xs text-gray-600"
//                       >
//                         {item.title}
//                       </span>
//                     ))}
//                     {order.items && order.items.length > 2 && (
//                       <span className="text-xs text-gray-400">+{order.items.length - 2} more</span>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   </div>
// );

// interface ProductSectionProps {
//   products: Product[];
//   loading?: boolean;
// }

// const ProductSection = ({ products, loading }: ProductSectionProps) => {
//   // Helper to safely get image URL
//   const getImageUrl = (product: any) => {
//     // If product.imageUrl is defined, use it
//     if (product.imageUrl) return product.imageUrl;
//     // If product.image is an object (Sanity reference), try accessing url
//     if (product.image?.asset?.url) return product.image.asset.url;
//     return null;
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {loading ? (
//          [...Array(6)].map((_, i) => (
//             <div key={i} className="bg-white rounded-xl border border-gray-200 h-64 animate-pulse"></div>
//          ))
//       ) : products.length === 0 ? (
//        <div className="col-span-full py-16 text-center bg-white rounded-xl border border-dashed border-gray-300">
//          <Package className="mx-auto w-12 h-12 text-gray-300 mb-3" />
//          <p className="text-gray-500 font-medium">No products available.</p>
//        </div>
//     ) : (
//       products.map((product) => {
//         const imageUrl = getImageUrl(product);
//         return (
//           <div key={product._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
            
//             {/* Image Area with Fallback */}
//             <div className="h-48 bg-gray-50 relative w-full">
//               {imageUrl ? (
//                 <Image
//                   src={imageUrl}
//                   alt={product.title}
//                   fill
//                   className="object-cover group-hover:scale-105 transition-transform duration-500"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
//                    <Package size={40} />
//                 </div>
//               )}
//             </div>

//             <div className="p-5 flex flex-col flex-1">
//               <div className="flex justify-between items-start mb-2">
//                 <h3 className="font-bold text-gray-900 line-clamp-1">{product.title}</h3>
//                 <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-0.5 rounded">
//                   ${product.price}
//                 </span>
//               </div>
              
//               <div className="text-xs text-gray-500 mb-4">
//                 Stock: {product.inventory}
//               </div>

//               <div className="mt-auto pt-4 flex gap-2">
//                  <button className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-1">
//                    <Edit size={14} /> Edit
//                  </button>
//                  <button className="flex-1 bg-gray-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-1">
//                    <Eye size={14} /> View
//                  </button>
//               </div>
//             </div>
//           </div>
//         )
//       }))}
//     </div>
//   );
// }

// export default AdminDashboard;