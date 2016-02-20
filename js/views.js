var app = app || {};

var FoodListView = Backbone.View.extend({
	el:  '#eated-food-view',

	initialize: function() {
		this.counter = new CounterView({collection: this.collection});
	    this.render();
	    this.listenTo(this.collection, 'all', this.render);
  	},

	render: function() {
		this.$el.empty();

		this.collection.each(function(foodItem) {
			var foodItemView = new FoodView({ model: foodItem });
			this.$el.append(foodItemView.render().el);
		}, this);

		return this;
	}
});

var FoodView = Backbone.View.extend({
	tagName: 'div',

	template: _.template($('#foodViewTemplate').html() ),

	render: function() {
		this.$el.html( this.template(this.model.toJSON()) );
		return this;
	}
});

var CounterView = Backbone.View.extend({

	el:  '#counter',

	initialize: function() {
	    this.render();
	    this.listenTo(this.collection, 'all', this.render);
  	},

	template: _.template($('#counterTemplate').html() ),

	render: function() {
		this.$el.html(this.collection.totalCalories() );
		return this;
	}
});

/*
//simple working example
app.mod1 = new app.Food({
                      name: 'Food # 1',
                      calories: 321,
                      quantity: 2,
                    });

app.mod2 = new app.Food({
                      name: 'Food # 2',
                      calories: 10,
                      quantity: 30,
                    });

app.mod3 = new app.Food({
                      name: 'Food # 3',
                      calories: 21,
                      quantity: 12,
                    });

app.FoodList1 = new app.FoodList([app.mod1, app.mod2], {date : '27091987'});

app.view = new FoodListView({ collection: app.FoodList1 });

app.FoodList1.add(app.mod3);
*/

