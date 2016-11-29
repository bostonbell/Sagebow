/*globals $, validateRequired*/
var DEBUG = true;
console.log(`Setting DEBUG to ${DEBUG} in delete/app.js.`);

var DeleteView = Backbone.View.extend({
    // The tag that represents the
    // hook that this view is associated
    // with.
    el: $("body"),

    // UI Components.
    $username: undefined,
    $password: undefined,

    // Models.
    userFields: undefined,

    initialize: function(attrs) {
	if (DEBUG) {
	    console.log("[delete/app.js::LoginView::initialize]: Initializing object...");
	}

	this.el = this.options.applicationContainer;
	this.options = attrs;

	// The user model that will be passed back and
	// fourth between the server.
	this.userFields = this.options.user;

	this.$username = this.options.$username;
	this.$password = this.options.$password;

	_.bindAll(this, 'render');
	this.render();
	
	var that = this;

	$(this.el).find(".btn-login").click(function(event) {
	    that.attemptDeletion(event);
	});

	$(this.el).keypress(function(event) {
	    if (event.which === 13 ) {
		if (($('body').has('.window').length == 0)) {
		    that.attemptDeletion(event);
		} else {
		    if (($(".top-text").has('.success-text').length === 0)) {
			$(".modal").parent().remove();
		    } 
		}
	    } 
	});
    },

    validateRequired: function() {
	var inputsSatisfied = $(this.el)
	    .find('.required')
	    .filter(function(element, item) {
		return item.value === '';
	}).length === 0;

	var selectionsSatisfied = $(this.el).children('.btn.required[set=false]').length === 0;

	return inputsSatisfied && selectionsSatisfied;
    },

    getFields: function() {
	return {
	    username: this.$username.val(),
	    password: this.$password.val()
	}
    },

    attemptDeletion: function(event) {
	// DEBUG DISPLAY: TO BE REMOVED IN PRODUCTION BUILD
	if (DEBUG) {
	    console.log(`[setup/app.js::deleteView::attemptDeletion]: Potential login event...`);
	}
	// !DEBUG DISPLAY


	if (event.keyCode && event.keyCode !== 13 ) {
	    return;
	} else {
	    $(this.el).find(".form-control").blur();
	}

	var that = this;

	if (this.validateRequired()) {
	    // DEBUG DISPLAY: TO BE REMOVED IN PRODUCTION BUILD
	    if (DEBUG) {
		console.log(`[setup/app.js::deleteView::attemptDeletion]: Validation passed!...`);
		console.log(this.getFields());
	    }

	    var fields = this.getFields();

	    that.userFields.save(fields, {
		dataType: 'text',

		success: function(model, response) {
		    // DEBUG DISPLAY: TO BE REMOVED IN PRODUCTION BUILD
		    if (DEBUG) {
			console.log(`[setup/app.js::SetupView::attemptCreation]: Success!...`);
		    }
		    // !DEBUG DISPLAY

		    var successModal = new ModalView({
			header: "Goodbye!",
			message: "Thanks for using Sagebow!",
			isDangerous: false,
			closeFn: function() {
			    window.location.href = '/login';
			}
		    });

		    successModal.display($(that.el));
		},

		error: function(model, response) {
		    // DEBUG DISPLAY: TO BE REMOVED IN PRODUCTION BUILD
		    if (DEBUG) {
			console.log(`[setup/app.js::SetupView::attemptCreation]: Error!...`);
			console.log(`[setup/app.js::SetupView::attemptCreation]: ${that.userFields.values()}!...`);
		    }
		    // !DEBUG DISPLAY

		    console.log(response.responseText);

		    if (response.responseText === "Not Found") {
			produceModal("Oops", "This username does not exist.", true).display($(that.el));
		    } else if (response.responseText === "Malformed") {
			produceModal("Oops", "The password you entered is incorrect.", true).display($(that.el));

		    } else if (response.responseText === "Error") {
			produceModal("Oops", "Some error occurred on our end.", true).display($(that.el));
		    } else {
			produceModal("Oops", "An unknown error occured, maybe you should try again later.", true).display($(that.el));
		    }
		},
	    });
	} else {
	    produceModal("Oops", "All fields are required.", true).display($(this.el));
	}
    }
});

$(document).ready(function() {
    // Create a user object.
    userObject = new UserModelDeletion();

    // Instantiate this page of the application.
    app = new DeleteView({
	applicationContainer: $("body"),
	$username: $("#username"),
	$password: $("#password"),
	user: userObject
    });
});