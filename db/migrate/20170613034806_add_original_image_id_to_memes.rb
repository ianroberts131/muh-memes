class AddOriginalImageIdToMemes < ActiveRecord::Migration[5.0]
  def change
    add_reference :memes, :original_image, foreign_key: true
  end
end
