(function () {
    "use strict";

    var {env} = require('sdk/system/environment'),
        featuresRuleParser = require("lib/feature-parser"),
        standardNames = require("lib/standard-names").standardNames,
        standardIdsToFeatures = featuresRuleParser.parse("features.csv"),
        pageMod = require("sdk/page-mod"),
        system = require("sdk/system"),
        simplePrefs = require("sdk/simple-prefs"),
        tabs = require("sdk/tabs"),
        data = require("sdk/self").data,
        simpleStorage = require("sdk/simple-storage"),
        store = simpleStorage.storage,
        conservativeSet = [2, 19, 25, 29, 32, 33, 35, 42, 51, 54, 55, 63, 68],
        aggressiveSet = conservativeSet.concat([74, 1, 4, 5, 7, 15, 21, 22,
                                                23, 24, 26, 27, 30, 34, 38,
                                                36, 43, 45, 47, 50, 52, 53,
                                                56, 60, 64, 65, 67, 48, 71]);

    simplePrefs.on("clickedWebAPISettings", function () {
        tabs.open(data.url("settings.html"));
    });

    if (!store.blockingSettings) {
        store.blockingSettings = {};
    }

    if (!store.blockingSettings.default) {
        store.blockingSettings.default = aggressiveSet;
    }

    pageMod.PageMod({
        contentScriptOptions: {
            defaultBlockingSet: aggressiveSet,
            blockingSettings: store.blockingSettings,
            standardIdsToFeatures: standardIdsToFeatures,
            standardNames: standardNames
        },
        include: "resource://firefox-api-blocking-extension/data/settings.html",
        contentScriptFile: [
            "./content/jquery-3.2.1.min.js",
            "./content/settings.js",
        ],
        contentScriptWhen: "ready",
        onAttach: function (worker) {

            worker.port.on("config-request", function () {
                worker.port.emit("config-send", store.blockingSettings);
            });

            worker.port.on('update-standard-settings', function (message) {
                var domain = message.domain,
                    settings = message.settings;
                store.blockingSettings[domain] = settings;
            });

            worker.port.on("create-new-domain", function (message) {
                var domain = message.domain;
                store.blockingSettings[domain] = aggressiveSet;
                worker.port.emit("create-new-domain-done");
            });

            worker.port.on("disable-domain-rule", function (message) {
                var domain = message.domain;
                delete store.blockingSettings[domain];
            })
        }
    });


    // featuresToBlock = standardIdsToBlock.split(",").reduce(function (collection, standardId) {
    //     var newFeatures = standardIdsToFeatures[standardId];
    //     if (!newFeatures) {
    //         console.log("Blocking 0 features from standard " + standardId);
    //         return collection;
    //     }
    //     console.log("Blocking " + newFeatures.length + " features from standard " + standardId);
    //     numFeaturesBlocking += newFeatures.length;
    //     return collection.concat(newFeatures);
    // }, []);

    // if (!featuresToBlock[0]) {
    //     featuresToBlock = [];
    // }


    pageMod.PageMod({
        include: "*",
        exclude: "resource://firefox-api-blocking-extension/data/settings.html",
        contentScriptOptions: {
            blockingSettings: store.blockingSettings,
            standardIdsToFeatures: standardIdsToFeatures
        },
        contentScriptFile: [
            "./content/block.js"
        ],
        contentScriptWhen: "start"
    });
}());
