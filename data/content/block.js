(function () {

    var featuresToBlockEnc = JSON.stringify(self.options.featuresToBlock);

    unsafeWindow.eval(`

        var allPurposeProxy,
            featuresToBlock = eval(${featuresToBlockEnc}),
            pathToRef,
            noOpFunc,
            toPrimitiveFunc,
            origConsole = window.console;

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
            return false;
        };

        allPurposeProxy = new Proxy(function () {}, {
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
            enumerate: function (target) {
                return [][Symbol.iterator]();
            },
            ownKeys: function (target) {
                return [];
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
