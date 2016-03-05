var app = app || {};

app.appView = Backbone.View.extend({
    el: 'body',

    template: _.template($('#loadingFailedTemplate').html() ),

    templateLoading: _.template($('#loadingIndicator').html() ),

    events: {
        'click .search-button' : 'searchItem',
        'click .add-manually-button' : 'addManually',
        'keyup .search-string' : 'keyPressSearch',
        'keyup .food-name-input' : 'keyPressAdd',
        'keyup .food-kcal-input' : 'keyPressAdd'
    },

    initialize: function() {

    this.$foodNameString = $('.food-name-input');
    this.$foodKcalString = $('.food-kcal-input');
    this.$searchString = $('.search-string');
    this.$searchView = $('.search-view');
    this.$statView = $('.statistics-view');

    this.dateView = new app.DateView();

    this.foodCollections = {};
    this.foodCollections[this.dateView.getDate()] = new app.FoodList([], {date : this.dateView.getDate()});

    this.foodListView = new app.FoodListView({collection: this.foodCollections[this.dateView.getDate()]});
    this.searchListView = new app.SearchListView({collection: new app.SearchList()});
    this.statListView = new app.StatListView({collection: new app.StatList()});

    this.foodListView.collection.fetch();

    this.counter = new app.CounterView({collection: this.foodListView.collection});

    this.listenTo(this.searchListView, 'addItem', this.addItem)
    this.listenTo(this.dateView, 'changeDate', this.changeCurrentCollection)

    this.initStatCollection(); //TODO

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

    addManually: function() {
        this.foodListView.addItem (new app.Food({
                    name: this.$foodNameString.val(),
                    calories: this.$foodKcalString.val(),
                    quantity: 1,
                    })
        );
        this.$foodNameString.val('');
        this.$foodKcalString.val('');
    },

    changeCurrentCollection: function(currentDate) {
        var currentCollection = this.getCollectionByDate(currentDate)
        this.foodListView.changeCurrentCollection(currentCollection);
        this.counter.changeCurrentCollection(currentCollection);
    },

    countStats: function() {
        return true; //TODO
    },

    initStatCollection: function() {
        var models = [];
        models.push(new app.Stat({
                                name: 'Max per day',
                                calories: 0,
                                date: ''
                                }
        ));

        models.push(new app.Stat({
                                name: 'Min per day',
                                calories: 0,
                                date: ''
                                }
        ));

        models.push(new app.Stat({
                                name: 'Average per day',
                                calories: 0,
                                date: 'N/A'
                                }
        ));
    },

    getCollectionByDate: function(currentDate) {
        if (!this.foodCollections[currentDate]) {
          this.foodCollections[currentDate] = new app.FoodList([], {date : currentDate});
        }

        return this.foodCollections[currentDate];
    },

    keyPressSearch: function(e) {
        if(e.keyCode == 13) {
            self.searchItem();
        }
    },

    keyPressAdd: function(e) {
        if(e.keyCode == 13) {
            self.addManually();
        }
    },

    searchItem: function() {
        var apiRequestTemplate = 'https://api.nutritionix.com/v1_1/search/%SEARCH%?fields=item_name%2Cnf_calories&appId=1c120cc3&appKey=99dd94d4da2652a426b99bbfb4c3da6c';
        var searchRequest = this.$searchString.val();
        var apiRequest = apiRequestTemplate.replace('%SEARCH%',searchRequest);

        self.searchListView.collection.reset();
        self.$searchView.html(self.templateLoading);

        var apiRequestTimeout = setTimeout(function() {
                self.$searchView.html(self.template);
            }, 8000);

        $.ajax({
            url: apiRequest,
            success: function(response) {
                clearTimeout(apiRequestTimeout);
                if (response.total_hits > 0) {
                    var rawData = response.hits;
                    var len = rawData.length;
                    for (var i=0; i <len; i++) {
                        self.searchListView.collection.add(new app.Search({
                                                                            name: rawData[i].fields.item_name,
                                                                            calories: Math.round(rawData[i].fields.nf_calories)
                                                                        })
                        );
                    }
                }
            },
            error: function() {
                clearTimeout(apiRequestTimeout);
                self.$searchView.html(self.template);
            }
        });
    }
});