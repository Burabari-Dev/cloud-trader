// import { is10MinElapsed } from "../../opt/common.mjs";
import { is10MinElapsed } from "../../../layers/services-utils/common.mjs";

export const handler = async (event) => {
  const sessionRecord = event.Item;   //-> Item returned from getDbSession lambda

  if (sessionRecord) {                //-> If (true) a record of session was returned from the database
    return {
      isValid: is10MinElapsed(sessionRecord.TIME_LAST_ACTIVE),
      ...sessionRecord
    };
  }

  return { isValid: false }
}
