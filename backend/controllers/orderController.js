import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ----------------------- ONLINE PAYMENT (STRIPE) -----------------------
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    const shippingFee = 20;
    const totalAmount = req.body.amount + shippingFee;

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: totalAmount,
      shipping: shippingFee,
      address: req.body.address,
      paymentMethod: "ONLINE",
      payment: false,
      status: "Food Processing"
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 20 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ----------------------- VERIFY STRIPE PAYMENT -----------------------
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ----------------------- CASH ON DELIVERY (COD) -----------------------
const placeOrderCOD = async (req, res) => {
  try {
    const shippingFee = 20;
    const totalAmount = req.body.amount + shippingFee;

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: totalAmount,
      shipping: shippingFee,
      address: req.body.address,
      paymentMethod: "COD",
      payment: false,
      status: "Food Processing",
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    res.json({
      success: true,
      message: "COD Order Placed Successfully",
      orderId: newOrder._id,
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "COD Order Failed" });
  }
};

// ----------------------- USER ORDERS -----------------------
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ----------------------- ADMIN ORDER LIST -----------------------
const listOrders = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);

    if (userData && userData.role === "admin") {
      const orders = await orderModel.find({});
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ----------------------- UPDATE ORDER STATUS -----------------------
const updateStatus = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);

    if (userData && userData.role === "admin") {
      await orderModel.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status,
      });
      
      res.json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.json({ success: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ----------------------- TRACK SINGLE ORDER -----------------------
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      status: order.status,
      eta: order.eta || "Not available",
      order,
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching order" });
  }
};

export { 
  placeOrder, 
  verifyOrder, 
  userOrders, 
  listOrders, 
  updateStatus,
  placeOrderCOD,
  getOrderById       // ⭐ Important export
};
