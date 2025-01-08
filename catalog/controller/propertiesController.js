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
  getInvestmentsForProperty,
  cancelPropertyFunding,
  completePropertyFunding,
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

export const updateFundingMonthly = async (request, response) => {
  // Get every property that is open for funding
  getPropertiesOpenForFundingQuery()
    .then(async (properties) => {
      // Check if deadline has passed for any property
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      properties.forEach((property) => {
        const deadline = new Date(property.funding_deadline);
        deadline.setHours(0, 0, 0, 0);

        if (currentDate > deadline) {
          // Deadline has passed.

          // Check if the property has reached its funding goal
          // Get all investments made for the property
          getInvestmentsForProperty(property.Id_Property).then(
            (investments) => {
              // Sum the total amount invested
              property.current_funding = investments.reduce(
                (total, investment) => total + investment.investment_amount,
                0
              );

              if (property.current_funding >= property.property_price) {
                // Property has reached its funding goal
                closePropertyForFunding(property.Id_Property);
              } else {
                // Property has not reached its funding goal
                cancelPropertyFunding(property.Id_Property);

                // Call wallet service to refund all investors
                investments.forEach((investment) => {
                  // Call wallet service using fetch to refund the investor
                  fetch(
                    `${env.WALLET_SERVICE_URL}/wallets/${investment.Id_User}/transfer`,
                    {
                      method: "POST",
                      body: JSON.stringify({
                        amount: investment.investment_amount,
                        transaction_type: "refund",
                      }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  ).then((response) => {
                    if (response.status !== 200) {
                      console.log("Error refunding user " + investment.Id_User);
                    }
                  });
                });
              }
              response.status(200).send();
              return;
            }
          );
        }
        response.status(200).send();
        return;
      });
    })
    .catch((error) => {
      response.status(500).json({ error: error, message: error.message });
    });
};

/**
 * Update a property once the funding has been completed
 */
export const updateFundingForProperty = async (request, response) => {
  const property_id = request.params.id;

  // Get the property
  getPropertyByIdQuery(property_id).then((property) => {
    // Check if the property exists
    if (property.length === 0) {
      response.status(404).json({ error: "Property not found" });
      return;
    }

    // Check if the property is open for funding
    if (property[0].status !== "open") {
      response.status(400).json({ error: "Property is not open for funding" });
      return;
    }

    // Check if the property has reached its funding goal
    getInvestmentsForProperty(property_id).then((investiments) => {
      // Sum the total amount invested
      property[0].current_funding = investiments.reduce(
        (total, investiment) => total + investiment.investment_amount,
        0
      );

      if (
        Number(property[0].current_funding) < Number(property[0].property_price)
      ) {
        response
          .status(400)
          .json({ error: "Property has not reached its funding goal" });
        return;
      }

      // Update the property's status to "funded"
      completePropertyFunding(property_id)
        .then(() => {
          response.status(200).send();
        })
        .catch((error) => {
          response.status(500).json({ error: error, message: error.message });
        });
    });
  });
};
