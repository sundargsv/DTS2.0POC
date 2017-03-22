'use strict';

/* Controllers */


app.controller('CustomerSearchCtrl', CustomerSearchCtrl);
app.controller('CustomerCreateCtrl', CustomerCreateCtrl);
app.controller('CustomerViewCtrl', CustomerViewCtrl);

  // Customer controller - Search
/** @ngInject */
 function CustomerSearchCtrl($scope, $filter, CustomerService) {
  //  Search Criteria
  $scope.searchCustomer = {};
  $scope.searching = false;
  $scope.error = false;
  CustomerService.displayCheck();
  $scope.smartTablePageSize = 10;
    //Customer model
    //  $scope.smartTableData = {
    //    id:null,
    //    name:'',
    //    contact:'',
    //    email:''
    //  };
    //


    $scope.searchCriteria = {
        "message" : "0",
        "status"  : "10"
    };
    $scope.startIndex = 0;
    $scope.itemsByPage = 5;
    $scope.smartTableData = [];

    $scope.callServer = function callServer(tableState) {
    //console.log("callServer");
    $scope.error = false;
    $scope.isLoading = true;
    $scope.numberOfPagesUI;

    var pagination = tableState.pagination;

    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
    var number = pagination.number || 10;  // Number of entries showed per page.

    $scope.searchCriteria.message = start;
    $scope.searchCriteria.status = number;

    console.log("Start "+$scope.searchCriteria.message);

    CustomerService.fetchAllCustomer($scope.searchCriteria).then(function (result) {
      $scope.smartTableData = result[0];
      if(start == 0){
        console.log(start);
        tableState.pagination.numberOfPages = Math.ceil(result[1].status / 10);//set the number of pages so the pagination can update
        $scope.numberOfPagesUI = Math.ceil(result[1].status / 10);
      }else{
        tableState.pagination.numberOfPages = $scope.numberOfPagesUI;
      }
      $scope.isLoading = false;
    });
  };

  $scope.customSearch = function customSearch(id, name){
    $scope.searching = true;
    $scope.isLoading = true;
    if(id != null || name != null){
      $scope.searchQuery = 'id=&name=';
      if(id == undefined){
        id = "";
      }if(name == undefined){
        name = "";
      }
      $scope.searchQuery = 'id='+id+'&name='+name;
      $scope.searching = false;
      console.log("Request sent to server");
      CustomerService.fetchCustomerBasedCriteria($scope.searchQuery).then(function (result) {
          console.log(result);
        if(result != null){

          $scope.smartTableData = result;
          $scope.error = false;
        }else{
            console.log("Nothing found");
            $scope.searchCustomer.id = '';
            $scope.searchCustomer.name = '';
            $scope.error = true;
        }

        //$scope.smartTableData = result;
        $scope.searching = false;
        $scope.isLoading = false;
      });
      //console.log($scope.searchQuery);

    }else{
      $scope.searching = false;
      $scope.isLoading = false;
    }

  };

    $scope.editableTableData = $scope.smartTableData.slice(0, 36);

    // editableOptions.theme = 'bs3';
    // editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    // editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';


}

