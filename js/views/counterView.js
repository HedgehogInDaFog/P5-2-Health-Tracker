var app = app || {};

app.CounterView = Backbone.View.extend({

	el:  '#counter',

	initialize: function() {
	    this.render();
	    this.listenTo(this.collection, 'all', this.render);
  	},

  	changeCurrentCollection: function(collection) {
  		this.collection = collection;
  		//this.collection.fetch();
  		this.listenTo(this.collection, 'all', this.render);
  		this.render(); //TODO check is it needed?
  	},

	render: function() {
		if (this.collection) {
			this.$el.html(this.collection.totalCalories() );
		} else {
			this.$el.html('0');
		}
		return this;
	}
});