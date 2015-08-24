TournaGen.Collections.Tournaments = Backbone.Collection.extend({
  url: "api/tournaments",
  model: TournaGen.Models.Tournament,

  comparator: "title",

  parse: function (response) {
    this.page_number = parseInt(response.page_number);
    this.total_pages = parseInt(response.total_pages);
    return response.models;
  },

  getOrFetch: function (id) {
    var tournament = this.get(id);
    if (!tournament) {
      tournament = new TournaGen.Models.Tournament({ id: id });
      this.tournamentFetchListen(tournament);
      this.add(tournament);
      tournament.fetch({
        error: function () {
          this.remove(tournament);
        }.bind(this)
      });
    } else {
      this.tournamentFetchListen(tournament);
      tournament.fetch();
    }

    return tournament;
  },

  collectionFetchListen: function () {
    this.on("fetch", function () {
      this.fetching = true;
    }.bind(this));
  },

  tournamentFetchListen: function (tournament) {
    tournament.listenTo(tournament, "fetch", function () {
      this.fetching = true;
    }.bind(tournament));
  }
});
