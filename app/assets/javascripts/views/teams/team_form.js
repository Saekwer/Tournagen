TournaGen.Views.TeamForm = Backbone.View.extend({
  template: JST["teams/form"],

  initialize: function () {
    $(document).keyup(this.handleKey.bind(this));
  },

  events: {
    "submit form": "submit",
    "click .modal-background": "remove",
    "click .close": "removeModal"
  },

  handleKey: function (e) {
    if (e.keyCode === 27) {
      this.remove();
    }
  },

  onRender: function () { // user can type team name without clicking on field
    this.$('.name-field').focus();
  },

  removeModal: function (e) {
    e.preventDefault();
    this.remove();
  },

  render: function () {
    this.$el.html(this.template({ team: this.model }));
    this.onRender();
    return this;
  },

  submit: function (e) {
    e.preventDefault();
    // set model attrs to form values
    var attrs = $(e.currentTarget).serializeJSON().team;
    this.model.set(attrs);
    this.model.save({}, {
      success: function () {
        this.collection.add(this.model, { merge: true });
        // refresh page to update sidebar
        location.reload(true);
        Backbone.history.navigate("teams/" + this.model.escape("id"), { trigger: true });
        this.remove();
      }.bind(this),

      error: function (team, error) {
        // fetch to regrab proper team details
        team.fetch();
        // state what fields are missing
        var $errorsList = $("<ul>");
        error.responseJSON.forEach(function (error) {
          var $errorItem = $("<li>");
          $errorItem.html(error);
          $errorsList.append($errorItem);
        });
        // display error list
        this.$(".errors").removeClass("empty").html($errorsList);
      }.bind(this)
    });
  }
});
