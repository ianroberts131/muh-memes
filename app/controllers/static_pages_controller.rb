class StaticPagesController < ApplicationController
  def home
    if params[:tag]
      @tag = params[:tag]
      @memes = Meme.paginate(page: params[:page]).order(updated_at: :desc).tagged_with(@tag).where(private: false)
    elsif params[:all]
      redirect_to root_path
    else
      filter = params[:filter]
      if filter == "day" || filter == "week" || filter == "month"
        updated_at_statement = ""
        case filter
        when "day"
          updated_at_statement = 1.day.ago
        when "week"
          updated_at_statement = 7.days.ago
        when "month"
          updated_at_statement = 1.month.ago
        end
        @search = Sunspot.search(Meme) do
          fulltext params[:search]
          with(:updated_at).greater_than updated_at_statement
          order_by :favorites_count, :desc
          paginate(:page => params[:page] || 1, :per_page => 50)
        end
      else
        @search = Sunspot.search(Meme) do
          fulltext params[:search]
          order_by :favorites_count, :desc
          paginate(:page => params[:page] || 1, :per_page => 50)
        end
      end
      @tag_cloud_memes = Meme.all.order(updated_at: :desc).where(private: false)
      @query = params[:search]
      @memes = @search.results
    end
  end

  def contact
  end
  
  def about
  end
  
end
