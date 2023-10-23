import { getRecord } from "../../opt/dynamoDb.mjs";

const sessionKeyValue = process.env.SESSION_TABLE_KEY_VALUE;
const SESSION_KEY = { sessionID: sessionKeyValue };
const tableName = process.env.SESSION_TABLE_NAME;

export const handler = async(event) => {
  const response = await getRecord(tableName, SESSION_KEY);
  return response;
  //TODO: What is the response structure of a record not found in the DB?
}
