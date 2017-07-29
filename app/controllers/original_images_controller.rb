class OriginalImagesController < ApplicationController
  require 'mini_magick'
  before_action :logged_in_user, only: [:create, :update, :destroy]
  
  def index
    @original_images = OriginalImage.left_joins(:memes)
                                    .group(:id)
                                    .order('COUNT(memes.id) DESC')
                                    .all.where(private: false).paginate(:page => params[:page], :per_page => 30)
  end
  
  def show
    @original_image = OriginalImage.find(params[:id])
    @user = User.find(@original_image.user_id)
    if (@original_image.private && @user != current_user)
      flash[:danger] = "You are not permitted to view this image!"
      redirect_to user_url(current_user)
    end
    @meme = @original_image.memes.new
    @memes = @original_image.memes.where(private: false).paginate(:page => params[:page], :per_page => 30)
  end
  
  def create
    @user = current_user
    @original_image = @user.original_images.new(original_image_params)
    if @original_image.save
      flash[:success] = "Meme created!"
    else
      flash[:danger] = "Meme failed to be created"
    end
    redirect_to user_url(current_user)
  end
  
  def update
    @original_image = OriginalImage.find(params[:id])
    @user = User.find(@original_image.user_id)
    if (current_user != @user)
      flash[:danger] = "You cannot update other users' original images!"
      redirect_to user_url(current_user)
    end
    @original_image.assign_attributes(original_image_update_params)
    
    if @original_image.save
      respond_to do |format|
        format.html { flash[:success] = "Original image updated!"
                      redirect_to user_url(current_user) }
        format.json
      end
    else
      respond_to do |format|
        format.html { flash[:danger] = "There was an error updating the original image. Please try again."
                      render :show }
        format.json
      end
    end
  end
  
  def destroy
    @original_image = OriginalImage.find(params[:id])
    @user = User.find(@original_image.user_id)
    if current_user != @user
      flash[:danger] = "You are not allowed to delete other users' original images!"
    end
    
    if @original_image.destroy
      @original_image.remove_original_image!
      flash[:success] = "Original image deleted successfully"
    else
      flash[:danger] = "There was an error deleting the original image"
    end
    redirect_to user_url(current_user)
  end
  
  private
  
  def original_image_params
    params.require(:original_image).permit(:original_image, :private, 
                                            memes_attributes: [:id, :original_image_id, :image, :tag_list, :private]).deep_merge(
                                            memes_attributes: [user_id: current_user.id, image: params[:original_image][:meme][:image],
                                            tag_list: params[:original_image][:meme][:tag_list], 
                                            private: params[:original_image][:meme][:private]])
  end
  
  def original_image_update_params
    params.require(:original_image).permit(:private)
  end
  
end
