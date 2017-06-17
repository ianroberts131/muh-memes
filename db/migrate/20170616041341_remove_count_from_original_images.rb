class RemoveCountFromOriginalImages < ActiveRecord::Migration[5.0]
  def change
    remove_column :original_images, :count, :integer
  end
end
