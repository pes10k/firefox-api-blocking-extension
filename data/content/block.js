(function () {

    var featuresToBlockEnc = JSON.stringify(self.options.featuresToBlock);

    unsafeWindow.eval(`

        var allPurposeProxy,
            featuresToBlock = eval(${featuresToBlockEnc}),
            pathToRef;

        allPurposeProxy = function (featurePath) {
            return new Proxy(function () {}, {
                get: function (target, property, receiver) {
                    if (property === "length") {
                        return 0;
                    }
                    return allPurposeProxy(featurePath);
                },
                set: function (target, property, value, receiver) {
                    return allPurposeProxy(featurePath);
                },
                apply: function (target, thisArg, argumentsList) {
                    return allPurposeProxy(featurePath);
                },
                enumerate: function (target) {
                    return [][Symbol.iterator]();
                },
                ownKeys: function (target) {
                    return [];
                }
            });
        };

        pathToRef = function (keyPath) {
            return keyPath.reduce(function (prev, cur) {
                if (prev === undefined) {
                    return undefined;
                }
                return prev[cur];
            }, window);
        };


        featuresToBlock.forEach(function ([feature, returnValue]) {

            var pathSegments = feature.split("."),
                numSegments = pathSegments.length,
                pathToRoot = pathSegments.slice(0, numSegments - 1),
                leaf = pathSegments[numSegments - 1],
                rootElement = pathToRef(pathToRoot);

            if (rootElement === undefined) {
                throw "Unable to find path for " + feature;
            }

            if (returnValue === undefined || returnValue === null) {
                rootElement[leaf] = allPurposeProxy;
            } else {
                rootElement[leaf] = returnValue;
            }
        });
    `);
}());
