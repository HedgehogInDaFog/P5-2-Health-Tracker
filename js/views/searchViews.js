/**
 * @file
 * Contains backbone's views for search results
 *
 * @author
 * Vladimir Vorotnikov
 * v.s.vorotnikov@gmail.com
 *
 */

 var app = app || {};

// This view shows single (one) search result
app.SearchView = Backbone.View.extend({
    tagName: 'div',

    template: _.template($('#searchItemTemplate').html() ),

    events: {
        'click .add-button' : 'addItem'
    },

    render: function() {
        this.$el.html( this.template(this.model.toJSON()) );
        return this;
    },

    addItem: function() {
        this.trigger("addItem", this.model.attributes); //in case of adding new item from search list, appView needs to know about it. So we trigger this event
        this.model.destroy(); //remove from search list, if we added it to the list of eaten food
    }
});

// This view shows search results. It relies on collection (SearchList) and
// creates SearchView for every search result
app.SearchListView = Backbone.View.extend({
    el:  '.search-view',

    initialize: function() {
        this.render();
        this.listenTo(this.collection, 'all', this.render);
    },

    /**
    * @function
    * @description for every model in the collection new view (app.SearchView) is created
    */
    render: function() {
        this.$el.empty();

        this.collection.each(function(searchItem) {
            var searchItemView = new app.SearchView({ model: searchItem });
            this.listenTo(searchItemView, 'addItem', this.addItem); // is triggered by app.SearchView, if some item from a list need to be added to a food list
            this.$el.append(searchItemView.render().el);
        }, this);

        return this;
    },

    addItem: function(input) {
        this.trigger("addItem", input);
    }
});