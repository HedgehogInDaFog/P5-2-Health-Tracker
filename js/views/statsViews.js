/**
 * @file
 * Contains backbone's views for statistics
 *
 * @author
 * Vladimir Vorotnikov
 * v.s.vorotnikov@gmail.com
 *
 */

'use strict';

var app = app || {};

// This view shows single (one) statical parameter
app.StatView = Backbone.View.extend({
    tagName: 'div',

    template: _.template($('#statisticsTemplate').html() ),

    initialize: function() {
        this.listenTo(this.model, 'all', this.render);
    },

    render: function() {
        this.$el.html( this.template(this.model.toJSON()) );
        return this;
    }
});

// This view shows statistics. It relies on collection (StatList) and
// creates StatView for every statistics entity
app.StatListView = Backbone.View.extend({
    el:  '.statistics-view',

    initialize: function() {
        this.render();
        this.listenTo(this.collection, 'all', this.render);
    },

    /**
    * @function
    * @description for every model in the collection new view (app.StatView) is created
    */
    render: function() {
        this.$el.empty();

        if (this.collection) {
            this.collection.each(function(statItem) {
                var statItemView = new app.StatView({ model: statItem });
                this.$el.append(statItemView.render().el);
            }, this);
        }
        return this;
    }
});