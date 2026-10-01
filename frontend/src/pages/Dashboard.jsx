// Import useState/useEffect to load and store product data.
import { useState, useEffect } from "react";
// Import our configured axios instance.
import api from "../api.js";

// Dashboard: shows a table of every product and how much stock it
// has in each warehouse.
function Dashboard() {
  // List of products returned by the backend.
  const [products, setProducts] = useState([]);

  // loadProducts: fetches all products (with warehouse names populated).
  const loadProducts = async () => {
    const response = await api.get("/products");
    setProducts(response.data);
  };

  // Load the products once, when the page first renders.
  useEffect(() => {
    loadProducts();
  }, []);

  // Build the list of unique warehouses (id + name) seen across all
  // products' stock entries, so we know which columns to show.
  const warehouseMap = {};
  products.forEach((product) => {
    product.stock.forEach((entry) => {
      if (entry.warehouse) {
        warehouseMap[entry.warehouse._id] = entry.warehouse.name;
      }
    });
  });
  const warehouseIds = Object.keys(warehouseMap);

  // getQuantity: finds how much of a product is stored in a given warehouse.
  const getQuantity = (product, warehouseId) => {
    const entry = product.stock.find(
      (stockEntry) => stockEntry.warehouse && stockEntry.warehouse._id === warehouseId
    );
    return entry ? entry.quantity : 0;
  };

  return (
    <div className="page">
      <h2>Warehouse Dashboard</h2>

      {products.length === 0 ? (
        <p>No products</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              {warehouseIds.map((warehouseId) => (
                <th key={warehouseId}>{warehouseMap[warehouseId]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                {warehouseIds.map((warehouseId) => (
                  <td key={warehouseId}>{getQuantity(product, warehouseId)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
