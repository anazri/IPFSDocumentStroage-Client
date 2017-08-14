(function () {
    'use strict';

    angular
        .module('myApp')
        .directive('ngFileModel', ngFileModel);

    // 
    //
    ngFileModel.$inject = ['$parse'];

    function ngFileModel($parse) {
        var directive = {
            restrict: 'A',
            link: link
        };

        return directive;

        //
        function link(scope, element, attrs) {
            var model = $parse(attrs.ngFileModel);
            var isMultiple = attrs.multiple;
            var modelSetter = model.assign;
            element.bind('change', function () {
                var values = [];
                angular.forEach(element[0].files, function (item) {
                    var value = {
                        // File Name 
                        name: item.name,
                        //File Size 
                        size: item.size,
                        //File URL to view 
                        url: URL.createObjectURL(item),
                        // File Input Value 
                        _file: item
                    };
                    values.push(value);
                });
                scope.$apply(function () {
                    if (isMultiple) {
                        modelSetter(scope, values);
                    } else {
                        modelSetter(scope, values[0]);
                    }
                });
            });
        }
    }



})();