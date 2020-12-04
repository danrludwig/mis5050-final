const { render } = require("ejs");
const Style = require("../models/stache-style.js");
module.exports = {

    showAllStyles: (req, res, next) => {
        Style.find({}).then((styles) => {
            res.render("styles/gallery", {styles: styles});
        }).catch((err) => {
            next(err);
        })

    },

    showStyle : (req, res, next) => {
        let id = req.params.id;
        Style.findById(id).then((style) => {
            res.render("styles/gallery-single-post", {style: style});
        }).catch((err) => {
            next(err);
        })

    },

    newStyle: (req, res) => {
        res.render("styles/new");
    },

    createStyle: async (req, res, next) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send("No file were uploaded.");
        }
        try {
            let newStyle = await Style.create( {
                title: req.body.title,
                description: req.body.description,
                imageUrl: req.files.picture.name
            });
            if (newStyle) {
                let picture = req.files.picture;
                picture.mv((__dirname + "/../public/images/" + picture.name), function(error) {
                    if (error) {
                        return res.status(500).send(error);
                    }
                    res.redirect("/gallery");
                });
            }
        } catch (error) {
            console.log(error);
        }
    } 
}