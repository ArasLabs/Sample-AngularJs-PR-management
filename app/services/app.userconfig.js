angular.module('app.aras.sample.userconfig', [])
    .service('userLocal', function($window)  {
        var userLocal = this
        userLocal.saveCredentials = (db,login,pass)=>{
            var arasCreds = [db,login,pass]
            $window.localStorage['arasCreds'] = arasCreds.join("///")
        }
        userLocal.removeCredentials = ()=>{
            $window.localStorage.removeItem('arasCreds')
        }
        userLocal.getCredentials = (token)=>{
            var arasCreds = $window.localStorage['arasCreds']
            var arasCredsObj = arasCreds.split("///")

            return {
                db: arasCredsObj[0],
                login: arasCredsObj[1],
                password: arasCredsObj[2]
            }
        }
    })