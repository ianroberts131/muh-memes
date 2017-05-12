class AddPrivateToMemes < ActiveRecord::Migration[5.0]
  def change
    add_column :memes, :private, :boolean, :default => false
    add_index :memes, :private
  end
end
