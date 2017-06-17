class MemesController < ApplicationController
  require 'mini_magick'
  before_action :logged_in_user, only: [:show, :create, :update, :destroy]
  
  def show
    @meme = Meme.find(params[:id])
    if OriginalImage.exists?(id: @meme.original_image_id)
      @original_image = OriginalImage.find(@meme.original_image_id)
    end
    @user = User.find(@meme.user_id)
    if !current_user?(@user) && @meme.private
      flash[:danger] = "You are not allowed to view private memes!"
      redirect_to root_url
    end
  end
  
  def create
    @user = current_user
    @meme = @user.memes.build(meme_params)
    if !@meme.original_image_id.nil?
      @original_image = OriginalImage.find(@meme.original_image_id)
      params[:meme][:original_image_id] = @original_image.id
    end
    if @meme.save
      flash[:success] = "Meme created!"
    else
      # flash[:danger] = "Meme failed to be created."
      flash[:danger] = @meme.errors.full_messages.to_sentence
    end
    redirect_to user_url(current_user)
  end
  
  def update
    @user = User.friendly.find(params[:user_id])
    @meme = @user.memes.find(params[:id])
    
    @meme.assign_attributes(meme_params)
    
    if @meme.save
      respond_to do |format|
        format.html { flash[:success] = "Meme updated!"
                      redirect_to user_url(current_user) }
        format.json
      end
    else
      respond_to do |format|
        format.html { flash[:danger] = "There was an error updating the meme. Please try again."
                      render :show }
        format.json
      end
      
    end
  end
  
  def destroy
    @user = User.friendly.find(params[:user_id])
    @meme = @user.memes.find(params[:id])
    if current_user != @user
      flash[:danger] = "You are not allowed to delete other users' memes!"
      redirect_to user_url(current_user)
    end
    
    if @meme.destroy
      @meme.remove_image!
      flash[:success] = "Meme deleted successfully"
    else
      flash[:danger] = "There was an error deleting the meme"
    end
    redirect_to user_url(current_user)
  end
  
  # Helper method to get tag counts (global)
  def tag_cloud
    @tags = Meme.tag_counts_on(:tags)
  end
  
  private
  
    def meme_params
      params.require(:meme).permit(:image, :remote_image_url, :tag_list, :private, :original_image_id)
    end
    
    def correct_user
      @meme = current_user.memes.find_by(id: params[:id])
      redirect_to root_url if @meme.nil?
    end
    
end
