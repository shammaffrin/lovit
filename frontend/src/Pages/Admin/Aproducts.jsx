import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const AProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      const allProducts = Array.isArray(res.data) ? res.data : [];
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await API.delete(`/products/${id}`);
      alert("🗑️ Product deleted successfully!");
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setFilteredProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Failed to delete product.");
    }
  };

  // Handle filter + search
  const handleFilter = (filter, searchValue = search) => {
    setActiveFilter(filter);
    let temp = [...products];

    // Apply filter
    if (filter !== "All") {
      if (filter === "New Arrival") {
        temp = temp.filter((p) => p.isNewArrival);
      } else if (filter === "Featured") {
        temp = temp.filter((p) => p.isFeatured);
      }
    }

    // Apply search (by title or category only)
  if (searchValue) {
  const lowerSearch = searchValue.toLowerCase();
  temp = temp.filter(
    (p) =>
      p.title?.toLowerCase().includes(lowerSearch) ||
      p.category?.name?.toLowerCase().includes(lowerSearch) ||
      p.sku?.toLowerCase().includes(lowerSearch) // ✅ search by SKU
  );
}


    setFilteredProducts(temp);
  };

  // Handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    handleFilter(activeFilter, value); // Reapply filters with new search term
  };

  return (
    <div className="p-4 md:p-6 font-[Poppins]">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
        🛍️ All Products List
      </h1>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-2">
        <div className="flex gap-2">
          {["All", "New Arrival", "Featured"].map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilter(filter)}
              className={`px-4 py-1 rounded ${
                activeFilter === filter
                  ? "bg-[#d97707cf] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by name, category or SKU..."
          value={search}
          onChange={handleSearch}
          className="border rounded px-3 py-1 w-full md:w-64"
        />
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm border border-gray-200 min-w-[900px]">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              
              <th className="px-4 py-2 text-left">SKU</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Loading products...
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((p, index) => (
                <tr
                  key={p._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-mono text-blue-700">
                    {p.sku || "N/A"}
                  </td>

                  <td className="px-4 py-3">
                    <img
                      src={p.mainImage || "/placeholder.png"}
                      alt={p.title}
                      className="w-12 h-12 object-cover rounded border"
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold">{p.title}</td>
                  <td className="px-4 py-3">
  {typeof p.category === "string"
    ? p.category
    : p.category?.name || "—"}
</td>

                  <td className="px-4 py-3 text-green-600 font-medium">
                    ₹ {p.variants?.[0]?.price || "0"}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                      className="bg-blue-800 text-white px-3 py-1 rounded hover:bg-blue-900 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-[#c15508a8] text-white px-3 py-1 rounded hover:bg-[#c15508a8] transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AProducts;
