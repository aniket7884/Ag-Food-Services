import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/frontend_assets/assets";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      console.log(response.data);

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>Orders</h2>

      <div className="container">
        {data.length === 0 && <p>No orders found.</p>}

        {data.map((order, index) => (
          <div key={index} className="my-orders-order">
            <img src={assets.parcel_icon} alt="parcel" />

            {/* Items */}
            <p>
              {order.items.map((item, i) => (
                i === order.items.length - 1
                  ? `${item.name} x ${item.quantity}`
                  : `${item.name} x ${item.quantity}, `
              ))}
            </p>

            {/* Amount */}
            <p>₹{order.amount}.00</p>

            {/* Item Count */}
            <p>Items: {order.items.length}</p>

            {/* Status */}
            <p>
              <span>&#x25cf;</span>
              <b> {order.status}</b>
            </p>

            {/* ⭐ Track Order Button (Correct Route) */}
            <button onClick={() => navigate(`/track-order/${order._id}`)}>
              Track Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
