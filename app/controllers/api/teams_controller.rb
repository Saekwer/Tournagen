class Api::TeamsController < ApplicationController
  def index
    if params[:search]
      @teams = Team.includes(:captain, :registrations)
                   .where("name LIKE ?", params[:search])
    else
      @teams = Team.includes(:captain, :registrations)
    end
  end

  def show
    @team = Team.includes(:captain, :registrations).find(params[:id])
  end

  def create
    @team = Team.new(team_params)
    @team.owner_id = current_user.id
    if @team.save
      TeamMembership.create!(user_id: current_user.id, team_id: @team.id)
      render :show
    else
      render json: @team.errors.full_messages, status: :unprocessable_entity
    end
  end

  def update
    @team = Team.find(params[:id])
    if @team.update(team_params)
      render :show
    else
      render json: @team.errors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    @team = Team.find(params[:id])
    @team.destroy!
    render json: @team
  end

  private
  def team_params
    params.require(:team).permit(:name, :description)
  end
end
