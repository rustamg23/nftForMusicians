const express = require("express");
const multer = require('multer');
const path = require('path');
const app = express();
const helpers = require('./helpers');

const getProvider = () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
    window.open("https://phantom.app/", "_blank");
  };

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const urlencodedParser = express.urlencoded({extended: false});
  
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});



app.post('/upload-profile-pic', urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');
    
    upload(req, res, function(err) {
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        res.send(`You have uploaded image`);// ${req.file.path} <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">`);
        console.log(req.body.userName);
    });
    
    
    //res.send(`${req.body.userName} - ${req.body.userImage}`);
});
   
app.listen(3000, ()=>console.log("Сервер запущен..."));