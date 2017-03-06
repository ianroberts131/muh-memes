class CreateMemes < ActiveRecord::Migration[5.0]
  def change
    create_table :memes do |t|
      t.string :image
      t.string :name
      t.references :user, foreign_key: true

      t.timestamps
    end
    add_index :memes, [:user_id, :created_at]
  end
end
