const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB");
const itemRoutes = require('./routes/itemRoutes');
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/items", itemRoutes);

app.listen(process.env.PORT || 5000, async () => {
  await connectDB();
  console.log(`✅ Server running on port ${process.env.PORT || 5000}`);
});
