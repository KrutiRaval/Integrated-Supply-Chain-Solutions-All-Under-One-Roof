app.controller("OutStandingInvoiceController", ['$scope', '$http', '$location', 'ngEncryption', 'DataService', '$filter', '$rootScope', '$linq', '$confirm', '$compile',
    function ($scope, $http, $location, ngEncryption, DataService, $filter, $rootScope, $linq, $confirm, $compile) {
        $scope.openModuleChange = function () {
            $location.path('/Customer')
        }
        $scope.resizeModuleSub = function () {
            $rootScope.$broadcast('resizeModuleSubChild');
        }
        window.onresize = $scope.resizeModuleSub;
        function isEmpty(val) {
            return (val === undefined || val == null || val.length <= 0 || val == "") ? true : false;
        }
        onLoad();
        function onLoad() {
            $scope.CustOutStandingInvoice = {};
            $scope.OutStandingInvoiceList = [];
            $scope.selectedList = [];
            BindComboValues();
            $scope.viaEmail = true;
            $scope.viaFax = false;
            $scope.viaEmailSendStmt = true;
            $scope.viaFaxSendStmt = false;
            angular.element('#success').hide();
        }
        function BindComboValues() {
            var objcombo =
            {
                "CategoryName": 'INVDELACTION'
            };
            var data = ngEncryption.encrypt(JSON.stringify(objcombo));
            var requestCombo = $http({
                method: "GET",
                url: "api/General/GetFillComboList",
                params: { CategoryName: data }
            }).then(function successResult(successData) {
                if (successData.status != "202") {
                    var obj = JSON.parse(successData.data);
                    $scope.OutStandingInvoiceEFax = obj.INVDELACTION;
                    $scope.OutStandingInvoiceStmt = obj.INVDELACTION;
                    $scope.EFaxVia = $scope.OutStandingInvoiceEFax[0].CodeId;
                    $scope.SendStmtVia = $scope.OutStandingInvoiceStmt[0].CodeId;
                    $scope.OutStandingInvoiceDunnNotify = $linq.Enumerable().From($scope.OutStandingInvoiceEFax)
                                                              .Where(function (x) {
                                                                  return (x.CodeValue == "EMAIL");
                                                              })
                                                              .Select(function (x) {
                                                                  return x;
                                                              }).ToArray();
                    $scope.DunnNotifyVia = $scope.OutStandingInvoiceDunnNotify[0].CodeId;
                }
                else {
                    $scope.ErrorMsg = successData.data;
                }
            }, function errorResult() {
            });
        }
        $scope.CustOutStandingInvoice.CustCode = DataService.GetServiceData();

        $scope.NewId = "gridOutstandingInvoice";
        BindCustOutStandingInvoice();
        function BindCustOutStandingInvoice() {
            $scope.Height = "200";
            $scope.IsPagerVisible = false;
            $scope.sorting = true;
            $scope.VirtualMode = false;
            $scope.OutStandingInvoiceList.PageSize = "10";
            $scope.ColumnList = [
            {
                dataField: "", caption: "", width: 40, cssClass: "dx-datagrid-action", allowSorting: false, allowEditing: false,
                headerCellTemplate: function myfunction(container, options) {
                    $('<div>').dxCheckBox({
                        value: !isEmpty($scope.SelectAllValue) ? $scope.SelectAllValue : false,
                        onValueChanged: function (args) {
                            if (!isEmpty($scope.OutStandingInvoiceList)) {
                                $.each($scope.OutStandingInvoiceList, function (_, item) {
                                    if (args.value) {
                                        item.IsChecked = 'Y';
                                    }
                                    else {
                                        item.IsChecked = 'N';
                                    }
                                });
                                $scope.SelectAllValue = args.value;
                                $scope.$broadcast('DataSourceUpdate', $scope.OutStandingInvoiceList);
                            }
                        }
                    }).appendTo(container);
                },
                cellTemplate: function myfunction(container, options) {
                    $('<div />').dxCheckBox({
                        value: options.data.IsChecked == 'Y' ? true : false,
                        onValueChanged: function myfunction(e) {
                            if (e.value) {
                                options.data.IsChecked = 'Y';
                            }
                            else {
                                options.data.IsChecked = 'N';
                            }
                        }
                    }).appendTo(container);
                }
            },
            {
                dataField: "InvoiceId", caption: "Invoice", width: 120, allowSorting: true
            },
            {
                dataField: "InvoiceDate", width: 120, allowSorting: true, caption: "Date"
            },
            {
                dataField: "OrigAmount", format: 'currency', precision: 2, caption: "Orig Amount", width: 120, allowSorting: true, cellTemplate: function myfunction(container, options) {
                    //options.data.OrigAmount = $filter('currency')(options.data.OrigAmount != undefined ? options.data.OrigAmount : 0);

                    var Text = "<span>" + options.data.strOrigAmount + "</span>";
                    var temp = $compile(Text)($scope);
                    $(container).append(temp);
                }
            },
            {
                dataField: "Days30", caption: "1-30", width: 120, allowSorting: true, format: 'currency', precision: 2, cellTemplate: function myfunction(container, options) {
                    //options.data.Days30 = $filter('currency')(options.data.Days30 != undefined ? options.data.Days30 : 0);

                    var Text = "<span>" + options.data.strDays30 + "</span>";
                    var temp = $compile(Text)($scope);
                    $(container).append(temp);
                }
            },
            {
                dataField: "Days60", caption: "31-60", width: 120, allowSorting: true, format: 'currency', precision: 2, cellTemplate: function myfunction(container, options) {
                    //options.data.Days60 = $filter('currency')(options.data.Days60 != undefined ? options.data.Days60 : 0);

                    var Text = "<span>" + options.data.strDays60 + "</span>";
                    var temp = $compile(Text)($scope);
                    $(container).append(temp);
                }
            },
            {
                dataField: "Days90", caption: "61-90", width: 120, allowSorting: true, format: 'currency', precision: 2, cellTemplate: function myfunction(container, options) {
                    //options.data.Days90 = $filter('currency')(options.data.Days90 != undefined ? options.data.Days90 : 0);

                    var Text = "<span>" + options.data.strDays90 + "</span>";
                    var temp = $compile(Text)($scope);
                    $(container).append(temp);
                }
            },
            {
                dataField: "Morethan90", caption: "90+", width: 120, allowSorting: true, format: 'currency', precision: 2, cellTemplate: function myfunction(container, options) {
                    //options.data.Morethan90 = $filter('currency')(options.data.Morethan90 != undefined ? options.data.Morethan90 : 0);

                    var Text = "<span>" + options.data.strMorethan90 + "</span>";
                    var temp = $compile(Text)($scope);
                    $(container).append(temp);
                }
            },
            {
                dataField: "FollowUp", allowSorting: true, caption: "Follow Up"
            }
            ];
            $scope.SummaryInfo = [
            {
                showInColumn: "FollowUp",
                summaryType: "count",
                displayFormat: "Total Invoice(s) : {0}",
                alignByColumn: true,
                showInGroupFooter: true
            },
            {
                showInColumn: "InvoiceDate",
                displayFormat: "   Total Charges : ",
                alignByColumn: true,
                showInGroupFooter: true
            },
            {
                showInColumn: "OrigAmount",
                summaryType: "sum",
                displayFormat: "US{0}",
                column: "OrigAmount",
                alignByColumn: true,
                showInGroupFooter: true,
                valueFormat: "currency",
                precision: 2
            },
            {
                showInColumn: "Days30",
                summaryType: "sum",
                displayFormat: "US{0}",
                column: "Days30",
                alignByColumn: true,
                showInGroupFooter: true,
                valueFormat: "currency",
                precision: 2
            },
            {
                showInColumn: "Days60",
                summaryType: "sum",
                displayFormat: "US{0}",
                column: "Days60",
                alignByColumn: true,
                showInGroupFooter: true,
                valueFormat: "currency",
                precision: 2
            },
            {
                showInColumn: "Days90",
                summaryType: "sum",
                displayFormat: "US{0}",
                column: "Days90",
                alignByColumn: true,
                showInGroupFooter: true,
                valueFormat: "currency",
                precision: 2
            },
            {
                showInColumn: "Morethan90",
                summaryType: "sum",
                displayFormat: "US{0}",
                column: "Morethan90",
                alignByColumn: true,
                showInGroupFooter: true,
                valueFormat: "currency",
                precision: 2
            }
            ];
            var ReqObj = {
                "CustCode": DataService.GetServiceData()
            };
            var data = ngEncryption.encrypt(JSON.stringify(ReqObj));
            var requestcombo = $http({
                method: "POST",
                url: "api/Customer/GetOutstandingInvoiceDtls",
                data: { "RequestText": data }
            }).then(function successresult(successdata) {
                if (successdata.status != "202") {
                    var obj = JSON.parse(successdata.data);
                    $scope.CustOutStandingInvoice = obj;
                    $scope.CustOutStandingInvoice.AcctCreatedDt = !isEmpty($scope.CustOutStandingInvoice.AcctCreatedDt) ? $filter('date')($scope.CustOutStandingInvoice.AcctCreatedDt, "MM/dd/yyyy") : null;
                    $scope.CustOutStandingInvoice.LastPayment = !isEmpty($scope.CustOutStandingInvoice.LastPayment) ? $filter('date')($scope.CustOutStandingInvoice.LastPayment, "MM/dd/yyyy") : null;
                    $scope.EFaxAddress = $scope.CustOutStandingInvoice.EmailAddr;
                    if (!isEmpty($scope.selectedList) && !isEmpty(obj) && !isEmpty(obj.CustInvList)) {
                        for (var i = 0; i < $scope.selectedList.length ; i++) {
                            for (var j = 0; j < obj.CustInvList.length; j++) {
                                if ($scope.selectedList[i].InvoiceId == obj.CustInvList[j].InvoiceId) {
                                    obj.CustInvList[j].IsChecked = $scope.selectedList[i].IsChecked;
                                }
                            }

                        }
                    }
                    $scope.OutStandingInvoiceList = $linq.Enumerable().From(obj.CustInvList)
                                                 .Select(function (x) {
                                                     x.IsChecked = !isEmpty(x.IsChecked) ? x.IsChecked : 'N';
                                                     x.InvoiceDate = !isEmpty(x.InvoiceDate) ? $filter('date')(x.InvoiceDate, "MM/dd/yyyy") : null;
                                                     x.FollowUp = !isEmpty(x.FollowUp) ? $filter('date')(x.FollowUp, "MM/dd/yyyy") : null;
                                                     x.strOrigAmount = $filter('currency')(x.OrigAmount != undefined ? x.OrigAmount : 0);
                                                     x.strDays30 = $filter('currency')(x.Days30 != undefined ? x.Days30 : 0);
                                                     x.strDays60 = $filter('currency')(x.Days60 != undefined ? x.Days60 : 0);
                                                     x.strDays90 = $filter('currency')(x.Days90 != undefined ? x.Days90 : 0);
                                                     x.strMorethan90 = $filter('currency')(x.Morethan90 != undefined ? x.Morethan90 : 0);
                                                     return x;
                                                 }).ToArray();
                    $scope.selectedList = $linq.Enumerable().From($scope.OutStandingInvoiceList)
                                                             .Where(function (x) {
                                                                 return (x.IsChecked == 'Y');
                                                             })
                                                             .Select(function (x) {
                                                                 return x;
                                                             }).ToArray();
                    for (var i = 0; i < $scope.selectedList.length ; i++) {
                        $scope.selectedList[i].FollowUp = $scope.FollowUp;
                        for (var j = 0; j < $scope.OutStandingInvoiceList.length; j++) {
                            if ($scope.selectedList[i].InvoiceId == $scope.OutStandingInvoiceList[j].InvoiceId) {
                                $scope.OutStandingInvoiceList[j].FollowUp = $scope.selectedList[i].FollowUp;
                            }
                        }

                    }

                    $scope.$broadcast('DataSourceUpdate', $scope.OutStandingInvoiceList);

                }
                else {
                    $scope.ErrorMsg = successdata.data;
                }
            }, function myfunction() {
            });
        }
        $scope.HideValidationDiv = function () {
            angular.element('#idReqValidation').hide();
            angular.element('#errorid').hide();
            angular.element('#formerrorid').hide();
            angular.element('#success').hide();
            $scope.ErrorMsg = "";
        }
        $scope.TransOutstandingInvoiceDtls = function () {
            angular.element('#success').hide();
            $scope.ErrorMsg = "";
            if ($scope.OutStandingInvoiceForm.$valid) {
                if ($scope.ErrorMsg != "")
                    return;
                $scope.selectedList = $linq.Enumerable().From($scope.OutStandingInvoiceList)
                                                              .Where(function (x) {
                                                                  return (x.IsChecked == 'Y');
                                                              })
                                                              .Select(function (x) {
                                                                  return x;
                                                              }).ToArray();
                for (var i = 0; i < $scope.selectedList.length ; i++) {
                    $scope.selectedList[i].FollowUp = $scope.FollowUp;
                }
                $scope.InvoiceIdList = '';
                if ($scope.selectedList.length > 0) {
                    for (var i = 0; i < $scope.selectedList.length; i++) {
                        if ($scope.InvoiceIdList != '') {
                            $scope.InvoiceIdList = $scope.InvoiceIdList + "," + $scope.selectedList[i].InvoiceId;
                        }
                        else {
                            $scope.InvoiceIdList = $scope.selectedList[i].InvoiceId;
                        }
                    }
                }

                var objcombo = {
                    "CustCode": DataService.GetServiceData(),
                    "strInvoiceIdLst": $scope.InvoiceIdList,
                    "InvFollowUpDt": $scope.FollowUp,
                    "MemoNote": $scope.CustOutStandingInvoice.Note
                };
                var data = ngEncryption.encrypt(JSON.stringify(objcombo));
                var requestCombo = $http({
                    method: "POST",
                    url: "api/Customer/TransOutstandingInvoiceDtls",
                    params: { RequestText: data }
                }).then(function successResult(successData) {
                    if (successData.status != "202") {
                        $scope.SuccessMsg = "Record Saved Successfully!";
                        angular.element('#SuccessMsgid').show();
                        $scope.CustOutStandingInvoice.Note = "";
                        BindCustOutStandingInvoice();
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
        //$scope.SetFollowUp = function ()
        //{
        //    $scope.selectedList = $linq.Enumerable().From($scope.OutStandingInvoiceList)
        //                                                       .Where(function (x) {
        //                                                           return (x.IsChecked == 'Y');
        //                                                       })
        //                                                       .Select(function (x) {
        //                                                           return x;
        //                                                       }).ToArray();
        //    for(var i=0; i<$scope.selectedList.length ; i++)
        //    {
        //        $scope.selectedList[i].FollowUp = $scope.FollowUp;
        //    }
        //}        

 $scope.CheckEFaxVia = function (onChange) {
            $scope.HideValidationDiv();
            var Via = $linq.Enumerable().From($scope.OutStandingInvoiceEFax)
                                       .Where(function (x) {
                                           return x.CodeId == $scope.EFaxVia;
                                       })
                                       .Select(function (x) {
                                           return x.CodeDisplayName;
                                       }).FirstOrDefault();

            if (Via == "Fax") {
                if (onChange)
                    $scope.EFaxAddress = "";
                if (!isEmpty($scope.CustOutStandingInvoice.FaxNum))
                    $scope.EFaxAddress = $scope.CustOutStandingInvoice.FaxNum;
                $scope.viaFax = true;
                $scope.viaEmail = false;
            }
            if (Via == "Email") {
                if (onChange)
                    $scope.EFaxAddress = "";
                if (!isEmpty($scope.CustOutStandingInvoice.EmailAddr))
                    $scope.EFaxAddress = $scope.CustOutStandingInvoice.EmailAddr;
                $scope.viaFax = false;
                $scope.viaEmail = true;
            }

        }

        $scope.CheckSendStmtVia = function (onChange) {
            $scope.HideValidationDiv();
            var Via = $linq.Enumerable().From($scope.OutStandingInvoiceStmt)
                                       .Where(function (x) {
                                           return x.CodeId == $scope.SendStmtVia;
                                       })
                                       .Select(function (x) {
                                           return x.CodeDisplayName;
                                       }).FirstOrDefault();

            if (Via == "Fax") {
                if (onChange)
                    $scope.SendStmtAddress = "";
                if (!isEmpty($scope.CustOutStandingInvoice.FaxNum))
                    $scope.SendStmtAddress = "Enter Fax no.";
                $scope.viaFaxSendStmt = true;
                $scope.viaEmailSendStmt = false;
            }
            if (Via == "Email") {
                if (onChange)
                    $scope.SendStmtAddress = "";
                //if (!isEmpty($scope.CustOutStandingInvoice.EmailAddr))
                //    $scope.SendStmtAddress = $scope.CustOutStandingInvoice.EmailAddr;
                $scope.viaFaxSendStmt = false;
                $scope.viaEmailSendStmt = true;
            }

        }

        $scope.SendElecInvoiceDtls = function (Via) {
            angular.element('#success').hide();
            $scope.HideValidationDiv();
            if ($scope.viaEmail) {
                var IsEmailValid = /^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([;,.](([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+)*$/;
                if (isEmpty($scope.EFaxAddress)) {
                    if ($scope.ErrorMsg != '') {
                        $scope.ErrorMsg = $scope.ErrorMsg + '\n' + "Please enter Email Id.";
                    }
                    else {
                        $scope.ErrorMsg = "Please enter Email Id.";
                    }
                }
                else if (!IsEmailValid.test($scope.EFaxAddress)) {
                    if ($scope.ErrorMsg != '') {
                        $scope.ErrorMsg = $scope.ErrorMsg + '\n' + "Invalid Email Id.";
                    }
                    else {
                        $scope.ErrorMsg = "Invalid Email Id.";
                    }
                }
                else {
                    var selectedList = $linq.Enumerable().From($scope.OutStandingInvoiceList)
                                                           .Where(function (x) {
                                                               return (x.IsChecked == 'Y');
                                                           })
                                                           .Select(function (x) {
                                                               return x;
                                                           }).ToArray();
                    if (selectedList.length > 0) {
                        var SelectedInvoiceId = '';
                        for (var i = 0; i < selectedList.length; i++) {
                            if (SelectedInvoiceId != '') {
                                SelectedInvoiceId = SelectedInvoiceId + "," + selectedList[i].InvoiceId;
                            }
                            else {
                                SelectedInvoiceId = selectedList[i].InvoiceId;
                            }
                        }
                    }
                    else {
                        if ($scope.ErrorMsg != '') {
                            $scope.ErrorMsg = $scope.ErrorMsg + '\n' + "Please select atleast one invoice.";
                        }
                        else {
                            $scope.ErrorMsg = "Please select atleast one invoice.";
                        }

                    }
                }
            }
            if ($scope.viaFax) {
                if (isEmpty($scope.EFaxAddress)) {
                    if ($scope.ErrorMsg != '') {
                        $scope.ErrorMsg = $scope.ErrorMsg + '\n' + "Please enter Fax No.";
                    }
                    else {
                        $scope.ErrorMsg = "Please enter Fax No.";
                    }
                }
                else if ($scope.EFaxAddress.length != 10 && $scope.EFaxAddress.length != 12 && $scope.EFaxAddress.length != 0) {
                    if ($scope.ErrorMsg != '') {
                        $scope.ErrorMsg = $scope.ErrorMsg + '\n' + "Please enter 10 digits FaxNum no.";
                    }
                    else {
                        $scope.ErrorMsg = "Please enter 10 digits FaxNum no.";
                    }
                    angular.element('#idReqValidation').show();
                }
                var selectedList = $linq.Enumerable().From($scope.OutStandingInvoiceList)
                                                          .Where(function (x) {
                                                              return (x.IsChecked == 'Y');
                                                          })
                                                          .Select(function (x) {
                                                              return x;
                                                          }).ToArray();
                if (selectedList.length > 0) {
                    var SelectedInvoiceId = '';
                    for (var i = 0; i < selectedList.length; i++) {
                        if (InvoiceIdforFax != '') {
                            SelectedInvoiceId = SelectedInvoiceId + "," + selectedList[i].InvoiceId;
                        }
                        else {
                            SelectedInvoiceId = selectedList[i].InvoiceId;
                        }
                    }
                }
                else {
                    if ($scope.ErrorMsg != '') {
                        $scope.ErrorMsg = $scope.ErrorMsg + '\n' + "Please select atleast one invoice.";
                    }
                    else {
                        $scope.ErrorMsg = "Please select atleast one invoice.";
                    }
                }
            }

            if ($scope.ErrorMsg != "") {
                angular.element('#idReqValidation').show();
                angular.element('#errorid').show();
                return;
            }

            var objcombo =
            {
                "EmailBody ": $scope.EFaxMessage,
                "ReportPath": "/SSRSService/ViewInvoice ",
                "ReportName": "ViewInvoice",
                "AttachmentType": "PDF",
                "ReportId": 1475,
                "ParameterName": "StartInvoice",
                "ParameterValue": 2110617,
                "EmailFaxAddr": $scope.EFaxAddress
            };
            var data = ngEncryption.encrypt(JSON.stringify(objcombo));
            var requestCombo = $http({
                method: "POST",
                url: "api/Customer/SendElecInvoiceDtls",
                params: { RequestText: data }
            }).then(function successResult(successData) {
                if (successData.status != "202") {
                    if ($scope.viaEmail) {
                        $scope.SuccessMsg = "Email successfully sent.";
                        angular.element('#success').show();
                        angular.element('#SuccessMsgid').show();
                    }
                    else {
                        $scope.SuccessMsg = "Fax successfully sent.";
                        angular.element('#success').show();
                        angular.element('#SuccessMsgid').show();
                    }
                }
                else {
                    $scope.ErrorMsg = successData.data;
                }
            }, function errorResult() {
            });
        }

        $scope.SendstatementInvoiceDtls = function (Via) {
            $scope.HideValidationDiv();
            angular.element('#success').hide();
            $scope.ErrorMsg = "";
            if ($scope.viaEmailSendStmt) {
                var IsEmailValid = /^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([;,.](([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+)*$/;
                if (isEmpty($scope.SendStmtAddress)) {
                    if ($scope.ErrorMsg != '') {
                        $scope.ErrorMsg = $scope.ErrorMsg + '\n' + "Please enter Email Id.";
                    }
                    else {
                        $scope.ErrorMsg = "Please enter Email Id.";
                    }
                }
                else if (!IsEmailValid.test($scope.SendStmtAddress)) {
                    if ($scope.ErrorMsg != '') {
                        $scope.ErrorMsg = $scope.ErrorMsg + '\n' + "Invalid Email Id.";
                    }
                    else {
                        $scope.ErrorMsg = "Invalid Email Id.";
                    }

                }
                if (isEmpty($scope.SendStmtAddressCC)) { }
                else if (!IsEmailValid.test($scope.SendStmtAddressCC)) {
                    if ($scope.ErrorMsg != '') {
                        $scope.ErrorMsg = $scope.ErrorMsg + '\n' + "Invalid Email Id.";
                    }
                    else {
                        $scope.ErrorMsg = "Invalid Email Id.";
                    }
                }
            }

            if ($scope.viaFaxSendStmt) {
                if (isEmpty($scope.SendStmtAddress)) {
                    if ($scope.ErrorMsg != '') {
                        $scope.ErrorMsg = $scope.ErrorMsg + '\n' + "Please enter Fax No.";
                    }
                    else {
                        $scope.ErrorMsg = "Please enter Fax No.";
                    }
                }
                else {
                    if ($scope.SendStmtAddress.length != 10 && $scope.SendStmtAddress.length != 12 && $scope.SendStmtAddress.length != 0) {
                        if ($scope.ErrorMsg != '') {
                            $scope.ErrorMsg = $scope.ErrorMsg + '\n' + "Please enter 10 digits FaxNum no.";
                        }
                        else {
                            $scope.ErrorMsg = "Please enter 10 digits FaxNum no.";
                        }
                        angular.element('#idReqValidation').show();
                    }
                }
            }

            if ($scope.ErrorMsg != "") {
                angular.element('#idReqValidation').show();
                angular.element('#errorid').show();
                return;
            }


            var objcombo =
                   {
                       "EmailBody ": $scope.SendStmtMessage,
                       "ReportPath": "/SSRSService/CustOutStandingInvoiceEmail",
                       "ReportName": "ViewInvoice",
                       "AttachmentType": "PDF",
                       "ReportId": 1475,
                       "ParameterName": "CustCode",
                       "ParameterValue": 2110617,
                       "EmailFaxAddr": $scope.SendStmtAddress
                   };
            var data = ngEncryption.encrypt(JSON.stringify(objcombo));
            var requestCombo = $http({
                method: "POST",
                url: "api/Customer/SendstatementInvoiceDtls",
                params: { RequestText: data }
            }).then(function successResult(successData) {
                if (successData.status != "202") {
                    if ($scope.viaEmailSendStmt) {
                        $scope.SuccessMsg = "Email successfully sent.";
                        angular.element('#success').show();
                        angular.element('#SuccessMsgid').show();
                    }
                    else {
                        $scope.SuccessMsg = "Fax successfully sent.";
                        angular.element('#success').show();
                        angular.element('#SuccessMsgid').show();
                    }
                }
                else {
                    $scope.ErrorMsg = successData.data;
                }
            }, function errorResult() {
            });

        }

        $scope.SendDunningInvoiceDtls = function () {
            $scope.HideValidationDiv();
            angular.element('#success').hide();
            $scope.ErrorMsg = "";

            var IsEmailValid = /^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([;,.](([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+)*$/;
            if (isEmpty($scope.DunnNotifyAddress)) {
                if ($scope.ErrorMsg != '') {
                    $scope.ErrorMsg = $scope.ErrorMsg + '\n' + "Please enter Email Id.";
                }
                else {
                    $scope.ErrorMsg = "Please enter Email Id.";
                }
            }
            else if (!IsEmailValid.test($scope.DunnNotifyAddress)) {
                if ($scope.ErrorMsg != '') {
                    $scope.ErrorMsg = $scope.ErrorMsg + '\n' + "Invalid Email Id.";
                }
                else {
                    $scope.ErrorMsg = "Invalid Email Id.";
                }
            }
            else {
                var selectedList = $linq.Enumerable().From($scope.OutStandingInvoiceList)
                                                       .Where(function (x) {
                                                           return (x.IsChecked == 'Y');
                                                       })
                                                       .Select(function (x) {
                                                           return x;
                                                       }).ToArray();
                if (selectedList.length > 0) {
                    var SelectedInvoiceId = '';
                    for (var i = 0; i < selectedList.length; i++) {
                        if (SelectedInvoiceId != '') {
                            SelectedInvoiceId = SelectedInvoiceId + "," + selectedList[i].InvoiceId;
                        }
                        else {
                            SelectedInvoiceId = selectedList[i].InvoiceId;
                        }
                    }
                }
                else {
                    if ($scope.ErrorMsg != '') {
                        $scope.ErrorMsg = $scope.ErrorMsg + '\n' + "Please select atleast one invoice.";
                    }
                    else {
                        $scope.ErrorMsg = "Please select atleast one invoice.";
                    }

                }
            }
            if (isEmpty($scope.DunnNotifyAddressCC)) {
            }
            else if (!IsEmailValid.test($scope.DunnNotifyAddressCC)) {
                if ($scope.ErrorMsg != '') {
                    $scope.ErrorMsg = $scope.ErrorMsg + '\n' + "Invalid Email Id.";
                }
                else {
                    $scope.ErrorMsg = "Invalid Email Id.";
                }
            }

            if ($scope.ErrorMsg != "") {
                angular.element('#idReqValidation').show();
                angular.element('#errorid').show();
                return;
            }

            var objcombo =
               {
                   "EmailBody ": $scope.DunnNotifyMessage,
                   "ReportPath": " /SSRSService/OutstandingInvoices",
                   "ReportName": " OutstandingInvoices",
                   "AttachmentType": "PDF",
                   "ReportId": 1526,
                   "ParameterName": " CustCode",
                   "ParameterValue": 113234,
                   "EmailFaxAddr": $scope.DunnNotifyAddress
               };
            var data = ngEncryption.encrypt(JSON.stringify(objcombo));
            var requestCombo = $http({
                method: "POST",
                url: "api/Customer/SendDunningInvoiceDtls",
                params: { RequestText: data }
            }).then(function successResult(successData) {
                if (successData.status != "202") {
                    $scope.SuccessMsg = "Email successfully sent.";
                    angular.element('#success').show();
                }
                else {
                    $scope.ErrorMsg = successData.data;
                }
            }, function errorResult() {
            });


        }
    }]);
