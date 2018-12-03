const expressEdge = require("express-edge");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const newPostController = require('./controllers/newPost')
const homePageController = require('./controllers/homePage')
const createPostController = require('./controllers/createPost')
const getPostController = require('./controllers/getPost')

const app = new express();

mongoose.connect('mongodb://127.0.0.1:27017/node-blog', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))

app.use(fileUpload());
app.use(express.static("public"));
app.use(expressEdge);
app.set('views', __dirname + '/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storePost = require('./middleware/createPost')

app.use('/posts/store', storePost)

app.get("/", homePageController);
app.get("/post/:id", getPostController);
app.get("/posts/new", newPostController);
app.post("/posts/create", createPostController);

app.listen(4000, () => {
  console.log("App listening on port 4000");
});
