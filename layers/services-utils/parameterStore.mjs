import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const REGION = process.env.AWS_REGION;
// Configure the SSMClient to use eu-west-2 region
const client = new SSMClient({ region: REGION });


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
