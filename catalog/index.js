import express from "express";
import propertiesRoutes from "./routes/propertiesRoutes.js";
import { db } from "./database/db_connection.js";

// Setup express
const app = express();
const port = 5001;

app.use(express.json());

app.use("/properties", propertiesRoutes);

app.listen(port, () => {
  console.log(`Catalog service listening at http://localhost:${port}`);
  // check if db connection is successful
  db.raw("SELECT 1")
    .then(() => console.log("Database connection successful"))
    .catch((err) => console.error("Database connection failed", err));
});
