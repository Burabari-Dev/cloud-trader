import { is10MinElapsed } from "../../opt/common.mjs";

export const handler = async (event) => {
  const sessionRecord = event.Item;   //-> Item returned from getDbSession lambda
  const timeLastActive = sessionRecord.TIME_LAST_ACTIVE;
  const isValid =  timeLastActive ? ! is10MinElapsed(timeLastActive) : false

  if (sessionRecord) {                //-> If (true) a record of session was returned from the database
    return {
      isValid: isValid,
      ...sessionRecord
    };
  }

  return { isValid: false }
}
