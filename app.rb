require 'sinatra'
require 'data_mapper'


DataMapper::Logger.new($stdout, :debug)
DataMapper.setup(:default, "#{ENV['DATABASE_URL']}")

class Post
  include DataMapper::Resource
  property :id, Serial
  property :title, String
  property :body, Text
end

DataMapper.finalize
DataMapper.auto_upgrade!

class PCWILEY < Sinatra::Base

  get '/' do
     # get the latest 20 posts #@posts = Post.all(:order => [ :id.desc ], :limit => 20)
    @posts = Post.all
    erb :index
  end

  get '/new' do
    posty = Post.create(:title => 'posty 2!', :body => 'booody booody')
    puts '#{posty.title}'
  end

  get '/reset' do
    Post.destroy
  end

  get '/tone' do
    erb :test_tone
  end
  
end