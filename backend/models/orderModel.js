import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },

  status: { type: String, default: "Food Processing" },

  date: { type: Date, default: Date.now() },

  // ⭐ ETA for tracking
  eta: { type: String, default: "30 minutes" },

  // --- PAYMENT FIELDS ---
  paymentMethod: {
    type: String,
    enum: ["ONLINE", "COD"],
    default: "ONLINE",
  },

  paymentStatus: {
    type: String,
    enum: ["PAID", "PENDING"],
    default: "PENDING",
  },

  // OLD FIELD FOR BACKWARD COMPATIBILITY
  payment: { type: Boolean, default: false }
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
