import express from "express";
import {
  getAllProperties,
  getPropertyById,
  addProperty,
  updateProperty,
  deleteProperty,
  getPropertiesOpenForFunding,
  getPropertiesClosedForFunding,
  openFunding,
  stopFunding,
} from "../controller/propertiesController.js";

import { authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authorize("admin", "agent"), (request, response) => {
  const fundingStatus = request.query.funding;

  if (fundingStatus === "open") {
    getPropertiesOpenForFunding(request, response);
    return;
  }
  if (fundingStatus === "closed") {
    getPropertiesClosedForFunding(request, response);
    return;
  }

  getAllProperties(request, response);
});

router.get("/:id", authorize("admin"), (request, response) => {
  getPropertyById(request, response);
});

router.post("/add", authorize("admin"), (request, response) => {
  addProperty(request, response);
});

router.put("/:id", authorize("admin"), (request, response) => {
  updateProperty(request, response);
});

router.delete("/:id", authorize("admin"), (request, response) => {
  deleteProperty(request, response);
});

router.patch(
  "/:id/open-funding",
  authorize("admin", "investor"),
  (request, response) => {
    openFunding(request, response);
  }
);

router.patch(
  "/:id/stop-funding",
  authorize("admin", "investor"),
  (request, response) => {
    stopFunding(request, response);
  }
);

export default router;
