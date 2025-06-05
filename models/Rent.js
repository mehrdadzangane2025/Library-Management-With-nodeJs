const db = require('./../db.json')
const fs = require('fs')

const findIdAndRent = async(userId, bookId) => {

    const isBookFree = db.books.some(
        (book) => book.id === Number(bookId) && book.free === 1
    );

    if (isBookFree) {
        db.books.forEach((book) => {
            if (book.id === (bookId)) {
                book.free = 0;
            }
        });
        const newRent = {
            id: crypto.randomUUID(),
            userId,
            bookId,
        };

        db.rents.push(newRent);

        try {
            fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
            return {
                status: 200,
                message: "book reserved successfully!"
            };
        } catch (err) {
            return {
                status: 401,
                message: "this book is not free"
            }
        }
    }
}
module.exports = {
    findIdAndRent
}