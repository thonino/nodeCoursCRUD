// const {sign, verify} = require('jsonwebtoken');
// const createToken = (user) =>{
//     const accessToken = sign(
//         {username:user.username, password:user.password},
//         "SECRET"
//     )
//     return accessToken;
// }

// const validateToken = (req,res, next) =>{
//     const accessToken = req.cookies['access-token']
//     if(!accessToken){
//         return res.status(400).jason({error:"user not auth"})
//     }
//     try{
//         const validToken = verify(accessToken, "SECRET")
//         if(validToken){
//             req.authentificated = true 
//             return next();
//         }

//     }
//     catch(err){
//         return res.status(400).json({error: err});

//     }
// }

// module.exports = {createToken, validateToken} 