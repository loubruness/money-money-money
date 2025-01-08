import { db } from "../db_connection.js";

export const getAllProperties = async () => {
  return db("Property").select("*");
};

export const getPropertyById = async (id) => {
  return db("Property").select("*").where({ Id_Property: id });
};

export const addProperty = async (property) => {
  return db("Property").insert(property);
};

export const updateProperty = async (id, property) => {
  return db("Property").where({ Id_Property: id }).update(property);
};

export const deleteProperty = async (id) => {
  return db("Property").where({ Id_Property: id }).del();
};

export const getPropertiesOpenForFunding = async () => {
  return db("Property").select("*").where({ status: "open" });
};

export const getNumberOfPropertiesOpenForFunding = async () => {
  return db("Property").count("*").where({ status: "open" });
};

export const getPropertiesClosedForFunding = async () => {
  return db("Property").select("*").where({ status: "closed" });
};

export const openPropertyForFunding = async (id) => {
  return db("Property").where({ Id_Property: id }).update({ status: "open" });
};

export const closePropertyForFunding = async (id) => {
  return db("Property").where({ Id_Property: id }).update({ status: "closed" });
};

export const cancelPropertyFunding = async (id) => {
  return db("Property")
    .where({ Id_Property: id })
    .update({ status: "cancelled" });
};

export const completePropertyFunding = async (id) => {
  return db("Property").where({ Id_Property: id }).update({ status: "funded" });
};

export const getInvestmentsForProperty = async (id) => {
  return db("Investment").select("*").where({ Id_Property: id });
};
