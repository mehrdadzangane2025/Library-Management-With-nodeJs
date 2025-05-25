const http = require("http");
const fs = require("fs");
const url = require("url");
const db = require("./db.json");
const { stringify } = require("querystring");

const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/api/users") {
        fs.readFile("db.json", (err, db) => {
            if (err) {
                throw err;
            }

            const data = JSON.parse(db);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(data.users));
            res.end();
        });
    } else if (req.method === "GET" && req.url === "/api/users") {
        fs.readFile("db.json", (err, db) => {
            if (err) {
                throw err;
            }

            const data = JSON.parse(db);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(data.users));
            res.end();
        });
    } else if (req.method === "DELETE" && req.url.startsWith("/api/books")) {
        const parsedUrl = url.parse(req.url, true);
        const bookId = parsedUrl.query.id;

        const newBook = db.books.filter((book) => book.id != bookId);
        if (newBook.length === db.books.length) {
            res.writeHead(401, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ message: "Book Not Found" }));
            res.end();
        } else {
            fs.writeFile(
                "db.json",
                JSON.stringify({...db, books: newBook }),
                (err) => {
                    if (err) {
                        throw err;
                    }
                    res.writeHead(200, { "Content-Type": "aplication/json" });
                    res.write(JSON.stringify({ message: "Book Removed Successfully!" }));
                    res.end();
                }
            );
        }
    } else if (req.method === "POST" && req.url === "/api/books") {
        let book = "";
        req.on("data", (data) => {
            book = book + data.toString();
        });
        req.on("end", () => {
            const newBook = { id: crypto.randomUUID(), ...JSON.parse(book), free: 1 };
            db.books.push(newBook);
            fs.writeFile("db.json", JSON.stringify(db), (err) => {
                if (err) {
                    throw err;
                }
                res.writeHead(201, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ message: "new Book added Successfully!" }));
                res.end();
            });
        });
    } else if (req.method === "PUT" && req.url.startsWith("/api/books")) {
        const parsedUrl = url.parse(req.url, true);
        const bookId = parsedUrl.query.id;
        let bookNewInfos = "";
        req.on("data", (data) => {
            bookNewInfos = bookNewInfos + data.toString();
        });

        req.on("end", () => {
            const reqBody = JSON.parse(bookNewInfos);

            db.books.forEach((book) => {
                if (book.id === Number(bookId)) {
                    book.title = reqBody.title;
                    book.author = reqBody.author;
                    book.price = reqBody.price;
                }
            });

            fs.writeFile("db.json", JSON.stringify(db), (err) => {
                if (err) {
                    throw err;
                }

                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ message: "Book Updated Successfully!" }));
                res.end();
            });
        });
    } else if (req.method === "POST" && req.url === "/api/users") {
        let user = "";
        req.on("data", (data) => {
            user = user + data.toString();
        });
        req.on("end", () => {
            const { name, username, email } = JSON.parse(user);
            const isUserExist = db.users.find(
                (user) => user.email === email || user.username === username
            );
            if (name === "" || username === "" || email === "") {
                res.writeHead(422, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ message: "User data are not valid!" }));
                res.end();
            } else if (isUserExist) {
                res.writeHead(409, { "Content-Type": "application/json" });
                res.write(
                    JSON.stringify({ message: "email or username already is exist!" })
                );
                res.end();
            } else {
                const newUser = {
                    id: crypto.randomUUID(),
                    name,
                    username,
                    email,
                    crime: 0,
                    role: "USER",
                };

                db.users.push(newUser);
                fs.writeFile("./db.json", JSON.stringify(db), (err) => {
                    if (err) {
                        throw err;
                    }

                    res.writeHead(201, { "Content-Type": "application/json" });
                    res.write(
                        JSON.stringify({ message: "new User Registered Successfully!" })
                    );
                    res.end();
                });
            }
        });
    } else if (req.method === "PUT" && req.url.startsWith("/api/users/upgrade")) {
        const parsedUrl = url.parse(req.url, true);
        const userId = parsedUrl.query.id;
        db.users.forEach((user) => {
            if (user.id === Number(userId)) {
                user.role = "ADMIN";
            }
        });

        fs.writeFile("./db.json", JSON.stringify(db), (err) => {
            if (err) {
                throw err;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ message: "user upgraded Successfully!" }));
            res.end();
        });
    } else if (req.method === "PUT" && req.url.startsWith("/api/users")) {
        const parsedUrl = url.parse(req.url, true);
        const userId = parsedUrl.query.id;
        let reqBody = "";
        req.on("data", (data) => {
            reqBody = reqBody + data.toString();
        });

        req.on("end", () => {
            const { crime } = JSON.parse(reqBody);

            db.users.forEach((user) => {
                if (user.id === Number(userId)) {
                    user.crime = crime;
                }
            });
            fs.writeFile("./db.json", JSON.stringify(db), (err) => {
                if (err) {
                    throw err;
                }
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ message: "crime Set Successfully!" }));
                res.end();
            });
        });
    } else if (req.method === "POST" && req.url === "/api/users/login") {
        let user = "";
        req.on("data", (data) => {
            user = user + data.toString();
        });

        req.on("end", () => {
            const { username, email } = JSON.parse(user);
            const mainUser = db.users.find(
                (user) => user.username === username && user.email === email
            );

            if (mainUser) {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ username: mainUser.username, email: mainUser.email }));
                res.end();
            } else {
                res.writeHead(401, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ message: "user not found" }));
                res.end();
            }
        });
    }
}); // Done!
server.listen(4000, () => {
    console.log("Server is running on port 4000");
});