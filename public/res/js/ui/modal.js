var ModalView = Backbone.View.extend({
    header: undefined,
    message: undefined,
    isDangerous: undefined,

    textClass: this.isDangerous  ? 'success-text' : 'danger-text',
    buttonClass: this.isDangerous ? 'btn-success' : 'btn-reject',

    template: _.template(function() {
	tag = "";
	tag += '<div class="modal">';
	tag +=   '<div class="overlay fadein begin-transparent">';
	tag +=     '<div class="window">';
	tag +=       '<div class="top-text">';
	tag +=         '<h2 class="m-b-1 <%= this.textClass %>"><%= this.header %></h2>';
	tag +=         '<p><%= this.message %></p>';
	tag +=       '</div>';
	tag +=       '<div class="bottom-text text-xs-right">';
	tag +=         '<a class="btn btn-exit <%= this.buttonClass %>">Close</a>';
	tag +=       '</div>';
	tag +=     '</div>';
	tag +=   '</div>';
	tag += '</div>';
	return tag;
    }()),

    initialize: function(attrs) {
	// Pull parameters of object passed to ModalView
	this.options = attrs;

	// Set all possibilities equal to internal objects:
	// note that the user of this view may not pass certain
	// objects: This is okay, because at the end of the day,
	// they are undefined anyways.
	this.header = this.options.header;
	this.message = this.options.message;
	this.isDangerous = this.options.isDangerous;

	// Simple Backbone binding schema.
	_.bindAll(this, 'render');
	this.render();
    },

    render: function() {
	this.el.innerHTML = this.template();
	return this;
    },

    events: {
	"click .btn": "removeModal",
	"click .overlay": "removeModal",
	"keyup .btn-exit": "removeModal",
    },

    removeModal: function(event) {
	console.log("Hi.");
	// Quite coupled: Watch out here.
	if ($(event.target).hasClass("btn-reject") || $(event.target).hasClass("overlay") || event.keyCode === 13) {
	    this.undelegateEvents();
	    this.$el.removeData().unbind(); 
	    this.remove();  
	    Backbone.View.prototype.remove.call(this);
	}
    }
});


function produceModal(header, message, isDangerous) {
    var modalItem = new ModalView({
	header: header,
	message: message,
	isDangerous: isDangerous
    });

    return modalItem;
}