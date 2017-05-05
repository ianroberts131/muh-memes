class FavoriteMemesController < ApplicationController
  
  def create
    @meme = Meme.find(params[:meme_id])
    if Favorite.create(favorited: @meme, user: current_user)
      respond_to do |format|
        format.html { redirect_to user_meme_path(@meme.user, @meme) }
        format.js
      end
    end
  end
  
  def destroy
    @meme = Meme.find(params[:meme_id])
    Favorite.where(favorited_id: @meme.id, user_id: current_user.id).first.destroy
    respond_to do |format|
      format.html { redirect_to user_meme_path(@meme.user, @meme) }
      format.js
    end
  end
  
end