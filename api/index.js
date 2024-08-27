const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const User = require('./models/Users.js');
const Place = require('./models/Place.js');
const Booking = require("./models/Booking.js");
const tok = require('jsonwebtoken');
require('dotenv').config();
const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const tokSecret = 'fjslafjioewhgoajf;lkjfas';
const cookieParser = require('cookie-parser');
const downloader = require('image-downloader'); 
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const multer = require('multer');
const fs = require('fs');
const bucket = 'bvuyyuru-project1';
const mime = require('mime-types');

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'))
app.use(cors({
    credentials:true,
    origin: [
        'http://localhost:5173', 
        'https://bvuyyuru-booking-site-clone-theta.vercel.app',
        'https://booking-site-clone-7ri5hsva3-bvuyyurus-projects.vercel.app',
        'https://booking-site-clone-jcnhu8ccc-bvuyyurus-projects.vercel.app/'
    ],
}));


async function uploadS3(path,originalFilename,mimetype){
    const client = new S3Client({
        region: 'us-east-2',
        credentials:{
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
    })
    const parts = originalFilename.split('.');
    const ext = parts[parts.length - 1];
    const newFilename = Date.now() + '.' + ext;
    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: fs.readFileSync(path),
        Key: newFilename,
        ContentType: mimetype,
        ACL: 'public-read',
    }));
    return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}


app.get('/api/test', (req,res)=>{
    mongoose.connect(process.env.MONGO_URL);
    res.json('test ok');
});
//qCUyyevTbt0dvKPo
app.post('/api/register',async (req,res)=>{
    mongoose.connect(process.env.MONGO_URL);
    const{name, email,password} = req.body;
    try {
        const userNew = await User.create({
            name, email, password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json(userNew);
    } catch(e){
        res.status(422).json(e);
    }
});

app.post('/api/login', async (req,res)=>{
    mongoose.connect(process.env.MONGO_URL);
    const{email, password} = req.body;
    const loggedUser = await User.findOne({email});
    if(loggedUser){
        const corrPassword = bcrypt.compareSync(password, loggedUser.password);
        if(corrPassword){
            tok.sign({
                email:loggedUser.email, 
                id:loggedUser._id
            }, tokSecret,{},(err,token)=>{
                if (err) throw err;
                res.cookie('token',token).json(loggedUser);
            });
        }
        else{
            res.status(401).json('password is incorrect for given email');
        }
    }
    else{
        res.json('not found');
    }
});

app.get('/api/profile', (req,res)=>{
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    if(token){
        tok.verify(token, tokSecret,{},async (err,user)=>{
            if(err) throw err;
            const userInfo = await User.findById(user.id)
            res.json(userInfo);
        });
    }
    else{
        res.json(null)
    }

});

app.post('/api/logout', (req,res)=>{
    mongoose.connect(process.env.MONGO_URL);
    console.log('in the api');
    res.cookie('token','').json(true);
});

app.post('/api/upload-link', async (req,res)=>{
    mongoose.connect(process.env.MONGO_URL);
    const {link} = req.body;
    const name = 'photo'+ Date.now() + '.jpg';
    await downloader.image({
        url: link,
        dest: '/tmp/' +name,
    });
    const url = await uploadS3('/tmp/' +name, name, mime.lookup('/tmp/' +name));
    res.json(url);
});
const photosMulter = multer({dest:'/tmp'});
app.post('/api/upload',photosMulter.array('photos',100),async (req,res)=>{
    mongoose.connect(process.env.MONGO_URL);
    const uploads =[];
    for(let i = 0;i<req.files.length;i++){
        const {path,originalname,mimetype} = req.files[i];
        const url = await uploadS3(path, originalname, mimetype);
        uploads.push(url);
    }
    res.json(uploads);
})

app.post('/api/places',(req,res)=>{
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    tok.verify(token, tokSecret,{},async (err,user)=>{
        if(err) throw err;
        const newPlace =await Place.create({
            owner:user.id,
            title:req.body.title,
            address:req.body.address,
            photos: req.body.newPhotos,
            perks:req.body.perks,
            extraInfo:req.body.extrInfo,
            checkIn:req.body.checkIn,
            checkOut: req.body.checkOut,
            maxGuests: req.body.maxGuests,
            description: req.body.description,
            price: req.body.price,
        })
        res.json(newPlace);
    });
})

app.get('/api/user-places',(req,res)=>{
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    tok.verify(token, tokSecret,{},async (err,userData)=>{
        const {id} = userData;
        res.json(await Place.find({owner:id}));
    });

})

app.get('/api/places/:id',async (req,res)=>{
    mongoose.connect(process.env.MONGO_URL);
    const {id}=req.params;
    res.json(await Place.findById(id))
})

app.put("/api/places", async (req,res)=>{
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    const {id} =req.body;
    console.log(id);
    tok.verify(token, tokSecret,{},async (err,user)=>{
        const place = await Place.findById(id);
        if(user.id === place.owner.toString()){
            place.title = req.body.title;
            place.address = req.body.address;
            place.photos = req.body.newPhotos;
            place.description = req.body.description;
            place.perks = req.body.perks;
            place.extraInfo = req.body.extraInfo;
            place.checkIn = req.body.checkIn;
            place.checkOut = req.body.checkOut;
            place.maxGuests = req.body.maxGuests;
            place.price = req.body.price;
            const updated = await place.save();
            res.json(updated);
        }
    });

})

app.get("/api/places", async (req,res)=>{
    mongoose.connect(process.env.MONGO_URL);
    res.json(await Place.find());
})

app.post("/api/booking", async (req,res)=>{
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    const {place,checkIn,checkOut,numGuests,name,number,price} = req.body;
    tok.verify(token, tokSecret,{},async (err,user)=>{
        const newBooking = await Booking.create({
            place,checkIn,checkOut,numGuests,name,number,price, user: user.id,
        })
        res.json(newBooking); 
    });
})

app.get("/api/booking", async(req,res)=>{
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    tok.verify(token, tokSecret,{},async (err,u)=>{
        res.json(await Booking.find({user:u.id}).populate('place'));
    });
})
app.listen(4000);