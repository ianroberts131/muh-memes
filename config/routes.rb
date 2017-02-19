Rails.application.routes.draw do
  get 'users/new'

  root 'static_pages#home'
  get 'static_pages/home'
  get '/contact', to: 'static_pages#contact'
  get '/about', to: 'static_pages#about'
  get '/signup', to: 'users#new'
  post '/signup', to: 'users#create'
  resources :users
end
