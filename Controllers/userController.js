const url = require("url");
const userModel = require("./../models/User");
const { json } = require("stream/consumers");
const getAll = (req, res) => {
    const users = userModel.find();


    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(users));
    res.end();
};

const addNewUser = (req, res) => {
    let user = "";
    req.on("data", (data) => {
        user = user + data.toString();
    });
    req.on("end", () => {
        const answer = userModel.addNewUserInDataBase(user)
        if (answer === "422") {
            res.writeHead(422, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ message: "User data are not valid!" }))
            res.end()

        } else if (answer === "409") {
            res.writeHead(409, { "Content-Type": "application/json" });
            res.write(
                JSON.stringify({ message: "email or username already is exist!" })
            );
            res.end()
        } else {
            res.writeHead(201, { "Content-Type": "application/json" });
            res.write(
                JSON.stringify({ message: "new User Registered Successfully!" })
            );
            res.end();
        }
    })
}
const changeRole = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const userId = parsedUrl.query.id;

    userModel.findIdAndChangeRole(userId);

    res.writeHead(200, { "Content-Type": "application/json" })
    res.write(JSON.stringify({ message: "Role change successfuly!" }))
    res.end();

};
const changeCrime = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const userId = parsedUrl.query.id;
    let reqBody = "";
    req.on("data", (data) => {
        reqBody = reqBody + data.toString();
    });
    req.on("end", () => {
        userModel.findIdAndChangeCrime(reqBody, userId);

    })
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify({ message: "crime Set Successfully!" }));
    res.end();
}
const userLogin = (req, res) => {
    let user = "";
    req.on("data", (data) => {
        user = user + data.toString();
    });
    req.on("end", () => {
        const result = userModel.findIdAndLogin(user)
        if (result.status === 200) {
            res.write(JSON.stringify(result.data));
        } else {
            res.write(JSON.stringify({ message: result.message }));
        }

        res.end();
    })
}
module.exports = {
    getAll,
    addNewUser,
    changeRole,
    changeCrime,
    userLogin

}