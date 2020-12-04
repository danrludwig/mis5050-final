const BlogPost = require("../models/blogPost.js");
const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://dbo:dbpassword@cluster0.b7d0m.mongodb.net/midterm-mustache?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  );

BlogPost.insertMany([
    {
        title: "Why I Grew a Mustache",
        summary: "Summary of blog post 1",
        content: "<p>Paragraph 1</p><p>Paragraph2</p><p>Paragraph3</p>",
        imageUrl: "cutting-mustache.jpg"
    }, 
    {
        title: "In the Country",
        summary: "Summary of blog post 2",
        content: "<p>Paragraph 1</p><p>Paragraph2</p><p>Paragraph3</p>",
        imageUrl: "in-the-country.jpg"
    }, 
    {
        title: "The Mustache Brothers",
        summary: "Summary of blog post 3",
        content: "<p>Paragraph 1</p><p>Paragraph2</p><p>Paragraph3</p>",
        imageUrl: "mustache-brothers.jpg"
    } 
]).then((result) => {console.log(result)}).catch((err) => {console.log(err)});