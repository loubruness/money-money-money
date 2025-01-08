import "dotenv/config";
import express from "express";
import propertiesRoutes from "./routes/propertiesRoutes.js";
import { db } from "./database/db_connection.js";

import schedule from "node-schedule";

// Setup express
const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());

app.use("/properties", propertiesRoutes);

app.listen(port, () => {
  console.log(`Catalog service listening at http://localhost:${port}`);
  // check if db connection is successful
  db.raw("SELECT 1")
    .then(() => console.log("Database connection successful"))
    .catch((err) => console.error("Database connection failed", err));
});

// Job to check and update funding once per month
const job_update_funding_monthly = schedule.scheduleJob(
  process.env.UPDATE_FUNDING_FREQUENCY,
  function () {
    console.log("Running job to check and update funding for all properties");
    fetch(`http://localhost:${port}/properties/update-funding-monthly`, {
      method: "PATCH",
    }).catch((error) => console.error("Error:", error));
  }
);
