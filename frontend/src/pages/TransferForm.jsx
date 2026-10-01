// Import useState/useEffect for form state and loading dropdown data.
import { useState, useEffect } from "react";
// Import our configured axios instance.
import api from "../api.js";

// TransferForm: lets any logged-in user request a stock transfer
// between two warehouses.
function TransferForm() {
  // Dropdown data loaded from the backend.
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  // Form field values.
  const [productId, setProductId] = useState("");
  const [fromWarehouse, setFromWarehouse] = useState("");
  const [toWarehouse, setToWarehouse] = useState("");
  const [quantity, setQuantity] = useState("");

  // Messages shown to the user.
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // loadDropdownData: fetches the products and warehouses used to
  // fill in the select boxes.
  const loadDropdownData = async () => {
    const productsResponse = await api.get("/products");
    const warehousesResponse = await api.get("/warehouses");
    setProducts(productsResponse.data);
    setWarehouses(warehousesResponse.data);
  };

  // Load dropdown data once, when the page first renders.
  useEffect(() => {
    loadDropdownData();
  }, []);

  // clearForm: resets every field back to empty.
  const clearForm = () => {
    setProductId("");
    setFromWarehouse("");
    setToWarehouse("");
    setQuantity("");
  };

  // handleSubmit: sends the transfer request to the backend.
  const handleSubmit = async (event) => {
    // Stop the browser from reloading the page on form submit.
    event.preventDefault();
    // Clear old messages before trying again.
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await api.post("/transfers", {
        product: productId,
        fromWarehouse,
        toWarehouse,
        quantity: Number(quantity),
      });

      // Show a success message and reset the form.
      setSuccessMessage("Transfer request submitted");
      clearForm();
    } catch (err) {
      // Show the backend's error message (e.g. "Quantity must be greater than 0").
      setErrorMessage(err.response.data.message);
    }
  };

  return (
    <div className="page">
      <h2>Transfer Request</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form className="transfer-form" onSubmit={handleSubmit}>
        <label>Product</label>
        <select value={productId} onChange={(event) => setProductId(event.target.value)}>
          <option value="">Select product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>

        <label>From Warehouse</label>
        <select
          value={fromWarehouse}
          onChange={(event) => setFromWarehouse(event.target.value)}
        >
          <option value="">Select source warehouse</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse._id} value={warehouse._id}>
              {warehouse.name}
            </option>
          ))}
        </select>

        <label>To Warehouse</label>
        <select value={toWarehouse} onChange={(event) => setToWarehouse(event.target.value)}>
          <option value="">Select destination warehouse</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse._id} value={warehouse._id}>
              {warehouse.name}
            </option>
          ))}
        </select>

        <label>Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        />

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}

export default TransferForm;
