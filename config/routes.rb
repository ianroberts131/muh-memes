Rails.application.routes.draw do
  get 'password_resets/new'

  get 'password_resets/edit'

  root    'static_pages#home'
  get     'static_pages/home'
  get     '/contact', to: 'static_pages#contact'
  get     '/about',   to: 'static_pages#about'
  get     '/signup',  to: 'users#new'
  post    '/signup',  to: 'users#create'
  get     '/login',   to: 'sessions#new'
  post    '/login',   to: 'sessions#create'
  delete  '/logout',  to: 'sessions#destroy'
  resources :users do
    resources :memes,             only: [:show, :destroy, :update] do
      resources :favorite_memes,      only: [:create, :destroy]
    end
  end
  resources :memes,               only: [:create]
  resources :account_activations, only: [:edit]
  resources :password_resets,     only: [:new, :create, :edit, :update]
  
end
