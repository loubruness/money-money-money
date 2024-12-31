import { db } from "../db_connection.js";

export const getUserById = async (id) => {
  return db("User").select("*").where({ Id_User: id });
};
