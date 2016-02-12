//  Copyright 2015 Alexandre Terrasa <alexandre@moz-code.org>.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.

// Build bugs directories.

var fs = require('fs');
var path = require('path');
var async = require('async');
var child_process = require('child_process');

exports.testTeam = function(teamsDir, round, team, bs, cb) {
	var calls = [];
	bs.forEach(function(bug) {
		calls.push(function(callback) {
			exports.testBugRandom(teamsDir, round, team, bug, callback);
		});
	});

	async.parallel(calls, function(err, results) {
		if(err) {
			console.log(err);
			return;
		};
		var allStatus = {
			round: round,
			team: team.id,
			timestamp: new Date().getTime(),
			bugs: {}
		};
		results.forEach(function(result) {
			allStatus.bugs[result.bug] = result;
		});
		cb(allStatus);
	});
}

exports.testBugRandom = function(teamsDir, round, team, bug, callback) {
	var rand = bug.tests[Math.floor(Math.random() * bug.tests.length)];
	exports.testBug(teamsDir, round, team, bug, rand, callback);
}

exports.testBug = function(teamsDir, round, team, bug, test, callback) {
	var execDir = teamsDir + '/' + team.id + '/' + bug.id;
	child_process.exec('cd "' + execDir + '" && ./tests.sh "' + test.name +'"',
		function(err, stdout, stderr) {
			var status = {
				bug: bug.id,
				test: test.name,
			}
			if(err) {
				status.status = 'failure'
				status.output = stderr? stderr : stdout
			} else {
				status.status = 'success'
				status.output = stdout
			}
			console.log("   - test " + bug.id + " with " + test.name + ' [' + (err? 'KO' : 'OK') + ']');
			callback(null, status);
		});
}
