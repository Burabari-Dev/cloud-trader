import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const REGION = process.env.AWS_REGION;
const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

export const newRecord = async (tableName = 'demoTable', item = {}) => {
  const command = new PutCommand({
    TableName: tableName,
    Item: item,
    ReturnConsumedCapacity: 'TOTAL'
  });

  const response = await docClient.send(command);
  return response;
}

export const updateRecord = async (tableName = 'demoTable', itemKey = {}, updateAttributes = {}) => {
  const command = new UpdateCommand({
    TableName: tableName,
    Key: itemKey,
    UpdateExpression: genUpdateExpression(updateAttributes),
    ExpressionAttributeValues: genExpressionAttributeValues(updateAttributes),
    ReturnValues: 'ALL_NEW',
    ReturnConsumedCapacity: 'TOTAL'
  });

  const response = await docClient.send(command);
  return response;
}

export const getRecord = async (tableName = 'demoTable', itemKey = {}) => {
  const command = new GetCommand({
    TableName: tableName,
    Key: itemKey,
    ReturnConsumedCapacity: 'TOTAL'
  })

  const response = await docClient.send(command);
  return response;
}


////////////////////////////////////////////////////////////////////////////  -> Helper Functions

const genUpdateExpression = (updateAttributes = {}) => {
  const keys = Object.keys(updateAttributes);
  const initialValue = 'set ';
  const result = keys.reduce((accumulator, currentValue) => {
    return accumulator + `${currentValue} = :${currentValue}, `;
  }, initialValue);
  return result;
}

const genExpressionAttributeValues = (updateAttributes = {}) => {
  let expressionAttributeValues = {};
  for ([key, value] of Object.entries(updateAttributes)) {
    expressionAttributeValues[`:${key}`] = value;
  }
  return expressionAttributeValues;
}

// const genExpressionAttributeValues2 = (updateAttributes = {}) => {
//   let expressionAttributeValues = {};
//   Object.entries(updateAttributes).reduce((accumulator, currentValue) => {
//     const [key, value] = currentValue;
//     expressionAttributeValues[`:${key}`] = value;
//   }, expressionAttributeValues)
//   return expressionAttributeValues;
// }
