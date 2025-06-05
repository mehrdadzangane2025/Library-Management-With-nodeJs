const db = require('./../db.json')
const fs = require('fs')

const find = () => db.books
const findBookToGiveBack = (bookId) => {
    db.books.forEach((book) => {
        if (book.id === Number(bookId)) {
            book.free = 1;
        }
    });
    fs.writeFileSync("db.json", JSON.stringify(db, null, 2), (err) => {
        if (err) {
            throw err;
        }

    });
}
const deletBookFromLib = (bookId) => {
    const newBook = db.books.filter((book) => book.id != bookId);
    if (newBook.length === db.books.length) {
        return "book not found!"
    } else {

        fs.writeFile(
            "db.json",
            JSON.stringify({...db, books: newBook }, null, 2),
            (err) => {
                if (err) {
                    throw err;
                } else {
                    return "book remove successfuly!"
                }

            }
        );
    }
};
const addBookToLib = (book) => {
    const newBook = { id: crypto.randomUUID(), ...JSON.parse(book), free: 1 };
    db.books.push(newBook);
    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
        if (err) {
            throw err;
        }

    });
}
const changeFromDataBase = (bookInfo, bookId) => {
    const reqBody = JSON.parse(bookInfo);

    db.books.forEach((book) => {
        if (book.id === Number(bookId)) {
            book.title = reqBody.title;
            book.author = reqBody.author;
            book.price = reqBody.price;
        }
    });

    fs.writeFile("db.json", JSON.stringify(db, null, 2), (err) => {
        if (err) {
            throw err;
        }


    });
}
module.exports = {
    find,
    findBookToGiveBack,
    deletBookFromLib,
    addBookToLib,
    changeFromDataBase
}