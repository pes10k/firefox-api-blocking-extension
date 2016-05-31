"use strict";

var parseFeaturesCsv,
    self = require("sdk/self");

/**
 * Parses a CSV from disk that describes a set of features to instrument.
 * The CSV file should be zero or more rows of 
 *  <feature path>, <event | method | promise>
 *
 * @param string filename
 *   String description of where the rule list is on disk to parse, relative
 *   to the data dir
 *
 * @return null|array
 *   Either returns null if there was an error reading the rules from disk,
 *   or an array of zero or more rules parsed from the file, where each
 *   rule is an object in the following format:
 *   {feature: <array key filename to feature>, type: <event | method>}
 */
parseFeaturesCsv = function (filename) {

    var readRules = self.data.load(filename);

    return readRules.trim().split("\n").reduce(function (prev, cur) {

        var parts = cur.split(",").map(a => a.trim()),
            returnValue = undefined,
            featureName = parts[0],
            standardId = parts[1];

        if (prev[standardId] === undefined) {
            prev[standardId] = [];
        }

        if (parts.length === 4) {
            switch (parts[2]) {
                case "number":
                    returnValue = parseInt(parts[3]);
                    break;
            }
        }

        prev[standardId].push([featureName, returnValue]);

        return prev;
    }, {});
};


exports.parse = parseFeaturesCsv;
