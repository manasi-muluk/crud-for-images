const express=require('express');
const router=express.Router();
const User=require('../models/image_info');
const multer=require('multer');
const { title } = require('process');
const fs=require('fs');

//uploading images
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        //images will be uploaded in uploads directory
        cb(null,'./uploads');
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
})

var upload=multer({
    storage: storage,
}).single('image'); //uploading single image, image from add.ejs file

//insert the images into the database route
router.post('/add',upload,(req,res)=>{
    const user=new User({
        name:req.body.name,
        image:req.file.filename, //filename is declared before while uploading images
    });
    user.save((err)=>{
        if(err){
        res.json({message: err.message,type:'danger'});}
       
        res.redirect('/');
        
    })
})

//get all images routr
router.get('/',(req,res)=>{
    User.find().exec((err,images)=>{
        if(err)
        {
res.json({message:err.message});
        }
        else
        {
            res.render('index',{title:'Home',images:images})
        }
    }
    )
})

router.get('/add',(req,res)=>{
    res.render('add',{title:"add images"});
})

router.get('/edit/:id',(req,res)=>{
    let id=req.params.id;
    User.findById(id,(err,imagess)=>{
        if(err)
        {
            res.redirect('/');
        }
        else{
            if(imagess==null)
            {
                res.redirect('/');
            }
            else{
                res.render('edit_image',{
                    title: "Edit image",
                    imagess:imagess,
                })
            
            }
        }
    })
})

//update images route
router.post('/update/:id',upload,(req,res)=>{
    let id=req.params.id;
    let new_image=" ";
    //if file is selected using input field
    if(req.file)
    {
       new_image=req.file.filename;
       try{
           fs.unlinkSync('./uploads/'+req.body.old_image);
       }
       catch(err)
       {
           console.log(err);
       }
    }
    else{
        new_image=req.body.old_image;
    }
    User.findByIdAndUpdate(id,{
        name: req.body.name,
        image:new_image,
    },(err,result)=>{
        if(err)
        {
            res.json({message: err.message,type:'danger'})
        }
        else{
            res.redirect('/');
        }
    })
})

//deleting image
router.get('/delete/:id',(req,res)=>{
    let id=req.params.id;
    User.findByIdAndRemove(id,(err,result)=>{
       if(result.image!=' ')
       {
           try{
               fs.unlinkSync('./uploads/'+result.image);
           }
           catch(err)
           {
               console.log(err);
           }
       }
       if(err)
       {
           res.json({message: err.message});
       }
       else{
           res.redirect('/');
       }
    })
})

module.exports=router;