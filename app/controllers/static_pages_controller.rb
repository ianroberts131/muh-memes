class StaticPagesController < ApplicationController
  def home
    if params[:all]
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
    @tag_cloud_memes = Meme.all.order(updated_at: :desc).where(private: false)
  end

  def contact
  end
  
  def about
  end
  
end
