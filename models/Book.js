const db = require('./../db.json')


const find = () => db.books

module.exports = {
    find
}