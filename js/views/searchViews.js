var app = app || {};

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
        this.trigger("addItem", this.model.attributes);
        this.model.destroy();
    }
});

app.SearchListView = Backbone.View.extend({
    el:  '.search-view',

    initialize: function() {
        this.render();
        this.listenTo(this.collection, 'all', this.render);
    },

    render: function() {
        this.$el.empty();

        this.collection.each(function(searchItem) {
            var searchItemView = new app.SearchView({ model: searchItem });
            this.listenTo(searchItemView, 'addItem', this.addItem);
            this.$el.append(searchItemView.render().el);
        }, this);

        return this;
    },

    addItem: function(input) {
        this.trigger("addItem", input);
    }
});