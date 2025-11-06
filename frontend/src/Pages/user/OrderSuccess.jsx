import React from "react";
import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="success-page">
      <h1>🎉 Order Placed Successfully!</h1>
      <p>Your order ID: <strong>{id}</strong></p>
      <Link to="/orders">View My Orders</Link>
    </div>
  );
}
