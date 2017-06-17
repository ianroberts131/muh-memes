class RenameRememeableToPrivate < ActiveRecord::Migration[5.0]
  def change
    rename_column :original_images, :rememeable, :private
  end
end
