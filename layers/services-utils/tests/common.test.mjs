import { is10MinElapsed } from '../common.mjs';
import { expect } from 'chai';
import moment from 'moment';

describe('is10MinElapsed Method Unit Tests', () => {
  it('Returns true if 10 minutes has elapsed since the provided time', () => {
    //-> GIVEN
    const time = moment().subtract(12, 'minutes');
    //-> WHEN
    const result = is10MinElapsed(time.format());
    //-> THEN
    expect(result).to.equal(true);
  })

  it('Returns false if 10 minutes has not elapsed since the provided time', () => {
    //-> GIVEN
    const time = moment().subtract(4, 'minutes');
    //-> WHEN
    const result = is10MinElapsed(time.format());
    //-> THEN
    expect(result).to.equal(false);
  })
})
