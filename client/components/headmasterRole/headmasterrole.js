import {app} from '/client/app.js';

import Branches from '/imports/models/branches.js';

//import Users from '/imports/models/users.js';

class HeadmasterroleCtrl{

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
      $scope.searchTexts = null;
      $scope.partyID = null;
      $scope.deletedNow = false;
      $scope.deletedNows = false;
      $scope.done = false;
      $scope.existing = false;

      $scope.subscribe('branches', function () {
          return [$scope.getReactively('searchTexts')];
      });

      $scope.helpers({
        branches() {
              $scope.promise = $timeout(function(){

              }, 2000);
              var limit = parseInt($scope.getReactively('perPage'));
              var skip  = parseInt(( $scope.getReactively('page')-1 )* $scope.perPage);
              var sort  = $scope.getReactively('sort');
              var selector = {};
              var branches = Branches.find(
                    selector, { limit: limit, skip: skip, sort: {branches_city: sort} }
                );
              return branches;
      },
        totalBranches(){
            var branch = 'branch';
            var selector = {branches_type: branch};
            return Branches.find(selector).count();
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

            Meteor.call('deleteSchoolFromAdmin', userDel, function(err, userDel) {
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
          templateUrl: 'client/components/headmaster/branchschools/delete.html',
          targetEvent: $event
        });
        };

        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.openSchool = function (selected) {
          console.info('selected:', selected[0]._id);
          var branchID = selected[0]._id;
          $state.go('Headmasterschool', {stateHolder : 'Headmaster', userID : Meteor.userId(), branchID : branchID});
        }

        $scope.openRole = function () {
          $state.go('Headmasterrole', {stateHolder : 'Headmaster', userID : Meteor.userId()});
        }

        $scope.openResp = function () {
          $state.go('Headmasterresp', {stateHolder : 'Headmaster', userID : Meteor.userId()});
        }


        $scope.hidden = false;
        $scope.isOpen = false;
        $scope.hover = false;
        // On opening, add a delayed property which shows tooltips after the speed dial has opened
        // so that they have the proper position; if closing, immediately hide the tooltips
        $scope.$watch('demo.isOpen', function(isOpen) {
          if (isOpen) {
            $timeout(function() {
              $scope.tooltipVisible = $scope.isOpen;
            }, 600);
          } else {
            $scope.tooltipVisible = $scope.isOpen;
          }
        });

        $scope.items = [
          { name: "Add user roles", icon: "../../assets/img/white_roleadd24.svg", direction: "left" }
        ];


        $scope.openDialog2 = function($event, item) {
          // Show the dialog

          $mdDialog.show({
            clickOutsideToClose: false,
            escapeToClose: true,
            controller: function($mdDialog) {
              // Save the clicked item
              $scope.FABitem = item;
              // Setup some handlers
              $scope.close = function() {
                $mdDialog.cancel();
              };
            },
            controllerAs: 'headmastercreaterole',
            controller: HeadmasterroleCtrl,
            template: '<headmastercreaterole></headmastercreaterole>',
            targetEvent: $event
          });
      }




      // On opening, add a delayed property which shows tooltips after the speed dial has opened
      // so that they have the proper position; if closing, immediately hide the tooltips
    }
}

app.component('headmasterrole', {
    templateUrl: 'client/components/headmasterRole/headmasterrole.html',
    controllerAs: 'headmasterrole',
    controller: HeadmasterroleCtrl,
    transclude: true
})
