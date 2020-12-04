"use strict";

const mongoose = require("mongoose"),
  blogPostSchema = mongoose.Schema({
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
    summary : {
      type: String,
      required: true,
      maxlength: 250
  },
    content : {
        type: String,
        required: true
    },
    datePosted : {
      type: Date,
      default: new Date(),
      required: true
    }

  });

module.exports = mongoose.model("blogs", blogPostSchema, "blogs");
