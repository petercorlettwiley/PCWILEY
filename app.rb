require 'sinatra'
require 'data_mapper'
require 'curb'
require 'json'
require 'compass'

DataMapper::Logger.new($stdout, :debug)
DataMapper.setup(:default, "#{ENV['DATABASE_URL']}")

class Page
  include DataMapper::Resource
  property :id, Serial
  property :slug, Text
  property :title, String
  property :images, Text
  property :body, Text
  property :published, Boolean, :default => false
  property :type, String, :default => 'page'
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
  #handle all the SASS files and convert to css on the fly
  get '/css/:name.css' do
    if :name != 'normalize' then 
      content_type 'text/css', :charset => 'utf-8'
      scss :"stylesheets/#{params[:name]}"
    end
  end

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

  # home
  get '/' do 
    @page = Page.first(:type => 'home')
    @links = Page.all(:published => true, :type.not => 'home')
    @home = Page.first(:type => 'home')

    unless @page.published
      halt 404, '<h1>Not Found</h1>'
    end

    erb :page
  end

  # admin section and commands
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
    protected!
    newPage = Page.create(:slug => params[:slug], :title => params[:title], :images => params[:images], :body => params[:body], :published => params[:published], :type => params[:type])
    redirect '/admin'
  end

  get '/admin/editpage/:id' do
    protected!
    @page = Page.get(params[:id])
    erb :page_edit
  end

  post '/admin/editpage/:id' do
    protected!
    Page.get(params[:id]).update(:slug => params[:slug], :title => params[:title], :images => params[:images], :body => params[:body], :published => params[:published], :type => params[:type])
    redirect '/admin'
  end

  get '/admin/newpost' do
    protected!
    erb :post_new
  end

  post '/admin/newpost' do
    protected!
    newPost = Post.create(:title => params[:title], :images => params[:images], :body => params[:body], :published => params[:published])
    redirect '/admin'
  end

  get '/admin/editpost/:id' do
    protected!
    @post = Post.get(params[:id])
    erb :post_edit
  end

  post '/admin/editpost/:id' do
    protected!
    Post.get(params[:id]).update(:title => params[:title], :images => params[:images], :body => params[:body], :published => params[:published])
    redirect '/admin'
  end

  post '/admin/deletepost/:id' do
    protected!
    Post.get(params[:id]).destroy
  end

  post '/admin/deletepage/:id' do
    protected!
    Page.get(params[:id]).destroy
  end

  # custom pages
  get '/:page' do
    @page = Page.first(:slug => params[:page])
    @links = Page.all(:published => true, :type.not => 'home')
    @home = Page.first(:type => 'home')

    unless @page.published
      halt 404, '<h1>Not Found</h1>'
    end

    case @page.type
    when 'archive'
      @posts = Post.all
      erb :archive
    when 'home'
      redirect '/'
    else
      erb :page
    end
  end

  get '/test/tone' do
    protected!
    erb :test_tone
  end

  get '/test/sentiment' do
    protected!

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

end