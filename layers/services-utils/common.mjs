import moment from "moment";

// export const CT_IDENTIFIER = process.env.CT_IDENTIFIER;
// export const CT_KEY = process.env.CT_KEY;
// export const CT_PASSWORD = process.env.CT_PASSWORD;
// export const CT_DEMO_URL = process.env.CT_DEMO_URL;
// export const SESSION_ENDPOINT = process.env.SESSION_ENDPOINT;


export const nowTime = () => (moment().format());

export const is10MinElapsed = (time = '2013-02-08 24:00:00.000') => {
  const diff = moment().diff(moment(time), 'minutes', true);
  return diff > Math.abs(9.8);  //-> Capital.com session expires in 10 mins. Use 9.8 to account for aws services processing time
}
