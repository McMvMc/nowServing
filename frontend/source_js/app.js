var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services', '720kb.datepicker', 'ngDialog']);
 
app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'partials/home.html',
    controller: 'HomeCtrl'
  }).
  when('/user/portfolio/:id', {
    templateUrl: 'partials/portfolio.html',
    controller: 'PortfolioCtrl'
  }).    

  // logged in
  when('/user/edit/:id', {
    templateUrl: 'partials/edit_portfolio.html',
    controller: 'EditPortfolioCtrl'
  }).    
  when('/user/:id', {
    templateUrl: 'partials/queue.html',
    controller: 'QueueCtrl'
  }).
  when('/newrequest/:id', {
    templateUrl: 'partials/newRequest.html',
    controller: 'NewRequestCtrl'
  }).
  otherwise({
    redirectTo: '/'
  });

/*  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
*/
}]);

app.run(function($rootScope){
    $rootScope.$apply($(document).foundation());
});