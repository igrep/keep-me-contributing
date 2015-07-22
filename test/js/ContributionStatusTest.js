'use strict';

import assert from 'power-assert';
import fs from 'fs';

import ContributionStatus from '../../app/js';

describe('ContributionStatus', () => {
  describe('#recentlyContributedAt', () => {
    context('given a response of https://api.github.com/users/igrep/events', () => {
      let contributionStatus = new ContributionStatus(
        JSON.parse(fs.readFileSync('test/fixtures/api.github.com/events/igrep.json'))
      );

      it('has recentlyContributedAt as recorded in JSON', () => {
        assert(
          contributionStatus.recentlyContributedAt.valueOf() === new Date('2015-07-19T16:08:53Z').valueOf()
        );
      });
    });
  });
});
