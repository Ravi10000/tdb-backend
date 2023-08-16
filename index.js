require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { errorHandler } = require("./middlewares/handle-error");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, HEAD, OPTIONS",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("uploads"));
mongoose
  .connect(process.env.DB_URI)
  .catch(({ message }) =>
    console.error("😐 initial connection error: 👇 \n", message)
  );
mongoose.connection.on("error", ({ message }) => {
  console.error("😐 connection error: 👇 \n", message);
});
mongoose.connection.once("open", () => {
  console.log("connected to database 🎉");
  app.listen(process.env.PORT, () => {
    console.log(`👉 http://localhost:${process.env.PORT}`);
    console.log(`⚡ http://localhost:${process.env.PORT}/api`);
  });
});

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/products", require("./routes/product.route"));

app.get(["/", "/api"], (_, res) => res.send("👋 welcome to the api"));
app.use(errorHandler);
