const http = require("http");
const fs = require("fs");
const url = require("url");
const bookController = require("./Controllers/bookController");
const userController = require("./Controllers/userController");
const rentController = require("./Controllers/rentController");

const db = require("./db.json");

const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/api/users") {
        userController.getAll(req, res);
    } else if (req.method === "GET" && req.url === "/api/books") {
        bookController.getAll(req, res);
    } else if (req.method === "PUT" && req.url.startsWith("/api/books/back")) {
        bookController.getBackBook(req, res);
    } else if (req.method === "DELETE" && req.url.startsWith("/api/books")) {
        bookController.deleteBook(req, res);
    } else if (req.method === "POST" && req.url === "/api/books") {
        bookController.addBook(req, res);
    } else if (req.method === "PUT" && req.url.startsWith("/api/books")) {
        bookController.changeBookInfo(req, res);
    } else if (req.method === "POST" && req.url === "/api/users") {
        userController.addNewUser(req, res);
    } else if (req.method === "PUT" && req.url.startsWith("/api/users/upgrade")) {
        userController.changeRole(req, res);
    } else if (req.method === "PUT" && req.url.startsWith("/api/users")) {
        userController.changeCrime(req, res);
    } else if (req.method === "POST" && req.url === "/api/users/login") {
        userController.userLogin(req, res);
    } else if (req.method === "POST" && req.url === "/api/books/rent") {
        rentController.rentBookOrBorrow(req, res);
    }
});
server.listen(4001, () => {
    console.log("Server is running on port 4001");
});