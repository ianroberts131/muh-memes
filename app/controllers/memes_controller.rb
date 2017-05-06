class MemesController < ApplicationController
  require 'mini_magick'
  before_action :logged_in_user, only: [:create, :destroy]
 
  def show
    @user = User.friendly.find(params[:user_id])
    @meme = @user.memes.find(params[:id])
  end
  
  def new
    @user = current_user
    @meme = @user.memes.new
  end
  
  def create
    # respond_to :js

    @meme = current_user.memes.build(meme_params)
    
    if @meme.save
      flash[:success] = "Meme created!"
    else
      flash[:danger] = "Meme failed to be created."
    end
    redirect_to user_url(current_user)
  end
  
  def update
    @user = User.friendly.find(params[:user_id])
    @meme = @user.memes.find(params[:id])
    
    @meme.assign_attributes(meme_params)
    
    if @meme.save
      flash[:success] = "Meme updated!"
      redirect_to user_url(current_user)
    else
      flash[:danger] = "There was an error updating the meme. Please try again."
      render :show
    end
  end
  
  def destroy
    @user = User.friendly.find(params[:user_id])
    @meme = @user.memes.find(params[:id])
    
    if @meme.destroy
      @meme.remove_image!
      flash[:success] = "Meme deleted successfully"
    else
      flash[:danger] = "There was an error deleting the meme"
    end
    redirect_to user_url(current_user)
  end
  
  private
  
    def meme_params
      params.require(:meme).permit(:image, :remote_image_url, :tag_list)
    end
    
    def correct_user
      @meme = current_user.memes.find_by(id: params[:id])
      redirect_to root_url if @meme.nil?
    end
    
end
