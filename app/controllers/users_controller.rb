class UsersController < ApplicationController
  before_action :logged_in_user, only: [:index, :edit, :update, :destroy]
  before_action :correct_user, only: [:edit, :update]
  before_action :admin_user, only: :destroy
  
  def index
    @users = User.where(activated: true).paginate(page: params[:page])
  end
  
  def show
    if params[:tag]
      @tag = params[:tag]
      @user = User.friendly.find(params[:user_id])
      redirect_to root_url and return unless @user.activated
      @memes = @user.memes.order(created_at: :desc).tagged_with(@tag).paginate(page: params[:page])
      @meme = @user.memes.new
    else
      @user = User.friendly.find(params[:id])
      redirect_to root_url and return unless @user.activated
      @memes = @user.memes.order(created_at: :desc).paginate(page: params[:page])
      @meme = @user.memes.new
    end
    @public_memes = @memes.where(private: false)
  end
  
  def new
    @user = User.new
  end
  
  def create
    @user = User.new(user_params)
    if @user.save
      @user.send_activation_email
      flash[:info] = "Please check your email to activate your account."
      redirect_to root_url
    else
      render 'new'
    end
  end
  
  def edit
  end
  
  def update
    if @user.update_attributes(user_params)
      flash[:success] = "Profile updated"
      redirect_to @user
    else
      render 'edit'
    end
  end
  
  def destroy
    User.friendly.find(params[:id]).destroy
    flash[:success] = "User deleted"
    redirect_to users_url
  end
  
  private
  
    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation, :avatar)
    end
    
    # Before filters
    
    # Confirms the correct user.
    def correct_user
      @user = User.friendly.find(params[:id])
      redirect_to(root_url) unless current_user?(@user)
    end
    
    # Confirms an admin user.
    def admin_user
      redirect_to(root_url) unless current_user.admin?
    end
end
