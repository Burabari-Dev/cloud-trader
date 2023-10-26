import { doStartSession } from '../startSession.mjs';
import { expect } from 'chai';
import sinon from 'sinon';

describe('doStartSession unit tests', () => {
  const event = {};

  afterEach(() => {
    sinon.restore();
  })

  it('should return a successful response with CST and TOKEN values', async () => {
    // -> GIVEN
    sinon.stub(global, 'fetch').callsFake(() => new Response({}, {
      status: 200,
      headers: {
        CST: '1234567890',
        'X-SECURITY-TOKEN': 'qwertyuiopasdfghjkl'
      }
    }));
    // -> WHEN
    const result = await doStartSession(event, 'http://endpoint.com', 'DEMO-KEY', 'name@email.com', 'abc-123-!');
    // -> THEN
    expect(result.session.CST).to.equal('1234567890');
    expect(result.session.TOKEN).to.equal('qwertyuiopasdfghjkl');
  });

  it('should return an error response with the Capital.com error code when the start session request fails', async () => {
    // -> GIVEN
    const errMsg = { "errorCode": "error.invalid.details" };
    const blob = new Blob([JSON.stringify(errMsg, null, 2)], { type: "application/json" });
    sinon.stub(global, 'fetch').callsFake(() => new Response(blob, {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    }));
    // -> WHEN
    const result = await doStartSession(event, 'http://endpoint.com', 'DEMO-KEY', 'name@email.com', 'abc-123-!');
    // -> THEN
    expect(result.message).to.include(`error.invalid.details`);
  });

  it('should return the error object when the start session request throws an error', async () => {
    // -> GIVEN
    sinon.stub(global, 'fetch').throws(new Error('Network error'));
    // -> WHEN
    const result = await doStartSession(event, 'http://endpoint', 'DEMO-KEY', 'name@email.com', 'abc-123-!');
    // -> THEN
    expect(result.message).to.include('Could not fetch with the following parameters:');
    expect(result.message).to.include('DEMO-KEY');
    expect(result.message).to.include('name@email.com');
  });
});
