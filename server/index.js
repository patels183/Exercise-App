const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const { LoginRequired  } = require('./controllers/security');
dotenv.config();
const cors = require('cors');
const signupController = require('./controllers/signup');
const usersModel = require('./models/userModel');
const activtyController = require('./controllers/activty');
const exerciseController = require('./controllers/exercise');
const friendController = require('./controllers/friends');
const app = express();
const port = process.env.PORT || 3000;

app
    .use(express.json())
    .use(cors())
    .use(async (req, res, next)=>{ 
        
      const token = req.headers.authorization?.split(' ')[1];
      req.user = token && await usersModel.FromJWT(token);
      next();
    }) 
    .use('/signup',signupController)
    .use('/activtyStore',LoginRequired,activtyController)
    .use('/exerciseStore',LoginRequired,exerciseController)
    .use('/friendList',LoginRequired,friendController)
    .use((err, req, res, next)=>{
      if (err.code === "INCORRECT_FILETYPE") {
        res.status(422).json({ error: 'Only images are allowed' });
        return;
      }
      if (err.code === "LIMIT_FILE_SIZE") {
        res.status(422).json({ error: 'Allow file size is 500KB' });
        return;
      }
      res.status(err.code || 500 );
      res.send( { msg: err.msg });
    })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})