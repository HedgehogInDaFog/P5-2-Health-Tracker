var app = app || {};

app.appView = Backbone.View.extend({
    el: 'body',

    events: {
        'click #search-button' : 'searchItem'
    },

    initialize: function() {

    this.$searchString = $('.search-string');

    this.dateView = new app.DateView();

    this.foodCollections = {};
    this.foodCollections[this.dateView.getDate()] = new app.FoodList([], {date : this.dateView.getDate()});

    this.foodListView = new app.FoodListView({collection: this.foodCollections[this.dateView.getDate()]});
    this.searchListView = new app.SearchListView({collection: new app.SearchList()});

    this.foodListView.collection.fetch();

    this.counter = new app.CounterView({collection: this.foodListView.collection});

    this.listenTo(this.searchListView, 'addItem', this.addItem)
    this.listenTo(this.dateView, 'changeDate', this.changeCurrentCollection)

    self = this;
    },

    addItem: function(input) {
        this.$searchString.val('');
        this.foodListView.addItem (new app.Food({
                    name: input.name,
                    calories: input.calories,
                    quantity: 1,
                    })
        );
    },

    changeCurrentCollection: function(currentDate) {
        var currentCollection = this.getCollectionByDate(currentDate)
        this.foodListView.changeCurrentCollection(currentCollection);
        this.counter.changeCurrentCollection(currentCollection);
    },

    getCollectionByDate: function(currentDate) {
    if (!this.foodCollections[currentDate]) {
      this.foodCollections[currentDate] = new app.FoodList([], {date : currentDate});
    }
    return this.foodCollections[currentDate];
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