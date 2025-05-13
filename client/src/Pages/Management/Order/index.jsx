import { useEffect, useState, useContext } from "react";
import Breadcrumb from "../../../Components/Breadcrumb";
import LoadingSpinner from "../../../Components/Loading";
import PopUp from "../../../Components/PopUp";
import { OrderApi } from "../../../Api/order";
import "./Order.scss";
import AuthContext from "../../../Context/AuthProvider";
import { Link } from "react-router-dom";

const statusColors = {
  Pending: "#ffc107",
  Processing: "#17a2b8",
  Shipped: "#6f42c1",
  Delivered: "#28a745",
  Cancelled: "#dc3545",
};

const OrderManagement = () => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailPopup, setOrderDetailPopup] = useState(false);
  const [statusUpdatePopup, setStatusUpdatePopup] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  const [filterStatus, setFilterStatus] = useState("All");

  const { auth } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      setBusy(true);
      const result = await OrderApi.getAllOrders();
      setOrders(result);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to load orders. Please try again.");
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Order Management | OKBF";
  }, []);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOrderDetailPopup(true);
  };

  const handleStatusUpdate = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusUpdatePopup(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || newStatus === selectedOrder.status) {
      setStatusUpdatePopup(false);
      return;
    }

    try {
      setBusy(true);
      await OrderApi.updateOrderStatus(selectedOrder._id, newStatus);
      await fetchOrders();
      setSuccessMessage(`Order #${selectedOrder._id.substr(-6)} status updated to ${newStatus}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error updating order status:", error);
      setErrorMessage(`Failed to update order status: ${error.message || 'Unknown error'}`);
      setError(true);
    } finally {
      setBusy(false);
      setStatusUpdatePopup(false);
    }
  };

  const handleUpdatePaid = async (order, isPaid) => {
    try {
      setBusy(true);
      await OrderApi.updateOrderPaid(order._id, isPaid);
      await fetchOrders();
      setSuccessMessage(`Order #${order._id.substr(-6)} payment status updated to ${isPaid ? 'Paid' : 'Unpaid'}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error updating payment status:", error);
      setErrorMessage(`Failed to update payment status: ${error.message || 'Unknown error'}`);
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateDelivered = async (order, isDelivered) => {
    try {
      setBusy(true);
      await OrderApi.updateOrderDelivered(order._id, isDelivered);
      await fetchOrders();
      setSuccessMessage(`Order #${order._id.substr(-6)} delivery status updated to ${isDelivered ? 'Delivered' : 'Not Delivered'}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error updating delivery status:", error);
      setErrorMessage(`Failed to update delivery status: ${error.message || 'Unknown error'}`);
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return (
      <span className="sort-icon">
        {sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}
      </span>
    );
  };

  const filteredAndSortedOrders = () => {
    if (!orders || !orders.length) return [];
    
    // First apply status filter
    let filtered = orders;
    if (filterStatus !== "All") {
      filtered = orders.filter(order => order.status === filterStatus);
    }
    
    // Then apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order => {
        const orderId = order._id.toLowerCase();
        const customerName = order.shippingAddress?.fullName?.toLowerCase() || '';
        const customerAddress = order.shippingAddress?.address?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        
        return orderId.includes(search) || 
               customerName.includes(search) || 
               customerAddress.includes(search);
      });
    }
    
    // Finally sort the data
    return [...filtered].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Handle nested properties like shippingAddress.fullName
      if (sortConfig.key.includes('.')) {
        const keys = sortConfig.key.split('.');
        aValue = a[keys[0]][keys[1]];
        bValue = b[keys[0]][keys[1]];
      }
      
      // Handle date comparison
      if (sortConfig.key === 'createdAt' || sortConfig.key === 'paidAt' || sortConfig.key === 'deliveredAt') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  return (
    <>
      <main className="order-management">
        <section>
          <Breadcrumb
            breadcrumb="Orders"
            list={[{ title: "Admin", path: "/admin" }]}
          />
        </section>
        <section>
          {busy ? (
            <LoadingSpinner />
          ) : (
            <div className="container">
              <div className="order-management-wrapper">
                {successMessage && (
                  <div className="success-message">
                    {successMessage}
                  </div>
                )}
                <div className="list-order">
                  <h1 className="order-title">Order Management</h1>
                  
                  <div className="filter-container">
                    <div className="search-bar">
                      <input
                        type="text"
                        placeholder="Search by order ID, customer name, or address..."
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </div>
                    <div className="status-filter">
                      <label htmlFor="status-filter">Filter by Status:</label>
                      <select 
                        id="status-filter" 
                        value={filterStatus} 
                        onChange={handleFilterChange}
                      >
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="order-table">
                    <table>
                      <thead>
                        <tr>
                          <th onClick={() => handleSort('_id')} className="sortable">
                            Order ID {renderSortIcon('_id')}
                          </th>
                          <th onClick={() => handleSort('shippingAddress.fullName')} className="sortable">
                            Customer {renderSortIcon('shippingAddress.fullName')}
                          </th>
                          <th onClick={() => handleSort('createdAt')} className="sortable">
                            Date {renderSortIcon('createdAt')}
                          </th>
                          <th onClick={() => handleSort('totalPrice')} className="sortable">
                            Total {renderSortIcon('totalPrice')}
                          </th>
                          <th onClick={() => handleSort('isPaid')} className="sortable">
                            Paid {renderSortIcon('isPaid')}
                          </th>
                          <th onClick={() => handleSort('isDelivered')} className="sortable">
                            Delivered {renderSortIcon('isDelivered')}
                          </th>
                          <th onClick={() => handleSort('status')} className="sortable">
                            Status {renderSortIcon('status')}
                          </th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSortedOrders().map((order) => (
                          <tr key={order._id}>
                            <td>#{order._id.substr(-6)}</td>
                            <td>{order.shippingAddress?.fullName}</td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td>${order.totalPrice.toFixed(2)}</td>
                            <td>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={order.isPaid}
                                  onChange={() => handleUpdatePaid(order, !order.isPaid)}
                                />
                                <span className="slider round"></span>
                              </label>
                            </td>
                            <td>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={order.isDelivered}
                                  onChange={() => handleUpdateDelivered(order, !order.isDelivered)}
                                />
                                <span className="slider round"></span>
                              </label>
                            </td>
                            <td>
                              <span 
                                className="status-badge"
                                style={{ backgroundColor: statusColors[order.status] || "#6c757d" }}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="actions">
                              <button 
                                className="action-btn view-btn"
                                onClick={() => handleViewDetails(order)}
                              >
                                View
                              </button>
                              <button 
                                className="action-btn status-btn"
                                onClick={() => handleStatusUpdate(order)}
                              >
                                Status
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredAndSortedOrders().length === 0 && (
                          <tr>
                            <td colSpan="8" className="no-orders">
                              No orders found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {error && (
                  <PopUp
                    message={errorMessage || "Error! Please notify the developer"}
                    setPopUp={setError}
                  />
                )}
                
                {/* Order Detail Popup */}
                {orderDetailPopup && selectedOrder && (
                  <PopUp setPopUp={setOrderDetailPopup} width="800px">
                    <div className="order-detail">
                      <h2>Order #{selectedOrder._id.substr(-6)}</h2>
                      <div className="order-info">
                        <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                        <p><strong>Status:</strong> 
                          <span 
                            className="status-badge"
                            style={{ backgroundColor: statusColors[selectedOrder.status] || "#6c757d" }}
                          >
                            {selectedOrder.status}
                          </span>
                        </p>
                        <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                        <p><strong>Paid:</strong> {selectedOrder.isPaid ? `Yes (${formatDate(selectedOrder.paidAt)})` : 'No'}</p>
                        <p><strong>Delivered:</strong> {selectedOrder.isDelivered ? `Yes (${formatDate(selectedOrder.deliveredAt)})` : 'No'}</p>
                      </div>

                      <div className="customer-info">
                        <h3>Customer Information</h3>
                        <p><strong>Name:</strong> {selectedOrder.shippingAddress.fullName}</p>
                        <p><strong>Address:</strong> {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}</p>
                        <p><strong>Phone:</strong> {selectedOrder.shippingAddress.phoneNumber}</p>
                      </div>

                      <div className="order-items">
                        <h3>Order Items</h3>
                        <table>
                          <thead>
                            <tr>
                              <th>Image</th>
                              <th>Product</th>
                              <th>Type</th>
                              <th>Options</th>
                              <th>Quantity</th>
                              <th>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.orderItems.map((item) => (
                              <tr key={item._id}>
                                <td className="item-image">
                                  <img src={item.image} alt={item.name} />
                                </td>
                                <td>{item.name}</td>
                                <td>{item.productType}</td>
                                <td>
                                  {item.productType === 'coffee' && (
                                    <>
                                      {item.options?.bagSize && <div>Size: {item.options.bagSize}oz</div>}
                                      {item.options?.grind && <div>Grind: {item.options.grind}</div>}
                                    </>
                                  )}
                                  {item.productType === 'merch' && (
                                    <>
                                      {item.options?.size && <div>Size: {item.options.size}</div>}
                                      {item.options?.color && <div>Color: {item.options.color}</div>}
                                    </>
                                  )}
                                </td>
                                <td>{item.quantity}</td>
                                <td>${item.price.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-line"><span>Items:</span> <span>${selectedOrder.itemsPrice.toFixed(2)}</span></div>
                        <div className="summary-line"><span>Shipping:</span> <span>${selectedOrder.shippingPrice.toFixed(2)}</span></div>
                        <div className="summary-line"><span>Tax:</span> <span>${selectedOrder.taxPrice.toFixed(2)}</span></div>
                        <div className="summary-line total"><span>Total:</span> <span>${selectedOrder.totalPrice.toFixed(2)}</span></div>
                      </div>

                      <div className="popup-actions">
                        <button 
                          className="theme-btn__black"
                          onClick={() => setOrderDetailPopup(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </PopUp>
                )}
                
                {/* Status Update Popup */}
                {statusUpdatePopup && selectedOrder && (
                  <PopUp setPopUp={setStatusUpdatePopup}>
                    <div className="status-update">
                      <h3>Update Order Status</h3>
                      <p>Order: #{selectedOrder._id.substr(-6)}</p>
                      <p>Current Status: 
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: statusColors[selectedOrder.status] || "#6c757d" }}
                        >
                          {selectedOrder.status}
                        </span>
                      </p>
                      
                      <div className="status-select">
                        <label htmlFor="new-status">New Status:</label>
                        <select 
                          id="new-status" 
                          value={newStatus} 
                          onChange={(e) => setNewStatus(e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      
                      <div className="popup-actions">
                        <button 
                          className="theme-btn__black"
                          onClick={() => setStatusUpdatePopup(false)}
                        >
                          Cancel
                        </button>
                        <button 
                          className="theme-btn__white"
                          onClick={handleUpdateStatus}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </PopUp>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default OrderManagement;
