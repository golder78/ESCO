const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");

connectDB();
 
const app = express();

app.use(express.json());
app.use(cors())

app.use("/api/auth", require("./routes/authRoutes"));
 app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
const PORT = process.env.PORT || 5000;

app.get ("/", (req, res) => {
  res.send("Welcome to the E-commerce API");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


