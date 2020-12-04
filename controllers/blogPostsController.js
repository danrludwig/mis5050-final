const BlogPost = require("../models/blogPost.js");
const dateFormat = require("dateformat");

module.exports = {
    showAllPosts: (req, res, next) => {
        BlogPost.find({}).sort({ datePosted: 'desc' })
            .then((posts) => {
                console.log(posts);
                res.render("blog/blog", { posts: posts });
            })
            .catch((err) => {
                next(err);
            });

    }, 
    showPost: (req, res, next) => {
        let id = req.params.id;
        BlogPost.findById(id)
            .then((post) => {
                console.log(post);
                res.render("blog/blog-single-post", { post: post, dateFormat: dateFormat });
            })
            .catch((err) => {
                next(err);
            });
    }
}