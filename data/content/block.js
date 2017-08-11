(function () {

    var currentDomain = window.location.host,
        isDebugMode = self.options.isDebugMode,
        blockingSettings = self.options.blockingSettings,
        standardIdsToFeatures = self.options.standardIdsToFeatures,
        currentDomain = window.location.host, 
        matchingDomainRule,
        standardIdsToBlock,
        featuresToBlock,
        featuresToBlockEnc;

    // Determine which standards to block, by trying to match the domain
    // rule sets to the current domain.  If we're not able to, then
    // fallback to the default ruleset.
    matchingDomainRule = Object.keys(blockingSettings)
        .filter(function (domainName) {
            return domainName !== "default";
        })
        .reduce(function (prev, next) {

            var matchingDomainRule = prev,
                newDomainRule = next,
                regexPattern;

            if (matchingDomainRule) {
                return matchingDomainRule;
            }

            var regexPattern = new RegExp(newDomainRule);
            if (regexPattern.test(currentDomain)) {
                return newDomainRule;
            }

            return undefined;
        }, undefined);

    standardIdsToBlock = matchingDomainRule
        ? blockingSettings[matchingDomainRule]
        : blockingSettings.default;

    // Go from an array of integers, each being a standard to block,
    // to an array of arrays, where each array contains information about a
    // feature to block.  This returned array will be the size of the
    // all the features, in all the standards, we're blocking.
    featuresToBlock = standardIdsToBlock
        .map(function (aStandardId) {
            return standardIdsToFeatures[aStandardId];
        })
        .reduce(function (prev, next) {
            return prev.concat(next);
        }, []);

    featuresToBlockEnc = JSON.stringify(featuresToBlock);

    // Rely on this nasty injection trick to bypass Firefox's sandboxing.
    // Seems like we shouldn't be allowed to do this, but, welp it works...
    unsafeWindow.eval(`

        var isDebugMode = ("${isDebugMode}" === "debug"),
            featuresToBlock = eval(${featuresToBlockEnc}),
            defaultFunction = function () {},
            funcPropNames = Object.getOwnPropertyNames(defaultFunction),
            unconfigurablePropNames = funcPropNames.filter(function (propName) {
                var possiblePropDesc = Object.getOwnPropertyDescriptor(defaultFunction, propName);
                return (possiblePropDesc && !possiblePropDesc.configurable);
            }),
            createBlockingProxy,
            defaultBlockingProxy,
            pathToRef,
            noOpFunc,
            toPrimitiveFunc,
            debugMsg;

        debugMsg = function (msg) {
            throw msg;
            console.log(msg);
        };

        pathToRef = function (keyPath) {
            return keyPath.reduce(function (prev, cur) {
                if (prev === undefined) {
                    return undefined;
                }
                return prev[cur];
            }, window);
        };

        noOpFunc = function (id, oldval, newval) {
            return oldval;
        };

        toPrimitiveFunc = function (hint) {
            if (hint === "number" || hint === "default") {
                return 0;
            }
            if (hint === "string") {
                return "";
            }
            return undefined;
        };

        createBlockingProxy = function (keyPath) {

            var hasBeenLogged = false,
                logKeyPath = function () {
                    if (keyPath !== undefined && hasBeenLogged === false) {
                        hasBeenLogged = true;
                        console.log(keyPath);
                    }
                },
                blockingProxy;

            blockingProxy = new Proxy(defaultFunction, {
                get: function (target, property) {
                    logKeyPath();

                    if (property === Symbol.toPrimitive) {
                        return toPrimitiveFunc;
                    }

                    if (property === "valueOf") {
                        return toPrimitiveFunc;
                    }

                    return blockingProxy;
                },
                set: function (target, property, value) {
                    logKeyPath();
                    return blockingProxy;
                },
                apply: function (target, thisArg, argumentsList) {
                    logKeyPath();
                    return blockingProxy;
                },
                ownKeys: function (target) {
                    return unconfigurablePropNames;
                },
                has: function (target, property) {
                    return (unconfigurablePropNames.indexOf(property) > -1);
                },
                getOwnPropertyDescriptor: function (target, property) {
                    if (unconfigurablePropNames.indexOf(property) === -1) {
                        return undefined;
                    }
                    return Object.getOwnPropertyDescriptor(defaultFunction, property);
                }
            });

            return blockingProxy;
        };

        defaultBlockingProxy = createBlockingProxy();

        // For each feature we've specified to block on this domain,
        // walk the key-value path, starting from the root / window object,
        // and replace the leaf with our allPurproseProxy object, to render
        // the feature unreachable by client code.

        featuresToBlock.forEach(function (row) {

            var featurePath = row[0],
                featureType = row[1],
                pathSegments = featurePath.split("."),
                numSegments = pathSegments.length,
                pathToRoot = pathSegments.slice(0, numSegments - 1),
                leafName = pathSegments[numSegments - 1],
                rootElement = pathToRef(pathToRoot);

            if (rootElement === undefined) {
                console.log("Unable to find path for " + featurePath);
                return;
            }

            if (featureType === "property") {

                rootElement.watch(leafName, function (id, oldval, newval) {
                    return noOpFunc.call(this, id, oldval, newval);
                });

            } else {

                if (isDebugMode === true) {
                    rootElement[leafName] = createBlockingProxy(pathSegments);
                } else {
                    rootElement[leafName] = defaultBlockingProxy;
                }
            }
        });
    `);
}());
