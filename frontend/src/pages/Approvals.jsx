// Import useState/useEffect to load and store transfer data.
import { useState, useEffect } from "react";
// Import our configured axios instance.
import api from "../api.js";

// Approvals: lists transfer requests, with a status filter. Managers
// can approve or reject any pending request.
function Approvals() {
  // List of transfers returned by the backend.
  const [transfers, setTransfers] = useState([]);
  // Currently selected filter: "" (all), "pending", "approved" or "rejected".
  const [statusFilter, setStatusFilter] = useState("");
  // Error message from the last approve/reject action, shown in red.
  const [errorMessage, setErrorMessage] = useState("");

  // Is the logged-in user a manager? Read once from localStorage.
  const role = localStorage.getItem("role");

  // loadTransfers: fetches transfers, adding ?status= only when a
  // filter other than "All" is selected.
  const loadTransfers = async () => {
    const query = statusFilter ? `?status=${statusFilter}` : "";
    const response = await api.get(`/transfers${query}`);
    setTransfers(response.data);
  };

  // Reload the list whenever the selected filter changes.
  useEffect(() => {
    loadTransfers();
  }, [statusFilter]);

  // handleApprove: approves one transfer, then waits for the list to
  // finish reloading before this function is considered done.
  const handleApprove = async (transferId) => {
    setErrorMessage("");
    try {
      await api.patch(`/transfers/${transferId}/approve`);
      await loadTransfers();
    } catch (err) {
      setErrorMessage(err.response.data.message);
      await loadTransfers();
    }
  };

  // handleReject: rejects one transfer, then waits for the list to
  // finish reloading before this function is considered done.
  const handleReject = async (transferId) => {
    setErrorMessage("");
    try {
      await api.patch(`/transfers/${transferId}/reject`);
      await loadTransfers();
    } catch (err) {
      setErrorMessage(err.response.data.message);
      await loadTransfers();
    }
  };

  return (
    <div className="page">
      <h2>Approvals</h2>

      <label>Filter: </label>
      <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {transfers.length === 0 ? (
        <p>No transfers</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>From</th>
              <th>To</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Requested By</th>
              {role === "manager" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer) => (
              <tr key={transfer._id}>
                <td>{transfer.product.name}</td>
                <td>{transfer.fromWarehouse.name}</td>
                <td>{transfer.toWarehouse.name}</td>
                <td>{transfer.quantity}</td>
                <td>
                  <span className={`status-label status-${transfer.status}`}>
                    {transfer.status}
                  </span>
                </td>
                <td>{transfer.requestedBy.name}</td>
                {role === "manager" && (
                  <td>
                    {transfer.status === "pending" && (
                      <>
                        <button onClick={() => handleApprove(transfer._id)}>Approve</button>
                        <button onClick={() => handleReject(transfer._id)}>Reject</button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Approvals;
