"use strict";

const {check, validationResult} = require("express-validator");
const User = require("../models/user"),
    passport = require("passport"),
    getUserParams = body => {
        return {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            isAdmin: body.isAdmin,
            favoriteStyles: body.favoriteStyles
        };
    };

module.exports = {
    getUserParams,

    index: (req, res, next) => {
        User.find()
        .then(users => {
            res.locals.users = users;
            next();
        })
        .catch(error => {
            console.log(`Error fetching users: ${error.message}`);
            next(error);
        });
    },

    indexView: (req, res) => {
        res.render("users/index");
    },

    new: (req, res) => {
        res.render("users/register");
    },

    create: (req, res, next) => {
        // console.log("_________________here")
        // if (req.skip).next();
        let newUser = new User(getUserParams(req.body));
        console.log(newUser);
        User.register(newUser, req.body.password, (error, user) => {
            console.log("here------------------------>");
            if (user) {
                console.log("what========================")
                // req.flash("success", `Created ${user.firstName} ${user.lastName}'s account successfully`);
                res.locals.redirect = "/user/login";
                next();
            } else {
                // req.flash("error", `Failed to create user account.\n ${error.message}.`);
                console.log(error.message);
                res.locals.redirect = "/user/login";
                next();
            }
        });
    }, 

    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) {
            res.redirect(redirectPath);
        } else {
            next();
        }
    },

    show: (req, res, next) => {
        let id = req.params.id;
        User.findById(id)
        .then(user => {
            res.locals.user = user;
            res.render("users/show")
        })
        .catch(error => {
            console.log(`Error fetching user: ${error.message}`);
            next(error);
        })
    },

    loginPage: (req, res) => {
        res.render("users/login");
    },

    printHi: (req, res, next) => {
        console.log("hiiiiiii");
        next();
    },

    authenticate: passport.authenticate("local", {
        failureRedirect: "/user/login",
        // failureFlash: "Failed to login.",
        successRedirect: "/",
        // successFlash: "Logged in!"
      }),

    // validate: (req, res, next) => {
    //     console.log(req.body);
    //     req
    //         .check("email")
    //         .normalizeEmail({ all_lowercase: true })
    //         .trim();
    //     req.check("email", "Email is invalid").isEmail();
    //     req.check("password", "Password cannot be empty").notEmpty();

    //     req.getValidationResult()
    //     .then(error => {
    //         if (!error.isEmpty()) {
    //             let messagees = error.array().map(a => a.msg);
    //             req.skip = true;
    //             req.flash("error", messages.join(" and "));
    //             res.locals.redirect = "/users/new";
    //         } 
    //         next();
    //     });
    // },

    logout: (req, res, next) => {
        req.logout();
        // req.flash("success", "You have been logged out!");
        res.locals.redirect = "/";
        next();
    },

    apiAuthenticate: (req, res, next) => {
        passport.authenticate("local", (errors, user) => {
            if (user) {
                let signedToken = jsonWebToken.sign(
                    {
                        data: user._id,
                        exp: new Date().setDate(new Date().getDate() + 1)
                    },
                    "some_secret_passphrase"
                );
                res.join({
                    success:true,
                    token: signedToken 
                });
            } else {
                res.json({
                    success: false,
                    message: "User not authenticated."
                });
            }
        })(req, res, next);
    },

    verifyJWT: (req, res, next) => {
         let token = req.headers.token;
         if (token) {
             jsonWebToken.verify(token, "some_secret_passphrase", (errors, payload) => {
                if (payload) {
                    User.findById(payload.data).then(user => {
                        if (user) {
                            next();
                        } else {
                            res.status(httpStatus.FORBIDDEN).json({
                                error: true,
                                message: "No User account found."
                            });
                        }
                    });
                } else {
                    res.status(httpStatus.UNAUTHORIZED).json({
                        error: true,
                        message: "Can't verify API token."
                    });
                    next();
                }
             });
         } else {
             res.status(httpStatus.UNAUTHORIZED).json({
                 erro: true,
                 message: "Provide token"
             });
         }
    },

    verifyAdmin: (req, res, next) => {
        if (res.locals.currentUser && res.locals.currentUser.isAdmin) {
            next();
        } else {
            res.send("Not authorized");
        }
    },

    addFavorite: (req, res, next) => {
        let styleId = req.params.id;
        let currentUser = req.user;
        if (currentUser) {
            User.findByIdAndUpdate(currentUser, {
                $addToSet: {
                    favoriteStyles: styleId
                }
            })
            .then(() => {
                res.locals.redirect = "/user/favorite-styles";
                next();
            })
            .catch((error) => {
                console.log(`Error adding style to favorites: ${error.message}`);
                next(error);
            })
        }
    },

    getFavorites: (req, res, next) => {
        let currentUser = req.user;
        if (currentUser) {
            User.findById(currentUser._id, "favoriteStyles")
            .populate("favoriteStyles")
            .then((user) => {
                res.render("users/favorite-styles", {styles: user.favoriteStyles});
            })
            .catch((error) => {
                console.log(`Error getting favorite styles for user: ${error.message}`);
            })
        }
    },

    checkAdmin: (req, res, next) => {
         if (res.locals.currentUser && res.locals.currentUser.isAdmin) {
             next();
         } else {
             res.send("Not authorized");
         }
    },

    userList : (req, res, next) => {
        User.find({})
        .then((users) => {
            res.render("users/list", {users: users});
        })
    }

    // update: (req, res, next) => {
    //     let userId = req.params.id;
    //     let userParams = {
    //         firstName: req.body.firstName,
    //         lastName: req.body.lastName,
    //         email: req.body.email,
    //         isAdmin: req.body.isAdmin,
    //         favoriteStyles: req.body.favoriteStyles
    //     };
    //     User.findByIdAndUpdate(userId, {
    //         $set: userParams
    //     })
    //     .then((user) => {
    //         // res.locals.redirect =
    //     })
    // }
};