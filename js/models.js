var app = app || {};

app.Food = Backbone.Model.extend({
  defaults: {
    name: '',
    calories: 0,
    quantity: 0,
  }
});

app.Search = Backbone.Model.extend({
  defaults: {
    name: '',
    calories: 0
  }
});

app.Stat = Backbone.Model.extend({
  defaults: {
    name: '',
    calories: 0,
    date: ''
  }
});