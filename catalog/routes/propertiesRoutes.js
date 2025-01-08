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
  updateFundingMonthly,
  updateFundingForProperty,
} from "../controller/propertiesController.js";

import { authorize } from "../middlewares/auth.js";
import { getUserRoleFromId } from "../database/queries/userQueries.js";

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

    if (getUserRoleFromId(request.query.userId) !== "investor") {
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

router.get("/:id", authorize("admin"), getPropertyById);

router.post("/add", authorize("admin", "agent"), addProperty);

router.put("/:id", authorize("admin", "agent"), updateProperty);

router.delete("/:id", authorize("admin", "agent"), deleteProperty);

router.patch("/:id/open-funding", authorize("admin", "investor"), openFunding);

router.patch("/:id/stop-funding", authorize("admin", "investor"), stopFunding);

router.patch("/update-funding-monthly", updateFundingMonthly);

router.patch("/:id/update-funding", updateFundingForProperty);

export default router;
