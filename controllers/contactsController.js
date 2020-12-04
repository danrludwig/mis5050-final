const Contact = require("../models/contact.js");
const dateFormat = require("dateformat");

module.exports = {

    newContact: (req, res) => {
        res.render("contact/contact");
    },
    
    createContact : (req, res, next) => {
        Contact.create(req.body).then((result) => {
            //console.log(result);
            res.render("thanks");
        }).catch((err) => {
            next(err);
        });
    },

    getUnrespondedContacts : (req, res, next) => {
        Contact.find().where({dateResponded: null})
        .then((contacts) => {
            res.render("contact/contact-list", {contacts: contacts, dateFormat: dateFormat})
        }).catch((err) => {
            next(err);
        });
    },

    getContactById : (req, res, next) => {
        let id = req.params.id;
        Contact.findById(id)
        .then((contact) => {
            res.render("contact/contact-respond", {contact: contact});
        })
        .catch((err) => {
            next(err);
        });
    },

    updateContactById: (req, res, next) => {
        let id = req.body.id;
        Contact.findByIdAndUpdate(id, {$set: {dateResponded: new Date(), response: req.body.response}}, {new: true})
        .then((result) => {
            console.log(result);
            res.redirect("/contacts");
        }) .catch((err) => {
            next(err);
        });
    }

};