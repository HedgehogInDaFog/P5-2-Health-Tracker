/**
 * @file
 * Contains backbone models
 *
 * @author
 * Vladimir Vorotnikov
 * v.s.vorotnikov@gmail.com
 *
 */

'use strict';

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