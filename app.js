

import express from 'express';
import mongoose from 'mongoose';

import multer from 'multer';
import path from'path';
import connectDB from './appdb.js';
connectDB();
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
// picModel.save()
const __dirname = path.dirname(__filename);
const app=express();
app.use(express.json());
var picSchema=new mongoose.Schema({
    picpath:String
})
var PicModel=mongoose.model('Picsdemo',picSchema);
export default PicModel;
var storage=multer.diskStorage({
    destination:function(req,file,cb){
    cb(null,'./public/uploads')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})
var upload = multer({storage:storage});
app.set('views',path.resolve(__dirname,'views'));
app.set('view engine','ejs');
var pathh=path.resolve(__dirname,'public');
app.use(express.static(pathh));
app.get('/',(req,res)=>{
    PicModel.find(function(err,data){
    if(err){
        console.log(err)
    }
    else if(data.length>0){
        res.render('home',{data:data})
    }
    else{
        res.render('home',{data:{}})
    }
})
})
app.post('/',upload.single('pic'),(req,res)=>{
    var x = 'uploads/'+req.file.originalname;
    var temp = new PicModel({
        picpath:x
    })
    temp.save((err,data)=>{
        if(err){
            console.log(err)
        }
        res.redirect('/')
    })
})
app.get('/download/:id',(req,res)=>{
    PicModel.find().then({_id:req.params._id},(err,data)=>{
        if(err){
            console.log(err)
        }
        else{
            var x= __dirname+ '/public/'+data[0].picpath;
            res.download(x)
        }
    })
})
var port = process.env.PORT || 3000 ;
app.listen(port,()=>console.log("server running at port"+port))