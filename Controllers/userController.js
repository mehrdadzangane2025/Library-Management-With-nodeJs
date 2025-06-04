const url = require("url");
const userModel = require("./../models/User");
const getAll = (req, res) => {
    const users = userModel.find();


    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(users));
    res.end();
};
module.exports = {
    getAll
}