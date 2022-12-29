// using express create server

//1. import express
const express=require('express')

// import data service
const dataService=require('./services/data.service')

// import cors
const cors=require('cors')

//import jsonWebtoken
const jwt=require('jsonWebtoken')
const { request } = require('express')

// 2.create an server app using express
const app=express()

// using cors define origin to server app
app.use(cors({
    origin:['http://localhost:4200']
}))

// to parse json data
app.use(express.json())

// 3.set up port for server app
app.listen(3000,()=>{
    console.log('server started at port 3000');
})

//application specific middleware
const appMiddleware=(req,res,next)=>{
    console.log("This is application specific middleware ");
    next()
}
app.use(appMiddleware)

//router specific middleware ---token validation
const jwtMiddleware=(req,res,next)=>{
    console.log("This is router specific middleware ");

    //get token from request headers x-access-token key
    let token=req.headers['x-access-token']
    // verify token using jsonwebtoken
        try{let data=jwt.verify(token,'winwon')
             req.currentAcno=data.currentAcno
             next()
           }
        catch{
            res.status(404).json({
                status:false,
                message:"Please Login..",
            });
        }


};


// HTTP REQUEST - REST API - BANK API

// 1.LOGIN API
app.post('/login',(req,res)=>{
    console.log('inside login function');
    console.log(req.body);
    // asynchronous
     dataService.login(req.body.acno,req.body.pswd)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

// 2.REGISTER API
app.post('/register',(req,res)=>{
    console.log('inside register function');
    console.log(req.body);
    // asynchronous
    dataService.register(req.body.acno,req.body.pswd,req.body.uname)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

// 3.DEPOSIT API
app.post('/deposit',jwtMiddleware,(req,res)=>{
    console.log('inside deposit function');
    console.log(req.body);
    // asynchronous
    dataService.deposit(req,req.body.acno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

// 3.WITHDRAW API
app.post('/withdraw',jwtMiddleware,(req,res)=>{
    console.log('inside withdraw function');
    console.log(req.body);
    // asynchronous
    dataService.withdraw(req,req.body.acno,req.body.pswd,req.body.amount)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

// 3.BALANCE API
app.post('/getBalance',jwtMiddleware,(req,res)=>{
    console.log('inside getBalance function');
    console.log(req.body);
    // asynchronous
    dataService.getBalance(req.body.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    })
})

// 3.getTransaction API
app.post('/getTransaction',jwtMiddleware,(req,res)=>{
    console.log('inside getTransaction function');
    console.log(req.body);
    // asynchronous
    dataService.getTransaction(req.body.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    });
});

// 3.deleteAccount API
app.post('/deleteAccount:acno',jwtMiddleware,(req,res)=>{
    console.log('inside deleteAccount function');
    // asynchronous
    dataService.deleteAccount(req.params.acno)
    .then((result)=>{
        res.status(result.statusCode).json(result)
    });
});