class StaticPagesController < ApplicationController
  def home
    if params[:tag]
      @tag = params[:tag]
      @memes = Meme.tagged_with(@tag)
      @most_used_tags = Meme.tag_counts_on(:tags).order('count desc').limit(50)
    else
      @memes = Meme.all
    end
  end

  def contact
  end
  
  def about
  end
end
