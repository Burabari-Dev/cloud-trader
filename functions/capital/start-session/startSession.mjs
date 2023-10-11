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

export const handler = async (event) => {
  // Run the commands and extract parameter values
  const { Parameter: { Value: IDENTIFIER } } = await client.send(identifierCommand);
  const { Parameter: { Value: KEY } } = await client.send(keyCommand);
  const { Parameter: { Value: PASSWORD } } = await client.send(passwordCommand);
  const { Parameter: { Value: BASE_URL } } = await client.send(baseUrlCommand);

  const url = BASE_URL + ENDPOINT;
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

    if (!response.ok) {
      //-> Capital.com returns error responses in json format eg: {"errorCode": "error.null.api.key"}
      const errCode = await response.json();  
      return {
        'statusCode': 200,
        'body': { 
          message: `
            Error getting session from capital.com 
            Capital.com Error Code: ${errCode.errorCode}
            ` }
      }
    }

    const CST = response.headers.get('CST');
    const TOKEN = response.headers.get('X-SECURITY-TOKEN');

    return {
      'statusCode': 200,
      'body': {
        CST: CST,
        TOKEN: TOKEN
      }
    }
  } catch (err) {   // TODO: Check better way of handling this error.
    console.log(err);
    return err;
  }

}
