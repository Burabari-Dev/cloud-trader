import { genUpdateExpression, genExpressionAttributeValues } from '../dynamoDb.mjs';
import mocha from 'mocha';
import sinon from 'sinon';
import { expect } from 'chai';
// import moment from 'mom'

describe('dynamoDb -> genUpdateExpression()', () => {
  const sessionId = 'only1session';
  const cst = '1234567890';
  const token = 'qwertyuiopasdfghjkl';
  const timeLastActive = '2013-02-08 24:00:00.000';

  afterEach(() => {
    sinon.restore();
  })

  it('Generates Update Expression from object attributes', () => {
    //-> GIVEN
    const updateAttributes = { sessionID: sessionId, CST: cst, TOKEN: token, TIME_LAST_ACTIVE: timeLastActive };
    //-> WHEN
    const result = genUpdateExpression(updateAttributes);
    //-> THEN
    expect(result).to.eql('set sessionID = :sessionID, CST = :CST, TOKEN = :TOKEN, TIME_LAST_ACTIVE = :TIME_LAST_ACTIVE');
  })

  it('Generates Expression Attribute Values from object attributes', () => {
    //-> GIVEN
    const updateAttributes = { sessionID: sessionId, CST: cst, TOKEN: token, TIME_LAST_ACTIVE: timeLastActive };
    //-> WHEN
    const result = genExpressionAttributeValues(updateAttributes);
    //-> THEN
    expect(result).to.deep.equal({ ":sessionID": sessionId, ":CST": cst, ":TOKEN": token, ":TIME_LAST_ACTIVE": timeLastActive });
  })

})

