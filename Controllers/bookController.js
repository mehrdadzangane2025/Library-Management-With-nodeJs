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
module.exports = {
    getAll,
    getBackBook,
    deleteBook,
};