// Customer controller - Create
/** @ngInject */
 function CustomerCreateCtrl($scope, $filter, CustomerService) {
   console.log("Customer Create ctrl called");
   var vm = this;

   // Customer Model - start
     vm.customer = {
         "type"     :"customer",
          "enabled" :true,
          "name"    : "",
          "version" :0
          ,

          "customerAddress" :
          {
            "cityName"  : "",
            "country"   : "",
            "streetName": "",
            "zipCode"   : "",
            "houseNumber": "",
            "houseNumberExtension": ""
          },

          "contactPerson":
          {
            "initials":"",
            "salutation":"",
            "surname":"",
            "surnamePrefix":"",
            "department":"",
            "contactNumber":"",
            "faxNumber":"",
            "title":""

        },

        "billingAddress":
        {
          "cityName": "",
          "country": "",
          "houseNumber": "",
          "houseNumberExtension": "",
          "streetName": "",
          "zipCode": ""

        },

        "email": ""
     }
     // End - Customer Model


   vm.email = "gsv";
   vm.personalInfo = {};
   vm.organizationDetails = {};
   vm.customerAddress = {};
   vm.customerAddress.city = {};
   vm.billingAddress = {};
   vm.billingAddress.city = {};
   vm.sameAsCustomerAddressChk = false;
   vm.savedStatus;
   vm.savedError;
   vm.saving;
   vm.savedMsg = "";
   vm.personalInfo.titleItems = [
     {
      id: 1,
      value: 'Mr.'
     }, {
      id: 2,
      value: 'Mrs.'
     }, {
      id: 3,
      value: 'Miss.'
     },
   ];
   vm.personalInfo.titleSelected = vm.personalInfo.titleItems[0];
   vm.personalInfo.middleName = "";

   vm.step1Submit = function(isValid) {
     // check to make sure the form is completely valid
    if (isValid) {
      console.log("Valid step-1 form");
      // console.log(vm.personalInfo.titleSelected);
      // console.log(vm.personalInfo.firstName);
      // console.log(vm.personalInfo.middleName);
      // console.log(vm.personalInfo.lastName);
      vm.customer.contactPerson.title = vm.personalInfo.titleSelected.value;
      vm.customer.name = vm.personalInfo.firstName;
      vm.customer.contactPerson.surnamePrefix = vm.personalInfo.middleName;
      vm.customer.contactPerson.surname = vm.personalInfo.lastName;
    }

    };
    vm.organizationDetails.faxNumber = "";
    vm.step2Submit = function(isValid) {
      // check to make sure the form is completely valid
       if (isValid) {
         console.log("Valid step-2 form");
        //  console.log(vm.organizationDetails.department);
        //  console.log(vm.organizationDetails.email);
        //  console.log(vm.organizationDetails.contactNumber);
        //  console.log(vm.organizationDetails.faxNumber);
         vm.customer.contactPerson.department = vm.organizationDetails.department;
         vm.customer.email = vm.organizationDetails.email;
         vm.customer.contactPerson.contactNumber = vm.organizationDetails.contactNumber;
         vm.customer.contactPerson.faxNumber = vm.organizationDetails.faxNumber;

      }

     };

     vm.step3Submit = function(isValid) {
       // check to make sure the form is completely valid
        if (isValid) {
          console.log("Valid step-3 form");
          // console.log(vm.customerAddress.houseNumber);
          // console.log(vm.customerAddress.street);
          // console.log(vm.customerAddress.city);
          // console.log(vm.customerAddress.country);
          // console.log(vm.customerAddress.zipCode);
          vm.customer.customerAddress.houseNumberExtension = "";
          vm.customer.customerAddress.houseNumber = vm.customerAddress.houseNumber;
          vm.customer.customerAddress.streetName = vm.customerAddress.street;
          vm.customer.customerAddress.cityName = vm.customerAddress.city.name;
          vm.customer.customerAddress.country = vm.customerAddress.country;
          vm.customer.customerAddress.zipCode = vm.customerAddress.zipCode;
       }

      };

      vm.sameAsCustomerAddress = function() {
        console.log(vm.sameAsCustomerAddressChk);
        if(vm.sameAsCustomerAddressChk){
          vm.billingAddress.houseNumber = vm.customerAddress.houseNumber;
          vm.billingAddress.street = vm.customerAddress.street;
          vm.billingAddress.city.name = vm.customerAddress.city.name;
          vm.billingAddress.state = vm.customerAddress.state;
          vm.billingAddress.country = vm.customerAddress.country;
          vm.billingAddress.zipCode = vm.customerAddress.zipCode;

          console.log("Same as customer address");
        }else {
          vm.billingAddress.houseNumber = '';
          vm.billingAddress.street = '';
          vm.billingAddress.city.name = '';
          vm.billingAddress.state = '';
          vm.billingAddress.country = '';
          vm.billingAddress.zipCode = '';
        }

      };


      vm.step4Submit = function(isValid) {

        // check to make sure the form is completely valid
         if (isValid) {
           console.log("Valid step-4 form");
          //  console.log(vm.billingAddress.houseNumber);
          //  console.log(vm.billingAddress.street);
          //  console.log(vm.billingAddress.city);
          //  console.log(vm.billingAddress.country);
          //  console.log(vm.billingAddress.zipCode);
           vm.customer.billingAddress.houseNumberExtension = "";
           vm.customer.billingAddress.houseNumber = vm.billingAddress.houseNumber;
           vm.customer.billingAddress.streetName = vm.billingAddress.street;
           vm.customer.billingAddress.cityName = vm.billingAddress.city.name;
           vm.customer.billingAddress.country = vm.billingAddress.country;
           vm.customer.billingAddress.zipCode = vm.billingAddress.zipCode;
           console.log(vm.customer.billingAddress.cityName);
        }else{
          console.log("not valid");
        }
        // console.log(vm.customer);
        vm.saving = true;
        vm.savedError = false;
        CustomerService.saveCustomer(vm.customer).then(function (result) {
          vm.savedMsg = result.message;
          if(result.status){
            vm.savedStatus = true;
          }else{
            vm.savedError = true;
            vm.savedStatus = false;

          }

        });
       };
 }
