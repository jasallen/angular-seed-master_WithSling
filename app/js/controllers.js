'use strict';

/* Controllers */


function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2($scope, $rootScope) {
    $rootScope.recs = "12 inch Subway Melt" ;
    //$scope.recs = $roo.recs;

    $scope.update = function(rec)
    {
        $rootScope.recs = rec;
    }
}
//MyCtrl2.$inject = [];

function RecommendCtrl($scope) {
 

}
//RecommendCtrl.$inject = [];
