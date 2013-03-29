angular.module('SLIng', [])
    .directive('slingView', ['$rootScope', '$compile', '$controller', '$route', '$browser', 'transition',
function ($rootScope, $compile, $controller, $route, $browser, transition) {
    return {
        restrict: 'EA',
        link: link
    };

    function link(scope, uberEl, attrs) {
        var lastScope,
            lastElement,
            prevUrls = [],
          onloadExp = attrs.onload || '';

        //create viewing window
        uberEl.addClass('sling-uber');
        var parentEl = angular.element(document.createElement("div"));
        parentEl.addClass('sling-windowTray');
        uberEl.append(parentEl);

        scope.$on('$routeChangeSuccess', update);
        update();

        function update(toRoute, fromRoute) {
            var current = $route.current,
                locals = current && current.locals,
                template = locals && locals.$template;

            prevUrls.push($browser.url());

            if (template) {
                //##create next page
                var el = angular.element(document.createElement("div"))
                el.html(template);
                el.addClass('sling-content mb-page');
                var link = $compile(el.contents()),                    
                    controller;
                
                current.scope = scope.$new();
                if (current.controller){
                    locals.$scope = current.scope;
                    controller = $controller(current.controller, locals);
                    el.children().data('$ngControllerController', controller);
                }

                link(current.scope);
                parentEl.append(el);
                
                var isBackButton = (prevUrls.length > 2 && $browser.url() === prevUrls[prevUrls.length - 3]);
                if (isBackButton) { prevUrls.splice(prevUrls.length - 2, 2); }
                var promise = transition(el, lastElement, isBackButton);

                current.scope.$emit('$viewContentLoaded');
                current.scope.$eval(onloadExp);

                promise.then(function () {
                    //if (source) {
                    //    $rootScope.$broadcast('$pageTransitionSuccess', dest, source);
                        cleanupStatics();
                    //}
                }, function () {
                    cleanupStatics();                    
                });

                function cleanupStatics() {
                    destroyLastScope();

                    lastScope = current.scope;
                    lastElement = el;
                }
            } else {
                clearContent();
            }


        }

        function destroyLastScope() {
            if (lastScope) {
                lastScope.$destroy();
                lastScope = null;
            }

            if (lastElement) {
                lastElement.remove();
                lastElement = undefined;
            }
        }

        function clearContent() {            
            destroyLastScope();
            parentEl.html('');
        }

    }
    
}]);
