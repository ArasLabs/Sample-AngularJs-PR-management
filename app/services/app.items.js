angular.module('app.aras.sample.data', [])
    .service('arasData', function ($http) {

        var arasData = this,
            URLs = {
                PR: "../Server/odata/PR"
            }

        // Service for Problem Report
        arasData.problemReport = {
            add: (pr) => {
                return $http.post(URLs.PR, pr).then((result) => {
                    if (result.data) {
                        console.log(result)
                        return result.data
                    } else {
                        var answer = { isError: true }
                        if (result.data.error) {
                            answer.error = result.data.error.message
                        }
                        return answer
                    }
                })
            },
            get: (searchQuery) => {

                return $http.get(URLs.PR)
                    .then((result) => {
                        if (result.data) {
                            console.log(result)
                            return result.data.value
                        } else {
                            console.log(result)
                            return false
                        }
                    })
            },
            patch: (pr) => {
                console.log(URLs.PR + "('" + pr.id + "')")
                console.log(pr)
                return $http.patch(URLs.PR + "('" + pr.id + "')", pr)
                    .then((result) => {
                        console.log(result)
                        if (result.status == 200) {
                            var answer = { isError: false, data: result.data }
                            return answer
                        } else {
                            var answer = { isError: true }
                            if (result.data.error) {
                                answer.error = result.data.error.message
                            }
                            return answer
                        }
                    })
            },
            delete: (prId) => {
                return $http.delete(URLs.PR + "('" + prId + "')")
                    .then((result) => {
                        console.log(result)
                        if (result.status == 204) {
                            var answer = { isError: false, data: result.data }
                            return answer
                        } else {
                            var answer = { isError: true }
                            if (result.data.error) {
                                answer.error = result.data.error.message
                            }
                            return answer
                        }
                    })
            }
        }
    })