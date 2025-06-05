const db = require("./../db.json");
const fs = require("fs");
const find = () => db.users;
const addNewUserInDataBase = (userInfo) => {
    const { name, username, email } = JSON.parse(userInfo);

    const isUserExist = db.users.find(
        (user) => user.email === email || user.username === username
    );
    if (name === "" || username === "" || email === "") {
        return "422";
    } else if (isUserExist) {
        return "409";
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
        fs.writeFile("./db.json", JSON.stringify(db, null, 2), (err) => {
            if (err) {
                throw err;
            }

            return "201";
        });
    }
};

const findIdAndChangeRole = (userId) => {
    const changeUserRole = db.users.map((user) => {
        if (user.id === userId) {
            user.role = user.role === "ADMIN" ? "USER" : "ADMIN";
        }
        return user;
    });
    fs.writeFile(
        "db.json",
        JSON.stringify(db, null, 2),
        (err) => {
            if (err) {
                throw err;
            }
            return {
                status: 200,
                message: "Role updated successfully",
            };
        }
    );
};
const findIdAndChangeCrime = (reqBody, userId) => {
    const { crime } = JSON.parse(reqBody);

    const changeCrimeWithFunc = db.users.map((user) => {
        if (user.id === userId) {
            user.crime = crime;
        }
        return user;
    });
    fs.writeFile(
        "db.json",
        JSON.stringify({...db, users: changeCrimeWithFunc }, null, 2),
        (err) => {
            if (err) {
                throw err;
            }
        }
    );
};
const findIdAndLogin = (userReqBody) => {
    const { username, email } = JSON.parse(userReqBody);
    const mainUser = db.users.find(
        (user) => user.username === username && user.email === email
    );

    if (mainUser) {
        return {
            status: 200,
            data: {
                username: mainUser.username,
                email: mainUser.email
            }

        }
    } else {
        return {
            status: 401,
            message: "user not found"
        };
    }
}
module.exports = {
    find,
    addNewUserInDataBase,
    findIdAndChangeRole,
    findIdAndChangeCrime,
    findIdAndLogin
};