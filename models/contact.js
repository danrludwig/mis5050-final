"use strict";

const mongoose = require("mongoose"),
  contactSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 30,
        required: [true, "Name is a required field"]
    },
    address: {
        type: String
    },
    email : {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  },
    phone : {
        type: String
    },
    message : {
      type: String,
      required: true
  },
    datePosted : {
      type: Date,
      default: new Date(),
      required: true
    },
    response : {
      type: String
  },
    dateResponded : {
      type: Date
  }, 


  });

  contactSchema.virtual("shortMessage").get(function() {
    return this.message.split(" ").splice(0,10).join(" ") + "...";
  })

module.exports = mongoose.model("contacts", contactSchema, "contacts");
