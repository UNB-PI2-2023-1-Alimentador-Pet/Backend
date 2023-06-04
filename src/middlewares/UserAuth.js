const { db } = require("../db/db");
const jwt = require('jsonwebtoken');
//Assigning db.users to User variable
const User = db.users;

//Function to check if username or email already exist in the database
//this is to avoid having two users with the same username and email
const saveUser = async (req, res, next) => {
  //search the database to see if user exist
  try {
    const username = await User.findOne({
      where: {
        nome: req.body.nome,
      },
    });
    //if username exist in the database respond with a status of 409
    if (username) {
      return res.json(409).send("value for the column 'nome' already taken");
    }

    //checking if email already exist
    const emailcheck = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    //if email exist in the database respond with a status of 409
    if (emailcheck) {
      return res.json(409).send("Authentication failed");
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.secretKey);

      // Get user from the token
      req.user = await User.findOne({
        where: { id: decoded.id }
      });

      if (req.user.accepted === false) {
        throw new Error();
      }

      next();
    } catch (error) {

      return res.status(401).json(error);
    }
  }

  if (!token) {
    return res.status(401).json({error: 'Invalid token!'});
  }
}

//exporting module
module.exports = {
  saveUser,
  protect
};
