var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var express    = require('express');
var app        = express();

mongoose.connect('mongodb://localhost/restful_blog_app');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);

/****************************************
            // ROUTES //
****************************************/
// Root redirect to index
app.get('/', function(req, res){
  res.redirect('/blogs');
});

// INDEX with route of /blog
app.get('/blogs', function(req, res) {
  Blog.find({}, function(err, blogs) {
    if(err) {
      console.log(err);
    } else {
      res.render('index', {blogs: blogs});
    }
  });
});

// NEW FORM ROUTE
app.get('/blogs/new', function(req, res){
  res.render('new');
});

// CREATE ROUTE
app.post('/blogs', function(req, res) {
  Blog.create(req.body.blog, function(err, newBlog) {
    if(err) {
      res.render('new');
    } else {
      res.redirect('/blogs');
    }
  });
});

// SERVER FUNCTION
app.listen(27017, function() {
  console.log("Server has started..");
});
