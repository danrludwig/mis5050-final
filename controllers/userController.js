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
        let newUser = new User(getUserParams(req.body));
        console.log(newUser);
        User.register(newUser, req.body.password, (error, user) => {
            if (user) {
                res.locals.redirect = "/user/login";
                next();
            } else {
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

    authenticate: passport.authenticate("local", {
        failureRedirect: "/user/login",
        successRedirect: "/",
      }),

    logout: (req, res, next) => {
        req.logout();
        res.locals.redirect = "/";
        next();
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

    userList: (req, res, next) => {
        User.find({})
        .then((users) => {
            res.render("users/list", {users: users});
        })
        .catch(error => {
            console.log(error.message);
            next(error);
        })
    },

    updateUsers: (req, res, next) => {
        let users = req.body.users;
        users.forEach(user => {
            User.findById(user._id)
            .then(userInfo => {
                let userParams = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
                favoriteStyles: userInfo.favoriteStyles
                }
                User.findByIdAndUpdate(user._id, {
                    $set: userParams
                })
                .then(user => {
                    console.log(user);
                    next();
                })
            })
        })
    }
    // index: (req, res, next) => {
    //     User.find()
    //     .then(users => {
    //         res.locals.users = users;
    //         next();
    //     })
    //     .catch(error => {
    //         console.log(`Error fetching users: ${error.message}`);
    //         next(error);
    //     });
    // },

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