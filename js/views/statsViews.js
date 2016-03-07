/**
 * @file
 * Contains backbone's views for sttistics
 *
 * @author
 * Vladimir Vorotnikov
 * v.s.vorotnikov@gmail.com
 *
 */

 var app = app || {};

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

app.StatListView = Backbone.View.extend({
    el:  '.statistics-view',

    initialize: function() {
        this.render();
        this.listenTo(this.collection, 'all', this.render);
    },

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