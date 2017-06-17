class AddRememeableToOriginalImages < ActiveRecord::Migration[5.0]
  def change
    add_column :original_images, :rememeable, :boolean
  end
end
