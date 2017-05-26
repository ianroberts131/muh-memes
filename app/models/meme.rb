class Meme < ApplicationRecord
  belongs_to :user
  has_many :favorites, as: :favorited
  acts_as_taggable
  mount_base64_uploader :image, ImageUploader
  validates :user_id, presence: true
  validates :image, presence: true
  validate :image_size
  
  searchable do
    text    :tag_list
    integer :user_id
    boolean :private
    time    :created_at
    time    :updated_at
  end
  
  def is_public?
    private == false
  end
  
  def self.limited_tag_counts
    self.tag_counts.most_used(100).sort_by{ |item| item.name.downcase }
  end
  
  private
  
    # Validates the size of an uploaded image
    def image_size
      if image.size > 5.megabytes
        errors.add(:image, "should be less than 5MB")
      end
    end
    
end
