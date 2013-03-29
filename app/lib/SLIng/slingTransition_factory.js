angular.module('SLIng2', [])
    .factory('transition', ['$q', '$rootScope',
function ($q, $rootScope) {


    return function transition(next, prev, isReversed) {

        var direction = ['', ' sl-backbutton']
            , reverseclass = direction[isReversed ? 1 : 0];
       
        var deferred = $q.defer();

        if (prev) {
            var nextClasses = 'mb-slide mb-in' + reverseclass
            next.addClass(nextClasses);

            var prevClasses = 'mb-slide mb-out' + reverseclass;
            prev && prev.addClass(prevClasses);

            var boundElement;
            (boundElement = next).bind('webkitAnimationEnd', done);
        }
        else { deferred.resolve(); }

        deferred.promise.then(function () {
            boundElement && boundElement.unbind('webkitAnimationEnd', done);
            nextClasses && next.removeClass(nextClasses);
            prevClasses && prev && prev.removeClass(prevClasses);
        });

        return deferred.promise;

        function done() {
            $rootScope.$apply(function () {
                deferred.resolve();
            });
        }
    };

}]);