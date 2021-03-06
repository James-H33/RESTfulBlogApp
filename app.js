var expressSanitizer = require('express-sanitizer');
var methodOverride   = require('method-override');
var bodyParser       = require('body-parser');
var mongoose         = require('mongoose');
var express          = require('express');
var app              = express();

mongoose.connect('mongodb://localhost/restful_blog_app');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
// expressSanitizer must go after bodyParser.
app.use(expressSanitizer());
app.use(methodOverride('_method'));

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

// CREATE ROUTE ---- The console.log's will show how express-sanitizer works.
app.post('/blogs', function(req, res) {
  console.log(req.body);
  req.body.blog.body = req.sanitize(req.body.blog.body);
  console.log("================");
  console.log(req.body);

  Blog.create(req.body.blog, function(err, newBlog) {
    if(err) {
      res.render('new');
    } else {
      res.redirect('/blogs');
    }
  });
});

// SHOW ROUTE
app.get('/blogs/:id', function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if(err){
      res.redirect('/blogs');
    } else {
      res.render('show', {blog: foundBlog});
    }
  });
});

// EDIT ROUTE
app.get('/blogs/:id/edit', function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if(err) {
      res.redirect('/blogs');
    } else {
      res.render('edit', {blog: foundBlog});
    }
  });
});

// UPDATE ROUTE
app.put('/blogs/:id', function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  // Blog.findByIdAndUpdate(id, newData, callback)
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
    if(err) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/'+ req.params.id);
    }
  });
});

// DELETE ROUTE
app.delete('/blogs/:id', function(req, res) {
  Blog.findByIdAndRemove(req.params.id, req.body.blog, function(err) {
  if(err) {
    res.redirect('/blogs');
  } else {
    res.redirect('/blogs');
  }
  });
});

// SERVER FUNCTION
app.listen(27017, function() {
  console.log("Server has started..");
});
