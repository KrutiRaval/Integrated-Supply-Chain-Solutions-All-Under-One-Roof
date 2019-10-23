app.controller("AirportAlternateAirportsController", ['$scope', '$http', '$location', 'ngEncryption', '$rootScope', '$route', '$linq', '$filter', 'DataService', '$confirm', '$timeout',
function ($scope, $http, $location, ngEncryption, $rootScope, $route, $linq, $filter, DataService, $confirm, $timeout) {
    $scope.openModuleChange = function () {
        $location.path('/Airport')
    }
    $scope.resizeModuleSub = function () {
        $rootScope.$broadcast('resizeModuleSubChild');
    }
    window.onresize = $scope.resizeModuleSub;
    $scope.HideValidationDiv = function () {
        angular.element('#idReqValidation').hide();
        angular.element('#errorid').hide();
        angular.element('#formerrorid').hide();
    }
    function isEmpty(val) {
        return (val === undefined || val == null || val.length <= 0 || val == "") ? true : false;
    }
    onLoad();
    function onLoad() {
        $scope.AlternateAirportDtls = {};
        $scope.AlternateAirportList = [];
        $scope.AlternateAirportDtls.AirportAltId = 0;
        $("#txtalternateairport").focus();
        $scope.NotActiveFlag = false;
        $scope.IsOnEditDetail = false;
        $scope.GetRecordStatus = "Active";
        $scope.AirportId = DataService.GetServiceData();
        angular.element('#success').hide();
        BindAlternateAirportDtls();
    }
    $scope.rdBtnChange = function (value) {
        if (value == 'Deleted' || value == 'All') {
            $scope.NotActiveFlag = true;
        }
        else {
            $scope.NotActiveFlag = false;
        }
        $scope.GetRecordStatus = value;
        $scope.AlternateAirportDtls = {};
        $scope.HideValidationDiv();
        $scope.SuccessMsg = '';
        angular.element('#success').hide();
        $scope.AlternateAirportList = [];
        $scope.AlternateAirportDtls.AirportAltId = 0;
        $("#txtalternateairport").focus();
        BindAlternateAirportDtls();
    }
    $scope.NewId = "IdAlternateAirportGD";
    function BindAlternateAirportDtls() {
        $scope.IsPagerVisible = false;
        $scope.Height = "200";
        $scope.sorting = true;
        $scope.VirtualMode = false;
        $scope.AlternateAirportList.PageSize = "10";
        $scope.ColumnList = [
        {
            dataField: "AltAirportId", allowSorting: true, caption: "Alternate Airport", cellTemplate: function myfunction(container, options) {
                $('<a/>').addClass('dx-link')
                .text(options.data.AltAirportId)
                .on('dxclick', function () {
                    $scope.EditAlternateAirportDtls(options.data.AirportAltId);
                })
       .appendTo(container);
            }
        },
        {
            dataField: "Selected", allowSorting: true, caption: "Selected"
        },
        ];
        $scope.SummaryInfo = [{
            showInColumn: "Selected",
            summaryType: "count",
            displayFormat: "Total Count(s): {0}",
            alignByColumn: true,
            showInGroupFooter: true
        }];
        var ReqObj = {
            "AirportId": $scope.AirportId,
            "AirportAltId": $scope.AlternateAirportDtls.AirportAltId,
            "GetRecordStatus": $scope.GetRecordStatus
        };
        var data = ngEncryption.encrypt(JSON.stringify(ReqObj));
        var requestcombo = $http({
            method: "GET",
            url: "api/Airport/GetAlternateAirportList",
            params: {
                RequestText: data
            }
        }).then(function successresult(successdata) {
            if (successdata.status != "202") {
                if (!isEmpty(successdata.data) && successdata.data.length > 0) {
                    var obj = JSON.parse(successdata.data);
                    if ($scope.AlternateAirportDtls.AirportAltId == 0) {
                        $scope.AlternateAirportList = $linq.Enumerable().From(obj)
                                           .Select(function (x) {
                                               if (x.Selected != "Y")
                                                   x.Selected = "N";
                                               return x;
                                           }).ToArray();
                        $scope.resizeModuleSub();
                        $scope.$broadcast('DataSourceUpdate', $scope.AlternateAirportList);
                        OnAdd();
                    }
                    else {
                        $scope.AlternateAirportDtls = angular.copy(obj[0]);
                        $scope.AlternateAirportDtls.Mode = "Edit";
                        $("#chkbSelect").focus();
                    }                   
                }
                else {
                    $scope.$broadcast('DataSourceUpdate', []);
                    OnAdd();
                }
                ControlEnableDisableBasedonStatus($scope.AlternateAirportDtls.Mode);
            }
            else {
                $scope.ErrorMsg = successdata.data;
            }
        }, function myfunction() {
        });
    }
    function ControlEnableDisableBasedonStatus(Mode) {
        if ($scope.GetRecordStatus != "Active") {
            $("#ImgAdd").addClass('disabled');
            $("#ImgSave").addClass('disabled');
            $("#ImgDelete").addClass('disabled');
            $scope.IsOnEditDetail = true;
        }
        else if ($scope.GetRecordStatus == "Active" && Mode == "Edit") {
            $("#ImgAdd").removeClass('disabled');
            $("#ImgSave").removeClass('disabled');
            $("#ImgDelete").removeClass('disabled');
            $scope.IsOnEditDetail = true;
            $timeout(function myfunction() {
                $("#txtalternateairport").focus();
            }, 0);
        }
        else if ($scope.GetRecordStatus == "Active" && Mode == "Add") {
            $("#ImgAdd").removeClass('disabled');
            $("#ImgSave").removeClass('disabled');
            $("#ImgDelete").addClass('disabled');
            $scope.IsOnEditDetail = false;
            $timeout(function myfunction() {
                $("#txtalternateairport").focus();
            }, 0);
        }
        else {
            $("#ImgAdd").removeClass('disabled');
            $("#ImgSave").removeClass('disabled');
            $("#ImgDelete").addClass('disabled');
            $scope.IsOnEditDetail = false;
            $timeout(function myfunction() {
                $("#txtalternateairport").focus();
            }, 0);
        }
    }
    $scope.AddAlternateAirportDtls = function () {
        $scope.ErrorMsg = "";
        $scope.HideValidationDiv();
        angular.element('#success').hide();
        OnAdd();
    }
    function OnAdd() {
        $scope.AlternateAirportDtls = {};
        $scope.AlternateAirportDtls.Mode = "Add";
        $timeout(function myfunction() {
            $("#txtalternateairport").focus();
        }, 0);
        $scope.IsOnEditDetail = false;
        $("#ImgSave").removeClass('disabled');
        $("#ImgDelete").addClass('disabled');
        $scope.FinalObjAirportId = [];
    }
    //For Airport Auto-suggestion
    $scope.FinalObjAirportId = [];
    $scope.SearchAirportAutoSuggest = function (value) {
        if (value != undefined && value != '' && value != null) {
            var FinalObj = [];
            var CheckDataIsExist = $linq.Enumerable().From($scope.FinalObjAirportId)
                                         .Where(function (x) {
                                             return (strStartsWith(x.Name, value));
                                         })
                                         .Select(function (x) {
                                             return x;
                                         }).ToArray();
            if (CheckDataIsExist.length == 0) {

                var objAirportId = {
                    "AirportId": value
                };
                var data = ngEncryption.encrypt(JSON.stringify(objAirportId));
                return $http({
                    method: "POST",
                    url: "/api/AddItinerary/AirportSearch",
                    params: {
                        AirportSearch: data
                    }
                }).then(function (response) {
                    FinalObj = JSON.parse(response.data);
                    if ($("#txtalternateairport").keydown(function () {
                    }));
                    else {
                    }
                    $scope.FinalObjAirportId = FinalObj;

                    return FinalObj;
                });
            }
            else {

                FinalObj = CheckDataIsExist;
                return FinalObj;
            }
        }
    }

    function strStartsWith(str, prefix) {
        if (((str + "").toLowerCase().indexOf(prefix.toLowerCase()) === 0) == true) {
            return str;
        };
    }

    $scope.onSelectAirport = function myfunction($item) {
        if ($item.AirportId != 'No matches found') {
            $scope.AlternateAirportDtls.AltAirportId = $item.AirportId;            
        }
    };
    $scope.CheckAirportId = function () {      
        if (isEmpty($scope.FinalObjAirportId) || (!isEmpty($scope.AlternateAirportDtls) && (!isEmpty($scope.AlternateAirportDtls.AltAirportId) && $scope.AlternateAirportDtls.AltAirportId.length <= 4))) {
            if (!isEmpty($scope.FinalObjAirportId)) {
                var CheckDataIsExist = $linq.Enumerable().From($scope.FinalObjAirportId)
                                    .Where(function (x) {
                                        return (x.AirportId == $scope.AlternateAirportDtls.AltAirportId);
                                    })
                                    .Select(function (x) {
                                        return x;
                                    }).ToArray();
                if (CheckDataIsExist.length == 0) {
                    $scope.AlternateAirportDtls.AltAirportId = undefined;
                }
                else
                {
                    $scope.FinalObjAirportId = [];
                }
            }
            else {
                $scope.AlternateAirportDtls.AltAirportId = undefined;
            }

        }
    }
    $scope.EditAlternateAirportDtls = function (AirportAltId) {
        $scope.ErrorMsg = "";
        $scope.HideValidationDiv();
        angular.element('#success').hide();
        $("#txtalternateairport").focus();
        $scope.IsOnEditDetail = true;
        $("#ImgSave").removeClass('disabled');
        $("#ImgDelete").removeClass('disabled');
        $scope.AlternateAirportDtls.AirportAltId = AirportAltId;
        $scope.AlternateAirportDtls.Mode = "Edit";
        BindAlternateAirportDtls();
    }
    $scope.DeleteAlternateAirportDtls = function () {
        $scope.ErrorMsg = "";
        angular.element('#success').hide();
        $scope.HideValidationDiv();
        $confirm({ text: 'Are you sure you want to Delete this record?', title: 'Delete', ok: 'Yes', cancel: 'No' })
                               .then(function (yes) {
                                   $scope.AlternateAirportDtls.Mode = "Delete";
                                   $scope.SaveAlternateAirportDtls();
                               }, function (no) {
                                   return;
                               });
    }
    $scope.SaveAlternateAirportDtls = function () {
        $scope.ErrorMsg = "";
        $scope.HideValidationDiv();
        angular.element('#success').hide();
        if (isEmpty($scope.AlternateAirportDtls.AltAirportId)) {
            angular.element('#formerrorid').show();
        }
        if ($scope.AirportAlternateAirportsForm.$valid || $scope.AlternateAirportDtls.Mode == "Delete") {
            if (isEmpty($scope.AlternateAirportDtls.AltAirportId)) {
                $scope.AlternateAirportDtls.Mode = "Add";
            }
            if ($scope.ErrorMsg != "")
                return;
            var ReqObj =
                {
                    "AirportAltId": $scope.AlternateAirportDtls.AirportAltId,
                    "AirportId": DataService.GetServiceData(),
                    "AltAirportId": $scope.AlternateAirportDtls.AltAirportId,
                    "Selected": !isEmpty($scope.AlternateAirportDtls.Selected) ? $scope.AlternateAirportDtls.Selected : 'N',
                    "Mode": $scope.AlternateAirportDtls.Mode,
                    "ModifiedOn": $scope.AlternateAirportDtls.ModifiedOn
                };
            var data = ngEncryption.encrypt(JSON.stringify(ReqObj));
            var requestCombo = $http({
                method: "POST",
                url: "api/Airport/TransAlternateAirport",
                params: { "RequestText": data }
            }).then(function successResult(successData) {
                if (successData.status != "202") {
                    if (!isEmpty(successData.data) && successData.data.length > 0) {
                        var obj = JSON.parse(successData.data);
                        $scope.IsOnEditDetail = false;
                        if ($scope.AlternateAirportDtls.Mode == "Add" || $scope.AlternateAirportDtls.Mode == "Edit") {
                            $scope.addClass = 'success';
                            $scope.SuccessMsg = "Record Saved Successfully.";
                            angular.element('#success').show();
                        }
                        else {
                            $scope.addClass = 'deletedmsg';
                            $scope.SuccessMsg = "Record deleted successfully.";
                            angular.element('#success').show();
                        }
                        $scope.AlternateAirportList = $linq.Enumerable().From(obj)
                                           .Select(function (x) {
                                               if (x.Selected != "Y")
                                                   x.Selected = "N";
                                               return x;
                                           }).ToArray();
                        $scope.resizeModuleSub();
                        $scope.$broadcast('DataSourceUpdate', $scope.AlternateAirportList);
                        $timeout(function () {
                            $scope.AlternateAirportDtls = angular.copy($scope.AlternateAirportList[0]);
                            if (!isEmpty($scope.AlternateAirportList[0])) {
                                $scope.IsOnEditDetail = true;
                                $scope.AlternateAirportDtls.Mode = "Edit";
                                if ($scope.AlternateAirportDtls.Selected != "Y")
                                    $scope.AlternateAirportDtls.Selected = "N";                               
                                $("#chkbSelect").focus();
                                $("#ImgSave").removeClass('disabled');
                                $("#ImgDelete").removeClass('disabled');
                            }
                            else {
                                OnAdd();
                            }
                        }, 0);
                    }
                    else {
                        if ($scope.AlternateAirportDtls.Mode == "Delete") {
                            $scope.addClass = 'deletedmsg';
                            $scope.SuccessMsg = "Record deleted successfully.";
                            angular.element('#success').show();
                            $("#ImgDelete").addClass('disabled');
                        }
                        $scope.AlternateAirportList = [];
                        $scope.resizeModuleSub();
                        $scope.$broadcast('DataSourceUpdate', $scope.AlternateAirportList);
                        OnAdd();
                    }
                    ControlEnableDisableBasedonStatus($scope.AlternateAirportDtls.Mode);
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
        }
    }
}]);