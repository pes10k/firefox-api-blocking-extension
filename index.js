(function () {
    "use strict";

    var {env} = require('sdk/system/environment'),
        featuresRuleParser = require("lib/featureParser"),
        standardIdsToFeatures = featuresRuleParser.parse("features.csv"),
        pageMod = require("sdk/page-mod"),
        system = require("sdk/system"),
        standardIdsToBlock,
        featuresToBlock,
        numFeaturesBlocking = 0;


    standardIdsToBlock = env.FF_STANDARDS;
    if (!standardIdsToBlock) {
        console.log("Usage: FF_STANDARDS=<comma seperated standard ids>");
        system.exit(1);
        return;
    }

    featuresToBlock = standardIdsToBlock.split(",").reduce(function (collection, standardId) {
        var newFeatures = standardIdsToFeatures[standardId];
        if (!newFeatures) {
            console.log("Blocking 0 features from standard " + standardId);
            return collection;
        }
        console.log("Blocking " + newFeatures.length + " features from standard " + standardId);
        numFeaturesBlocking += newFeatures.length;
        return collection.concat(newFeatures);
    }, []);

    if (!featuresToBlock[0]) {
        featuresToBlock = [];
    }

    console.log("---");
    console.log("Blocking " + numFeaturesBlocking + " total features");

    pageMod.PageMod({
        include: "*",
        contentScriptOptions: {
            featuresToBlock: featuresToBlock
        },
        contentScriptFile: [
            "./content/block.js"
        ],
        contentScriptWhen: "start"
    });
}());
