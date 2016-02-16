var app = app || {};

app.Food = Backbone.Model.extend({
  defaults: {
    name: '',
    calories: 0,
    quantity: 0,
  }
});

