class AddMemeCountToOriginalImages < ActiveRecord::Migration[5.0]
  def change
    add_column :original_images, :memes_count, :integer, default: 0
  end
end
