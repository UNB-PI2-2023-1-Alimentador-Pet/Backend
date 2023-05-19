class UserController {
    async sayHi(req, res) {
        console.log("It works!");
        return res.status(200);
    }

}


export default new UserController();