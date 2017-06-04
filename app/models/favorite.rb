class Favorite < ApplicationRecord
  belongs_to    :user
  belongs_to    :favorited, polymorphic: true
  after_save    :update_favorites_count_index
  after_destroy :update_favorites_count_index
end

private

  def update_favorites_count_index
    Sunspot.index!(favorited)
  end

