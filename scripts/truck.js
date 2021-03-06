(function (window) {
    'use strict';
    var App = window.App || {};
    class Truck {
        constructor(truckId, db) {
            console.log('running the Truck function');
            this.truckId = truckId;
            this.db = db;
        }
        createOrder(order) {
            console.log('Adding order for ' + order.emailAddress);
            return this.db.add(order.emailAddress, order);
        }
        deliverOrder(customerId) { 
            console.log('Delivering order for ' + customerId);
            return this.db.remove(customerId);
        }
         printOrders(printfn) {
             if(this.db.serverURL !== "firebase"){
                return this.db.getAll()
                .then(function (orders) {
                    if(orders!==null){
                    var customerIdArray = Object.keys(orders);
                    
                    console.log(`Truck #${this.truckId} has pending orders:`);
                    customerIdArray.forEach(function(id) {
                        console.log(orders[id]);
                        if (printfn) { 
                            printfn(orders[id]);
                        }
                    }.bind(this));
            }}.bind(this));
            }else {
                return this.db.getAll().then((data) => {
                    if(data!== null){
                        var customerIdArray = Object.keys(data);
                    
                        customerIdArray.forEach(function(id){
                            if(printfn){
                                printfn(data[id]);
                            }
                        })
                }
                });
            }
            ;} 
    }
    App.Truck = Truck;
    window.App = App;
    
})(window);