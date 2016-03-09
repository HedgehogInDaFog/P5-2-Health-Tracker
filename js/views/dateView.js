/**
 * @file
 * Contains backbone's view for date
 *
 * @author
 * Vladimir Vorotnikov
 * v.s.vorotnikov@gmail.com
 *
 */

var app = app || {};

// This view shows the date and allows to change date
app.DateView = Backbone.View.extend({
    el: '.date-view',

    events: {
        'click .day-fw' : function() {this.addDays(1);},
        'click .week-fw' : function() {this.addDays(7);},
        'click .day-back' : function() {this.addDays(-1);},
        'click .week-back' : function() {this.addDays(-7);}
    },

    initialize: function() {
        this.$dateField = $('.date-field');
        this.date = new Date();
        this.$dateField.append(this.dateToString(this.date));
    },

    render: function() {
        this.$dateField.text(this.dateToString(this.date));
    },

    /**
    * @function
    * @description change date on the particular number of days
    * @param {integer} numberOfDays - how many days the date is changed. Can be negative
    */
    addDays: function(numberOfDays) {
        this.date.setDate(this.date.getDate() + numberOfDays); //change date for number of days (can be negative)
        this.render();
        this.trigger('changeDate', this.getDate()); //Trigger event for appView, cause in case of changing date there is a lot to do in other app's components
    },

    /**
    * @function
    * @description returns date as a string in a readable format
    */
    dateToString: function(date) {
        return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate(); //example of string is '2016-3-7' which means March'7 2016
    },

    getDate: function() {
        return this.dateToString(this.date);
    }
});