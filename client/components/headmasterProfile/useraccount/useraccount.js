import {app} from '/client/app.js';

import Profiles from '/imports/models/profiles.js';

class UseraccountCtrl{

  constructor($scope, $timeout, $mdSidenav, $element, $log, $mdDialog, $state, $q, $mdToast, $rootScope){
      'ngInject';

      $scope.profileID = $rootScope.profileID;

      $scope.branchID = $rootScope.branchID;
      $scope.subBranchID = $rootScope.branchID;
      $scope.myBranch = $rootScope.branchID;

      $scope.show = false;

      $scope.subscribe('profiles2', function () {
          return [$scope.getReactively('profileID')];
      });

      $scope.subscribe('users');

      $scope.helpers({
          profiles(){
            var profileID = $scope.getReactively('profileID');
            var selector = {profiles_userID : profileID};
            var profiles = Profiles.find(selector);
            var roleName = '';
            console.info('profiles', profiles);
            profiles.forEach(function(profile) {
              $scope.rolesID = profile.profiles_userroleID;
            });
            return profiles;
          },
          totalProfiles(){
            var branchID = $scope.branchID;
            var type = 'Non-teaching staff';
            var selector = {profiles_branchID: branchID, $and: [{profiles_type: type}]};
            var profiles = Profiles.find(selector);
            var count = profiles.count();
            return count;
          }
      })//helpers

      var last = {
        bottom: true,
        top: false,
        left: true,
        right: false
      };

      $scope.toastPosition = angular.extend({},last);

      $scope.openProfile2 = function (selected2) {
        console.info('selected:', selected2[0].profiles_userID);
        var profileID = selected2[0].profiles_userID;
        $state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
      }

      $scope.getToastPosition = function() {
        sanitizePosition();

        return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
      };

      function sanitizePosition() {
        var current = $scope.toastPosition;

        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;

        last = angular.extend({},current);
      }


      $scope.editNow = function(){
        $scope.show = !$scope.show;
        console.info('userID', $scope.profileID);
        var profileID = $scope.profileID;
        var selector = {profiles_userID: profileID};
        $scope.results = Profiles.findOne(selector);
      }


        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.updateUser = function(results) {
          $scope.done = true;
          $scope.show = !$scope.show;
          console.log('daan dito');


        }
          //$state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
    }
}

app.component('useraccount', {
    templateUrl: 'client/components/headmasterProfile/useraccount/useraccount.html',
    controllerAs: 'useraccount',
    controller: UseraccountCtrl,
    transclude: true
})
