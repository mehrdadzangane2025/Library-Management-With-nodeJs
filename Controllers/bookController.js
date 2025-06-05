const url = require("url");
const bookModel = require("./../models/Book");
const getAll = (req, res) => {
    const books = bookModel.find();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(books));
    res.end();
};
const getBackBook = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const bookId = parsedUrl.query.id;
    bookModel.findBookToGiveBack(bookId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "book back to library!" }));
    res.end();
};
const deleteBook = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const bookId = parsedUrl.query.id;
    bookModel.deletBookFromLib(bookId);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end();
};
const addBook = (req, res) => {
    let book = "";
    req.on("data", (data) => {
        book = book + data.toString();
    });
    req.on("end", () => {
        bookModel.addBookToLib(book);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "new Book added Successfully!" }));
        res.end();
    });
};
const changeBookInfo = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const bookId = parsedUrl.query.id;
    let bookNewInfos = "";
    req.on("data", (data) => {
        bookNewInfos = bookNewInfos + data.toString();
    });
    req.on("end", () => {
        bookModel.changeFromDataBase(bookNewInfos, bookId);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "Book Updated Successfully!" }));
        res.end();
    });
};

module.exports = {
    getAll,
    getBackBook,
    deleteBook,
    addBook,
    changeBookInfo,

};