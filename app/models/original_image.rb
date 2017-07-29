class OriginalImage < ApplicationRecord
  belongs_to :user
  has_many :memes
  accepts_nested_attributes_for :memes
  mount_uploader :original_image, OriginalImageUploader
  validates :original_image, presence: true
  
  private
  
    # Validates the size of an uploaded image
    def image_size
      if image.size > 5.megabytes
        errors.add(:image, "should be less than 5MB")
      end
    end
end
