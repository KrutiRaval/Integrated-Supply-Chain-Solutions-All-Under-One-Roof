app.controller("CourierDelayController", ['$scope', '$http', '$location', 'ngEncryption', 'DataService', '$filter', '$rootScope', '$linq', '$confirm', '$modal',
    function ($scope, $http, $location, ngEncryption, DataService, $filter, $rootScope, $linq, $confirm, $modal) {
        $scope.IsPagerVisible = true;
        $scope.openModuleChange = function () {
            $location.path('/Courier')
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
        $scope.BindCourierDelay = function () {
            $scope.ErrorMsg = "";
            angular.element('#success').hide();
            if (isEmpty($scope.CourierDelayDtls.ValidFrom) || isEmpty($scope.CourierDelayDtls.ValidTo)) {
                angular.element('#idReqValidation').show();
                angular.element("#errorid").show();
                $scope.CourierDelayList = [];
                $scope.resizeModuleSub();
                $scope.$broadcast('DataSourceUpdate', $scope.CourierDelayList);
                return false;
            }

            if ($scope.ErrorMsg != "")
                return;
            $scope.NewId = "IdCourierDelayGD";
            $scope.PageSize = 100;            
            $scope.NewId = "IdCourierAlertGD";
            $scope.Height = "250";
            $scope.sorting = true;
            $scope.VirtualMode = false;
            $scope.ColumnList = [

    {
        dataField: "JobId", allowSorting: true, caption: "Job #", width: "100",
    },
    {
        dataField: "SchpuDttm", allowSorting: true, caption: "Schedule Time", width: "150",
    },
    {
        dataField: "ActpuDttm", allowSorting: true, caption: "ActualTime", width: "150",
    },
    {
        dataField: "DelayTime", allowSorting: true, caption: "Delay Time", width: "100",
    },
    {
        dataField: "Note", allowSorting: true, caption: "Note", cssClass: "wraplabelDXGrid",
    },
            ];
            var ReqObj = {
                "CourierId": $scope.CourierId,
                "ValidFrom": $scope.CourierDelayDtls.ValidFrom,
                "ValidTo": $scope.CourierDelayDtls.ValidTo
            };

            var data = ngEncryption.encrypt(JSON.stringify(ReqObj));
            var requestCombo = $http({
                method: "POST",
                url: "api/Courier/GetCourierDelayDetails",
                params: { "RequestText": data }
            }).then(function successresult(successdata) {
                if (successdata.status != "202") {
                    if (!isEmpty(successdata.data) && successdata.data.length > 0) {
                        var obj = JSON.parse(successdata.data);
                        if (!isEmpty(obj) && !isEmpty(obj[0].JobId)) {
                            $scope.CourierDelayList = $linq.Enumerable().From(obj)
                                                      .Select(function (x) {
                                                          x.ActpuDttm = !isEmpty(x.ActpuDttm) ? x.ActpuDttm : "01/01/0001 12:00:00 AM";
                                                          x.DelayTime = isEmpty(x.DelayTime) ? 0 : x.DelayTime;
                                                          return x;
                                                      }).ToArray();

                            if (isEmpty($scope.CourierDelayList[0].QualityIdx)) {
                                $scope.CourierDelayDtls.QualityIdx = 0;
                            }
                            else {
                                $scope.CourierDelayDtls.QualityIdx = $scope.CourierDelayList[0].QualityIdx;
                            }

                            $scope.$broadcast('DataSourceUpdate', $scope.CourierDelayList);

                        }

                        else {
                            if (!isEmpty(obj) && !isEmpty(obj[0].QualityIdx)) {
                                $scope.CourierDelayDtls.QualityIdx = obj[0].QualityIdx;
                            }
                            else {
                                $scope.CourierDelayDtls.QualityIdx = 0;
                            }
                            $scope.CourierDelayList = [];
                            $scope.$broadcast('DataSourceUpdate', $scope.CourierDelayList);
                        }
                        $scope.resizeModuleSub();
                    }
                    else {
                        $scope.CourierDelayList = [];
                        if (isEmpty($scope.CourierDelayDtls.QualityIdx)) {
                            $scope.CourierDelayDtls.QualityIdx = 0;
                        }
                        $scope.$broadcast('DataSourceUpdate', $scope.CourierDelayList);

                    }
                }
                else {
                    $scope.ErrorMsg = successdata.data;
                }
            }
       )
        }
        $scope.onLoad = function (value) {
            var QualityId = value == 'reset' && !isEmpty($scope.CourierDelayDtls) && !isEmpty($scope.CourierDelayDtls.QualityIdx) ? $scope.CourierDelayDtls.QualityIdx : 0;
            $scope.CourierDelayDtls = {};
            $scope.CourierDelayList = [];
            $scope.$broadcast('DataSourceUpdate', $scope.CourierDelayList);
            $scope.CourierId = DataService.GetServiceData();
            $scope.CourierDelayDtls.QualityIdx = !isEmpty(QualityId) ? QualityId : 0;
            var today = new Date();
            var priorDate = new Date().setDate(today.getDate() - 30);
            $scope.CourierDelayDtls.ValidTo = $filter('date')(today, "MM/dd/yyyy");
            $scope.CourierDelayDtls.ValidFrom = $filter('date')(priorDate, "MM/dd/yyyy");

            if (value != 'reset') {
                $scope.BindCourierDelay();
            }
        }
        $scope.onLoad();
        $scope.ChangeQualityIdx = function () {
            if (isEmpty($scope.CourierDelayDtls.QualityIdx)) {
                $scope.CourierDelayDtls.QualityIdx = 0;
            }
            if ($scope.CourierDelayDtls.QualityIdx > 100) {
                $scope.CourierDelayDtls.QualityIdx = 100;
            }
        }
        $scope.UpdateCourierRating = function () {
            $scope.ErrorMsg = "";
            if (isEmpty($scope.CourierDelayDtls.QualityIdx)) {
                $scope.CourierDelayDtls.QualityIdx = 0;
            }
            if ($scope.CourierDelayDtls.QualityIdx > 100) {
                $scope.CourierDelayDtls.QualityIdx = 100;
            }
            var ReqObj =
          {
              "CourierId": $scope.CourierId,
              "QualityIdx": $scope.CourierDelayDtls.QualityIdx
          };
            var data = ngEncryption.encrypt(JSON.stringify(ReqObj));
            var requestCombo = $http({
                method: "POST",
                url: "api/Courier/TransCourierUpdateRating",
                params: { "RequestText": data }
            }).then(function successResult(successData) {
                if (successData.status != "202") {
                    $scope.addClass = 'success';
                    $scope.SuccessMsg = "Rating Updated Successfully.";
                    angular.element('#success').show();
                }
                else {
                    $scope.ErrorMsg = successData.data;
                }
            })
        }
    }]);