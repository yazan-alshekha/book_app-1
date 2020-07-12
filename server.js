'use strict';

require('dotenv').config();


const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const { resolveSoa } = require('dns');

const server = express();
const PORT = process.env.PORT;

//connect with static styles folder
server.use(express.static('./public'));

//middelware  
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//I'm gonna use EJS tamplating
server.set('view engine', 'ejs');

server.get('/', (req, res) => {
    // res.render('pages/searches/new');
    res.render('pages/index');
});
server.get('/search',(req,res)=>{
    res.render('pages/searches/new');
});

server.post('/searches/new', (req, res) => {
    let searchBy = req.body.by;
    let searchFor = req.body.bookName;
    // let url = `https://www.googleapis.com/books/v1/volumes?q=search+terms`;
    if (searchBy == 'auther') {
        let urlByAuthor = `https://www.googleapis.com/books/v1/volumes?q=${searchFor}+inauthor`;
        superagent.get(urlByAuthor)
            .then(books => {
                let bookResult = books.body.items.map((book) => {
                    return new Book(book);

                });

                res.render('pages/searches/show', { books: bookResult });
                // return bookResult;
            });

    } else {

        let urlByTitle = `https://www.googleapis.com/books/v1/volumes?q=${searchFor}+intitle`;
        console.log(`${searchFor}`)
        superagent.get(urlByTitle)
            .then(books => {
                let bookResult = books.body.items.map((book) => {
                    return new Book(book);

                });

                res.render('pages/searches/show', { books: bookResult });
                // return bookResult;
            });
    }
});

function Book(obj) {
    this.title = obj.volumeInfo.title;
    // this.img = `https://i.imgur.com/J5LVHEL.jpg`;
    this.img = obj.volumeInfo.imageLinks.thumbnail;
    this.auther = obj.volumeInfo.authers;
    this.desc = obj.volumeInfo.description;
    Book.books.push(this);

}
Book.books = [];

server.get('/hello', (req, res) => {
    res.render('pages/index')
});
server.get('*',(req,res)=>{
res.render('pages/error.ejs')
});

server.listen(PORT, () => {
    console.log(`Hello I'm the server,Listening to port: ${PORT}`);
});
