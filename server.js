'use strict';

require('dotenv').config();


const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const { resolveSoa } = require('dns');

const server =express();
const PORT= process.env.PORT;

//connect with static styles folder
server.use(express.static('./public'));

//middelware  
// server.use(express.json());
// server.use(express.urlencoded({extended:true}));

//I'm gonna use EJS tamplating
server.set('view engine','ejs');

server.get('/',(req,res)=>{
    // res.status(200).send("hello  world");
    res.render('pages/index');
});

server.get('/hello',(req,res)=>{
    res.render('pages/index')
})
server.listen(PORT,()=>{
console.log(`Hello I'm the server,Listening to port: ${PORT}`);
});
