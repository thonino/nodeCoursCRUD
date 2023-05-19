// Express :
// [npm install express --save] installe module de dépendance Express
// Il simplifie l'utilisation de Node.js 
// require('express') : importe module express 
var express = require('express'); 
var app = express();

// Path :
// require('path') : importe module de dépendance path
// path.resolve() : renvoie automatiquement le chemin absolut d'un fichier, 
//      En gros, il assure que le chemin du fichier soit toujours correcte.
var path = require('path'); //

// BodyParser
// [npm install body-parser --save] installe module de dépendance bodyParser
// require('body-parser') : importe  module bodyParser
// bodyParser.urlencoded({''}) : analyse et décode les données du (formulaires) 
// il nous permet de récupérer facilement les données envoyées par la (requête)
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); 

// EJS : (Embedded JavaScript)
// [npm install ejs --save] installe module de dépendance ejs 
// C'est un moteur de modèle pour générer du contenu HTML dynamique.
// app.set() : configure EJS comme moteur de rendu par défaut.
app.set('view engine','ejs'); 

// Mongodb et Mongoose :
// [npm install Mongodb --save] instale module de dépendance MongoDB
// [npm install Mongoose --save] instale module de dépendance Mongoose
// require('mongoose') : importe module Mongoose ds un modèle pr interagir avec la BDD
// {log} = require('console') : importe la fx() log pour afficher des mmsg dans console
// CONNEXION A LA BDD MONGODB :
// url = ""; établit les parametres pour la connexion avec Mongodb
// mongoose.connect(url, useNewUrlParser: true) : établit la connexion avec MongoDB
// utilise l'analyseur d'URL de MongoDB pr mieux prendre en charge des fx() de connexion.
// mongoose.connect(url, useUnifiedTopology: true) recommandée pr chaque applications :
// active une infrastructure de surveillance du serveur MongoDB => (topologie unifiée) 
// il offre : stabilité, performance, simplicité de connexion et gain de réactivité
var mongoose = require('mongoose');
const Contact = require('./models/Contact');
const { log } = require('console');
const url = "mongodb+srv://user:user@cluster0.gcuhga5.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => {
  console.log(err);
});

// Method-override :
// [npm install method-override --save] instale module de dépendance method-override
// pour l'utilisation de put() ou delete() qui ne sont pas prise en charge de base.
const methodOverride = require('method-override')
app.use(methodOverride('_method'));

// -----------  CONTACT -----------
// [(GET, POST)*, SAVE, PUT, DELETE] 
// * ne pas confondre avec <form method="get et post">

// [CREATE CONTACT] 
// => Ajouter un nouveau Contact dans la BDD
// app.get() : désigner route [formulaire contact] "/contact/new" 
// res.render() : response => rendu du fichier ejs "ContactForm.ejs"
app.get('/contact/new', function(req, res){ 
  res.render(path.resolve('./views/ContactForm.ejs')); 
});
// etape 1 :
  // app.post() : récupérer données formulaire de la  route "/submit-contact"
  // Data = new Contact : créer {objet} "Contact" dans Data
  // nom: req.body.nom : Contact.nom = value du formulaire dont "name = nom" 
  app.post('/submit-contact', function(req, res){ //  
      const Data = new Contact({ 
      nom: req.body.nom, 
      prenom: req.body.prenom,
      email: req.body.email,
      message: req.body.message,
  })
// etape 2 :
  // Data.save() : Enregistrement des données dans la BDD
  // redirect('') : response => redirection vers page /Contact
  // console.log("") : pour confirmer l'action via la console
  // console.catch() : pour gérer les erreurs 
Data.save().then(()=>{ 
      res.redirect('/'); 
      console.log("Success Data Saved");})
    .catch(err => { console.log(err); }); 
});

// [READ CONTACT] 
// => Lire données de la BDD dans le fichier "views/Contact.ejs" 
// app.get() : désigner route "/"
// Contact.find() : dans la BDD, chercher les {objets Contact} 
// then() : ajouter une action pour les {objets Contact} trouvés 
// res.render() : response => envoyer "data" vers la vue Contact.ejs
app.get('/', function(req, res){
    Contact.find() 
    .then(data =>{res.render('Contact', {data:data})})
    .catch(err => console.log(err))
});

// [EDIT CONTACT] 
// => Modifier les données de la BDD
// etape 1 :
  // app.get() : désigner route [formulaire edit] "/contact/edit/:id"
  // ":id" a été envoyé à l'url lors du clique du bouton "edit"
  // Contact.findOne() : dans la BDD, chercher {_id: req.params.id} == :id
  // res.render() : response => envoyer "data" trouvées vers la vue EditContact.ejs
  app.get('/contact/edit/:id', function(req, res){
    Contact.findOne({_id: req.params.id})
      .then(data => { res.render('EditContact', { data: data });})
      .catch(err => console.log(err));
  });
// etape 2 :
  // app.put() : récupérer données formulaire route "/contact/edit/:id"
  // Data = {}: Affecter des values à {objet} Data
  // Contact.updateOne() : enregistre les données de l'objet Contact de 
  // la BDD correspondant à {_id: req.params.id} == {$set: Data}
  app.put('/contact/edit/:id', function(req, res){
    const Data = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      message: req.body.message,
    }
    Contact.updateOne({_id: req.params.id}, {$set: Data})
    .then(console.log("Data updated"), res.redirect('/'))
    .catch(err => console.log(err));
  });

// [DELETE CONTACT] 
// => Supprimer les données de la BDD
// app.delete() : désigner route [delete] "/contact/delete/:id"
// Contact.findOneAndDelete() : trouver et supprimer {_id: req.params.id}
app.delete('/contact/delete/:id', function(req, res){
  Contact.findOneAndDelete({_id: req.params.id})
  .then(res.redirect('/'))
  .catch(err => console.log(err));
});

// Nodemon 
// [npm install nodemon ] installe module de dépendance nodemon
// [nodemon app.js] lance le serveur et nous évite de le relancer à chaque fois
// [npm start] pour lancer le serveur si Nodemon pas installé
// Création serveur => port:5000 
var server = express(); app.listen(5000, function () {
    console.log("server listening on port:5000");
});