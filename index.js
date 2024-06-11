const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const paymentRoute = require("./routes/razorpay"); // Import the payment route
const orderRoute = require("./routes/order"); // Import the order route

dotenv.config(); // Load environment variables

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB connection successful"))
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/payments", paymentRoute); // Use the payment route
app.use("/api/orders", orderRoute); // Use the order route

app.listen(5000, () => {
  console.log("Backend server is running!");
});
