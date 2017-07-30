Rails.application.routes.draw do
  get 'password_resets/new'

  get 'password_resets/edit'

  root    'static_pages#home'
  get     'static_pages/home'
  get     '/contact',     to: 'contacts#new'
  get     '/about',       to: 'static_pages#about'
  get     '/quick-meme',  to: 'static_pages#quick_meme'
  get     '/signup',      to: 'users#new'
  post    '/signup',      to: 'users#create'
  get     '/login',       to: 'sessions#new'
  post    '/login',       to: 'sessions#create'
  delete  '/logout',      to: 'sessions#destroy'
  resources :contacts,            only: [:new, :create]
  resources :users do
    resources :memes,             only: [:show, :create, :destroy, :update] do
      resources :favorite_memes,      only: [:create, :destroy]
    end
  end
  resources :memes,               only: [:create]
  resources :original_images,     only: [:index, :create, :show, :destroy, :update]
  resources :account_activations, only: [:edit]
  resources :password_resets,     only: [:new, :create, :edit, :update]
  
end
