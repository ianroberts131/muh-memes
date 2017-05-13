class StaticPagesController < ApplicationController
  def home
    if params[:tag]
      @tag = params[:tag]
      @memes = Meme.order(created_at: :desc).tagged_with(@tag)
    else
      @memes = Meme.all.order(created_at: :desc)
    end
    
    @memes = @memes.where(private: false)
  end

  def contact
  end
  
  def about
  end
  
end
