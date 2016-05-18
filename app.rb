require 'sinatra'
require 'data_mapper'
require 'curb'
require 'json'

DataMapper::Logger.new($stdout, :debug)
DataMapper.setup(:default, "#{ENV['DATABASE_URL']}")

class Page
  include DataMapper::Resource
  property :id, Serial
  property :slug, Text
  property :title, String
  property :body, Text
  property :published, Boolean, :default => false
end

class Post
  include DataMapper::Resource
  property :id, Serial
  property :title, String
  property :images, Text
  property :body, Text
  property :published, Boolean, :default => false
end

DataMapper.finalize
DataMapper.auto_upgrade!

class PCWILEY < Sinatra::Base

  # authorize user
  def authorized?
    @auth ||=  Rack::Auth::Basic::Request.new(request.env)
    @auth.provided? &&
    @auth.basic? &&
    @auth.credentials &&
    @auth.credentials == [ENV['PC_USERNAME'],ENV['PC_PASSWORD']]
  end

  def protected!
    unless authorized?
      response['WWW-Authenticate'] = %(Basic realm="what's up")
      throw(:halt, [401, "hi haters"])
    end
  end

  get '/design' do
     # get the latest 20 posts #@posts = Post.all(:order => [ :id.desc ], :limit => 20)
    @posts = Post.all
    erb :posts
  end

  get '/admin' do
    protected!
    @pages = Page.all
    @posts = Post.all
    erb :admin
  end

  get '/admin/newpage' do
    protected!
    erb :page_new
  end

  post '/admin/newpage' do
    newPage = Page.create(:slug => params[:slug], :title => params[:title], :body => params[:body], :published => params[:published])
    redirect '/admin'
  end

  get '/admin/editpage/:id' do
    protected!
    @page = Page.get(params[:id])
    erb :page_edit
  end

  post '/admin/editpage/:id' do
    Page.get(params[:id]).update(:slug => params[:slug], :title => params[:title], :body => params[:body], :published => params[:published])
    redirect '/admin'
  end

  get '/admin/newpost' do
    protected!
    erb :post_new
  end

  post '/admin/newpost' do
    newPost = Post.create(:title => params[:title], :images => params[:images], :body => params[:body], :published => params[:published])
    redirect '/admin'
  end

  get '/admin/editpost/:id' do
    protected!
    @post = Post.get(params[:id])
    erb :post_edit
  end

  post '/admin/editpost/:id' do
    Post.get(params[:id]).update(:title => params[:title], :images => params[:images], :body => params[:body], :published => params[:published])
    redirect '/admin'
  end

  post '/admin/deletepost/:id' do
    Post.get(params[:id]).destroy
    redirect '/admin'
  end

  post '/admin/deletepage/:id' do
    Page.get(params[:id]).destroy
    redirect '/admin'
  end

  get '/admin/reset' do
    Post.destroy
    redirect '/admin'
  end

  get '/test/tone' do
    protected!
    erb :test_tone
  end

  get '/test/sentiment' do

    c = Curl::Easy.new
    url = "http://www.sentiment140.com/api/bulkClassifyJson?appid=peter.c.wiley@gmail.com"
    headers = {}
    headers['Content-Type'] = 'application/json'
    headers['X-Requested-With'] = 'XMLHttpRequest'
    headers['Accept'] = 'application/json'
    payload = "{'data': [{'text': 'I love Titanic.'}]}"
    
    c.url = url
    c.headers = headers
    c.verbose = true

    c.http_post(payload)

    hash = JSON.parse c.body_str
    puts hash
    puts hash['data']
    puts hash['data'][0]['text']

    c.on_success {|easy| puts "success, add more easy handles" }

  end

  get '/:page' do
    @page = Page.first(:slug => params[:page])

    unless @page.published
      halt 404, '<h1>Not Found</h1>'
    end

    erb :page
  end

end