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
    await addPropertyQuery(property);
    response.status(200).send();
  } catch (error) {
    response.status(500).json({ error: error, message: error.message });
  }
};

export const updateProperty = async (request, response) => {
  const id = request.params.id;
  const property = request.body;

  try {
    await updatePropertyQuery(id, property);
    response.status(200).send();
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

  try {
    await openPropertyForFunding(id);
    response.status(200).send();
  } catch (error) {
    response.status(500).json({ error: error, message: error.message });
  }
};

export const stopFunding = async (request, response) => {
  const id = request.params.id;

  try {
    await closePropertyForFunding(id);
    response.status(200).send();
  } catch (error) {
    response.status(500).json({ error: error, message: error.message });
  }
};