function CustomerViewCtrl($rootScope, $scope, $state, $stateParams, editableOptions, CustomerService, $localStorage, $sessionStorage, $window){


  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

  var vm = this;
  vm.customer = {};
  vm.personalInfo = {};
  vm.personalInfo.titleSelected;
  vm.customerUI = {};
  vm.customerUI.state = "";
  vm.changedFlag = false;
  vm.customer = $rootScope.$stateParams.item;
  //console.log(vm.customer);
  if(vm.customer == undefined || vm.customer == null){
    vm.customer = $sessionStorage.customerModified;
    // console.log($sessionStorage.customerModified);
  }else{
    $sessionStorage.customerModified = vm.customer;
  }
  vm.savedStatus;
  vm.savedError;
  vm.saving = false;
  vm.modified = false;
  vm.savedMsg = "";
  //console.log($rootScope.$stateParams.item.id);
  $scope.msg = "Route works";
  console.log(vm.customer.contactPerson.title);
//   vm.titleItems = [
//       {
//        id: 1,
//        value: 'Mr.'
//       }, {
//        id: 2,
//        value: 'Mrs.'
//       }, {
//        id: 3,
//        value: 'Miss.'
//       },
//   ];
//
//   vm.statuses = [
//   {value: 1, text: 'status1'},
//   {value: 2, text: 'status2'},
//   {value: 3, text: 'status3'},
//   {value: 4, text: 'status4'}
// ];
//
// vm.changeTitle = function() {
//   vm.customer.contactPerson.title = vm.customer.contactPerson.title;
// };

  //vm.personalInfo.titleSelected = vm.personalInfo.titleItems[0];

  // $scope.showStatus = function() {
  //   var selected = $filter('filter')(vm.personalInfo.titleItems, {value: vm.customer.contactPerson.title});
  //   return (vm.customer.contactPerson.title && selected.length) ? selected[0].text : 'Not set';
  // };

  vm.submitEditCustomer = function() {
    vm.saving = true;
    vm.savedError = false;
    CustomerService.saveCustomer(vm.customer).then(function (result) {
      vm.savedMsg = result.message;
      if(result.status){
        vm.savedStatus = true;
        vm.modified = true;
      }else{
        vm.savedError = true;
        vm.savedStatus = false;

      }

    });
  }

  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}
