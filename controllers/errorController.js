module.exports = {
    handleErrors: (error, req, res, next) => {
        res.render("error");
        console.log(error.message);
    }
}