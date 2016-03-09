/**
 * @file
 * Contains backbone's views for food
 *
 * @author
 * Vladimir Vorotnikov
 * v.s.vorotnikov@gmail.com
 *
 */

var app = app || {};

// This view shows one eaten food (with quantity and calories)
app.FoodView = Backbone.View.extend({
    tagName: 'div',

    template: _.template($('#foodItemTemplate').html() ),

    events: {
        'click .clear-button' : 'removeItem',
        'click .qnt-incr' : 'incrementQnt',
        'click .qnt-decr' : 'decrementQnt'
    },

    render: function() {
        this.$el.html( this.template(this.model.toJSON()) );
        return this;
    },

    /**
    * @function
    * @description decrements quantity of this particular food, when usec clicks button
    */
    decrementQnt: function() {
        if (this.model.attributes.quantity > 0) { //quantity of food can't be less then zero
            this.model.attributes.quantity -= 1;
            this.model.save();
            this.model.collection.trigger();
            this.trigger('countStats'); //trigger recalculation of statistics
        }
    },

    /**
    * @function
    * @description increments quantity of this particular food, when usec clicks button
    */
    incrementQnt: function() {
        this.model.attributes.quantity += 1;
        this.model.save();
        this.model.collection.trigger();
        this.trigger('countStats'); //trigger recalculation of statistics
    },

    removeItem: function() {
        this.model.destroy();
        this.trigger('countStats'); //trigger recalculation of statistics
    }
});

// This view show a list of food for a particular date. It relies on collection (FoodList) and
// creates FoodView for every model in collection
app.FoodListView = Backbone.View.extend({
    el:  '.eated-food-view',

    initialize: function() {
        this.render();
        this.listenTo(this.collection, 'all', this.render);
    },

    /**
    * @function
    * @description for every model in the collection new view (app.FoodView) is created
    */
    render: function() {
        this.$el.empty();

        if (this.collection) {
            this.collection.each(function(foodItem) {
                var foodItemView = new app.FoodView({ model: foodItem });
                this.listenTo(foodItemView, 'countStats', this.triggerCountStats); // is triggered by app.FoodView, if recalculation of statistics is needed
                this.$el.append(foodItemView.render().el);
            }, this);
        }
        return this;
    },

    addItem: function(model) {
        this.collection.add(model);
        model.save();
    },

    /**
    * @function
    * @description in case of changing current date, function changes current shown collection
    */
    changeCurrentCollection: function(collection) {
        this.collection = collection;
        this.collection.fetch();
        this.listenTo(this.collection, 'all', this.render);
        this.render();
    },

    triggerCountStats: function() {
        this.trigger('countStats'); // trigger recalculation of statistics in a main view (app.appView)
    }
});