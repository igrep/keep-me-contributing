'use strict';

/**
 * @fileoverview
 * Toplevel operations executed as a Web Worker.
 * This worker notifies me at the preset times (given by postMessage)
 * of whether I have contributed to GitHub today.
 *
 * NOTE:
 * Considering the operation executed by the worker,
 * This app doesn't need to run a worker in background actually.
 * I planned to use Service Worker at first,
 * but currently Service Worker doesn't support any feature
 * to execute some operations at a preset times.
 * I realized that after implemeing this worker.
 * That's why this is a Worker.
 */

goog.provide('KeepMeContributing.Worker.Main');

goog.require('KeepMeContributing.Worker');

goog.require('KeepMeContributing.ContributionStatus');
goog.require('KeepMeContributing.Github');

goog.require('goog.array');

self.addEventListener('message', (/** MessageEvent */ event) => {
  let kmc = KeepMeContributing;
  let /** string */ username = 'igrep';
  let /** KeepMeContributing.ContributionStatus */ contributionStatus = new kmc.ContributionStatus(
    new kmc.Github({ username: username, format: kmc.Github.Formats.JSON, apiUrl: '' })
  );

  let /** KeepMeContributing.Worker.ContributionStatusNotifier */ notifier =
    new kmc.Worker.ContributionStatusNotifier(username, contributionStatus);

  let /** Array<Object> */ timesObject = /** @type {Array<Object>} */ (event.data);
  let /** Array<KeepMeContributing.Worker.TimeOfDay> */ times =
    goog.array.map(timesObject, (/** {hour_: number, minute_: number} */ timeObject) =>
      KeepMeContributing.Worker.TimeOfDay.fromData(timeObject)
    );
  KeepMeContributing.Worker.SchedulesRunner.run(
    times,
    (/** KeepMeContributing.Worker.TimeOfDay */ time) => {
      notifier.askToNotifyAt(time);
    }
  );
});
