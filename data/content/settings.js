/*jslint browser: true */
/*global window, self */
(function () {

    var $ = window.jQuery,
        defaultBlockingSet = self.options.defaultBlockingSet,
        standardIdsToFeatures = self.options.standardIdsToFeatures,
        standardNames = self.options.standardNames,
        standardIdsInOrder = Object.keys(standardIdsToFeatures)
            .map(function (x) {
                return parseInt(x, 10);
            }),
        disableForm = function () {
            $(":input").prop("disabled", true);
        },
        enableForm = function () {
            $(":input").prop("disabled", false);
        },
        currentSettings,
        createNewDomain,
        deleteDomainRule,
        currentSelectedDomain,
        updateCheckboxesFromRadio,
        updateSettingsFromCheckboxState,
        buildRadioButtons,
        buildCheckboxes;


    currentSelectedDomain = function () {
        var selectedDomainEncoded = $("input[name=domain]:checked").val();
        return selectedDomainEncoded ? window.atob(selectedDomainEncoded) : undefined;
    };


    deleteDomainRule = function (domain) {
        self.port.emit("disable-domain-rule", {
            domain: domain
        });
        window.location = window.location.href;
    };


    updateCheckboxesFromRadio = function () {
        var domainRule = currentSelectedDomain(),
            settingsForDomain = currentSettings[domainRule];

        $("#standard-checks :checkbox").each(function (ignore, element) {
            var checkboxStandardId = parseInt(element.value, 10),
                isStandardBlocked = settingsForDomain.indexOf(checkboxStandardId) !== -1;
            $(element).prop("checked", isStandardBlocked);
        });
    };


    updateSettingsFromCheckboxState = function () {
        var standardsToBlockOnDomain = [],
            domainRule = currentSelectedDomain();

        $("#standard-checks :checkbox").each(function (ignore, element) {
            if (element.checked) {
                standardsToBlockOnDomain.push(parseInt(element.value, 10));
            }
        });

        currentSettings[domainRule] = standardsToBlockOnDomain;

        self.port.emit("update-standard-settings", {
            domain: domainRule,
            settings: standardsToBlockOnDomain
        });
    };


    buildRadioButtons = function () {

        var radioContainer = $("#radio-container");

        radioContainer.empty();

        Object.keys(currentSettings).sort().forEach(function (domainRule) {

            var encodedDomainRule = window.btoa(domainRule),
                deleteLink = "",
                domainRadioTemplate;
                
                if (domainRule !== "default") {
                    deleteLink = '<span class="glyphicon glyphicon-remove" data-domain="' + encodedDomainRule + '" aria-hidden="true"></span>';
                }

                domainRadioTemplate = '<div class="radio">' +
                    '<label>' +
                    '<input type="radio" name="domain" value="' + encodedDomainRule + '">' +
                    domainRule +
                    '</label>' +
                    deleteLink +
                    '</div>';
            radioContainer.append(domainRadioTemplate);
        });

        radioContainer.find(":radio").click(updateCheckboxesFromRadio);
        radioContainer.find("span.glyphicon-remove").click(function (event) {
            var domainRule = window.atob(event.target.dataset.domain);
            deleteDomainRule(domainRule);
        });
    };


    buildCheckboxes = function () {

        var standardCheckboxContainer = $("#standard-checks"),
            standardCheckboxes;

        standardCheckboxContainer.empty();

        standardIdsInOrder.forEach(function (standardId) {

            var featuresInStandard = standardIdsToFeatures[standardId],
                standardCheckboxTemplate;

            if (featuresInStandard === undefined) {
                return;
            }

            standardCheckboxTemplate = '<div class="checkbox">' +
                    '<label>' +
                    '<input type="checkbox" value="' + standardId + '">' +
                    '<strong>' + standardNames[standardId] + '</strong>' +
                    ' (' + featuresInStandard.length + ' features)' +
                    '</label>' +
                    '</div>';
            standardCheckboxContainer.append(standardCheckboxTemplate);
        });

        standardCheckboxContainer.find(":checkbox").change(updateSettingsFromCheckboxState);
        updateCheckboxesFromRadio();
    };


    createNewDomain = function () {
        var newDomainRule = $("#new-domain").val().trim();

        if (newDomainRule === "") {
            window.alert("Please input a valid domain.");
            return;
        }

        disableForm();
        self.port.emit("create-new-domain", {
            domain: newDomainRule
        });
    };
    $("#new-domain-submit").click(createNewDomain);


    $("#reset-button").click(function () {
        var currentDomain = currentSelectedDomain();
        currentSettings[currentDomain] = defaultBlockingSet;
        updateCheckboxesFromRadio();
        updateSettingsFromCheckboxState();
    });

    $("#block-all-button").click(function () {
        var currentDomain = currentSelectedDomain();
        currentSettings[currentDomain] = Object.keys(standardNames);
        updateCheckboxesFromRadio();
        updateSettingsFromCheckboxState();
    });

    $("#allow-all-button").click(function () {
        var currentDomain = currentSelectedDomain();
        currentSettings[currentDomain] = [];
        updateCheckboxesFromRadio();
        updateSettingsFromCheckboxState();
    });


    self.port.on("create-new-domain-done", function () {
        enableForm();
        window.location = window.location.href;
    });


    self.port.on("config-send", function (message) {
        currentSettings = message;
        buildRadioButtons();
        $(":radio:first").click();
        buildCheckboxes();
    });


    // Now kick things off by fetching the current config.
    self.port.emit("config-request");
}());