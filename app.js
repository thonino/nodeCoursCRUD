// Express :
var express = require('express'); 
var app = express();

// express-session
const session = require('express-session');
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Bbcrypt
const bcrypt = require('bcrypt');

// Path :
var path = require('path'); //

// BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); 

// EJS : (Embedded JavaScript)
app.set('view engine','ejs'); 

// Mongodb et Mongoose :

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
const methodOverride = require('method-override')
app.use(methodOverride('_method'));


// cors
const cors = require('cors')
app.use(cors());


//creation token back : A VERIFIER
// const cookieParser = require('cookie-parser')
// app.use(cookieParser());
// const {createToken, validateToken} = require('')
// // Apres la verification du password
// const accessToken = createToken(user);
// response.cookie("access-token", accessToken,{
//   maxAge: 60*60*24*30,
//   httpOnly : true
// })
// ici le login
// le test se fait sur le home cf page index "/"
// ne pas oublier de modifier la redirection vers :3000 apres login



// -----------  CONTACT -----------
app.get('/contact/new', function(req, res){ 
  res.render(path.resolve('./views/ContactForm.ejs')); 
});
  app.post('/submit-contact', function(req, res){ //  
      const Data = new Contact({ 
      nom: req.body.nom, 
      prenom: req.body.prenom,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password,10),
      message: req.body.message,
  })
Data.save().then(()=>{ 
      res.redirect('http://localhost:3000/allcontact'); 
      console.log("Success Data Saved");})
    .catch(err => { console.log(err); }); 
});

app.get('/login',(req,res)=>{res.render('LoginForm')});


// POST LOGIN
app.post('/login', (req, res) => {
  Contact.findOne({ email: req.body.email }).then(contact => {
    if (!contact) {res.send('email invalide');}
    if (!bcrypt.compareSync(req.body.password, contact.password)) {
      res.send('Mot de passe invalide');}
    req.session.contact = contact;
    res.redirect('/loginsuccess');
  })
  .catch(err => console.log(err));
  });

  app.get('/loginsuccess', (req, res) => {const contact = req.session.contact;
  res.render('LoginSuccess', { contact: contact });});

  

// logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {console.log(err); } else {
      res.redirect('/login'); 
    }
  });
});

// app.get('/', validateToken, function(req, res){
// // RES.JSON [FOR REACT]
// app.get('/', function(req, res){ 
//   Contact.find() 
//   .then(data => res.json(data))
//   .catch(err => console.log(err))
// });
// RES.RENDER [FOR EJS]
app.get('/', function(req, res){
  Contact.find() 
  .then(data =>{res.render('Contact', {data:data})})
  .catch(err => console.log(err))
});

// [EDIT] 
// RES.JSON [FOR REACT]
  app.get('/contact/edit/:id', function(req, res){
    Contact.findOne({_id: req.params.id})
      .then(data => { res.json(data)})
      .catch(err => console.log(err));
  });
  // // RES.RENDER [FOR EJS]
  // app.get('/contact/edit/:id', function(req, res){
  //   Contact.findOne({_id: req.params.id})
  //     .then(data => { res.render('EditContact', { data: data });})
  //     .catch(err => console.log(err));
  // });
  app.put('/contact/update/:id', function(req, res){
    const Data = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      message: req.body.message,
    }
    if(req.body.password !== ""){
      Data.password = bcrypt.hashSync(req.body.password, 10);
    }
    Contact.updateOne({_id: req.params.id}, {$set: Data})
    .then(console.log("Data updated"), res.redirect('http://localhost:3000/allcontact'))
    .catch(err => console.log(err));
  });

// [DELETE CONTACT] 
app.delete('/contact/delete/:id', function(req, res){
  Contact.findOneAndDelete({_id: req.params.id})
  // [FOR  EJS]
  // .then(res.redirect('/'))
  .then(res.redirect('http://localhost:3000/allcontact'))
  .catch(err => console.log(err));
});


var server = express(); app.listen(5000, function () {
    console.log("server http://localhost:5000/");
});