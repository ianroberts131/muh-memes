class Meme < ApplicationRecord
  belongs_to :user
  acts_as_taggable
  mount_base64_uploader :image, ImageUploader
  validates :user_id, presence: true
  validates :image, presence: true
  validate :image_size
  
  private
  
    # Validates the size of an uploaded image
    def image_size
      if image.size > 5.megabytes
        errors.add(:image, "should be less than 5MB")
      end
    end
    
end
