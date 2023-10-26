import { getRecord } from "../../opt/dynamoDb.mjs";

const sessionKeyValue = process.env.SESSION_TABLE_KEY_VALUE;
const SESSION_KEY = { sessionID: sessionKeyValue };
const tableName = process.env.SESSION_TABLE_NAME;

export const handler = async (event) => {
  const response = await getRecord(tableName, SESSION_KEY);

  //-> Structure of return object shown below. If there is no session record, it would not contain an Item property.
  const sessionRecord = response.Item;

  if(sessionRecord){
    return {
      session: { ...sessionRecord },
      data: { ...event.data }
    }
  }
  return {
    data: { ...event.data }
  }
}

// { // GetItemOutput
//   Item: { // AttributeMap
//     "<keys>": { // AttributeValue Union: only one key present
//       S: "STRING_VALUE",
//       N: "STRING_VALUE",
//       B: "BLOB_VALUE",
//       SS: [ // StringSetAttributeValue
//         "STRING_VALUE",
//       ],
//       NS: [ // NumberSetAttributeValue
//         "STRING_VALUE",
//       ],
//       BS: [ // BinarySetAttributeValue
//         "BLOB_VALUE",
//       ],
//       M: { // MapAttributeValue
//         "<keys>": {//  Union: only one key present
//           S: "STRING_VALUE",
//           N: "STRING_VALUE",
//           B: "BLOB_VALUE",
//           SS: [
//             "STRING_VALUE",
//           ],
//           NS: [
//             "STRING_VALUE",
//           ],
//           BS: [
//             "BLOB_VALUE",
//           ],
//           M: {
//             "<keys>": "<AttributeValue>",
//           },
//           L: [ // ListAttributeValue
//             "<AttributeValue>",
//           ],
//           NULL: true || false,
//           BOOL: true || false,
//         },
//       },
//       L: [
//         "<AttributeValue>",
//       ],
//       NULL: true || false,
//       BOOL: true || false,
//     },
//   },
//   ConsumedCapacity: { // ConsumedCapacity
//     TableName: "STRING_VALUE",
//     CapacityUnits: Number("double"),
//     ReadCapacityUnits: Number("double"),
//     WriteCapacityUnits: Number("double"),
//     Table: { // Capacity
//       ReadCapacityUnits: Number("double"),
//       WriteCapacityUnits: Number("double"),
//       CapacityUnits: Number("double"),
//     },
//     LocalSecondaryIndexes: { // SecondaryIndexesCapacityMap
//       "<keys>": {
//         ReadCapacityUnits: Number("double"),
//         WriteCapacityUnits: Number("double"),
//         CapacityUnits: Number("double"),
//       },
//     },
//     GlobalSecondaryIndexes: {
//       "<keys>": {
//         ReadCapacityUnits: Number("double"),
//         WriteCapacityUnits: Number("double"),
//         CapacityUnits: Number("double"),
//       },
//     },
//   },
// };
