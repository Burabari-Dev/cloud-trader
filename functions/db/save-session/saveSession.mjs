/*global fetch*/
import { updateRecord } from "../../opt/dynamoDb.mjs";

const sessionKeyValue = process.env.SESSION_TABLE_KEY_VALUE;
const SESSION_KEY = { sessionID: sessionKeyValue };
const tableName = process.env.SESSION_TABLE_NAME;

export const handler = async (event) => {
  const session = event.session;
  const sessionWithKey = { ...session, ...SESSION_KEY };
  const response = updateRecord(tableName, SESSION_KEY, sessionWithKey);
  console.log('>>---> ', response);                                 //TODO: DELETE THIS LINE
}
