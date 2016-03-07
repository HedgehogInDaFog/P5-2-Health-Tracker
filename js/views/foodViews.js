var app = app || {};

app.FoodView = Backbone.View.extend({
	tagName: 'div',

	template: _.template($('#foodItemTemplate').html() ),

	events: {
		'click .clear-button' : 'removeItem',
		'click .qnt-incr' : 'incrementQnt',
		'click .qnt-decr' : 'decrementQnt'
	},

	incrementQnt: function() {
		this.model.attributes.quantity += 1;
		this.model.save();
		this.model.collection.trigger();
		this.trigger('countStats');
	},

	decrementQnt: function() {
		if (this.model.attributes.quantity > 0) {
			this.model.attributes.quantity -= 1;
			this.model.save();
			this.model.collection.trigger();
			this.trigger('countStats');
		}
	},

	removeItem: function() {
		this.model.destroy();
		this.trigger('countStats');
	},

	render: function() {
		this.$el.html( this.template(this.model.toJSON()) );
		return this;
	}
});

app.FoodListView = Backbone.View.extend({
	el:  '.eated-food-view',

	initialize: function() {
	    this.render();
	    this.listenTo(this.collection, 'all', this.render);
  	},

  	changeCurrentCollection: function(collection) {
  		this.collection = collection;
  		this.collection.fetch();
  		this.listenTo(this.collection, 'all', this.render);
  		this.render(); //TODO check is it needed?
  	},

  	addItem: function(model) {
  		this.collection.add(model);
  		model.save();
  		this.render(); //TODO check is it needed?
  	},

  	triggerCountStats: function() {
  		this.trigger('countStats');
  	},

	render: function() {
		this.$el.empty();

		if (this.collection) {
			this.collection.each(function(foodItem) {
				var foodItemView = new app.FoodView({ model: foodItem });
				this.listenTo(foodItemView, 'countStats', this.triggerCountStats);
				this.$el.append(foodItemView.render().el);
			}, this);
		}
		return this;
	}
});