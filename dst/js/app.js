/**
 * @file
 * Simply start the application by creating new backbone's view
 *
 * @author
 * Vladimir Vorotnikov
 * v.s.vorotnikov@gmail.com
 *
 */

app.view = new app.AppView();
/**
 * @file
 * Contains backbone collections
 *
 * @author
 * Vladimir Vorotnikov
 * v.s.vorotnikov@gmail.com
 *
 */

var app = app || {};

//This collection contains data about eaten food in a particular date
app.FoodList = Backbone.Collection.extend({

  model: app.Food,

  /**
  * @function
  * @description Initialize collection. Takes date as an options
  * @param {list} models - list, containing app.Food models
  * @param {object} options - contains date (and can be used for passing other parameters during init in the future)
  */
  initialize: function(models, options) {
    this.date = options.date;
    this.localStorage = new Backbone.LocalStorage('foodList-' + this.date); //unique LocalStorage for every date
  },

  /**
  * @function
  * @description counts total calories of all food items in this collection
  */
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

//This collection contains search results
app.SearchList = Backbone.Collection.extend({
  model: app.Search,
});

//This collection contains statistics
app.StatList = Backbone.Collection.extend({
  model: app.Stat,
});
/**
 * @file
 * Contains backbone models
 *
 * @author
 * Vladimir Vorotnikov
 * v.s.vorotnikov@gmail.com
 *
 */

var app = app || {};

//This model contains data about food, that user adds to his list
app.Food = Backbone.Model.extend({
  defaults: {
    name: '',
    calories: 0,
    quantity: 0,
  }
});

//This model contains search result
app.Search = Backbone.Model.extend({
  defaults: {
    name: '',
    calories: 0
  }
});

//This model contains statistics
app.Stat = Backbone.Model.extend({
  defaults: {
    name: '',
    calories: 0,
    date: '',
    id: ''
  }
});