(function () {

    var featuresToBlockEnc = JSON.stringify(self.options.featuresToBlock);

    unsafeWindow.eval(`

        var allPurposeProxy,
            featuresToBlock = eval(${featuresToBlockEnc}),
            defaultFunction = function () {},
            funcPropNames = Object.getOwnPropertyNames(defaultFunction),
            unconfigurablePropNames = funcPropNames.filter(function (propName) {
                var possiblePropDesc = Object.getOwnPropertyDescriptor(defaultFunction, propName);
                return (possiblePropDesc && !possiblePropDesc.configurable);
            }),
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
            if (hint === "number") {
                return 0;
            }
            if (hint === "string") {
                return "";
            }
            return undefined;
        };

        allPurposeProxy = new Proxy(defaultFunction, {
            get: function (target, property, receiver) {
                if (property === Symbol.toPrimitive) {
                    return toPrimitiveFunc;
                }
                return allPurposeProxy;
            },
            set: function (target, property, value, receiver) {
                return allPurposeProxy;
            },
            apply: function (target, thisArg, argumentsList) {
                return allPurposeProxy;
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

        featuresToBlock.forEach(function (row) {

            var featurePath = row[0],
                featureType = row[1],
                pathSegments = featurePath.split("."),
                numSegments = pathSegments.length,
                pathToRoot = pathSegments.slice(0, numSegments - 1),
                leaf = pathSegments[numSegments - 1],
                rootElement = pathToRef(pathToRoot);

            if (rootElement === undefined) {
                throw "Unable to find path for " + featurePath;
            }

            if (featureType === "property") {
                rootElement.watch(leaf, noOpFunc);
            } else {
                rootElement[leaf] = allPurposeProxy;
            }
        });
    `);
}());
