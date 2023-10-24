/*global fetch*/
import { newOrReplaceRecord } from "../../opt/dynamoDb.mjs";

const sessionKeyValue = process.env.SESSION_TABLE_KEY_VALUE;
const SESSION_KEY = { sessionID: sessionKeyValue };
const tableName = process.env.SESSION_TABLE_NAME;

export const handler = async (event) => {
  const session = {
    CST: event.CST,
    TOKEN: event.TOKEN,
    TIME_LAST_ACTIVE: event.TIME_LAST_ACTIVE
  };
  const sessionWithKey = { ...session, ...SESSION_KEY };
  await newOrReplaceRecord(tableName, sessionWithKey);
  return session;
}
