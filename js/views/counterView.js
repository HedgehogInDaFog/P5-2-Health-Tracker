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

    changeCurrentCollection: function(collection) {
        this.collection = collection;
        this.listenTo(this.collection, 'all', this.render);
        this.render();
    }
});