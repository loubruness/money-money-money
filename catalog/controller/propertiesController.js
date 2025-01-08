import {
  getAllProperties as getAllPropertiesQuery,
  getPropertyById as getPropertyByIdQuery,
  addProperty as addPropertyQuery,
  updateProperty as updatePropertyQuery,
  deleteProperty as deletePropertyQuery,
  getPropertiesOpenForFunding as getPropertiesOpenForFundingQuery,
  getPropertiesClosedForFunding as getPropertiesClosedForFundingQuery,
  openPropertyForFunding,
  closePropertyForFunding,
  getNumberOfPropertiesOpenForFunding,
} from "../database/queries/propertyQueries.js";

export const getAllProperties = async (request, response) => {
  getAllPropertiesQuery()
    .then((properties) => {
      response.status(200).json(properties);
    })
    .catch((error) => {
      response.status(500).json({ error: error, message: error.message });
    });
};

export const getPropertyById = async (request, response) => {
  const id = request.params.id;
  getPropertyByIdQuery(id)
    .then((property) => {
      response.status(200).json(property);
    })
    .catch((error) => {
      response.status(500).json({ error: error, message: error.message });
    });
};

export const addProperty = async (request, response) => {
  const property = request.body;

  try {
    // Check if we are adding a property with funding status open
    if (property.status === "open") {
      // Check if there are already 6 properties open for funding
      getNumberOfPropertiesOpenForFunding()
        .then(async (count) => {
          count = Number(count[0].count);
          console.log(count);
          if (count >= 6) {
            response
              .status(400)
              .json({ error: "Too many properties open for funding" });
            return;
          }

          await addPropertyQuery(property);
          response.status(200).send();
        })
        .catch((error) => {
          // Can't check the number of properties open for funding
          response.status(500).json({ error: error, message: error.message });
        });
    } else {
      await addPropertyQuery(property);
      response.status(200).send();
    }
  } catch (error) {
    response.status(500).json({ error: error, message: error.message });
  }
};

export const updateProperty = async (request, response) => {
  const id = request.params.id;
  const property = request.body;

  try {
    // Check if we are updating the property's funding status to open
    if (property.status === "open") {
      // Check if there are already 6 properties open for funding
      getNumberOfPropertiesOpenForFunding()
        .then(async (count) => {
          count = Number(count[0].count);
          if (count >= 6) {
            response
              .status(400)
              .json({ error: "Too many properties open for funding" });
            return;
          }

          await updatePropertyQuery(id, property);
          response.status(200).send();
        })
        .catch((error) => {
          // Can't check the number of properties open for funding
          response.status(500).json({ error: error, message: error.message });
        });
    } else {
      await updatePropertyQuery(id, property);
      response.status(200).send();
    }
  } catch (error) {
    response.status(500).json({ error: error, message: error.message });
  }
};

export const deleteProperty = async (request, response) => {
  const id = request.params.id;

  try {
    await deletePropertyQuery(id);
    response.status(200).send();
  } catch (error) {
    response.status(500).json({ error: error, message: error.message });
  }
};

export const getPropertiesOpenForFunding = async (request, response) => {
  getPropertiesOpenForFundingQuery()
    .then((properties) => {
      response.status(200).json(properties);
    })
    .catch((error) => {
      response.status(500).json({ error: error, message: error.message });
    });
};

export const getPropertiesClosedForFunding = async (request, response) => {
  getPropertiesClosedForFundingQuery()
    .then((properties) => {
      response.status(200).json(properties);
    })
    .catch((error) => {
      response.status(500).json({ error: error, message: error.message });
    });
};

export const openFunding = async (request, response) => {
  const id = request.params.id;

  // Check if property is already open or not
  getPropertyByIdQuery(id)
    .then(async (property) => {
      if (property.length === 0) {
        response.status(404).json({ error: "Property not found" });
        return;
      }

      if (property[0].status === "open") {
        response
          .status(400)
          .json({ error: "Property is already open for funding" });
        return;
      }

      getNumberOfPropertiesOpenForFunding()
        .then(async (count) => {
          count = Number(count[0].count);
          if (count <= 5) {
            await openPropertyForFunding(id);
            response.status(200).send();
          } else {
            response
              .status(400)
              .json({ error: "Too many properties open for funding" });
            return;
          }
        })
        .catch((error) => {
          response.status(500).json({ error: error, message: error.message });
        });
    })
    .catch((error) => {
      response.status(500).json({ error: error, message: error.message });
    });
};

export const stopFunding = async (request, response) => {
  const id = request.params.id;

  getPropertyByIdQuery(id)
    .then(async (property) => {
      // Check if property exists
      if (property.length === 0) {
        response.status(404).json({ error: "Property not found" });
        return;
      }

      // Check if property is already closed or not
      if (property[0].status === "closed") {
        response
          .status(400)
          .json({ error: "Property is already closed for funding" });
        return;
      }

      // Close property for funding
      await closePropertyForFunding(id);
      response.status(200).send();
    })
    .catch((error) => {
      response.status(500).json({ error: error, message: error.message });
    });
};
