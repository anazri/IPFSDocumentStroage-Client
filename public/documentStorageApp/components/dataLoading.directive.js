(function () {
    'use strict';

    angular
        .module('myApp')
        .directive('loading', loading);

    // 
    //
    loading.$inject = ['$http'];

    function loading($http) {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        //
        function link(scope, element, attrs) {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (value) {
                if (value) {
                    element.removeClass('ng-hide');
                } else {
                    element.addClass('ng-hide');
                }
            });
        }
    }



})();