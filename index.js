(function () {
    "use strict";

    var {env} = require('sdk/system/environment'),
        featuresRuleParser = require("lib/featureParser"),
        standardIdsToFeatures = featuresRuleParser.parse("features.csv"),
        pageMod = require("sdk/page-mod"),
        system = require("sdk/system"),
        standardIdsToBlock,
        featuresToBlock;


    standardIdsToBlock = env.FF_STANDARDS;
    if (!standardIdsToBlock) {
        console.log("Usage: FF_STANDARDS=<comma seperated standard ids>");
        system.exit(1);
        return;
    }

    featuresToBlock = standardIdsToBlock.split(",").reduce(function (collection, standardId) {
        return collection.concat(standardIdsToFeatures[standardId]);
    }, []);

    if (!featuresToBlock[0]) {
        featuresToBlock = [];
    }

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
