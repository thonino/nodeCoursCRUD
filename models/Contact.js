// Mongodb et Mongoose :
// [npm install Mongodb --save] instale module de dépendance MongoDB
// [npm install Mongoose --save] instale module de dépendance Mongoose
// require('mongoose') : importe module Mongoose ds un modèle pr interagir avec la BDD
// contactSchema = new mongoose.Schema() : Crée la structure schéma pr l'entité "contact"
// module.exports = mongoose.model() : exporte le modèle pour qu'on puisse l'utiliser
const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
    nom: { type: String },
    prenom: { type: String },
    email: { type: String },
    message: { type: String }
});
module.exports = mongoose.model('Contact', contactSchema);
