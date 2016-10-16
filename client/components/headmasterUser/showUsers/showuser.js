import {app} from '/client/app.js';

//import Users from '/imports/models/users.js';

class ShowuserCtrl{

  constructor($scope, $timeout, $mdSidenav, $log, $mdDialog, $state, $q){
      'ngInject';

      $scope.selected = [];
      $scope.itemNow = [];

      console.log('pass');

      $scope.email = {
        address: ''
      };

      $scope.query = {
          order: 'createdAt'
        };

      $scope.perPage = 10;
      $scope.page = 1;
      $scope.sort = -1;
      $scope.searchText = null;
      $scope.partyID = null;
      $scope.deletedNow = false;
      $scope.deletedNows = false;
      $scope.done = false;
      $scope.existing = false;

      $scope.subscribe('users', function () {
        $scope.promise = $timeout(function(){

        }, 2000);      
          return [$scope.getReactively('searchText')];
      });

      $scope.helpers({
          users() {
                $scope.promise = $timeout(function(){

                }, 2000);
                var limit = parseInt($scope.getReactively('perPage'));
                var skip  = parseInt(( $scope.getReactively('page')-1 )* $scope.perPage);
                var sort  = $scope.getReactively('sort');
                var selector = {};
                var users = Meteor.users.find(
                      selector, { limit: limit, skip: skip, sort: {createdAt: sort} }
                  );
                return users;
        },
        totalUsers(){
            return Meteor.users.find().count();
        }
      })//helpers

      $scope.pageChange = function (newPageNumber) {
          $scope.page = newPageNumber;
      };

      $scope.filterShow = function(){
        $scope.filter.show = !$scope.filter.show;
      }

      $scope.changeSort = function () {
          $scope.sort = parseInt($scope.sort*-1);
      }

      $scope.closeFilter = function(){
        $scope.filter.show = !$scope.filter.show;
        $scope.searchText = '';
      }

      $scope.removeUser = function(userDel) {
        console.info('userid', $scope.selected);
        if(userDel){
          var idNow = $scope.selected[0]._id;
          Meteor.users.remove({_id: idNow});
          $scope.deletedNow = false;
          $scope.deletedNows = false;
          $scope.done = false;
          $scope.existing = false;
        }
        else{

          console.info('2', userDel);
        }

        }

      $scope.$watch('searchText', function (newValue, oldValue) {
        if(!oldValue) {
          bookmark = $scope.page;
        }

        if(newValue !== oldValue) {
          $scope.page = 1;
        }

        if(!newValue) {
          $scope.page = bookmark;
        }
      });

      $scope.openDialog = function ($event, selected) {
          $scope.userDel = selected[0]._id;
          console.info('userid', $scope.userDel );
          var userDel = $scope.userDel;
          $mdDialog.show({
          clickOutsideToClose: false,
          escapeToClose: true,
          transclude: true,
          locals:{
            userDel : $scope.userDel
          },
          controller: function($scope, $mdDialog, userDel){
            $scope.userDel = userDel;
            $scope.deletedNow = false;
            $scope.existing = false;
            $scope.done = false;

            $scope.removeuserNow = function(userDel) {

            $scope.done = true;
            $scope.deletedNow = !$scope.deletedNow;

            Meteor.call('deleteUserFromAdmin', userDel, function(err, userDel) {
                      if (err) {
                          //do something with the id : for ex create profile
                          $scope.done = false;
                          $scope.deletedNow = !$scope.deletedNow;
                          $scope.existing = true;
                          window.setTimeout(function(){
                            $scope.$apply();
                        },2000);
                        //UserProfile.insert({
                            //user: userId
                       //})
                     } else {
                       //simulation purposes
                         $scope.deletedNows = !$scope.deletedNows;
                         $scope.done = false;
                         window.setTimeout(function(){
                         $scope.$apply();
                       },2000);
                     }
                  });
              }

              $scope.cancelNow = function() {
                $mdDialog.cancel();
              };


          },
          templateUrl: 'client/components/headmasterUser/showUsers/deleteuser.html',
          targetEvent: $event
        });
        };

        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.openProfile = function (selected) {
          console.info('selected:', selected[0]._id);
          var profileID = selected[0]._id;
          $state.go('Headmasterprofile', {stateHolder : 'Headmaster', userID : Meteor.userId(), profileID : profileID});
        }



      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
    }
}

app.component('showuser', {
    templateUrl: 'client/components/headmasterUser/showUsers/showuser.html',
    controllerAs: 'showuser',
    controller: ShowuserCtrl,
    transclude: true
})
