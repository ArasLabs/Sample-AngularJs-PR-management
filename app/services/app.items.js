angular.module('app.aras.sample.data', [])
    .service('arasData', function($http)  {

        var arasData = this,
         URLs = {
            PR: "../Server/odata/PR"
        }

        // Service for Problem Report
        arasData.problemReport = {
            add: (pr) => {
                return $http.post(URLs.PR, pr).then((result) => {
                    return result.data
                })
            },
            get: (searchQuery) => {

                return $http.get(URLs.PR)
                .then((result) => {
                    if (result.data){
                        console.log(result)
                        return result.data.value
                    }else {
                        console.log(result)
                        return false
                    }
                })
            },
            put: (pr) => {

            },
            delete: (prId) => {

            }
        }
    })