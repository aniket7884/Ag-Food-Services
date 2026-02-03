import express from "express";
import authMiddleware from "../middleware/auth.js";

import { 
  listOrders, 
  placeOrder, 
  updateStatus, 
  userOrders, 
  verifyOrder,
  placeOrderCOD,
  getOrderById   // Track order controller
} from "../controllers/orderController.js";

const orderRouter = express.Router();

/* ================================
   CUSTOMER ORDER ROUTES
================================ */

// ▶ Place an online paid order
orderRouter.post("/place", authMiddleware, placeOrder);

// ▶ Place a Cash On Delivery order
orderRouter.post("/cod", authMiddleware, placeOrderCOD);

// ▶ Verify Stripe payment
orderRouter.post("/verify", verifyOrder);

// ▶ Get logged-in user’s all orders
orderRouter.post("/userorders", authMiddleware, userOrders);

// ▶ Track single order by ID (Correct Route)
orderRouter.get("/track/:orderId", authMiddleware, getOrderById);


/* ================================
   ADMIN ORDER ROUTES
================================ */

// ▶ Get all orders (Admin only)
orderRouter.get("/list", authMiddleware, listOrders);

// ▶ Update order status (Admin only)
orderRouter.post("/status", authMiddleware, updateStatus);

export default orderRouter;
