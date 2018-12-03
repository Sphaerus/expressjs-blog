const express = require('express');
const path = require('path');
const expressEdge = require('express-edge');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./database/models/Post');

const fileUpload = require("express-fileupload");

const createPost = require('./middleware/createPost')

const app = new express();

mongoose.connect('mongodb://127.0.0.1:27017/blog', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))


app.use(express.static('public'));
app.use(fileUpload());
app.use(expressEdge);
app.set('views', __dirname + '/views');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/posts/create', createPost)

app.get('/', async (req, res) => {
    const posts = await Post.find({})
    res.render('index', {
        posts
    })
});

app.get('/about', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/contact.html'));
});

app.get('/post', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/post.html'));
});

app.get('/posts/new', (req, res) => {
    res.render('new')
});

app.post('/posts/create', (req, res) => {
  const { image } = req.files

   image.mv(path.resolve(__dirname, 'public/posts', image.name), (error) => {
       Post.create({
           ...req.body,
           image: `/posts/${image.name}`
       }, (error, post) => {
           res.redirect('/');
       });
   })
});

app.get('/post/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('post', {
        post
    })
});

app.listen(4000, () => {
    console.log('App listening on port 4000')
});
