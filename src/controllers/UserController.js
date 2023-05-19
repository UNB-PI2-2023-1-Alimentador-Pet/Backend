class UserController {
    async sayHi(req, res) {
        console.log("It works!");
        return res.status(200).json({message: "Everything is ok!"});
    }

}


module.exports = new UserController();