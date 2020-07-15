DROP TABLE IF EXISTS books;
CREATE TABLE
IF NOT EXISTS books
(
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    title VARCHAR(255),
    isbn VARCHAR(255),
    image_url VARCHAR(255),
    description TEXT,
    bookshelf TEXT
);


INSERT INTO books (author,title,image_url,description) VALUES('AHMAD','from the future', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSo7qnvwvxl5KihCobp4tqiIshkaZj8YrRAeA&usqp=CAU',  'THIS IS A DRAFT');
INSERT INTO books (author,title,image_url,description) VALUES('AHMAD','from the future', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSo7qnvwvxl5KihCobp4tqiIshkaZj8YrRAeA&usqp=CAU',  'THIS IS A DRAFT');
-- INSERT INTO books (title,image_url,author,description) VALUES('from the future', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSo7qnvwvxl5KihCobp4tqiIshkaZj8YrRAeA&usqp=CAU', 'AHMAD', 'THIS IS A DRAFT');