require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const session=require('express-session');


const MongoStore = require('connect-mongo');
//DB_URI=mongodb://localhost:27017/node_crud

// const connectDB = async () => {
//     try {
//       const conn = await mongoose.connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         //useFindAndModify: false,
//       })
  
//       console.log(`MongoDB Connected: ${conn.connection.host}`)
//     } catch (err) {
//       console.error(err)
//       process.exit(1)
//     }
//   }

//   connectDB();
const app=express();
const PORT=process.env.PORT||8000;



//connection to database
mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,useUnifiedTopology:true});
const db=mongoose.connection;
//if error
db.on('error',(error)=>{
    console.log(error)
})
//once connected successfully, display success message
db.once('open',()=>{console.log('Sucessfully connected to database!!!')});

//middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(session({
    secret:'dghshsjaakk',
    saveUninitialized:true,
    resave:false,
}));

// app.use(session({
//     secret : 'mysecretkey',
//     resave : true,
//     saveUninitialized : true,
//     store :MongoStore.create({ mongoUrl: "mongodb+srv://manasi3749:manasi3749@cluster1.vndql.mongodb.net/myFirstDatabase?" })
//   }));

// app.use((req,res,next)=>{
//     res.locals.message=req.session.message;
//     delete req.session.message;
//     next();
// });

app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
  })

app.use(express.static('uploads'));

//template engine
app.set('view engine','ejs');

//route prefix
// app.use("",require('./routes/routes'));

app.use('/', require('./routes/routes'))

app.listen(PORT,()=>{
    console.log("Server connceted");
})