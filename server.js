import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import connectDB from "./appdb.js";
// import connectDB from "./studentsdb.js";
const router =express.Router();
// connectDB();
// Students
connectDB();
const filesSchema=mongoose.Schema(
    {
   files:[{
        file:{
            data:String,
         contentType: String
        }
           }]          })

var Files= mongoose.model('Files', filesSchema);
filesSchema.plugin(Files);


const Storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
     cb(null,file.originalname);
    },
});

const upload = multer({
    storage: Storage,
   
}).single('testImage')

const files={
 files:[ {
    file:{
        data:"https://publuu.com/flip-book/107330/288496",
       contentType:"file/pdf"
    }
  
},{
    file:{
        data:"https://publuu.com/fhjkj/576326948",
       contentType:"file/pdf"
    }


},{
    
        file:{
            data:"https://publuu.com/flip-book/107330/288511",
           contentType:"file/pdf"
        }
    
        
    
}
]
}
// connectDB();
const app=express();
app.use(express.json());

app.set("view engine","ejs");


app.get('/upload',(req,res) =>
{
    try{
        res.status(200).send(files);
    }
    catch(error){
        res.json({message:"not available"});
    }
});



app.get('/upload/:id',(req,res)=>{
    console.log(req.params.id);
 Files.findById(req.params.id)
    
    .then(result=>{
        res.status(200).json({
            files:result
        })
    })
    .catch(err=> {
    console.log(err);
    res.status(505).json({
        error:err
    })
    }
  )
})

app.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            console.log(err)
        }
        else{
            const newFile = new Files({
             files:req.body.files
            })
            newFile.save()
        .then(()=>res.send('successfully uploaded')).catch(err=>console.log(err))
        }
    })
    
})

app.put('/upload/:id',(req,res)=>{
    console.log(req.params.id);
    Files.findOneAndUpdate({_id:req.params.id},{
        $set:{
            files:req.body.files
          

        }
    })
    .then(result=>{
        res.status(200).json({
            updated_files:result       
         })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
    })
    app.delete('/upload/:id',(req,res)=>{
        console.log(req.params.id);
        Files.deleteOne({_id:req.params.id},{
            $set:{
               
                files:req.body.files
    
            }
        })
        .then(result=>{
            res.status(200).json({
                deleted_files:result       
             })
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({
                error:err
            })
        })
        })
       app.delete('/upload',(req,res)=>{
    
         Files.deleteMany({files},(err,result)=>{
            if(err) throw err
            res.send(files)
            })
        })

        export default router;
        const port=4000;
        app.listen(port,()=>{
            console.log(`server is running at ${port}`);
            console.log(files);
        });