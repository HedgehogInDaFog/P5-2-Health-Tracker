/**
 * @file
 * Contains main backbone's view: appView. It connects together other backbone components.
 *
 * @author
 * Vladimir Vorotnikov
 * v.s.vorotnikov@gmail.com
 *
 */

 var app = app || {};

// Main view. Creates all other models, collections, views.
app.AppView = Backbone.View.extend({
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

    /**
    * @function
    * @description Initialize appView. Create downstream views. Add listeners to some events.
    */
    initialize: function() {

    this.$foodNameString = $('.food-name-input');
    this.$foodKcalString = $('.food-kcal-input');
    this.$searchString = $('.search-string');
    this.$searchView = $('.search-view');
    this.$statView = $('.statistics-view');

    this.dateView = new app.DateView();

    this.foodCollections = {}; //we'll keep here collections of food (1 collection for every date)
    this.foodCollections[this.dateView.getDate()] = new app.FoodList([], {date : this.dateView.getDate()});

    this.foodListView = new app.FoodListView({collection: this.foodCollections[this.dateView.getDate()]});
    this.searchListView = new app.SearchListView({collection: new app.SearchList()});
    this.statListView = new app.StatListView({collection: this.initStatCollection()});

    this.foodListView.collection.fetch();

    this.counter = new app.CounterView({collection: this.foodListView.collection});

    this.listenTo(this.searchListView, 'addItem', this.addItem);
    this.listenTo(this.dateView, 'changeDate', this.changeCurrentCollection);
    this.listenTo(this.foodListView, 'countStats', this.countStats);

    this.countStats();

    self = this;
    },

    /**
    * @function
    * @description Add item from the search results. Is triggered by SearchListView (which itself is triggered by SearchView)
    * @param {object} input - contains data needed to create new item (name, calories)
    */
    addItem: function(input) {
        this.$searchString.val('');
        this.foodListView.addItem (new app.Food({
                    name: input.name,
                    calories: input.calories,
                    quantity: 1,
                    })
        );

        self.countStats(); //after any change in food list we need to recount statistics
    },

    /**
    * @function
    * @description Add item from the fields for manual input (in case user can't find food through API)
    */
    addManually: function() {
        this.foodListView.addItem (new app.Food({
                    name: this.$foodNameString.val(),
                    calories: this.$foodKcalString.val(),
                    quantity: 1,
                    })
        );
        this.$foodNameString.val('');
        this.$foodKcalString.val('');

        self.countStats(); //after any change in food list we need to recount statistics
    },

    /**
    * @function
    * @description in case of data change, changes current collection (triggers other components to do it)
    */
    changeCurrentCollection: function(currentDate) {
        var currentCollection = this.getCollectionByDate(currentDate);
        this.foodListView.changeCurrentCollection(currentCollection);
        this.counter.changeCurrentCollection(currentCollection);
    },

    /**
    * @function
    * @description Counts current statistics. Days with zero calories do not affects the statistics.
    * @description Modifies StatListView (in fact - modifies it's collection)
    */
    countStats: function() {
        var currentDate = new Date();
        var tempDate = new Date(),
            tempCol,
            tempKcal;
        var max = 0, //maximum kcalories per day
            maxDay = '-', //day, when user reacher max calories
            min = 1000000, //smilar for mininum calories per day. Won't work correct if user adds more then 1000000 kcalories per day
            minDay = '-',
            sum = 0, // sum of all calories for last 30 days
            nonZeroDays = 0, //number of days, where there were more than 0 calories
            average = 0;

        for (var i=0; i<30; i++) { //from current day to 30 days back
            tempDate.setDate(currentDate.getDate() - i);
            tempCol = this.getCollectionByDate(this.dateView.dateToString(tempDate)); //get collection with food items
            tempCol.fetch();
            tempKcal = tempCol.totalCalories(); //get total calories for this day

            if (tempKcal > 0) { // if calories in this day > 0
                nonZeroDays += 1;
                sum += tempKcal;

                if (tempKcal > max) {
                    max = tempKcal;
                    maxDay = this.dateView.dateToString(tempDate);
                }

                if (tempKcal < min) {
                    min = tempKcal;
                    minDay = this.dateView.dateToString(tempDate);
                }
            }
        }
        average = Math.round(sum/nonZeroDays);

        this.statListView.collection.models.forEach(function(m) {
            if (m.get('id') == 'max30') {
                m.set('date', maxDay);
                m.set('calories', max);
            }

            if (m.get('id') == 'min30') {
                m.set('date', minDay);
                m.set('calories', min);
            }

            if (m.get('id') == 'avr') {
                m.set('calories', average); //obviously no particular date for average kcal
            }
        });

        return true;
    },

    /**
    * @function
    * @description Simply returns collection for given date
    * @param {string} currentDate - date in string format (YYYY-M-D), for which we want tot get collection
    */
    getCollectionByDate: function(currentDate) {
        if (!this.foodCollections[currentDate]) {
          this.foodCollections[currentDate] = new app.FoodList([], {date : currentDate}); //if there is no collection for currentDate - create new empty one
        }

        return this.foodCollections[currentDate];
    },

    /**
    * @function
    * @description Initialize app.StatList with statistical parameters. If you want to add new statistics you probably want to start here
    */
    initStatCollection: function() {
        var models = [];
        models.push(new app.Stat({
                                name: 'Max per day',
                                calories: 0,
                                date: '',
                                id: 'max30'
                                }
        ));

        models.push(new app.Stat({
                                name: 'Min per day',
                                calories: 0,
                                date: '',
                                id: 'min30'
                                }
        ));

        models.push(new app.Stat({
                                name: 'Average per day',
                                calories: 0,
                                date: 'N/A',
                                id: 'avr'
                                }
        ));

        var collection = new app.StatList();
        collection.add(models);

        return collection;
    },

    /**
    * @function
    * @description Handles event, when user presses "Enter" in case of manual data input
    */
    keyPressAdd: function(e) {
        if(e.keyCode == 13) {
            self.addManually();
        }
    },

    /**
    * @function
    * @description Handles event, when user presses "Enter" in case of search input
    */
    keyPressSearch: function(e) {
        if(e.keyCode == 13) {
            self.searchItem();
        }
    },

    /**
    * @function
    * @description Search food via Nutritionix API.
    */
    searchItem: function() {
        var apiRequestTemplate = 'https://api.nutritionix.com/v1_1/search/%SEARCH%?fields=item_name%2Cnf_calories&appId=1c120cc3&appKey=99dd94d4da2652a426b99bbfb4c3da6c';
        var searchRequest = this.$searchString.val();
        var apiRequest = apiRequestTemplate.replace('%SEARCH%',searchRequest);

        self.searchListView.collection.reset();
        self.$searchView.html(self.templateLoading); //show nice loading indicator

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