consturl = require("url");
const bookModel = require("./../models/Book");
const getAll = (req, res) => {
    const books = bookModel.find();


    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(books));
    res.end();
};
module.exports = {
    getAll
}