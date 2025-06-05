const url = require("url");
const rentModel = require("./../models/Rent");

const rentBookOrBorrow = (req, res) => {
    let reqBody = "";
    req.on("data", (data) => {
        reqBody = reqBody + data.toString();
    });

    req.on("end", async() => {
        let { userId, bookId } = JSON.parse(reqBody);

        const result = await rentModel.findIdAndRent(userId, bookId);


        res.writeHead(result.status, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
            message: result.message
        }));
        console.log(result.status);

    });
};

module.exports = {
    rentBookOrBorrow,
};