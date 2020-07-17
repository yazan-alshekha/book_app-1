'use strict';

require('dotenv').config();


const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
// const { resolveSoa } = require('dns');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);

const server = express();
const PORT = process.env.PORT;

//CRUD middelware
const methodOverride = require('method-override');
server.use(methodOverride('_method'));
//app.post('/updateTask/:task_id',updateTask);
// app.use(methodOverride('_method'));


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
    if (searchBy == 'author') { url += `q=${searchFor}+inauthor` } else(url += `q=${searchFor}+intitle`)

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
        .then(result => {
            // console.log(results.rows[0]);
            res.render('pages/books/detail', { bookDetails: result.rows[0] });
        });
});



server.post('/books', addToDB);

function addToDB(req, res) {

    const item = req.body;
    console.log(req.params.id)
    let SQL = `INSERT INTO books (author, title, isbn, image_url, description, bookshelf) VALUES($1, $2, $3, $4, $5, $6);`
    let SQL2 = `SELECT * FROM books;`;
    const safeValues = [item.author, item.bookTitle, item.ISBN, item.thumnail, item.description, item.bookshell];
    client.query(SQL2)
        .then(client.query(SQL, safeValues))
        .then(data => {
            let id = data.rows[data.rows.length - 1].id;
            console.log(data.rows[data.rows.length - 1])
            res.redirect(`/books/${id}`)
                //   res.redirect(`/`)
        });
};
server.get('/delete/:id', deleteFunc);
server.put('/update/:id', updateBook);

function deleteFunc(req, res) {
    let id = req.params.id;
    console.log('THIS IS AN ID :' + id);

    let SQL = `DELETE FROM books WHERE id=$1;`;
    let safeValue = [id];
    client.query(SQL, safeValue)
        .then(() => { res.redirect('/') })
}
//   function updateTask (req,res) {
//     let {title,description, contact, status, category} = req.body;
//     let SQL = `UPDATE tasks SET title=$1,description=$2,contact=$3, status=$4, category=$5 WHERE id=$6;`;
//     let id = req.params.task_id;
//     let values=[title,description, contact, status, category,id];
//     client.query(SQL,values)
//     .then(()=>{
//       res.redirect(`/tasks/${id}`)
//     })
function updateBook(req, res) {
    console.log('THIS IS FROM INSIDE updateBook')
    let id = req.params.id;
    // let SQL = `UPDATE tasks SET title=$1,description=$2,contact=$3, status=$4, category=$5 WHERE id=$6;`;
    let { image_url, title, author, description, bookshelf, isbn } = req.body;
    let SQL = `UPDATE books SET image_url=$1, title=$2, author=$3, description=$4, bookshelf=$5, isbn=$6 WHERE id=$7 ;`;
    let safeValues = [image_url, title, author, description, bookshelf, isbn, id];
    client.query(SQL, safeValues)
        .then(() => {
            res.redirect(`/books/${id}`)
        })
}

server.get('/showww', storedBookShow);

function storedBookShow(req, res) {

    res.render('pages/books/show')

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
    });