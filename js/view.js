var app = app || {};

app.template = '<div class="row" >' +
					'<div class="col-7"><p class="small-text"><%= name %></p></div>' +
					'<div class="col-3"><p class="small-text"><%= calories %></p></div>' +
					'<div class="col-1"><p class="small-text"><%= quantity %></p></div>' +
					'<div class="col-1"><p class="small-text">X</p></div>' +
					'<hr class="col-12">' +
				'</div>';

app.mod2 = new app.Food({
                      name: 'Food # 1',
                      calories: 10,
                      quantity: 30,
                    });
app.FoodList1 = new app.FoodList([app.mod2], {date : '27091987'});


app.EatedFoodView = Backbone.View.extend({

	el:  '#eated-food-view',

	eatedFoodTemplate: _.template(app.template),

	initialize: function (options) {
	    this.options = options || {};
  	},

  	model: app.mod2,

  	render: function() {
	    this.$el.html( this.eatedFoodTemplate( {name: this.model.get('name'),
	    										calories: this.model.get('calories'),
	    										quantity: this.model.get('quantity') } ) );
	    return this;
	  }

});

app.view = new app.EatedFoodView();

app.view.render();