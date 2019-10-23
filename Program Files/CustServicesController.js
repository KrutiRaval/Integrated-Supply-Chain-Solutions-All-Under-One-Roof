app.controller("CustServicesController", ['$scope', '$http', '$location', 'ngEncryption', 'DataService', '$filter', '$rootScope', '$linq',
function ($scope, $http, $location, ngEncryption, DataService, $filter, $rootScope, $linq) {

    $scope.openModuleChange = function () {
        $location.path('/Customer')
    }
    onLoad();
    function onLoad() {
        $scope.ErrorMsg = "";
        $scope.CustService = {};
        $scope.CustServiceList = [];
        $scope.CustService.CustServiceId = 0;
        BindComboValues();
        $scope.getModeFlag = true;
        $scope.addModeFlag = false;
        $scope.editModeFlag = false;
        $scope.ValStartTime = false;
        $("#ImgSave").addClass('disabled');
        $("#ImgDelete").addClass('disabled');
        angular.element('#success').hide();
    }
    function BindComboValues() {

        var requestCombo = $http({
            method: "GET",
            url: "/api/Customer/GetCustServiceComboList"
        }).then(function successResult(successData) {
            if (successData.status != "202") {
                var obj = JSON.parse(successData.data);
                $scope.ServiceTypeList = obj;
                $scope.CustService.CustCode = DataService.GetServiceData();
            }
            else {
                $scope.ErrorMsg = successData.data;
            }
        }, function errorResult() {
        });
    }
    $scope.NewId = "gridCustService";
    $scope.CustService.CustCode = DataService.GetServiceData();
    BindService();
    function BindService() {
        $scope.Height = "230";
        $scope.IsPagerVisible = false;
        $scope.sorting = true;
        $scope.VirtualMode = false;
        $scope.CustServiceList.PageSize = "10";
        $scope.ColumnList = [
        {
            dataField: "ServiceId", caption: "Service Code", width: 100, cellTemplate: function myfunction(container, options) {
                $('<a/>').addClass('dx-link')
                .text(options.data.ServiceId)
                .on('dxclick', function () {
                    $scope.EditCustomerServiceDetails(options.data.CustServiceId);
                })
       .appendTo(container);
            }
        },
        {
            dataField: "ServiceName", width: 200, allowSorting: true, caption: "Service"
        },
        {
            dataField: "Note", allowSorting: true, caption: "Note", cssClass: "wraplabelDXGrid wrapclass",
        },
        {
            dataField: "Restricated", width: 150, allowSorting: true, caption: "Restricted",
        }
        ];
        $scope.SummaryInfo = [
         {
             showInColumn: "Restricated",
             summaryType: "count",
             displayFormat: "Total Count : {0}",
             alignByColumn: true,
             showInGroupFooter: true
         }];
        var ReqObj = {
            "CustCode": DataService.GetServiceData(),
            "CustServiceId": $scope.CustService.CustServiceId
        };
        var data = ngEncryption.encrypt(JSON.stringify(ReqObj));
        var requestcombo = $http({
            method: "POST",
            url: "api/Customer/GetCustServiceList",
            data: { "RequestText": data }
        }).then(function successresult(successdata) {
            if (successdata.status != "202") {
                if (!isEmpty(successdata.data)) {
                    var obj = JSON.parse(successdata.data);
                    if ($scope.CustService.CustServiceId == 0) {
                        $scope.CustServiceList = $linq.Enumerable().From(obj)
                                             .Select(function (x) {
                                                 if (x.Restricated != "Y")
                                                     x.Restricated = "N";
                                                 return x;
                                             }).ToArray();
                        $scope.$broadcast('DataSourceUpdate', $scope.CustServiceList);
                        $scope.AddCustomerServiceDetails();
                    }
                    else {
                        $scope.CustService = angular.copy(obj[0]);
                        $scope.CustService.Mode = "Edit";
                        $scope.CustService.AfHrStartTime = !isEmpty($scope.CustService.AfHrStartTime) ? $filter('date')($scope.CustService.AfHrStartTime, "HH:mm") : null;
                        $scope.CustService.AfHrEndTime = !isEmpty($scope.CustService.AfHrEndTime) ? $filter('date')($scope.CustService.AfHrEndTime, "HH:mm") : null;
                        $scope.CustService.ServiceId = !isEmpty($scope.CustService.ServiceId) ? $scope.CustService.ServiceId.toString() : null;
                    }
                }
            }
            else {
                $scope.ErrorMsg = successdata.data;
            }
        }, function myfunction() {
        });
    }
    function isEmpty(val) {
        return (val === undefined || val == null || val.length <= 0 || val == "") ? true : false;
    }
    $scope.HideValidationDiv = function () {
        angular.element('#idReqValidation').hide();
        angular.element('#errorid').hide();
        angular.element('#formerrorid').hide();
        angular.element('#starttimeerrorid').hide();
        angular.element('#dupserverrorid').hide();
    }
    $scope.AddCustomerServiceDetails = function () {
        $scope.ErrorMsg = "";
        $scope.HideValidationDiv();
        $scope.CustService = {};
        $scope.CustService.Mode = "Add";
        $scope.getModeFlag = false;
        $scope.addModeFlag = true;
        $scope.editModeFlag = false;
        $("#ImgSave").removeClass('disabled');
        $("#ImgDelete").addClass('disabled');
        angular.element('#success').hide();
    }
    $scope.EditCustomerServiceDetails = function (CustServiceId) {
        $scope.ErrorMsg = "";
        $scope.getModeFlag = false;
        $scope.addModeFlag = false;
        $scope.editModeFlag = true;
        $("#ImgSave").removeClass('disabled');
        $("#ImgDelete").removeClass('disabled');
        angular.element('#success').hide();

        $scope.CustService.CustServiceId = CustServiceId;
        BindService();
        $scope.CustService.Mode = "Edit";
    }
    //$scope.DeleteCustomerServiceDetails = function (CustServiceId) {
    //    $scope.ErrorMsg = "";
    //    angular.element('#success').hide();
    //    $scope.HideValidationDiv();
    //        $confirm({ text: 'Are you sure you want to Delete this record? ', title: 'Delete', ok : 'Yes', cancel: 'No'
    //                        })
    //                         .then(function (yes) {
    //                             $scope.CustService.CustServiceId = CustServiceId;
    //                             $scope.CustService.Mode = "Delete";
    //                             $scope.SaveCustomerServiceDetails();
    //                         }, function (no) {
    //                             return;
    //                         });
    //   }
    $scope.SaveCustomerServiceDetails = function (ServiceIdA, StartTime, EndTime) {
        $scope.ErrorMsg = "";
        $scope.CustService.CustCode = DataService.GetServiceData();
        if (!isEmpty(EndTime) && isEmpty(StartTime)) {
            $scope.ValStartTime = true;
            if ($scope.ErrorMsg != '') {
                $scope.ErrorMsg = $scope.ErrorMsg + '\n' + " After Hr StartTime is Required.";
                angular.element("#errorid").show();
            }
            else {
                $scope.ErrorMsg = "After Hr StartTime is Required.";
                angular.element("#errorid").show();
            }
            angular.element('#idReqValidation').show();
            angular.element("#errorid").show();
        }
        if ($scope.CustService.Restricated != "Y") {
            $scope.CustService.Restricated = "N";
        }
        if (!isEmpty(StartTime) && !isEmpty(EndTime)) {
            var stime = StartTime + ':00';
            var etime = EndTime + ':00';
            if (stime > etime) {
                if ($scope.ErrorMsg != '') {
                    $scope.ErrorMsg = $scope.ErrorMsg + '\n' + " After Hr StartTime Cannot be Greater than After Hr EndTime. ";
                    angular.element("#errorid").show();
                }
                else {
                    $scope.ErrorMsg = " After Hr StartTime Cannot be Greater than After Hr EndTime. ";
                    angular.element("#errorid").show();
                }
                angular.element('#idReqValidation').show();
                angular.element("#errorid").show();
            }
        }

        if ($scope.CustServiceForm.$valid) {
            if (isEmpty($scope.CustService.CustServiceId)) {
                $scope.CustService.Mode = "Add";
            }
            if (isEmpty($scope.CustService.ServiceId)) {
                angular.element('#formerrorid').show();
            }
            if ($scope.ErrorMsg != "")
                return;
            var data = ngEncryption.encrypt(JSON.stringify($scope.CustService));
            var requestCombo = $http({
                method: "POST",
                url: "api/Customer/TransCustomerServices",
                params: { "RequestText": data }
            }).then(function successResult(successData) {
                if (successData.status != "202" && !isEmpty(successData.data)) {
                    if ($scope.CustService.Mode == "Add" || $scope.CustService.Mode == "Edit") {
                        $scope.addClass = 'success';
                        $scope.SuccessMsg = "Record Saved Successfully!";
                        angular.element('#success').show();
                    }
                    $("#ImgSave").removeClass('disabled');
                    $("#ImgDelete").addClass('disabled');

                    var obj = JSON.parse(successData.data);
                    $scope.CustServiceList = obj;
                    $scope.$broadcast('DataSourceUpdate', $scope.CustServiceList);
                    $scope.CustService = angular.copy(obj[0]);
                    $scope.CustService.Mode = "Edit";
                    $scope.ErrorMsg = "";
                    $scope.getModeFlag = false;
                    $scope.addModeFlag = false;
                    $scope.editModeFlag = true;
                    $scope.CustService.AfHrStartTime = !isEmpty($scope.CustService.AfHrStartTime) ? $filter('date')($scope.CustService.AfHrStartTime, "HH:mm") : null;
                    $scope.CustService.AfHrEndTime = !isEmpty($scope.CustService.AfHrEndTime) ? $filter('date')($scope.CustService.AfHrEndTime, "HH:mm") : null;
                    $scope.CustService.ServiceId = !isEmpty($scope.CustService.ServiceId) ? $scope.CustService.ServiceId.toString() : null;
                }
                else {
                    $scope.ErrorMsg = successData.data;
                    angular.element('#idReqValidation').show();
                    angular.element('#errorid').show();
                }
            }, function myfunction() {
            });
        }
        else {
            angular.element('#idReqValidation').show();
            angular.element('#errorid').show();
            angular.element('#formerrorid').show();
            angular.element('#starttimeerrorid').show();
        }
    }
    $scope.resizeModuleSub = function () {
        $rootScope.$broadcast('resizeModuleSubChild');
    }
    window.onresize = $scope.resizeModuleSub;
    window.onload = $scope.resizeModuleSub;
}]);
