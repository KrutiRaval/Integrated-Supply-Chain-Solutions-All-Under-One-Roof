
app.factory("DataService", function myfunction() {
    var data = {};

    return {
        SetServiceData: SetServiceData,
        GetServiceData: GetServiceData,
        ResetServiceData: ResetServiceData

    };

    function SetServiceData(objDtl) {
        data = objDtl;
    }

    function GetServiceData() {
        return data;
    }

    function ResetServiceData() {
        data = {};
        return data;
    }


});

app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                // this next if is necessary for when using ng-required on your input. 
                // In such cases, when a letter is typed first, this parser will be called
                // again, and the 2nd time, the value will be undefined
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9-]/g, '');
                if (transformedInput != inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
});

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

app.directive('capitalize', ['$window', function ($window) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            var capitalize = function (inputValue) {
                var GetCurserPosition = element[0].selectionStart;
                if (inputValue == undefined) inputValue = '';
                var capitalized = inputValue.toUpperCase();
                if (capitalized !== inputValue) {
                    modelCtrl.$setViewValue(capitalized);
                    modelCtrl.$render();
                }

                if (inputValue != undefined && inputValue != '') {
                    setSelectionRange(element[0], GetCurserPosition, GetCurserPosition);
                }

                return capitalized;
            }
            modelCtrl.$parsers.push(capitalize);
            capitalize(scope[attrs.ngModel]); // capitalize initial value    

            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
}]);





