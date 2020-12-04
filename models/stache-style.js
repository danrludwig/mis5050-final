"use strict";

const mongoose = require("mongoose"),
  stacheStyleSchema = mongoose.Schema({
    title: {
        type: String,
        maxlength: 30,
        required: true
    },
    imageUrl: {
        type: String,
        match: /^.*\.(jpg|JPG|png|PNG)$/,
        required: true
    },
    description : {
        type: String,
        required: true
    }

  });

module.exports = mongoose.model("stache-style", stacheStyleSchema, "styles");
