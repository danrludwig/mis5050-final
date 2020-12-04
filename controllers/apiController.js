const Styles = require("../models/stache-style"),
    httpStatus = require("http-status-codes");

module.exports = {
    getStyles: (req, res, next) => {
        Styles.find({})
        .then((styles) => {
            res.json({
                status: httpStatus.OK,
                data: styles
            })
        })
        .catch((error) => {
            console.log(error.message);
        })
    }
}