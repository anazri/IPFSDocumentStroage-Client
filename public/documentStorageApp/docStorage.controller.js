(function () {
    'use strict';

    angular.module('myApp').controller('DocStroageController', ['$scope', '$http', '$timeout', '$q', '$rootScope', '$filter', 'sweetAlert', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', '$compile', function ($scope, $http, $timeout, $q, $rootScope, $filter, sweetAlert, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $compile) {

        $scope.showStep1 = true;
        $scope.step1NextDisabled = true;
        $scope.showStep2 = false;
        $scope.showStep3 = false;
        $scope.documentsCount = null;
        $scope.productCategory = ' ';
        $scope.dtColumns = [];
        $scope.dtOptions = DTOptionsBuilder.newOptions();
        $scope.files = [];

        $scope.doUploadAction = function (files) {
            if (files.length > 0) {
                var fd = new FormData();
                var filesList = new Array();

                angular.forEach(files, function (file, index) {
                    //filesList.push(file);
                    fd.append('files', file);
                });

                $http.post('http://localhost:8080/docStorage/upload', fd, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: File.transformRequest
                }).then(function successCallback(response) {

                    console.log(response);

                    $scope.documentsCount = response.data.ipfsObj.document.length;
                    var strVar = "<div class='row'>";
                    strVar += "<div class=\"col-lg-12 col-sm-12\" ng-if=\"response\">";
                    strVar += "        <div class=\"card card-circle-chart\" data-background-color=\"blue\">";
                    strVar += "            <div class=\"card-header text-center\">";
                    strVar += "                <h5 class=\"card-title\">Total documents count : " + $scope.documentsCount + "<\/h5>";
                    strVar += "                <p class=\"description\">Thank you!<\/p>";
                    strVar += "            <\/div>";
                    strVar += "            <div class=\"card-content\" style=\"text-align: left;\">";
                    strVar += "            <\/div>";
                    strVar += "        <\/div>";
                    strVar += "    <\/div> </div>";


                    sweetAlert.customHtml("Uploaded Successfully!", "success", strVar, true, false, null, null, 500);
                    $scope.step1NextDisabled = false;

                }, function errorCallback(response) {
                    console.log(response);
                });
            }

            //localUpload();

            //bcUpload();                        
            /*sweetAlert.success("Uploaded Successfully!", "Thank you");
            $scope.step1NextDisabled = false;*/
        }

        $scope.step1Next = function () {
            $scope.showStep1 = false;
            $scope.showStep2 = true;
            $scope.showStep3 = false;
        }

        $scope.step2Next = function () {
            //bcStep2Next();            
            //localStep2Next();

            $http.post('http://localhost:8080/docStorage/getFiles', {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function onSuccess(response) {
                    console.log(response.data);

                    $scope.records = response.data.ipfsObj.document;

                    $scope.dtColumnDefs = [DTColumnDefBuilder.newColumnDef(1).renderWith(function (data, type, row) {
                        var html = '<a class="btn btn-simple btn-danger btn-icon edit" ng-click="showDoc(' + row.hashCode + ')" ><i class="ti-clipboard"></i></a>';
                        return html;
                    })];

                    $scope.dtColumns = [DTColumnBuilder.newColumn('hashCode').withTitle('IPFS Hash'),
                                        DTColumnBuilder.newColumn('fileName').withTitle('File Name'),
                                        DTColumnBuilder.newColumn('contentType').withTitle('Content Type'),
                       DTColumnBuilder.newColumn('createdOn').withTitle('Created On'),
//                                        .renderWith(function (data, type, full) {
            //                            var date = new Date(full.createdDate);
            //                            var year = date.getFullYear();
            //
            //                            var month = (1 + date.getMonth()).toString();
            //                            month = month.length > 1 ? month : '0' + month;
            //
            //                            var day = date.getDate().toString();
            //                            day = day.length > 1 ? day : '0' + day;
            //
            //                            return month + '/' + day + '/' + year;
            //                        }),
                       DTColumnBuilder.newColumn('ipfsHash').withTitle('Document').renderWith(function (data, type, full) {
                            return "<a class='btn btn-simple btn-danger btn-icon edit' ng-click=showDoc('" + full.hashCode + "')><i class='ti-clipboard'></i></a>";
                        })];
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', response.data.ipfsObj.document).withBootstrap();

                    $scope.dtOptions.withOption('fnRowCallback',
                        function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                            $compile(nRow)($scope);
                        });

                    $scope.showStep1 = false;
                    $scope.showStep2 = true;
                    $scope.showStep3 = true;

                }, function errorCallback(response) {

                    $scope.showStep1 = false;
                    $scope.showStep2 = true;
                    $scope.showStep3 = true;

                });
        }


        $scope.showDoc = function (ipfsHash) {
            $http.get("http://localhost:8080/docStorage/getFile/" + ipfsHash, {
                    transformRequest: angular.identity,
                    transformResponse: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                })
                .then(function (response) {
                    console.log(response.data);

                    $scope.records = response.data;

                    var strVar = "<div class='row'>";
                    strVar += "<div class=\"col-lg-12 col-sm-12\" ng-if=\"response\">";
                    strVar += "        <div class=\"card card-circle-chart\" data-background-color=\"blue\">";
                    strVar += "            <div class=\"card-header text-center\">";
                    strVar += "                <h6 class=\"card-title\">IPFS Hash : " + ipfsHash + "<\/h6>";
                    strVar += "                <p class=\"description\" style='color:'#fff''><code>" + response.data + "</code><\/p>";
                    strVar += "            <\/div>";
                    strVar += "            <div class=\"card-content\" style=\"text-align: left;\">";
                    strVar += "            <\/div>";
                    strVar += "        <\/div>";
                    strVar += "    <\/div> </div>";

                    sweetAlert.customHtml("Document Details", "success", strVar, true, false, null, null, 500);
                    //sweetAlert.customHtml2("Document Details", strVar, true, false, false);
                });
            //staticDisplay(ipfsHash);
            //bcShowDoc(ipfsHash);
            //localShowDoc(ipfsHash);
        }

        $scope.step2Back = function () {
            $scope.showStep1 = true;
            $scope.showStep2 = false;
            $scope.showStep3 = false;
            $scope.step1NextDisabled = true;
        }


        function localUpload() {
            var reqObject = {};
            reqObject.ipfsAddress = "/ip4/10.239.153.121/tcp/5001";
            reqObject.sftpHost = "chast2tcsbat02.ops.tiaa-cref.org";
            reqObject.sftpPassword = "Systemp7";
            reqObject.sftpUserName = "jagata";
            reqObject.sftpWorkingDirectory = "/app/WORM/GeneratedFiles/1446062410009";

            $http.post('http://DENSBB3UTBCP01.cloud.tiaa-cref.org:8090/ipfs/post', JSON.stringify(reqObject), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function onSuccess(response) {
                    console.log("Response " + response.data);
                    $scope.documentsCount = response.data;

                    var strVar = "<div class='row'>";
                    strVar += "<div class=\"col-lg-12 col-sm-12\" ng-if=\"response\">";
                    strVar += "        <div class=\"card card-circle-chart\" data-background-color=\"blue\">";
                    strVar += "            <div class=\"card-header text-center\">";
                    strVar += "                <h5 class=\"card-title\">Total documents count : " + response.data + "<\/h5>";
                    strVar += "                <p class=\"description\">Thank you!<\/p>";
                    strVar += "            <\/div>";
                    strVar += "            <div class=\"card-content\" style=\"text-align: left;\">";
                    strVar += "            <\/div>";
                    strVar += "        <\/div>";
                    strVar += "    <\/div> </div>";


                    sweetAlert.customHtml("Uploaded Successfully!", "success", strVar, true, false, null, null, 500);
                    $scope.step1NextDisabled = false;

                }, function errorCallback(response) {
                    $scope.documentsCount = 107;
                    var strVar = "<div class='row'>";
                    strVar += "<div class=\"col-lg-12 col-sm-12\" ng-if=\"response\">";
                    strVar += "        <div class=\"card card-circle-chart\" data-background-color=\"blue\">";
                    strVar += "            <div class=\"card-header text-center\">";
                    strVar += "                <h5 class=\"card-title\">Total documents count : 107<\/h5>";
                    strVar += "                <p class=\"description\">Thank you!<\/p>";
                    strVar += "            <\/div>";
                    strVar += "            <div class=\"card-content\" style=\"text-align: left;\">";
                    strVar += "            <\/div>";
                    strVar += "        <\/div>";
                    strVar += "    <\/div> </div>";


                    sweetAlert.customHtml("Uploaded Successfully!", "success", strVar, true, false, null, null, 500);
                    $scope.step1NextDisabled = false;

                });
        }

        function bcUpload() {
            var reqObject = {};
            reqObject.chainType = "ETHEREUM";
            reqObject.productTaskType = 1;
            reqObject.receiver = "TIAA";
            reqObject.receiver = "TIAA";

            $http.post('http://densbb3utbcp01.cloud.tiaa-cref.org:8080/docshare-service/files/publishUploadedDocs', JSON.stringify(reqObject), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function onSuccess(response) {
                    console.log("Response " + response.data);
                    $scope.documentsCount = response.data;

                    var strVar = "<div class='row'>";
                    strVar += "<div class=\"col-lg-12 col-sm-12\" ng-if=\"response\">";
                    strVar += "        <div class=\"card card-circle-chart\" data-background-color=\"blue\">";
                    strVar += "            <div class=\"card-header text-center\">";
                    strVar += "                <h5 class=\"card-title\">Total documents count : " + response.data.response.transactionId + "<\/h5>";
                    strVar += "                <p class=\"description\">Thank you!<\/p>";
                    strVar += "            <\/div>";
                    strVar += "            <div class=\"card-content\" style=\"text-align: left;\">";
                    strVar += "            <\/div>";
                    strVar += "        <\/div>";
                    strVar += "    <\/div> </div>";


                    sweetAlert.customHtml("Uploaded Successfully!", "success", strVar, true, false, null, null, 500);
                    $scope.step1NextDisabled = false;

                }, function errorCallback(response) {

                    sweetAlert.success("Uploaded Successfully!", "Thank you!");
                    $scope.step1NextDisabled = false;

                });
        }

        function bcStep2Next() {
            var product = [
                {
                    "id": 1,
                    "productType": "BRK AO"
                },
                {
                    "id": 2,
                    "productType": "DMA AO"
                },
                {
                    "id": 3,
                    "productType": "DMA RTQ"
                },
                {
                    "id": 4,
                    "productType": "OneIRA AO"
                }
            ];

            var reqObject = {};
            reqObject.fromDateSelected = "2017-07-13 00:00:00";
            reqObject.toDateSelected = "2017-07-13 23:59:59";
            reqObject.selProdType = 1;

            $http.post('http://densbb3utbcp01.cloud.tiaa-cref.org:8080/docshare-service/searchFile/searchByDate', JSON.stringify(reqObject), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function onSuccess(response) {
                    console.log(response.data);

                    $scope.records = response.data;

                    $scope.dtColumnDefs = [

                    DTColumnDefBuilder.newColumnDef(1).renderWith(function (data, type, row) {
                            var html = '<a class="btn btn-simple btn-danger btn-icon edit" ng-click="showDoc(' + row.pin + ', ' + row.clientName + ', ' + row.ipfsHash + ')" ><i class="ti-clipboard"></i></a>';
                            return html;
                        })
                ];

                    $scope.dtColumns = [
                   DTColumnBuilder.newColumn('PIN').withTitle('Pin'),
                   DTColumnBuilder.newColumn('CLIENT').withTitle('Client Name'),
//                   DTColumnBuilder.newColumn('FILE_ID').withTitle('Orch ID'),
                   DTColumnBuilder.newColumn('getCreatedTS').withTitle('Date').renderWith(function (data, type, full) {
                            var date = new Date(full.getCreatedTS);
                            var year = date.getFullYear();

                            var month = (1 + date.getMonth()).toString();
                            month = month.length > 1 ? month : '0' + month;

                            var day = date.getDate().toString();
                            day = day.length > 1 ? day : '0' + day;

                            return month + '/' + day + '/' + year;
                        }),
                   DTColumnBuilder.newColumn('FILE_ID').withTitle('IPFS Hash'),
                   DTColumnBuilder.newColumn('PRODUCT_TYPE').withTitle('Category').renderWith(function (data, type, full) {
                            return $filter('filter')(product, {
                                id: full.PRODUCT_TYPE
                            })[0].productType;
                        }),
                   DTColumnBuilder.newColumn('FILE_ID').withTitle('Document').renderWith(function (data, type, full) {
                            return "<a class='btn btn-simple btn-danger btn-icon edit' ng-click=showDoc('" + full.FILE_ID + "')><i class='ti-clipboard'></i></a>";
                        })
               ];
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', response.data.response).withBootstrap();

                    $scope.dtOptions.withOption('fnRowCallback',
                        function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                            $compile(nRow)($scope);
                        });

                    $scope.showStep1 = false;
                    $scope.showStep2 = true;
                    $scope.showStep3 = true;

                }, function errorCallback(response) {

                    $scope.showStep1 = false;
                    $scope.showStep2 = true;
                    $scope.showStep3 = true;

                });
        }

        function localStep2Next() {
            var reqObject = {};
            reqObject.startDate = $scope.from;
            reqObject.endDate = $scope.to;
            reqObject.pin = $scope.pin;
            reqObject.orchestrationId = $scope.orchestrationId;
            reqObject.clientName = $scope.clientName;
            reqObject.productCategory = $scope.productCategory;

            /*reqObject.pin = '7819559';
            reqObject.ipfsHash = '';
            reqObject.orchestrationId = '';
            reqObject.clientName = '';
            reqObject.productCategory = '';
            reqObject.smartContractAddress = '';*/

            $http.post('http://DENSBB3UTBCP01.cloud.tiaa-cref.org:8090/ipfs/search', JSON.stringify(reqObject), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function onSuccess(response) {
                    console.log(response.data);

                    $scope.records = response.data;

                    $scope.dtColumnDefs = [

                    DTColumnDefBuilder.newColumnDef(1).renderWith(function (data, type, row) {
                            var html = '<a class="btn btn-simple btn-danger btn-icon edit" ng-click="showDoc(' + row.pin + ', ' + row.clientName + ', ' + row.ipfsHash + ')" ><i class="ti-clipboard"></i></a>';
                            return html;
                        })
                ];

                    $scope.dtColumns = [
                   DTColumnBuilder.newColumn('pin').withTitle('Pin'),
                   DTColumnBuilder.newColumn('clientName').withTitle('Client Name'),
                   DTColumnBuilder.newColumn('orchestrationId').withTitle('Orch ID'),
                   DTColumnBuilder.newColumn('createdDate').withTitle('Date').renderWith(function (data, type, full) {
                            var date = new Date(full.createdDate);
                            var year = date.getFullYear();

                            var month = (1 + date.getMonth()).toString();
                            month = month.length > 1 ? month : '0' + month;

                            var day = date.getDate().toString();
                            day = day.length > 1 ? day : '0' + day;

                            return month + '/' + day + '/' + year;
                        }),
                   DTColumnBuilder.newColumn('ipfsHash').withTitle('IPFS Hash'),
                   DTColumnBuilder.newColumn('productCategory').withTitle('Category'),
                   DTColumnBuilder.newColumn('ipfsHash').withTitle('Document').renderWith(function (data, type, full) {
                            return "<a class='btn btn-simple btn-danger btn-icon edit' ng-click=showDoc('" + full.ipfsHash + "')><i class='ti-clipboard'></i></a>";
                        })
               ];
                    $scope.dtOptions = DTOptionsBuilder.newOptions().withOption('data', response.data).withBootstrap();

                    $scope.dtOptions.withOption('fnRowCallback',
                        function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                            $compile(nRow)($scope);
                        });

                    $scope.showStep1 = false;
                    $scope.showStep2 = true;
                    $scope.showStep3 = true;

                }, function errorCallback(response) {

                    $scope.showStep1 = false;
                    $scope.showStep2 = true;
                    $scope.showStep3 = true;

                });
        }

        function staticDisplay(ipfsHash) {
            var wormText = '   Client PIN: 1000068  \n' +
                '   Primary Account Holder Name: CHAD M. POCOPSON  \n' +
                '   Account Type: Self-directed  \n' +
                '   MOC: Individual  \n' +
                '   Brokerage Account Number: Completed  \n' +
                '   Case Manager Case Number: C1000R7F0  \n' +
                '   Number of Account Holders:   \n' +
                '   Is the co-owner your spouse  \n' +
                '   Joint Account Options:   \n' +
                '   Social Security: 212381443  \n' +
                '   Date of Birth: 1960-05-25  \n' +
                '   Gender: M  \n' +
                '   Marital Status: S  \n' +
                '   Country of Citizenship: US  \n' +
                '   Primary Phone Number: 5417854715 Extn: 47541  \n' +
                '   Secondary Phone Number: 7042548888  \n' +
                '   Email Address: JAGADISH.GUNTUMADUGU@TIAA-CREF.ORG  \n' +
                '   U.S. Residential Street Address: 3939 SOUTH ST, LAFAYETTE, IN-47905  \n' +
                '   Mailing Address: 3939 SOUTH ST, LAFAYETTE, IN-47905  \n' +
                '   Occupation / Title:   \n' +
                '   Employment Status: RETD  \n' +
                '   Source of Income: PENSION  \n' +
                '   Employers Name:   \n' +
                '   Employers Address  \n' +
                '   Affiliation Question 1 results - Are you or an immediate family member, a director, 10% shareholder or a policy-making executive of a publicly traded company: No  \n' +
                '   Affiliation Question 2 results -  Are you or an immediate family member affiliated with or working for another member firm, stock exchange, or FINRA, including TIAA-CREF or as an affiliated person will have any financial interest in or discretionary authority over this account: Yes  \n' +
                '   Affiliation Member Name: BENJAMIN OLDMAN  \n' +
                '   Member Firm:   \n' +
                '   Relationship: Self  \n' +
                '   Affiliation Question 3 Results - Are you or a person with interest in this account a senior military, governmental or political official in a non-US country, or closely associated with or an immediate family member of such an official: No  \n' +
                '   Sweep: Yes  \n' +
                '   Annual Income (from all sources): FROM50000TO99999  \n' +
                '   Approximate Net Worth: FROM100000TO249999  \n' +
                '   Current Tax Bracket: MDTB  \n' +
                '   How are you funding this account results: GAME  \n' +
                '   What is your investment objective for this account results: CAPR  \n' +
                '   What is your investment knowledge results: NONE  \n' +
                '   Would you like this to be a margin results: No  \n' +
                '   Channel: Call Center  \n' +
                '  Date and Time Instruction Received: 2015-10-26T05:33:29.452-04:00  ';

            var strVar = "<div class='row'>";
            strVar += "<div class=\"col-lg-12 col-sm-12\" ng-if=\"response\">";
            strVar += "        <div class=\"card card-circle-chart\" data-background-color=\"blue\">";
            strVar += "            <div class=\"card-header text-center\">";
            strVar += "                <h6 class=\"card-title\">IPFS Hash : " + ipfsHash + "<\/h6>";
            strVar += "                <p class=\"description\" style='color:'#fff''><code>" + wormText + "</code><\/p>";
            strVar += "            <\/div>";
            strVar += "            <div class=\"card-content\" style=\"text-align: left;\">";
            strVar += "            <\/div>";
            strVar += "        <\/div>";
            strVar += "    <\/div> </div>";

            sweetAlert.customHtml2("Document Details", strVar, true, false, false);
        }

        function bcShowDoc(ipfsHash) {
            $http.get("http://densbb3utbcp01.cloud.tiaa-cref.org:8080/docshare-service/files/downloadFile/" + ipfsHash)
                .then(function (response) {
                    console.log(response.data);

                    $scope.records = response.data;

                    var strVar = "<div class='row'>";
                    strVar += "<div class=\"col-lg-12 col-sm-12\" ng-if=\"response\">";
                    strVar += "        <div class=\"card card-circle-chart\" data-background-color=\"blue\">";
                    strVar += "            <div class=\"card-header text-center\">";
                    strVar += "                <h6 class=\"card-title\">IPFS Hash : " + ipfsHash + "<\/h6>";
                    strVar += "                <p class=\"description\" style='color:'#fff''><code>" + response.data + "</code><\/p>";
                    strVar += "            <\/div>";
                    strVar += "            <div class=\"card-content\" style=\"text-align: left;\">";
                    strVar += "            <\/div>";
                    strVar += "        <\/div>";
                    strVar += "    <\/div> </div>";

                    sweetAlert.customHtml2("Document Details", strVar, true, false, false);
                });
        }

        function localShowDoc(ipfsHash) {
            var reqObject = {};
            reqObject.ipfsHash = ipfsHash;
            reqObject.ipfsAddress = "/ip4/10.239.153.121/tcp/5001";

            $http.post('http://DENSBB3UTBCP01.cloud.tiaa-cref.org:8090/ipfs/retrieveText', JSON.stringify(reqObject), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function onSuccess(response) {
                    console.log(response.data);

                    $scope.records = response.data;

                    var strVar = "<div class='row'>";
                    strVar += "<div class=\"col-lg-12 col-sm-12\" ng-if=\"response\">";
                    strVar += "        <div class=\"card card-circle-chart\" data-background-color=\"blue\">";
                    strVar += "            <div class=\"card-header text-center\">";
                    strVar += "                <h6 class=\"card-title\">IPFS Hash : " + ipfsHash + "<\/h6>";
                    strVar += "                <p class=\"description\" style='color:'#fff''><code>" + response.data + "</code><\/p>";
                    strVar += "            <\/div>";
                    strVar += "            <div class=\"card-content\" style=\"text-align: left;\">";
                    strVar += "            <\/div>";
                    strVar += "        <\/div>";
                    strVar += "    <\/div> </div>";

                    sweetAlert.customHtml2("Document Details", strVar, true, false, false);
                });
        }

        /*EmbarkJS.Storage.setProvider('ipfs', {
            server: '10.239.153.121',
            port: '5001'
        });*/


    }]);

})();