class UsersController < ApplicationController
  before_action :logged_in_user, only: [:index, :edit, :update, :destroy]
  before_action :correct_user, only: [:edit, :update]
  before_action :admin_user, only: :destroy
  
  def index
    if params[:all]
      redirect_to users_path
    elsif params[:search]
      @search = Sunspot.search(User) do
        fulltext params[:search]
        paginate(:page => params[:page] || 1, :per_page => 30)
      end
      @users = @search.results
    else
      @users = User.all.paginate(page: params[:page]).order("name asc")
    end
  end
  
  def show
    if params[:tag]
      @tag = params[:tag]
      @user = User.friendly.find(params[:user_id])
      redirect_to root_url and return unless @user.activated
      @memes = @user.memes.paginate(page: params[:page]).order(created_at: :desc).tagged_with(@tag).paginate(page: params[:page])
      @meme = @user.memes.new
    elsif params[:all]
      @user = User.friendly.find(params[:id])
      redirect_to root_url and return unless @user.activated
      redirect_to user_path(@user)
    else
      @user = User.friendly.find(params[:id])
      redirect_to root_url and return unless @user.activated
      @search = Sunspot.search(Meme) do
        fulltext params[:search]
        with :user_id, User.friendly.find(params[:id]).id
        order_by :created_at, :desc
        paginate(:page => params[:page] || 1, :per_page => 30)
      end
      
      @public_search = Sunspot.search(Meme) do
        fulltext params[:search]
        with :user_id, User.friendly.find(params[:id]).id
        order_by :created_at, :desc
        with :private, false
        paginate(:page => params[:page] || 1, :per_page => 30)
      end
      @query = params[:search]
      @memes = @search.results
      @meme = @user.memes.new
      @tag_cloud_memes = @user.memes.order(created_at: :desc).paginate(page: params[:page])
      @public_memes = params[:search] ? @public_search.results : @user.memes.paginate(:page => params[:page] || 1, :per_page => 5).where(private: false)
    end
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
