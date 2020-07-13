DROP TABLE IF EXISTS books;
CREATE TABLE
IF NOT EXISTS books
(
    id SERIAL PRIMARY KEY,
    title VARCHAR
(100),
    img VARCHAR
(255),
    auther VARCHAR
(100),
    description TEXT
);

INSERT INTO books (title,img,auther,description) VALUES('titletitle', 'imgimg B. Erichsen', 'authorauthor 21', 'descdesc');

INSERT INTO books (title,img,auther,description) VALUES('from the future', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSo7qnvwvxl5KihCobp4tqiIshkaZj8YrRAeA&usqp=CAU', 'AHMAD', 'THIS IS A DRAFT');