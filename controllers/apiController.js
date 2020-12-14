const { json } = require("express");
const passport = require("passport");
const Styles = require("../models/stache-style"),
    httpStatus = require("http-status-codes"),
    jsonwebtoken = require("jsonwebtoken"),
    axios = require("axios");

module.exports = {
    getStyles: (req, res, next) => {
        Styles.find({})
        .then((styles) => {
            styles.forEach(style => {
                let imageName = style.imageUrl;
                style.imageUrl = "http://localhost:3000/images/" + imageName;
            })
            res.json({
                status: httpStatus.OK,
                data: styles
            })
        })
        .catch((error) => {
            console.log(error.message);
        })
    },

    getToken: (req, res, next) => {
        let jsonToken = jsonwebtoken.sign(
            {
                exp: new Date().setDate(new Date().getDate() + 1)
            },
            "some_passcode_phrase"
        );
        res.json({
            success: true,
            token: jsonToken
        });

        // passport.authenticate("local", (errors, user) => {
        //     if (user) {
        //         let token = jsonwebtoken.sign(
        //             {
        //                 // data: user._id,
        //                 exp: new Date().setDate(new Date().getDate() + 1)
        //             },
        //             "some_passcode_phrase_thing"
        //         );
        //         res.join({
        //             success: true,
        //             token: token
        //         });
        //     } else { 
        //         res.join({
        //             success: false,
        //             message: "Couldn't get token."
        //         });
        //     }
        // })(req, res, next);
    },

    verifyToken: (req, res, next) => {
        let token = req.query.token;
        console.log(token);
        if (token) {
            jsonwebtoken.verify(token, "some_passcode_phrase", (error, info) => {
                if (info) {
                    next();
                } else {
                    res.status(httpStatus.UNAUTHORIZED).json({
                        error: true,
                        message: "Can't verify API."
                    });
                    next()
                }
            })
        } else {
            res.status(httpStatus.UNAUTHORIZED).json({
                error: true,
                message: "No Token"
            });
        }(req, res, next);
    },

    getDogs: async (req, res, next) => {
        try {
            let result = await axios.get("https://dog.ceo/api/breeds/image/random");
            res.render("external-api", {data: result.data})
            // res.json(result.data);
          } catch (error) {
            res.send("something went wrong");
          }
    }
}