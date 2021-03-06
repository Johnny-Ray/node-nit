'use strict';

var ClaimAction = require('../../lib/actions/claim');
var nit = require('../../index');
var nitHelpers = require('../../testHelpers/nitHelpers');
var fs = require('fs');
var sf = require('sf');

module.exports = {
  'setUp': function (callback) {
    var self = this;
    nitHelpers.createTempNitDirectory({}, function (err, dir) {
      if (err) {
        return callback(err);
      }
      self.dir = dir;
      nitHelpers.createTask(self.dir, {
        fields: {
          'Modified Date': sf("{0:G}", new Date(2011, 1, 1))
        }
      }, function (err, task) {
        if (err) {
          return callback(err);
        }
        self.task = task;
        callback();
      });
    });
  },

  'claim task': function (test) {
    var self = this;
    var action = new ClaimAction();
    var options = {
      user: nitHelpers.getTestUser(),
      verbose: true,
      args: [
        this.task.id
      ]
    };
    var tracker = new nit.IssueTracker(this.dir);
    action.cliRun(tracker, options, function (err) {
      if (err) {
        throw err;
      }
      fs.readFile(self.task.filename, 'utf8', function (err, data) {
        if (err) {
          throw err;
        }
        test.ok(data.indexOf('Modified Date: 2/1/2011 00:00:00 AM') < 0);
        test.ok(data.indexOf('Assigned To: test user <test@user.com>') > 0);
        console.log(data);
        test.done();
      });
    });
  }
};
