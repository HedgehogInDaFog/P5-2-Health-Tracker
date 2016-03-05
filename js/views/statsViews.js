var app = app || {};

app.StatView = Backbone.View.extend({
	tagName: 'div',

	template: _.template($('#statisticsTemplate').html() ),

	initialize: function() {
	    //this.render();
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

  	addItem: function(model) {
  		this.collection.add(model);
  		model.save();
  		this.render(); //TODO check is it needed?
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