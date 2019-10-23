app.controller("CustSpecialInstructionController", ['$scope', '$http', '$location', 'ngEncryption', 'DataService', '$filter', '$rootScope', '$linq', '$confirm',
    function ($scope, $http, $location, ngEncryption, DataService, $filter, $rootScope, $linq, $confirm) {
        $scope.openModuleChange = function () {
            $location.path('/Customer')
        }
        $scope.resizeModuleSub = function () {
            $rootScope.$broadcast('resizeModuleSubChild');
        }
        window.onresize = $scope.resizeModuleSub;
        window.onload = $scope.resizeModuleSub;
        function isEmpty(val) {
            return (val === undefined || val == null || val.length <= 0 || val == "") ? true : false;
        }
        onLoad();
        function onLoad() {
            $scope.CustSpecialInstr = {};
            $scope.SpecialInstrTypeList = [];
            $scope.CustSpecialInstr.InstructionTypeId = 0;
            BindComboValues();
            $scope.IsOnGetDetail = true;
            $scope.IsOnAddDetail = false;
            $scope.IsOnEditDetail = false;
            $scope.GetRecordStatus = "Active";
            $("#ImgSave").addClass('disabled');
            $("#ImgDelete").addClass('disabled');
        }
        function BindComboValues() {
            var objcombo =
            {
                "CategoryName": 'SpecialInstrType'
            };
            var data = ngEncryption.encrypt(JSON.stringify(objcombo));
            var requestCombo = $http({
                method: "GET",
                url: "api/General/GetFillComboList",
                params: {
                    CategoryName: data
                }
            }).then(function successResult(successData) {
                if (successData.status != "202") {
                    var obj = JSON.parse(successData.data);
                    $scope.CSpecialInstrTypeList = obj.SpecialInstrType;
                    $scope.CustSpecialInstr.CustCode = DataService.GetServiceData();
                }
                else {
                    $scope.ErrorMsg = successData.data;
                }
            }, function errorResult() {
            });
        }
        $scope.rdBtnChange = function (value) {
            $scope.GetRecordStatus = value;
            $scope.CustSpecialInstr = {};
            $scope.SuccessMsg = '';
            angular.element('#success').hide();
            $scope.SpecialInstrTypeList = [];
            $scope.CustSpecialInstr.InstructionTypeId = 0;
            BindCustSpecialInstr();
        }
        $scope.NewId = "gridCustSpecialInstr";
        $scope.CustSpecialInstr.CustCode = DataService.GetServiceData();
        BindCustSpecialInstr();
        function BindCustSpecialInstr() {
            $scope.Height = "200";
            $scope.IsPagerVisible = false;
            $scope.sorting = true;
            $scope.VirtualMode = false;
            $scope.SpecialInstrTypeList.PageSize = "10";
            $scope.ColumnList = [
            {
                dataField: "InstructionType", caption: "Instruction Type", cellTemplate: function myfunction(container, options) {
                    $('<a/>').addClass('dx-link')
                    .text(options.data.InstructionType)
                    .on('dxclick', function () {
                        $scope.EditCustSpecialInstr(options.data.InstructionTypeId);
                    })
           .appendTo(container);
                }
            },
            {
                dataField: "Description", allowSorting: true, caption: "Description", cssClass: "wraplabelDXGrid",
            },
            {
                dataField: "ValidFrom", allowSorting: true, caption: "Valid From", width: 100,
            },
            {
                dataField: "ValidTo", allowSorting: true, caption: "Valid To", width: 100,
            },
            {
                dataField: "Acknowledge", allowSorting: true, caption: "Acknowledge", width: 120,
            }
            ];
            $scope.SummaryInfo = [
             {
                 showInColumn: "Acknowledge",
                 summaryType: "count",
                 displayFormat: "Total Count: {0}",
                 alignByColumn: true,
                 showInGroupFooter: true
             }];
            var ReqObj = {
                "CustCode": DataService.GetServiceData(),
                "GetRecordStatus": $scope.GetRecordStatus,
                "InstructionTypeId": $scope.CustSpecialInstr.InstructionTypeId
            };
            var data = ngEncryption.encrypt(JSON.stringify(ReqObj));
            var requestcombo = $http({
                method: "POST",
                url: "api/Customer/GetCustSpecInsDetails",
                data: { "RequestText": data }
            }).then(function successresult(successdata) {
                if (successdata.status != "202") {
                    if (!isEmpty(successdata.data) && successdata.data.length > 0) {
                        var obj = JSON.parse(successdata.data);
                        if ($scope.CustSpecialInstr.InstructionTypeId == 0) {
                            //$scope.SpecialInstrTypeList = obj.CustSpecInstrList;
                            $scope.SpecialInstrTypeList = $linq.Enumerable().From(obj.CustSpecInstrList)
                                               .Select(function (x) {
                                                   if (x.Acknowledge != "Y")
                                                       x.Acknowledge = "N";
                                                   x.ValidFrom = !isEmpty(x.ValidFrom) ? $filter('date')(x.ValidFrom, "MM/dd/yyyy") : null;
                                                   x.ValidTo = !isEmpty(x.ValidTo) ? $filter('date')(x.ValidTo, "MM/dd/yyyy") : null;
                                                   return x;
                                               }).ToArray();
                            $scope.$broadcast('DataSourceUpdate', $scope.SpecialInstrTypeList);
                            $scope.AddCustSpecialInstr();
                        }
                        else {
                            $scope.CustSpecialInstr = angular.copy(obj.CustSpecInstrList[0]);
                            $scope.CustSpecialInstr.Mode = "Edit";
                            $scope.CustSpecialInstr.ValidFrom = !isEmpty($scope.CustSpecialInstr.ValidFrom) ? $filter('date')($scope.CustSpecialInstr.ValidFrom, "MM/dd/yyyy") : null;
                            $scope.CustSpecialInstr.ValidTo = !isEmpty($scope.CustSpecialInstr.ValidTo) ? $filter('date')($scope.CustSpecialInstr.ValidTo, "MM/dd/yyyy") : null;
                            $scope.CustSpecialInstr.InstructionTypeId = !isEmpty($scope.CustSpecialInstr.InstructionTypeId) ? $scope.CustSpecialInstr.InstructionTypeId.toString() : "";
                        }
                        if ($scope.GetRecordStatus != "Active") {
                            $("#ImgAdd").addClass('disabled');
                            $("#ImgSave").addClass('disabled');
                            $("#ImgDelete").addClass('disabled');
                            $scope.IsOnGetDetail = true;
                            $scope.IsOnAddDetail = false;
                            $scope.IsOnEditDetail = false;
                        }
                        else if ($scope.GetRecordStatus == "Active" && $scope.CustSpecialInstr.Mode == "Edit") {
                            $("#ImgAdd").removeClass('disabled');
                            $("#ImgSave").removeClass('disabled');
                            $("#ImgDelete").removeClass('disabled');
                        }
                        else if ($scope.GetRecordStatus == "Active" && $scope.CustSpecialInstr.Mode == "Add") {
                            $("#ImgAdd").removeClass('disabled');
                            $("#ImgSave").removeClass('disabled');
                        }
                        else {
                            $("#ImgAdd").removeClass('disabled');
                            $("#ImgSave").addClass('disabled');
                            $("#ImgDelete").addClass('disabled');
                        }
                    }
                }
                else {
                    $scope.ErrorMsg = successdata.data;
                }
                $scope.resizeModuleSub();
            }, function myfunction() {
            });
        }
        $scope.HideValidationDiv = function () {
            angular.element('#idReqValidation').hide();
            angular.element('#errorid').hide();
            angular.element('#formerrorid').hide();
        }
        $scope.AddCustSpecialInstr = function () {
            $scope.ErrorMsg = "";
            $scope.HideValidationDiv();
            $scope.CustSpecialInstr = {};
            $scope.CustSpecialInstr.Mode = "Add";
            $scope.CustSpecialInstr.Acknowledge = "N";
            $scope.CustSpecialInstr.ValidFrom = $filter('date')(new Date(), 'MM/DD/YYYY');
            $scope.IsOnGetDetail = false;
            $scope.IsOnAddDetail = true;
            $scope.IsOnEditDetail = false;
            $("#ImgSave").removeClass('disabled');
            $("#ImgDelete").addClass('disabled');
            angular.element('#success').hide();
        }
        $scope.EditCustSpecialInstr = function (InstructionTypeId) {
            $scope.ErrorMsg = "";
            $scope.IsOnGetDetail = false;
            $scope.IsOnAddDetail = false;
            $scope.IsOnEditDetail = true;
            $("#ImgSave").removeClass('disabled');
            $("#ImgDelete").removeClass('disabled');
            $scope.HideValidationDiv();
            angular.element('#success').hide();
            $scope.CustSpecialInstr.InstructionTypeId = InstructionTypeId;
            BindCustSpecialInstr();
            $scope.CustSpecialInstr.Mode = "Edit";
        }
        $scope.DeleteCustSpecialInstr = function (InstructionTypeId) {
            $scope.ErrorMsg = "";
            angular.element('#success').hide();
            $scope.HideValidationDiv();
            $confirm({ text: 'Are you sure you want to Delete this record? ', title: 'Delete', ok: 'Yes', cancel: 'No' })
                               .then(function (yes) {
                                   $scope.CustSpecialInstr.InstructionTypeId = InstructionTypeId;
                                   $scope.CustSpecialInstr.Mode = "Delete";
                                   $scope.SaveCustSpecialInstr();
                               }, function (no) {
                                   return;
                               });
        }
        function CheckValidTo() {
            if (!isEmpty($scope.CustSpecialInstr.ValidFrom) && !isEmpty($scope.CustSpecialInstr.ValidTo)) {
                if (new Date($scope.CustSpecialInstr.ValidFrom) > new Date($scope.CustSpecialInstr.ValidTo)) {
                    if ($scope.ErrorMsg != '')
                        $scope.ErrorMsg = $scope.ErrorMsg + '\n' + 'Valid From should not be greater than Valid To';
                    else
                        $scope.ErrorMsg = 'Valid From should not be greater than Valid To';
                    angular.element('#idReqValidation').show();
                    angular.element("#errorid").show();
                    $scope.CustSpecialInstr.ValidTo = null;
                    return false;
                }
            }
            return true;
        }
        $scope.SaveCustSpecialInstr = function (InstructionTypeId) {
            $scope.ErrorMsg = "";
            angular.element('#idReqValidation').hide();
            $scope.SuccessMsg = "";
            angular.element('#success').hide();
            $scope.CustSpecialInstr.CustCode = DataService.GetServiceData();
            if (isEmpty($scope.CustSpecialInstr.InstructionTypeId)) {
                angular.element('#formerrorid').show();
            }
            CheckValidTo();
            if ($scope.CustSpecialInstructionsForm.$valid || $scope.CustSpecialInstr.Mode == "Delete") {
                if (isEmpty($scope.CustSpecialInstr.InstructionTypeId)) {
                    $scope.CustSpecialInstr.Mode = "Add";
                }

                if ($scope.ErrorMsg != "")
                    return;
                var data = ngEncryption.encrypt(JSON.stringify($scope.CustSpecialInstr));
                var requestCombo = $http({
                    method: "POST",
                    url: "api/Customer/TransCustSpecInsDetails",
                    data: { "RequestText": data }
                }).then(function successResult(successData) {
                    if (successData.status != "202") {
                        if ($scope.CustSpecialInstr.Mode == "Add" || $scope.CustSpecialInstr.Mode == "Edit") {
                            $scope.addClass = 'success';
                            $scope.SuccessMsg = "Record Saved Successfully!";
                            angular.element('#success').show();
                        }
                        else {
                            $scope.addClass = 'deletedmsg';
                            $scope.SuccessMsg = "Record deleted successfully.";
                            angular.element('#success').show();
                        }
                        if (!isEmpty(successData.data) && successData.data.length > 0) {
                            var obj = JSON.parse(successData.data);
                            $scope.SpecialInstrTypeList = [];
                            if (!isEmpty(obj) && (obj.length > 0 || (!isEmpty(obj.CustSpecInstrList) && obj.CustSpecInstrList.length > 0))) {

                                $scope.SpecialInstrTypeList = $linq.Enumerable().From(obj.CustSpecInstrList)
                                                       .Select(function (x) {
                                                           if (x.Acknowledge != "Y")
                                                               x.Acknowledge = "N";
                                                           x.ValidFrom = !isEmpty(x.ValidFrom) ? $filter('date')(x.ValidFrom, "MM/dd/yyyy") : null;
                                                           x.ValidTo = !isEmpty(x.ValidTo) ? $filter('date')(x.ValidTo, "MM/dd/yyyy") : null;
                                                           return x;
                                                       }).ToArray();
                            }
                            $scope.$broadcast('DataSourceUpdate', $scope.SpecialInstrTypeList);
                            $scope.ErrorMsg = "";
                            $scope.IsOnGetDetail = false;
                            $scope.IsOnAddDetail = false;
                            $scope.IsOnEditDetail = true;

                            $scope.HideValidationDiv();
                            if (isEmpty($scope.SpecialInstrTypeList)) {
                                $scope.CustSpecialInstr = {};
                                $scope.CustSpecialInstr.Mode = "Add";
                                $("#ImgSave").removeClass('disabled');
                                $("#ImgDelete").addClass('disabled');
                                $scope.IsOnGetDetail = false;
                                $scope.IsOnAddDetail = true;
                                $scope.IsOnEditDetail = false;
                                $scope.CustSpecialInstr.ValidFrom = $filter('date')(new Date(), "MM/dd/yyyy");
                            }
                            else {
                                $scope.CustSpecialInstr = angular.copy($scope.SpecialInstrTypeList[0]);
                                $scope.CustSpecialInstr.Mode = "Edit";
                                $("#ImgSave").removeClass('disabled');
                                $("#ImgDelete").removeClass('disabled');
                                $scope.IsOnGetDetail = false;
                                $scope.IsOnAddDetail = false;
                                $scope.IsOnEditDetail = true;
                            }
                            $scope.CustSpecialInstr.ValidFrom = !isEmpty($scope.CustSpecialInstr.ValidFrom) ? $filter('date')($scope.CustSpecialInstr.ValidFrom, "MM/dd/yyyy") : null;
                            $scope.CustSpecialInstr.ValidTo = !isEmpty($scope.CustSpecialInstr.ValidTo) ? $filter('date')($scope.CustSpecialInstr.ValidTo, "MM/dd/yyyy") : null;
                            $scope.CustSpecialInstr.InstructionTypeId = !isEmpty($scope.CustSpecialInstr.InstructionTypeId) ? $scope.CustSpecialInstr.InstructionTypeId.toString() : "";
                        }
                        else {
                            $scope.SpecialInstrTypeList = [];
                            $scope.$broadcast('DataSourceUpdate', $scope.SpecialInstrTypeList);
                            $("#ImgDelete").addClass('disabled');
                        }
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