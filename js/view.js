var EatedFoodView = Backbone.View.extend({

	id:  'eated-food-view',

	eatedFoodTemplate: _.template( "An example template" ),

	initialize: function (options) {
	    this.options = options || {};
  	},

  	render: function() {
	    this.$el.html( this.eatedFoodTemplate( this.model.attributes ) );
	    return this;
	  }

});