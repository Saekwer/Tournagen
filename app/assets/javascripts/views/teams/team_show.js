TournaGen.Views.TeamShow = Backbone.CompositeView.extend({
  template: JST["teams/show"],

  initialize: function (options) {
    this.teams = options.teams;
    this.image = this.model.image();
    this.registrations = this.model.registrations();
    this.teamMemberships = this.model.teamMemberships();
    this.listenTo(this.model, "sync change", this.render);
    this.listenTo(this.registrations, "add", this.addTournamentTitle);
    this.listenTo(this.registrations, "remove", this.removeTournamentTitle);
    this.listenTo(this.teamMemberships, "add", this.addMemberName);
    this.listenTo(this.teamMemberships, "remove", this.removeMemberName);
    this.renderTeamMembers();
    this.renderTournaments();
    this.addImage();
  },

  events: {
    "click .edit-button": "editTeam",
    "click .join-button": "joinAction",
    "click .delete-button": "deleteConfirmation",
    "click .upload-button": "upload"
  },

  addImage: function () {
    this.image.fetch();
    var view = new TournaGen.Views.ImageTeamShow({ model: this.model.image() });
    this.addSubview("div.team-logo", view);
  },

  addMemberName: function (teamMembership) {
    teamMembership.fetch();
    var view = new TournaGen.Views.MemberShow({ model: teamMembership });
    this.addSubview("ul.team-members-index", view);
  },

  addTournamentTitle: function (registration) {
    registration.fetch();
    var view = new TournaGen.Views.RegistrationTournamentShow({ model: registration });
    this.addSubview("ul.tournaments-index", view);
  },

  editTeam: function (e) {
    e.preventDefault();
    var modal = new TournaGen.Views.TeamForm({
      model: this.model,
      collection: this.teams
    });

    $('body').append(modal.$el);
    modal.render();
  },

  deleteConfirmation: function (e) {
    e.preventDefault();
    var modal = new TournaGen.Views.TeamDeleteConfirmation({ model: this.model });
    $('body').append(modal.$el);
    modal.render();
  },

  joinAction: function (e) {
    e.preventDefault();
    if (this.model.get("is_team_member")) {
      this.leaveTeam();
    } else {
      this.joinTeam();
    }
  },

  joinTeam: function () {
    var teamMembership = new TournaGen.Models.TeamMembership({ "team_id": this.model.get("id") });
    teamMembership.save({}, {
      success: function (tm) {
        this.teamMemberships.add(tm);
        this.$('.join-button').html("Leave This Team");
        this.model.set("is_team_member", true);
        this.model.set("tmId", tm.id);
      }.bind(this)
    });
  },

  leaveTeam: function () {
    var teamMembership = this.teamMemberships.findWhere({ "id": this.model.get("tmId") });
    teamMembership.destroy({
      success: function () {
        this.teamMemberships.remove(teamMembership);
        $(".join-button").html("Join This Team");
        this.model.set("is_team_member", false);
      }.bind(this)
    });
  },

  render: function () {
    this.$el.html(this.template({ team: this.model }));
    if (this.model.fetching) {
      this.$el.html(JST["loading_spinner"]());
      this.model.fetching = false;
    }
    this.attachSubviews();
    return this;
  },

  renderTeamMembers: function () {
    this.teamMemberships.each(this.addMemberName.bind(this));
  },

  renderTournaments: function () {
    this.registrations.each(this.addTournamentTitle.bind(this));
  },

  removeImage: function (image) {
    this.removeModelSubview("ul.images-index", image);
  },

  removeMemberName: function (teamMembership) {
    this.removeModelSubview("ul.team-members-index", teamMembership);
  },

  removeTournamentTitle: function (registration) {
    this.removeModelSubview("ul.tournaments-index", registration);
  },

  upload: function (e) {
    e.preventDefault();
    cloudinary.openUploadWidget(CLOUDINARY_OPTIONS, function (error, result) {
      var data = result[0];
      this.image.set({
        url: data.url,
        thumb_url: "https://res.cloudinary.com/dlrvqt6fn/image/upload/c_scale,h_150,w_150/" + data.path,
        imageable_id: this.model.get("id"),
        imageable_type: "Team"
      });
      this.image.save({}, {
        success: function () {
          this.render();
        }.bind(this)
      });
    }.bind(this));
    this.$el.html(JST["loading_spinner"]);
  }
});
