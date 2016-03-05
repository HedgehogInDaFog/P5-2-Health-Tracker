var app = app || {};

app.FoodList = Backbone.Collection.extend({

  model: app.Food,

  initialize: function(models, options) {
    this.date = options.date;
    this.localStorage = new Backbone.LocalStorage('foodList-' + this.date);
  },

  totalCalories: function() {
    var sum = 0;
    var len = this.models.length;
    for (var i=0; i<len; i++) {
      sum += this.models[i].get('calories')*this.models[i].get('quantity');
      sum = Math.round(sum);
    }
    return sum;
  }

});

app.SearchList = Backbone.Collection.extend({
  model: app.Search,
});

app.StatList = Backbone.Collection.extend({
  model: app.Stat,
});