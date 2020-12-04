module.exports = {
    home: (req, res, next) => {
        res.render("index");
    },

    about: (req, res, next) => {
        res.render("about");
    }
}