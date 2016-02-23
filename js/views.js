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

	template: _.template($('#foodItemTemplate').html() ),

	events: {
		'click #clear-button' : 'removeItem'
	},

	removeItem: function() {
		this.model.destroy();
	},

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

	render: function() {
		this.$el.html(this.collection.totalCalories() );
		return this;
	}
});


var SearchListView = Backbone.View.extend({
	el:  '#search-view',

	initialize: function() {
	    this.render();
	    this.listenTo(this.collection, 'all', this.render);
  	},

	render: function() {
		this.$el.empty();

		this.collection.each(function(searchItem) {
			var searchItemView = new SearchView({ model: searchItem });
			this.$el.append(searchItemView.render().el);
		}, this);

		return this;
	}
});

var SearchView = Backbone.View.extend({
	tagName: 'div',

	template: _.template($('#searchItemTemplate').html() ),

	render: function() {
		this.$el.html( this.template(this.model.toJSON()) );
		return this;
	}
});


//simple working example for FoodView, FoodListView, CounterView
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

app.foodList1 = new app.FoodList([app.mod1, app.mod2], {date : '27091987'});

app.view = new FoodListView({ collection: app.foodList1 });

app.foodList1.add(app.mod3);



//simple working example for searchView, searchListView, CounterView
app.s1 = new app.Search({
                      name: 'search # 1',
                      calories: 321
                    });

app.s2 = new app.Search({
                      name: 'search # 2',
                      calories: 10
                    });

app.s3 = new app.Search({
                      name: 'search # 3',
                      calories: 21
                    });

app.searchList1 = new app.SearchList([app.s1, app.s2]);

app.view = new SearchListView({ collection: app.searchList1 });

app.searchList1.add(app.s3);
