/**
 * @file
 * Contains backbone's view for total calories counter
 *
 * @author
 * Vladimir Vorotnikov
 * v.s.vorotnikov@gmail.com
 *
 */

var app = app || {};

// This view shows total calories for particaular day
app.CounterView = Backbone.View.extend({

    el:  '.counter',

    initialize: function() {
        this.render();
        this.listenTo(this.collection, 'all', this.render);
    },

    render: function() {
        if (this.collection) {
            this.$el.html(this.collection.totalCalories() );
        } else {
            this.$el.html('0');
        }
        return this;
    },

    /**
    * @function
    * @description in case of changing current date (and collection in FoodListView), changes collection and redraws counter
    * @param {object} collection - current collection
    */
    changeCurrentCollection: function(collection) {
        this.collection = collection;
        this.listenTo(this.collection, 'all', this.render);
        this.render();
    }
});