class StaticPagesController < ApplicationController
  def home
    if params[:all]
      redirect_to root_path
    else
      filter = params[:filter]
      if filter == "day" || filter == "week" || filter == "month"
        created_at_statement = ""
        case filter
        when "day"
          created_at_statement = 1.day.ago
        when "week"
          created_at_statement = 7.days.ago
        when "month"
          created_at_statement = 1.month.ago
        end
        @search = Sunspot.search(Meme) do
          fulltext params[:search]
          with(:created_at).greater_than created_at_statement
          with :private, false
          order_by :favorites_count, :desc
          paginate(:page => params[:page] || 1, :per_page => 35)
        end
      else
        @search = Sunspot.search(Meme) do
          fulltext params[:search]
          with :private, false
          order_by :favorites_count, :desc
          paginate(:page => params[:page] || 1, :per_page => 35)
        end
      end
      @query = params[:search]
      @memes = @search.results
    end
    @tag_cloud_memes = Meme.all.order(created_at: :desc).where(private: false)
  end

  def contact
  end
  
  def about
  end
  
  def quick_meme
  end
  
end
