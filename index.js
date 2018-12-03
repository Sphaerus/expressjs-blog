const expressEdge = require("express-edge");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const auth = require("./middleware/auth");
const connectFlash = require("connect-flash");

const newPostController = require('./controllers/newPost')
const homePageController = require('./controllers/homePage')
const createPostController = require('./controllers/createPost')
const getPostController = require('./controllers/getPost')
const createUserController = require('./controllers/createUser');
const newUserController = require('./controllers/newUser');
const loginController = require("./controllers/login");
const loginUserController = require('./controllers/loginUser');
const storePost = require('./middleware/createPost')
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')


const app = new express();

mongoose.connect('mongodb://127.0.0.1:27017/node-blog', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))

const mongoStore = connectMongo(expressSession);

app.use(expressSession({
    secret: 'secret',
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use(fileUpload());
app.use(express.static("public"));
app.use(expressEdge);
app.set('views', __dirname + '/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressSession({
    secret: 'secret'
}));
app.use(connectFlash());

app.use('/posts/store', storePost)

app.get("/", homePageController);
app.get("/post/:id", getPostController);
app.get("/posts/new", auth, newPostController);
app.post("/posts/create", auth, createPostController);
app.get("/auth/register", redirectIfAuthenticated, newUserController);
app.post("/users/register", redirectIfAuthenticated, createUserController);
app.get('/auth/login', redirectIfAuthenticated, loginController);
app.post('/users/login', redirectIfAuthenticated, loginUserController);

app.listen(4000, () => {
  console.log("App listening on port 4000");
});
