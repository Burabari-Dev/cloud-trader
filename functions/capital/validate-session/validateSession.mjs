import { is10MinElapsed } from "../../opt/common.mjs";

export const handler = async (event) => {
  const session = event.session;   //-> Item returned from getDbSession lambda
  if (!session) {
    return { isValid: false };
  }

  const timeLastActive = session.TIME_LAST_ACTIVE;
  const isValid = timeLastActive ? !is10MinElapsed(timeLastActive) : false

  return {
    isValid: isValid,
    session: { ...session },
    data: { ...event.data }
  };
}
