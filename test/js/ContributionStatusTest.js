'use strict';

import assert from 'power-assert';
import fs from 'fs';

import ContributionStatus from '../../app/js';

describe('ContributionStatus', () => {
  describe('#recentlyContributedAt', () => {
    context('given a response of https://api.github.com/users/igrep/events', () => {
      let fromJsonFile = (path) => {
        return new ContributionStatus(JSON.parse(fs.readFileSync(path)));
      };

      context('the latest contribution event is a PushEvent', () => {
        let contributionStatus = fromJsonFile('test/fixtures/api.github.com/events/PushEvent.json');

        it('has recentlyContributedAt same as the latest PushEvent', () => {
          assert(
            contributionStatus.recentlyContributedAt.valueOf() === new Date('2015-07-19T16:08:53Z').valueOf()
          );
        });
      });

      context('the latest contribution event is a CreateEvent of a repository', () => {
        let contributionStatus = fromJsonFile('test/fixtures/api.github.com/events/CreateEvent.json');

        it('has recentlyContributedAt same as the latest CreateEvent of a repository', () => {
          assert(
            contributionStatus.recentlyContributedAt.valueOf() === new Date('2015-07-18T04:36:51Z').valueOf()
          );
        });
      });

      context('the latest contribution event is a PullRequestEvent when opened', () => {
        let contributionStatus = fromJsonFile('test/fixtures/api.github.com/events/PullRequestEvent.json');

        it('has recentlyContributedAt same as the latest PullRequestEvent when opened', () => {
          assert(
            contributionStatus.recentlyContributedAt.valueOf() === new Date('2015-07-16T15:46:11Z').valueOf()
          );
        });
      });

      context('the latest contribution event is a IssuesEvent when opened', () => {
        let contributionStatus = fromJsonFile('test/fixtures/api.github.com/events/IssuesEvent.json');

        it('has recentlyContributedAt same as the latest PullRequestEvent when opened', () => {
          assert(
            contributionStatus.recentlyContributedAt.valueOf() === new Date('2015-07-26T04:39:34Z').valueOf()
          );
        });
      });

    });
  });
});
