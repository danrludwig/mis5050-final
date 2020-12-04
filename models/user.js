"use strict";

const mongoose = require("mongoose"),
    { Schema } = mongoose,
    passportLocalMongoose = require("passport-local-mongoose"),
    userSchema = new Schema(
        {
            firstName: {
                type: String,
                required: true
            },
            lastName: {
                type: String,
                required: true
            }, 
            email: {
                type: String,
                required: true 
            },
            isAdmin: {
                type: Boolean,
                default: false 
            },
            favoriteStyles: [{
                type: Schema.Types.ObjectId,
                ref: "stache-style"
            }]
        }
    );

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
});

module.exports = mongoose.model("User", userSchema, "user")