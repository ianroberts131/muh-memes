class StaticPagesController < ApplicationController
  def home
    if params[:tag]
      @tag = params[:tag]
      @memes = Meme.order(created_at: :desc).tagged_with(@tag)
      @most_used_tags = Meme.tag_counts_on(:tags).order('count desc').limit(50)
    else
      @memes = Meme.all.order(created_at: :desc)
    end
  end

  def contact
  end
  
  def about
  end
end
