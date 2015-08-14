TournaGen.Views.TournamentForm = Backbone.View.extend({
  template: JST["tournaments/form"],

  initialize: function () {
    $(document).on("keyup", this.handleKey.bind(this));
  },

  events: {
    "submit form": "submit",
    "click .close": "removeModal",
    "click .modal-background": "remove"
  },

  handleKey: function (e) {
    if (e.keycode === 27) {
      this.remove();
    }
  },

  onRender: function () {
    this.$('.title-field').focus();
  },

  render: function () {
    this.$el.html(this.template({ tournament: this.model }));
    this.onRender();
    return this;
  },

  removeModal: function (e) {
    e.preventDefault();
    this.remove();
  },

  submit: function (e) {
    e.preventDefault();
    var attrs = $(e.currentTarget).serializeJSON().tournament;
    this.model.set(attrs);
    this.model.save({}, {
      success: function () {
        this.collection.add(this.model, { merge: true });
        Backbone.history.navigate("tournaments/" + this.model.escape("id"), { trigger: true });
      }.bind(this)
    });
  }
});
