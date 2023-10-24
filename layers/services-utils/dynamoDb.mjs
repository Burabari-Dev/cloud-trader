import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const REGION = process.env.AWS_REGION;
const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

export const newOrReplaceRecord = async (tableName = 'demoTable', item = {}) => {
  const command = new PutCommand({
    TableName: tableName,
    Item: item,
    ReturnValues: 'NONE',
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

export const deleteRecord = async (tableName = 'demoTable', itemKey = {}) => {
  const command = new DeleteCommand({
    TableName: tableName,
    Key: itemKey,
    ReturnConsumedCapacity: 'TOTAL'
  })

  const response = await docClient.send(command);
  return response;
}


////////////////////////////////////////////////////////////////////////////  -> Helper Functions

export const genUpdateExpression = (updateAttributes = {}) => {
  const keys = Object.keys(updateAttributes);
  const initialValue = 'set ';
  const result = keys.reduce((accumulator, currentValue, index) => {
    return accumulator + `${currentValue} = :${currentValue}${keys.length > index + 1 ? ', ' : ''}`;
  }, initialValue);
  return result;
}

export const genExpressionAttributeValues = (updateAttributes = {}) => {
  let expressionAttributeValues = {};
  for (let [key, value] of Object.entries(updateAttributes)) {
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
