class RemoveMemesCountFromOriginalImages < ActiveRecord::Migration[5.0]
  def change
    remove_column :original_images, :memes_count, :integer
  end
end
