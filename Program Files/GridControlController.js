angular.module('NGLConnect').controller("GridControlController", ['$scope', '$http',
function ($scope, $http) {
    $scope.ErrorMsg = "";
    angular.element('#UserNoGrid').hide();
    $scope.SorOrder;
    $scope.NoDataMessage = 'No Records found!';
    angular.element('#grid').attr("style", "min-height:" + $scope.Height + "px;");
    angular.element('#grid').attr("id", $scope.IdNew);
    $scope.IsCallFromJS = false;
    if ($scope.Source != undefined) {
        $scope.gridSettings = {
            dataSource: $scope.Source,
            columns: $scope.ColumnList,
            scrolling: {
                //mode: 'virtual',
                mode: $scope.VirtualMode == true ? 'virtual' : 'standard',
                showScrollbar: 'always'
            },
            columnFixing: {
                enabled: true
            },
            sorting: {
                mode: $scope.Sorting == true ? 'single' : 'none'
            },
            groupPanel: {
                visible: $scope.Grouping ? $scope.Grouping : false
            },
            noDataText: $scope.IsNoDataMessage == true ? $scope.NoDataMessage : '',
            paging: {
                pageSize: $scope.PageSize > 0 ? $scope.PageSize : 100,
                enabled: $scope.IsPagerVisible == false ? false : true
            },
            pager: {
                visible: $scope.IsPagerVisible == false ? false : true,
                showInfo: true,
                showNavigationButtons: true,
                showPageSizeSelector: false
            },
            loadPanel: {
                enabled: false
            },
            summary: {
                totalItems: $scope.SummaryInfo
            }
        };
        $scope.$on("DataSourceUpdate", function (event, GridDataSource) {

            $scope.IsCallFromJS = true;
            var dataGrid = $("#" + $scope.IdNew + "").dxDataGrid('instance');
            dataGrid.option('dataSource', GridDataSource);
            if ($scope.CallSvcOnPageChanged && GridDataSource.length > 0) {
                var PageIndex = 0;
                LoadGridDataSource();
            }
            else {
                $("#" + $scope.IdNew + "").dxDataGrid("instance").pageIndex(0);
                if (GridDataSource != undefined && GridDataSource.length == 0) {
                    $scope.IsNoDataMessage = true;
                }
                else {
                    $scope.IsNoDataMessage = false;
                }
                dataGrid.option('noDataText', $scope.IsNoDataMessage == true ? $scope.NoDataMessage : '');
                dataGrid.refresh();
            }

            function LoadGridDataSource() {

                var GridDataSource = {
                    load: function (options) {
                        $scope.ErrorMsg = "";
                        angular.element('#UserNoGrid').hide();
                        var def = $.Deferred();
                        if ($scope.IsCallFromJS) {
                            $("#" + $scope.IdNew + "").dxDataGrid("instance").pageIndex(0);
                            if ($scope.IsPagerVisible == false) {
                                def.resolve($scope.Source, { totalCount: 0 });
                            }
                            else {
                                def.resolve($scope.Source, { totalCount: $scope.Source[0].TotalRecords });
                            }
                            $scope.IsCallFromJS = false;

                        }
                        else {
                            var PageIndex = parseInt(options.skip / options.take)
                            if (options.sort != undefined) {
                                var SorOrder = $scope.DefaultSort ? $scope.DefaultSort : "";
                                if (options.sort[0].desc)
                                    SorOrder = options.sort[0].selector + " DESC"
                                else
                                    SorOrder = options.sort[0].selector + " ASC"

                                if ($scope.SorOrder != SorOrder) {
                                    $scope.SorOrder = SorOrder;
                                    $("#" + $scope.IdNew + "").dxDataGrid("instance").pageIndex(0);
                                }

                                if ($scope.ReqObj != undefined) {
                                    $scope.ReqObj.Query = SorOrder;
                                }
                            }

                            if ($scope.ReqObj != undefined) {
                                $scope.ReqObj.PageIndex = PageIndex ? PageIndex : 0;
                                $scope.ReqObj.PageSize = options.take ? options.take : 100;
                            }
                            $http({
                                method: "Get",
                                url: $scope.GetUrl,
                                params: { RequestText: $scope.ReqObj ? $scope.ReqObj : "" }
                            }).then(function myfunction(successData) {
                                if (successData.status == "202") {
                                    ClearGridDataSource();
                                    $scope.ErrorMsg = successData.data;
                                    angular.element('#UserNoGrid').show();
                                }
                                else {
                                    if (successData.data != "") {
                                        var objData = JSON.parse(successData.data);
                                        if (objData != undefined && objData.length > 0) {
                                            if ($scope.IsPagerVisible == false) {
                                                def.resolve(objData, { totalCount: 0 });
                                            }
                                            else {
                                                $scope.ReqObj.TotalRecords = objData[0].TotalRecords;
                                                def.resolve(objData, { totalCount: objData[0].TotalRecords });
                                            }
                                        }
                                    }
                                    else {
                                        $scope.ReqObj.TotalRecords = 0;
                                        $scope.IsNoDataMessage = true;
                                        ClearGridDataSource();
                                    }

                                }
                            });
                        }
                        return def.promise();
                    },
                }
                var dataGrid = $("#" + $scope.IdNew + "").dxDataGrid('instance');
                dataGrid.option('dataSource', GridDataSource);
                dataGrid.clearSorting();
                dataGrid.refresh();
            }

        });
} }]);
