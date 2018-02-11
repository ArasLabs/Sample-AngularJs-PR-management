angular.module("app.aras.sample", [
    "app.aras.sample.data",
    "app.aras.sample.userconfig",
    "chart.js",
    'ui-notification'
])


    // API interceptor to handle user connexion
    .service('APIIntervceptor', function (userLocal, $rootScope) {
        var service = this;
        service.request = (config) => {

            var currentUser = userLocal.getCredentials()
            if (currentUser) {
                config.headers.DATABASE = currentUser.db
                config.headers.AUTHUSER = currentUser.login
                config.headers.AUTHPASSWORD = currentUser.password
            }
            return config
        }
        service.responseError = (response) => {
            if (response.status === 401) {
                $rootScope.$broadcast('unauthorized')
            }
            return response
        }
    })

    // plug the API interceptor
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('APIIntervceptor')
    })

    // initialization scripts
    .run(function () {

    })

    // controller declaration
    .controller('mainController', function ($scope, arasData, userLocal, Notification) {

        $scope.connected = false
        $scope.dataInit = ()=>{
            $scope.prs = []
            $scope.graph = { labels: [], data: [] }
            $scope.counters = []
            $scope.prSelected={}
        }

        $scope.dataInit()

        $scope.prSelect = (pr)=>{
            $scope.prSelected = pr
        }

        $scope.getPrs = () => {
            var prRequest = arasData.problemReport.get().then((data) => {
                console.log(data)
                $scope.prs = data

                //////////////////////////////////////////////////////////////
                //  Graphs generation
                //////////////////////////////////////////////////////////////


                $scope.counters = _.countBy($scope.prs, 'state')
                for (var prop in $scope.counters) {
                    $scope.graph.labels.push(prop)
                    $scope.graph.data.push($scope.counters[prop])
                }

                $scope.graph.options = {
                    legend: {
                        display: true,
                        labels: {
                            fontColor: 'rgb(255, 99, 132)'
                        }
                    }
                }
                console.log($scope.graph)
            })
        }


        $scope.addPr = ()=> {
            
            var prRequest = arasData.problemReport.add().then((data) => {
                console.log(data)
                if (data){
                    console.log(data)
                    data.open = true
                    $scope.prs.push(data)
                }
            })
        }

        $scope.removePr = (prId)=> {
            var prRequest = arasData.problemReport.delete(prId).then((data) => {
                console.log(data)
                if (!data.isError){
                    _.remove($scope.prs, {
                        id: prId
                    });
                }else {
                    Notification.error(data.error)
                }
            })
        }

        $scope.updatePr = (pr)=>{
            
            var prRequest = arasData.problemReport.patch(pr).then((data) => {
                console.log(data)
                if (!data.isError){
                    Notification.success(pr.item_number + " has been updated")
                }else {
                    Notification.error(data.error)
                }
            })
        }

        $scope.closePr=(pr)=>{
            pr.open = false
        }


        $scope.$watch('connected', (newValue, oldValue) => {
            console.log(oldValue)
            console.log(newValue)
            if (newValue) {
                $scope.getPrs()
            }
        })


        $scope.openPr = (pr) => {
            console.log(pr)
            pr.open = true
        }

        $scope.logout = () => {
            $scope.connected = false
            userLocal.removeCredentials()
            $scope.prs = []
            Notification.primary('Logged Out')
            $scope.dataInit()
        }
        
        $scope.connectionTry = () => {
            // test query (just using the problemReport query, not clean though but works for the sample)
            arasData.problemReport.get()
                .then((data) => {
                    if (data) {
                        console.log(data)
                        // if success save in localhost
                        $scope.connected = true
                    } else {
                        $scope.connected = false
                        userLocal.removeCredentials()
                        $scope.dataInit()
                    }
                })
        }

        

        $scope.connect = (db, login, password) => {
            // produce md5
            var md5Pass = md5(password)
            userLocal.saveCredentials(db, login, md5Pass)
            // test query (just using the problemReport query, not clean though but works for the sample)
            arasData.problemReport.get()
                .then((data) => {
                    if (data) {
                        console.log(data)
                        // if success save in localhost
                        $scope.connected = true
                        Notification.success(login + ' is now connected !')
                    } else {
                        $scope.connected = false
                        userLocal.removeCredentials()
                        Notification.error('Wrong credentials')
                        $scope.dataInit()
                    }
                })

        }




        // test if credentials exist => test connect => test get
        $scope.connectionTry()


    })

