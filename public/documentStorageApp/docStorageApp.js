angular
    .module('myApp', ['ui.router', 'jkuri.datepicker', 'datatables', 'datatables.bootstrap'])
    /*.factory('responseObserver', function responseObserver($q, $window) {
        return {
            'responseError': function (errorResponse) {
                switch (errorResponse.status) {
                case 403:
                    $window.location = './403.html';
                    break;
                case 500:
                    $window.location = './500.html';
                    break;
                }
                return $q.reject(errorResponse);
            }
        };
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('responseObserver');
        $httpProvider.defaults.headers.common = {};
        $httpProvider.defaults.headers.post = {};
        $httpProvider.defaults.headers.put = {};
        $httpProvider.defaults.headers.get = {};
        $httpProvider.defaults.headers.patch = {};
    });*/





var myApp = angular.module('myApp');

myApp.config(function ($stateProvider, $urlRouterProvider) {

    console.log("app config");
    $urlRouterProvider.when('/', ['$state', function ($state) {
        $state.go('docStroage');
    }]);
    $urlRouterProvider.otherwise('/');

    var docStroage = {
        name: 'docStroage',
        url: '/docStroage',
        controller: 'DocStroageController',
        templateUrl: 'index.html',
        resolve: {
            greeting: function ($q, $timeout) {
                var deferred = $q.defer();
                $timeout(function () {
                    deferred.resolve('Hello!');
                }, 1000);
                return deferred.promise;
            }
        }
    };

});