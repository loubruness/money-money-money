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

router.get(
  "/",
  authorize("admin", "agent", "investor"),
  (request, response) => {
    const fundingStatus = request.query.funding;

    if (fundingStatus === "closed") {
      getPropertiesClosedForFunding(request, response);
      return;
    }

    if (request.user.role !== "investor") {
      if (fundingStatus === "open") {
        getPropertiesOpenForFunding(request, response);
        return;
      }

      getAllProperties(request, response);
    } else {
      response.status(403).json({ message: "Forbidden" });
    }
  }
);

router.get("/:id", authorize("admin"), (request, response) => {
  getPropertyById(request, response);
});

router.post("/add", authorize("admin", "agent"), (request, response) => {
  addProperty(request, response);
});

router.put("/:id", authorize("admin", "agent"), (request, response) => {
  updateProperty(request, response);
});

router.delete("/:id", authorize("admin", "agent"), (request, response) => {
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
