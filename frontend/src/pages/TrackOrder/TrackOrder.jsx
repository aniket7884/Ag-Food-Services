import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./TrackOrder.css";

const steps = [
  "Order Placed",
  "Food Processing",
  "Packed",
  "Out For Delivery",
  "Delivered",
];

const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  // 🔥 Auto-refresh every 10 seconds
  useEffect(() => {
    const fetchStatus = () => {
      fetch(`http://localhost:4000/api/order/${orderId}`)
        .then((res) => res.json())
        .then((data) => setOrder(data))
        .catch((err) => console.log(err));
    };

    fetchStatus();

    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (!order) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  // Find current step index
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="track-container">
      <h1>Track Order #{orderId}</h1>

      <p><b>Status:</b> {order.status}</p>
      <p><b>Estimated Delivery:</b> {order.eta}</p>

      {/* 🔥 PROGRESS BAR  */}
      <div className="progress-container">
        {steps.map((step, index) => (
          <div key={index} className="progress-step">
            <div
              className={`circle ${
                index <= currentStepIndex ? "active" : ""
              }`}
            >
              {index + 1}
            </div>
            <p className={index <= currentStepIndex ? "active-text" : ""}>
              {step}
            </p>
          </div>
        ))}
      </div>

      {/* 🔥 Delivery Boy Map Tracking */}
      {order.deliveryBoy && (
        <div className="map-section">
          <h3>Delivery Partner:</h3>
          <p><b>Name:</b> {order.deliveryBoy.name}</p>
          <p><b>Phone:</b> {order.deliveryBoy.phone}</p>

          <iframe
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: "10px" }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${order.deliveryBoy.location.lat},${order.deliveryBoy.location.lng}&z=15&output=embed`}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
