var app = app || {};

app.DateView = Backbone.View.extend({
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