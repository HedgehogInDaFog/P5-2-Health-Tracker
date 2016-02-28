var app = app || {};

app.appView = Backbone.View.extend({
	el: 'body',

	events: {
		'click #search-button' : 'searchItem'
	},

	initialize: function() {

		this.$searchString = $('.search-string');

		this.dateView = new app.DateView();
		this.foodListView = new app.FoodListView({collection: new app.FoodList([], {date : this.dateView.getDate()})});
		this.searchListView = new app.SearchListView({collection: new app.SearchList()});

		this.counter = new app.CounterView({collection: this.foodListView.collection});

		this.listenTo(this.searchListView, 'addItem', this.addItem)
		this.listenTo(this.dateView, 'changeDate', this.changeColletion)

		self = this;
  	},

  	addItem: function(input) {
  		self.searchListView.collection.reset();
  		this.$searchString.val('');
  		this.foodListView.addItem (new app.Food({
                      name: input.name,
                      calories: input.calories,
                      quantity: 1,
                    })
  			);

  	},

  	changeCollection: function(date) {
  		this.foodListView.changeCurrentCollection(this.getCollectionByDate(date));
  	},

  	getCollectionByDate(date) {
  		return this.foodListView.collection; //TODO (!!!!!)
  	},

	searchItem: function() {
		var apiRequestTemplate = 'https://api.nutritionix.com/v1_1/search/%SEARCH%?fields=item_name%2Cnf_calories&appId=1c120cc3&appKey=99dd94d4da2652a426b99bbfb4c3da6c';
		var searchRequest = this.$searchString.val();
		var apiRequest = apiRequestTemplate.replace('%SEARCH%',searchRequest);

		self.searchListView.collection.reset();

		$.ajax({
			url: apiRequest,
			success: function(response) {
				if (response.total_hits > 0) {
					var rawData = response.hits;
					var len = rawData.length;
					for (var i=0; i <len; i++) {
						self.searchListView.collection.add(new app.Search({
	                      													name: rawData[i].fields.item_name,
	                      													calories: rawData[i].fields.nf_calories
	                    												})
						);
					}
				}
			},
			error: function() {
				console.log('Error while working with API');
			}
		});
	}
});