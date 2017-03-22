//--Start CustomerFactory--//
/**
 * @author Sundar GSV
 * created on 07.03.2017
 */

'use strict';
app.factory('CustomerService', ['$http', '$q', function($http, $q){

      var REST_SERVICE_URI = 'http://192.168.1.227:8887/DTSAPI/webapi/DTS';
     //var REST_SERVICE_URI = 'http://58.68.10.77:8887/DTSAPI/webapi/DTS';

    //var REST_SERVICE_URI = 'jsons/customer.json';
     var factory = {
             fetchAllCustomer: fetchAllCustomer,
             fetchCustomerBasedCriteria : fetchCustomerBasedCriteria,
             saveCustomer    : saveCustomer,
             displayCheck    : displayCheck
      };

            return factory;

            function fetchAllCustomer(searchCriteria) {
                console.log("fetchAllCustomer called " +searchCriteria.message);
                var deferred = $q.defer();
                $http.post(REST_SERVICE_URI + '/CustomerSearchWithLimit', searchCriteria)
                    .then(
                    function (response) {
                         console.log(response.data);
                        deferred.resolve(response.data);


                    },
                    function(errResponse){
                        console.error('Error while fetching Customer Details');
                        deferred.reject(errResponse);
                    }
                );
                return deferred.promise;
            }

            function fetchCustomerBasedCriteria(searchQuery) {
                console.log("fetchCustomerBasedCriteria called " +searchQuery);
                var deferred = $q.defer();
                $http.get(REST_SERVICE_URI + '/CustomerSearchWithCondition?' + searchQuery)
                    .then(
                    function (response) {
                         console.log(response.data);
                        deferred.resolve(response.data);


                    },
                    function(errResponse){
                        console.error('Error while fetching Customer Details');
                        deferred.reject(errResponse);
                    }
                );
                return deferred.promise;
            }

            function saveCustomer(customer) {
                console.log("saveCustomer called");
                var deferred = $q.defer();
                $http.post(REST_SERVICE_URI + '/createCustomer', customer)
                    .then(
                    function (response) {
                         console.log(response.data);
                        deferred.resolve(response.data);


                    },
                    function(errResponse){
                        console.error('Error while creating Customer');
                        deferred.reject(errResponse);
                    }
                );
                return deferred.promise;
            }


            function displayCheck(){
              console.log("service called");
            }
}]);

//--End CustomerFactory--//
