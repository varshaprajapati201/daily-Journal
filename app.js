require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASS+"@atlascluster.q4fqqjb.mongodb.net/blogDB", {useNewUrlParser: true});

const postSchema = {
 title: String,
 content: String
};

const Post = mongoose.model("Post", postSchema);

const homeStartingContent = "Daily Journal is your personal journal for every day. Save your memories here.";
const aboutContent = "It's an easy-to-use journaling platform. Nothing confusing, nothing complicated- its simple diary for everyday writing. Just write and save a journal notebook!";
const contactContent = "";

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});


app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      homeContent: homeStartingContent,
      posts: posts
      });
  });

});


app.post("/compose", function(req, res) {
  const post = new Post ({
   title: req.body.postTitle,
   content: req.body.postBody
 });

 post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
   res.render("post", {
     title: post.title,
     content: post.content
   });
 });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server is up and running on port 3000");
});
