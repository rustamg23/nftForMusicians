const express = require("express");
const multer = require('multer');
const path = require('path');
const app1 = express();
const helpers = require('./helpers');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = express.urlencoded({extended: false});
  
app1.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app1.post('/upload-profile-pic', urlencodedParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');
    console.log(req.body.userName);
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

        res.send(`You have uploaded image ${req.file.path}`);
    });
    
    
    //res.send(`${req.body.userName} - ${req.body.userImage}`);
});
   
app1.listen(3000, ()=>console.log("Сервер запущен..."));