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

const router = express.Router();

router.get("/", (request, response) => {
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

router.get("/:id", (request, response) => {
  getPropertyById(request, response);
});

router.post("/add", (request, response) => {
  addProperty(request, response);
});

router.put("/:id", (request, response) => {
  updateProperty(request, response);
});

router.delete("/:id", (request, response) => {
  deleteProperty(request, response);
});

router.patch("/:id/open-funding", (request, response) => {
  openFunding(request, response);
});

router.patch("/:id/stop-funding", (request, response) => {
  stopFunding(request, response);
});

export default router;
