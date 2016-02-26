//1c120cc3
//99dd94d4da2652a426b99bbfb4c3da6c
//https://api.nutritionix.com/v1_1/search/%SEARCH%?fields=item_name%2Cnf_calories&appId=1c120cc3&appKey=99dd94d4da2652a426b99bbfb4c3da6c

var app = app || {};

var DateView = Backbone.View.extend({
	el: '#date-view',

	events: {
		'click #day-fw' : function() {this.addDays(1);},
		'click #week-fw' : function() {this.addDays(7);},
		'click #day-back' : function() {this.addDays(-1);},
		'click #week-back' : function() {this.addDays(-7);}
	},

	initialize: function() {
		this.$dateField = $('#date-field')
		this.date = new Date();
		this.$dateField.append(this.dateToString(this.date));
  	},

  	render: function() {
  		//this.$dateField.emtpy();
  		this.$dateField.text(this.dateToString(this.date))
  	},

  	getDate: function() {
  		return this.dateToString(this.date);
  	},

  	dateToString: function(date) {
  		return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
  	},

  	addDays: function(numberOfDays) {
  		this.date.setDate(this.date.getDate() + numberOfDays);
  		this.render();
  	}

});

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
		'click #clear-button' : 'removeItem',
		'click #qnt-incr' : 'incrementQnt',
		'click #qnt-decr' : 'decrementQnt'
	},

	incrementQnt: function() {
		this.model.attributes.quantity += 1;
		this.model.collection.trigger();
	},

	decrementQnt: function() {
		this.model.attributes.quantity -= 1;
		this.model.collection.trigger();
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

	events: {
		'click #add-button' : 'addItem'
	},

	addItem: function() {
		console.log(this.model);
		//TODO
	},

	render: function() {
		this.$el.html( this.template(this.model.toJSON()) );
		return this;
	}
});

var appView = Backbone.View.extend({
	el: 'body',

	events: {
		'click #search-button' : 'searchItem'
	},

	initialize: function() {
		this.dateView = new DateView();
		console.log('Starting main view');
		this.foodListView = new app.FoodList([], {date : this.dateView.getDate()});
		this.searchListView = new SearchListView({collection: new app.SearchList()});
  	},

	searchItem: function() {
		var apiRequestTemplate = 'https://api.nutritionix.com/v1_1/search/%SEARCH%?fields=item_name%2Cnf_calories&appId=1c120cc3&appKey=99dd94d4da2652a426b99bbfb4c3da6c';
		var searchRequest = $('.search-string').val();
		var apiRequest = apiRequestTemplate.replace('%SEARCH%',searchRequest);

		$.ajax({
			url: apiRequest,
			success: function(response) {
				if (response.total_hits > 0) {
					var rawData = response.hits;
				}
				console.log(rawData);
			},
			error: function() {
				console.log('Error while working with API');
			}
		});
	}
});

/*
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

app.foodList1 = new app.FoodList([app.mod1, app.mod2, app.mod3], {date : '27022016'});
app.view = new appView({collection: app.foodList1});
*/

app.view = new appView();



/*
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

app.foodView1 = new FoodListView({ collection: app.foodList1 });

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

app.searchView = new SearchListView({ collection: app.searchList1 });

app.searchList1.add(app.s3);
*/

