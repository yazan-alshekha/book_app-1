'use strict';

require('dotenv').config();


const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
// const { resolveSoa } = require('dns');
const pg = require('pg');
const client = new pg.Client(process.env.DB_URL);

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
    let SQL = 'SELECT * FROM books;';
    client.query(SQL)
        .then((dbResult) => {

            res.render('pages/index', { dbContent: dbResult.rows, dbRowsCount: dbResult.rowCount });
        });
});
server.get('/search/new', (req, res) => {
    res.render('pages/searches/new');
});

server.post('/searches', (req, res) => {
    let searchBy = req.body.by;
    let searchFor = req.body.bookName;
    // let url = `https://www.googleapis.com/books/v1/volumes?q=search+terms`;
    let url = `https://www.googleapis.com/books/v1/volumes?`;
    if (searchBy == 'author') { url += `q=${searchFor}+inauthor` } else (url += `q=${searchFor}+intitle`)

    superagent.get(url)
        .then(books => {
            let bookResult = books.body.items.map((book) => {
                return new Book(book);

            });

            res.render('pages/searches/show', { books: bookResult });
            // return bookResult;
        });

});

function Book(obj) {
    this.title = obj.volumeInfo.title ? obj.volumeInfo.title : 'No Title';
    this.img = obj.volumeInfo.imageLinks.thumbnail;
    this.author = obj.volumeInfo.authors ? 'AUTHOR' + obj.volumeInfo.authors : 'No Author found';
    this.desc = obj.volumeInfo.description ? obj.volumeInfo.description : 'no descriptio found';
    this.isbn = obj.volumeInfo.industryIdentifiers[0].identifier ? obj.volumeInfo.industryIdentifiers[0].identifier : 'No ISBN Found';
    this.bookshelf = obj.volumeInfo.categories ? `CATEGORY : ${obj.volumeInfo.categories[0]}` : 'CATEGORY NOT FOUND';
    // Book.books.push(this);
}
// Book.books = [];
server.get('/books/:id', (req, res) => {
    let SQL = `SELECT * FROM books WHERE id=$1;`;
    // let params = req.params;
    let safeValues = [req.params.id]
    client.query(SQL, safeValues)
        .then(result=>{
            // console.log(results.rows[0]);
            res.render('pages/books/detail',{bookDetails : result.rows[0]});
        });
});



server.post('/books',addToDB);

function addToDB(req, res){
  
    const item = req.body;
    console.log(req.params.id)
    let SQL = `INSERT INTO books (author, title, isbn, image_url, description, bookshelf) VALUES($1, $2, $3, $4, $5, $6);`
    let SQL2 = `SELECT * FROM books;`;
    const safeValues = [item.author, item.bookTitle, item.ISBN, item.thumnail, item.description, item.bookshell];
    client.query(SQL2)
    .then(client.query(SQL, safeValues))
    .then( data=>{
  let id = data.rows[data.rows.length-1].id;
      console.log(data.rows[data.rows.length-1])
  res.redirect(`/books/${id}`)
//   res.redirect(`/`)
    });
  }
  

server.get('/showww', storedBookShow);
function storedBookShow(req, res) {

    res.render('pages/books/show',)

}

server.get('/hello', (req, res) => {
    res.render('pages/index')
});
server.get('*', (req, res) => {
    res.render('pages/error.ejs')
});

client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Hello I'm the server,Listening to port: ${PORT}`);
        });
    })


