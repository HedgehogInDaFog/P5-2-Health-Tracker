var app = app || {};

app.FoodList = Backbone.Collection.extend({

  initialize: function(models, options) {
    this.date = options.date;
    this.url = "https://burning-heat-7242.firebaseio.com/" + this.date;
  },

  model: app.Food,

  totalCalories: function() {
    var sum = 0;
    var len = this.models.length;
    for (var i=0; i<len; i++) {
      sum += this.models[i].get('calories')*this.models[i].get('quantity');
    }
    return sum;
  }

});

app.SearchList = Backbone.Collection.extend({

  model: app.Search,
});



/*simple working example
var mod1 = new app.Food();
var mod2 = new app.Food({
                      name: '1',
                      calories: 10,
                      quantity: 30,
                    });
var mod3 = new app.Food();
app.FoodList1 = new app.FoodList([mod1, mod2], {date : '27091987'});
console.log(JSON.stringify(app.FoodList1.toJSON()));

app.FoodList1.add(mod3);
console.log(JSON.stringify(app.FoodList1.toJSON()));

console.log(app.FoodList1.url);
console.log(app.FoodList1.totalCalories());
*/