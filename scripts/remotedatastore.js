(function (window) {
    'use strict';
    var App = window.App || {};
    var $ = window.jQuery;
    var form = document.querySelector('.myForm');
    class RemoteDataStore {

        constructor(url) {
            console.log('running the DataStore function');
            if (!url) {
                throw new Error('No remote URL supplied.');
            }
            this.serverURL = url;
        }
        ajaxposthelper(type, url, val) {
            return $.ajax({
                type: type,
                url: url,
                contentType: 'application/json',
                data: JSON.stringify(val),
                success: function (response) {
                    console.log('function returned: ' + JSON.stringify(response));
                }
            });
        }
        ajaxhelper(type, url, cb) {
            return $.ajax({
                type: type,
                url: url,
                contentType: 'application/json',
                success: function (response) {
                    console.log('function returned: ' + JSON.stringify(response));
                    if (cb !== undefined) {
                        cb(response);
                    }
                }
            });
        }
        add(key, val) {
            if (this.serverURL !== "firebase") {
                return this.ajaxposthelper('POST', this.serverURL, val);
            } else {
                return firebase.firestore().collection("orders").doc(form.emailAddress.value).set({
                    coffee: form.coffee.value,
                    emailAddress: form.emailAddress.value,
                    size: form.size.value,
                    flavor: form.flavor.value,
                    strength: form.strength.value
                })
            }
        }
        get(key, cb) {
            return this.ajaxhelper('GET', this.serverURL + '/' + key, cb);
        }

        getAll(cb) {
            if (this.serverURL !== "firebase") {
                return this.ajaxhelper('GET', this.serverURL, cb);
            } else {
                return firebase.firestore().collection("orders").get().then((snapshot) => {
                    var coffeeOrder = [];
                    snapshot.forEach((doc) => {
                        console.log(doc.data())
                        coffeeOrder.push(doc.data());

                    })
                    return coffeeOrder;

                })
            }
        }
        remove(key) {
            if (this.serverURL !== "firebase") {
                return this.ajaxhelper('DELETE', this.serverURL + '/' + key);
            } else {
                return firebase.firestore().collection("orders").doc(key).delete();
            }
        }
    }
    App.RemoteDataStore = RemoteDataStore;
    window.App = App;

})(window);