class StaticPagesController < ApplicationController
  def home
    if params[:tag]
      @tag = params[:tag]
      @memes = Meme.paginate(page: params[:page]).order(created_at: :desc).tagged_with(@tag).where(private: false)
    elsif params[:all]
      redirect_to root_path
    else params[:search]
      @search = Sunspot.search(Meme) do
        fulltext params[:search]
        order_by :created_at, :desc
        paginate(:page => params[:page] || 1, :per_page => 50)
      end
      @query = params[:search]
      @memes = @search.results
      @tag_cloud_memes = Meme.all.order(created_at: :desc).where(private: false)
    end
  end

  def contact
  end
  
  def about
  end
  
end
