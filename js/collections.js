var app = app || {};

var FoodList = Backbone.Collection.extend({
  model: app.FoodItem,
  localStorage: new Backbone.LocalStorage('food-backbone')
});


app.FoodList = new FoodList();