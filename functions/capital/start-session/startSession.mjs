import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';


// Configure the SSMClient to use eu-west-2 region
const client = new SSMClient({ region: 'eu-west-2' });

// Generate the commands to get necessary parameters from Parameter Store
const identifierCommand = new GetParameterCommand({
  Name: '/cloud-trader/identifier',
  WithDecryption: false
});
const keyCommand = new GetParameterCommand({
  Name: '/cloud-trader/key',
  WithDecryption: true
});
const passwordCommand = new GetParameterCommand({
  Name: '/cloud-trader/password',
  WithDecryption: true
});
const baseUrlCommand = new GetParameterCommand({
  Name: '/cloud-trader/capitalDemoUrl',
  WithDecryption: false
});

const ENDPOINT = '/session';


/**
 * This AWS Lambda function retrieves necessary parameters from AWS SSM Parameter Store,
 * constructs a session URL, and initiates a session with Capital.com API using the obtained credentials.
 *
 * @param {Object} event - AWS Lambda event object.
 * @returns {Object} - Returns an object containing CST (Client Session Token) and TOKEN (Security Token)
 *                   if the session is successfully started, or an error response otherwise.
 */
export const handler = async (event) => {
  // Run the commands and retrieve parameter store values
  const { Parameter: { Value: IDENTIFIER } } = await client.send(identifierCommand);
  const { Parameter: { Value: KEY } } = await client.send(keyCommand);
  const { Parameter: { Value: PASSWORD } } = await client.send(passwordCommand);
  const { Parameter: { Value: BASE_URL } } = await client.send(baseUrlCommand);

  const url = BASE_URL + ENDPOINT;

  return doStartSession(url, KEY, IDENTIFIER, PASSWORD);

}


/**
 * Initiates a session with the Capital.com API using the provided credentials.
 *
 * @param {string} url - The API endpoint URL for starting the session.
 * @param {string} KEY - API key for authentication.
 * @param {string} IDENTIFIER - User identifier (e.g., email address).
 * @param {string} PASSWORD - User password.
 * @returns {Object} - Returns an object containing CST (Client Session Token) and TOKEN (Security Token)
 *                   if the session is successfully started, or an error response otherwise.
 */
export const doStartSession = async (
  url = "http://endpoint.com",
  KEY = "DEMO-KEY",
  IDENTIFIER = "name@email.com",
  PASSWORD = "abc-123-!"
) => {

  const headers = {
    'X-CAP-API-KEY': KEY,
    'Content-Type': 'application/json'
  };
  const postBody = {
    "identifier": IDENTIFIER,
    "password": PASSWORD
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(postBody)
    });

    if (response.status >= 400 && response.status < 500) {
      //-> Capital.com returns error responses in json format eg: {"errorCode": "error.invalid.details"}
      const errCode = await response.json();
      return {
        message: `
          Error getting session from capital.com
          Capital.com Error Code: ${errCode?.errorCode}
        `
      }
    }

    const CST = response.headers.get('CST');
    const TOKEN = response.headers.get('X-SECURITY-TOKEN');

    return JSON.stringify({
        CST: CST,
        TOKEN: TOKEN
    })
  } catch (err) {   // TODO: Check better way of handling this error.
    // console.log(err);
    return {
      message: `
      Could not fetch with the following parameters: 
        -> X-CAP-API-KEY: ${KEY}
        -> IDENTIFIER: ${IDENTIFIER}
        -> PASSWORD: ****** given password.
      `
      };
  }
}
