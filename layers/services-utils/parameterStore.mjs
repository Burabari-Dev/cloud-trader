import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

// Configure the SSMClient to use eu-west-2 region
const client = new SSMClient({ region: 'eu-west-2' });


export const getParameter = async (paramName, isWithDecryption) => {
  // Generate the commands to get necessary parameters from Parameter Store
  const command = new GetParameterCommand({
    Name: paramName,
    WithDecryption: isWithDecryption
  });

  // Run the commands and retrieve parameter store values
  const { Parameter: { Value: paramValue } } = await client.send(command);

  return paramValue;
}
