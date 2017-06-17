class CreateOriginalImages < ActiveRecord::Migration[5.0]
  def change
    create_table :original_images do |t|
      t.string :original_image
      t.integer :count
      t.references :user, foreign_key: true
      t.timestamps
    end
    add_index :original_images, [:user_id, :created_at]
  end
end
