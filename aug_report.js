// Using bitrix ready function
// From js -> crm -> report -> filterselectors -> init.js
; (function () {
    function documentReadyHandler() {
        if (document.readyState !== "complete") return;

        BX.ready(function () {
            // Id value for new Application and Reporting intake user fields
            var applicationId = "aug-report-select-input-field-application-intake";
            var reportingId = "aug-report-select-input-field-reporting-intake";

            var applicationMonths = {
                "January": "01",
                "February": "02",
                "March": "03",
                "April": "04",
                "May": "05",
                "June": "06",
                "July": "07",
                "August": "08",
                "September": "09",
                "October": "10",
                "November": "11",
                "December": "12"
            };

            var yearValue = {
                "2015": "2015",
                "2016": "2016",
                "2017": "2017",
                "2018": "2018",
                "2019": "2019",
                "2020": "2020",
                "2021": "2021",
                "2022": "2022",
                "2023": "2023",
                "2024": "2024",
                "2025": "2025",
                "2026": "2026",
                "2027": "2027",
                "2028": "2028",
                "2029": "2029"
            };

            var reportingMonths = {
                "January": "01",
                "March": "03",
                "July": "07",
                "September": "09",
                "October": "10"
            };

            function augFromToText(className, counter) {
                var text = "";
                if (counter === 1) {
                    text = "From";
                }
                else if (counter === 2) {
                    text = "To";
                    counter = 0;
                }

                // Add the number so that the function know the correct fields
                className = className + "-" + text;
                var array = [
                    className,
                    counter
                ];
                return array;
            }

            BX.addClass(BX("workarea"), "aug_report");
            BX.addClass(BX("report-rewrite-filter-button"), "aug-button-blue");
            BX.addClass(BX("report-reset-filter-button"), "aug-button-white");


            setTimeout(function () {
                var className = "chfilter-field-datetime";
                var dateTime = document.getElementsByClassName(className);
                var counter = 0;
                var position = "";
                for (var i = 0; i < dateTime.length; i++) {
                    var labelText = dateTime[i].getElementsByTagName("label")[0].innerText;
                    if ((labelText.includes("Application Intake") || labelText.includes("Reporting Intake"))
                        && (labelText.includes("is less than or equal to") || labelText.includes("is more than or equal to"))) {
                        counter += 1;
                        var array = augFromToText(className, counter);
                        className = array[0] + "-" + i;
                        counter = array[1];
                        if (labelText.includes("Application Intake")) {
                            augBuildDualFields_Report(className, applicationMonths, yearValue, applicationId);

                            // Apply to second fields after both fields are rendered
                            if (counter % 2 === 0) {
                                augIntakeRadioButton(dateTime[i - 1], null);
                            }
                        }
                        else if (labelText.includes("Reporting Intake")) {
                            augBuildDualFields_Report(className, reportingMonths, yearValue, reportingId);

                            // Apply to second fields after both fields are rendered
                            if (counter % 2 === 0) {
                                augIntakeRadioButton(dateTime[i - 1], null);
                            }
                        }
                    }
                    else if ((labelText.includes("Application Intake") || labelText.includes("Reporting Intake"))
                        && (labelText.includes("is equal to"))) {
                        className = className + "-In-" + i;
                        if (labelText.includes("Application Intake")) {
                            augBuildOneIntakeField_Report(className, applicationMonths, yearValue, applicationId);
                        }
                        else if (labelText.includes("Reporting Intake")) {
                            augBuildOneIntakeField_Report(className, reportingMonths, yearValue, reportingId);
                        }
                    }
                    // else if(labelText.includes("Date")){
                    //     className = className + "-" + i;
                    //     if(labelText.includes("is less than or equal to")){
                    //         position = "left";
                    //         augBuildCalendarInputFields(className, position);
                    //     }

                    // }
                    className = "chfilter-field-datetime";
                }

                try {
                    /**
                     * Function to modify 2 Application Date filters: "more than and equal" and "less than and equal" into one.
                     * @function augBuildApplicationDateDualField_Report
                     */
                    (function augBuildApplicationDateDualField_Report() {
                        let fromDateField, toDateField;

                        let filterContainer = document.querySelector("#report-filter-chfilter");
                        let sampleDateFilter = document.querySelector(".filter-field.chfilter-field-datetime");

                        // Select 2 Applicaiton Date filters containers.
                        document.querySelectorAll('.chfilter-field-datetime').forEach((element) => {
                            let labelText = element.querySelector('label').innerText;
                            if (!labelText || !labelText.includes("Application Date")) return;
                            if (labelText.includes("more than or equal")) {
                                fromDateField = element;
                            } else if (labelText.includes("less than or equal")) {
                                toDateField = element;
                            }
                        });

                        // Clone inputs from these two filters
                        let toInput = toDateField.querySelector("input");
                        let toA = toDateField.querySelector("a");
                        let fromInput = fromDateField.querySelector("input");
                        let fromA = fromDateField.querySelector("a");

                        // Hide 2 Application Date filter containers.
                        toDateField.style.display = "none";
                        fromDateField.style.display = "none";
                        toDateField.remove();
                        fromDateField.remove();

                        // Adding new Date filter
                        let newDateFilter = sampleDateFilter.cloneNode(true);

                        // Adding new Date Filter before the first filter
                        filterContainer.insertBefore(newDateFilter, filterContainer.querySelectorAll(".filter-field")[0]);
                        newDateFilter.querySelector("label").innerText = "Application Date"

                        // Clear content of new Date Filter
                        newDateFilter.querySelector("input").remove();
                        newDateFilter.querySelector("a").remove();

                        // Adding options radio buttons
                        let optionDiv = newDateFilter.appendChild(BX.create("div", { "attrs": { "class": "aug-application-date-radio-container" }, "style": { "display": "flex" } }));
                        optionDiv.style.justifyContent = "space-evenly";
                        optionDiv.style.marginTop = "12px";

                        let allRadio = augBuildRadioButton(optionDiv, "All", false, 'aug-radio-btn-all-applcation_date', 'application_date');
                        let rangeRadio = augBuildRadioButton(optionDiv, "Range", true, 'aug-radio-btn-range-applcation_date', 'application_date');

                        // Adding From-To div Container
                        let toFromDiv = BX.create("div", { "attrs": { "class": "aug-date-from-to-input" }, "style": { "display": "flex", "justifyContent": "space-between" } });
                        newDateFilter.appendChild(toFromDiv);
                        augBuildDateField(toFromDiv, fromInput, fromA);
                        augBuildDateField(toFromDiv, toInput, toA);

                        // Adding Handler For Radio Buttons
                        allRadio.addEventListener("change", augAllRadioHandler.bind(toFromDiv));
                        rangeRadio.addEventListener("change", augRangeRadioHandler.bind(toFromDiv));

                        /**
                         * Local function to reduce code repetition.
                         * Build Div for date input, keep in mind that this function will move the existing date filter 
                         * created by Bitrix template into a single div.
                         * @function augBuildDateField
                         * @param {Element} container - outer container that the div will be added to.
                         * @param {Boolean} inputElement - the field that we are moving from original filter
                         * @param aElement - the calendar button we are moving from original filter
                         */
                        function augBuildDateField(container, inputElement, aElement) {
                            let newDiv = BX.create("div", { "attrs": { "class": "aug-date-input" }, "style": { "display": "inline-block" } });
                            container.appendChild(newDiv);
                            newDiv.appendChild(BX.create("label", { "attrs": { "class": "aug-date-input-label" }, "text": "To" }));
                            newDiv.appendChild(inputElement);
                            newDiv.appendChild(aElement);
                            inputElement.style.marginLeft = "5px";
                            aElement.addEventListener("click", e => e.preventDefault()); // <== Prevent page refreshes when click on calendar img border
                        }

                        /**
                         * Local handler for all radio button - hide To-From Date Field
                         * @function augAllRadioHandler
                         * @param {Event} e - event passed in by EventListener
                         */
                        function augAllRadioHandler(e) {
                            if (e.target.checked) {
                                BX.addClass(this, "aug_hide");
                                this.querySelectorAll("input").forEach(item => item.value = "");
                            }
                        }

                        /**
                         * Local handler for all radio button - hide To-From Date Field
                         * @function augRangeRadioHandler
                         * @param {Event} e - event passed in by EventListener
                         */
                        function augRangeRadioHandler(e) {
                            if (e.target.checked) {
                                BX.removeClass(this, "aug_hide");
                                this.style.visibility = "visible";
                            }
                        }

                    })();

                    /**
                     * Function to modify Closed filter "is equal to".
                     * @function augBuildClosedField_Report
                     */
                    (function augBuildClosedField_Report() {
                        let closedFilterContainer;

                        // Select container
                        document.querySelectorAll(".filter-field.chfilter-field-boolean").forEach(item => {
                            if (item.querySelector("label").innerHTML !== 'Closed "is equal to"') return;
                            closedFilterContainer = item;
                        });

                        // Clear container
                        let selectElement;
                        closedFilterContainer.querySelectorAll("*").forEach(item => {
                            item.tagName == "LABEL" && (item.innerHTML = "Show Closed Application");
                            item.tagName == "SELECT" && (item.style.display = "none") && (selectElement = item);
                        });

                        // Set container as flex
                        let optionDiv = closedFilterContainer.appendChild(BX.create("div"));
                        optionDiv.style.display = "flex";
                        optionDiv.style.justifyContent = "space-evenly";

                        let radioId = "aug-radio-btn-closed_field-";
                        let radioName = "closed_field";

                        // Adding radio buttons
                        let allRadio = augBuildRadioButton(optionDiv, 'All', true, radioId + "all", radioName);
                        let yesRadio = augBuildRadioButton(optionDiv, 'Yes', false, radioId + "yes", radioName);
                        let noRadio = augBuildRadioButton(optionDiv, 'No', false, radioId + "no", radioName);

                        allRadio.addEventListener("change", allRadioHandler.bind(selectElement));
                        yesRadio.addEventListener("change", yesRadioHandler.bind(selectElement));
                        noRadio.addEventListener("change", noRadioHandler.bind(selectElement));

                        /**
                         * @function allRadioHandler
                         * @param {Event} e - event passed by EventListener
                         */
                        function allRadioHandler(e) {
                            if (e.target.checked == true) {
                                this.value = "";
                            }
                        }

                        /**
                         * @function yesRadioHandler
                         * @param {Event} e - event passed by EventListener
                         */
                        function yesRadioHandler(e) {
                            if (e.target.checked == true) {
                                this.value = "true";
                            }
                        }

                        /**
                         * @function noRadioHandler
                         * @param {Event} e - event passed by EventListener
                         */
                        function noRadioHandler(e) {
                            if (e.target.checked == true) {
                                this.value = "false";
                            }
                        }
                    })();

                    /**
                     * Modify and rebuild the Branch Country and Branch Select Fields
                     * @function augBuildBrancSelectField_Report
                     */
                    (function augBuildBranchSelectField_Report() {

                        var augBranchSelect = {
                            "Australia": ["AUG Adelaide", "AUG Brisbane", "AUG Melbourne", "AUG Perth", "AUG Sydney"],
                            "Malaysia": ["AUG Ipoh", "AUG Johor Bahru", "AUG Kota Bharu", "AUG Kuala Lumpur", "AUG Kuantan", "AUG Kuching", "AUG Melaka", "AUG Nilai", "AUG Penang", "AUG Segamat", "AUG Subang Jaya"],
                            "Indonesia": ["AUG Bandung", "AUG Jakarta", "AUG Surabaya"],
                            "Singapore": ["AUG Singapore"],
                            "China": ["AUG Beijing"],
                            "Hong Kong SAR": ["AUG Hong Kong"],
                            "Philippines": ["AUG Manila"]
                        }

                        let selectBranchCountry, selectBranchOffice;

                        let templateSelectField = document.querySelector("#report-chfilter-examples > div.filter-field.filter-field-crm.chfilter-field-enum");
                        let filterContainer = document.querySelector("#report-chfilter-examples");

                        // Select the Branch Country and Branch Office Select Fields
                        document.querySelectorAll("filter-field.filter-field-crm.chfilter-field-enum").forEach((item) => {
                            item.querySelector("label").innerHTML == 'Lead: Branch Country "is equal to"' && (selectBranchCountry = item);
                            item.querySelector("label").innerHTML == 'Lead: Branch "is equal to"' && (selectBranchOffice = item);
                        });

                        // Hide these two fields
                        selectBranchCountry.style.display = "none";
                        selectBranchOffice.style.display = "none";

                        // Build dropdown
                        let dropdownContainer = BX.create("div", { "attrs": { "class": "dropdown-container" }, "style": { "visibility": "hidden", "position":"absolute" } });
                        for (country in augBranchSelect) {
                            let countryContainer = dropdownContainer.appendChild(BX.create("div"));
                            countryContainer.appendChild(BX.create("span", { "attrs": { "class": "countrySelect" }, "style": { "display": "block" }, "text": country }));
                            for (office of augBranchSelect[country]) {
                                countryContainer.appendChild(BX.create("span", { "attrs": { "class": "officeSelect" }, "style": { "display": "block" }, "text": office }));
                            }
                        }

                        // Add new select field
                        let newSelectFieldContainer = filterContainer.appendChild(templateSelectField.cloneNode(true));
                        let newSelectSpan = newSelectFieldContainer.appendChild(BX.create("span", { "attrs": { "class": "report-filter-vcc" }, "style": { "position": "relative" } }));
                        let textField = newSelectSpan.appendChild("input", { "attrs": { "type": "text" } });
                        newSelectSpan.appendChild(dropdownContainer); //<== Add dropdown menu to new select span

                    })()


                    /**
                     * Local function to reduce code repetition
                     * Build Radio button
                     * @function augBuildRadioButton
                     * @param {Element} container - Outer container the button will be added to
                     * @param {String} text - Label of the radio button
                     * @param {Boolean} checked - Check by default?
                     * @param {String} id - Id of radio button
                     * @param {String} name - name of radio button section
                     * @returns radioButton
                     */
                    function augBuildRadioButton(container, text, checked, id, name) {
                        let radioDiv = container.appendChild(BX.create("div"));
                        let radioButton = radioDiv.appendChild(BX.create("input", { "attrs": { "type": "radio", "id": id, "name": name, "class": "aug-report-intake-options" } }));
                        if (checked) {
                            radioButton.checked = true;
                        }
                        radioDiv.appendChild(BX.create("label", { "attrs": { "for": id }, "text": text }));

                        return radioButton;
                    }

                } catch (e) {
                    console.log(e);
                    return;
                }

                try {
                    // Change all the calendar icon
                    var calendarElement = document.getElementsByClassName("filter-date-interval-calendar");
                    for (var i = 0; i < calendarElement.length; i++) {
                        calendarElement[i].getElementsByTagName("img")[0].setAttribute("src", "/bitrix/js/ui/forms/images/calendar.svg");
                    }
                } catch (error) {
                    return;
                }
            }, 0);






            // // Check whether there is a div with id "workarea"
            // var form = BX("workarea");
            // if(!form)
            // {
            //     console.log("Not found!");
            //     return;
            // }
            // form.appendChild(
            //     BX.create('DIV',
            //         {
            //             props: {
            //                 className: 'test-mok1'
            //             },
            //             style: {
            //                 backgroundColor: "black",
            //                 width: "auto",
            //                 height: "100px"
            //             },
            //             text: "Test by Mok1",
            //         }
            //     )
            // );

            // // insertAfter works the next container after the id defined
            // // BX only support id (#test) not class (.test) = BX("id") not BX("className")
            // // Alternative solution: 
            // //      1. use document.getElementsByClassName for class name
            // //      2. use BX("id") for id
            // // https://dev.1c-bitrix.ru/support/forum/forum6/topic74790/
            // BX.insertAfter(BX.create("div", {
            //     props: {className: "test-mok2"},
            //     text: "Test by Mok2",
            //     style: {
            //         backgroundColor: "black",
            //         width: "auto",
            //         height: "100px"
            //     }
            // }), document.getElementsByClassName("pagetitle-wrap")[0]);
        })
    };

    document.addEventListener("readystatechange", documentReadyHandler);

    // Remove this in production
    window.documentReadyHandler = documentReadyHandler();
})();
