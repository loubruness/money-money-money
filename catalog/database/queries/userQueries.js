import { db } from "../database/db_connection.js";

export const getUserById = async (id) => {
  return db("user").select("*").where({ Id_User: id });
};
