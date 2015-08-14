TournaGen.Models.Team = Backbone.Model.extend({
  urlRoot: "api/teams",

  parse: function (response) {
    if (response.registrations) {
      this.registrations().set(response.registrations, { parse: true });
      delete response.registrations;
    }

    return response;
  },

  registrations: function () {
    if (!this._registrations) {
      this._registrations = new TournaGen.Collections.Registrations([], { team: this });
    }

    return this._registrations;
  }
});