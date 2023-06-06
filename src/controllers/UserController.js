const bcrypt = require("bcrypt");
const { db } = require("../db/db.js");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const mailer = require('../models/mailer.js');
const uuidv4 = require("uuid").v4;

const User = db.users;

//signing a user up
//hashing users password before its saved to the database with bcrypt
const signup = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const data = {
      nome,
      email,
      senha: await bcrypt.hash(senha, 10),
      userHash: uuidv4(),
    };
    //saving the user
    const user = await User.create(data);

    //if user details is captured
    //generate token with the user's id and the secretKey in the env file
    // set cookie with the token generated
    if (user) {
      let token = jwt.sign({ id: user.id }, process.env.secretKey, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      console.log("user", JSON.stringify(user, null, 2));
      console.log(token);
      //send users details
      return res.status(201).send(user);
    } else {
      return res.status(409).send("Details are not correct");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

//login authentication

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    //find a user by their email
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    //if user email is found, compare senha with bcrypt
    if (user) {
      const isSame = await bcrypt.compare(senha, user.senha);

      //if senha is the same
      //generate token with the user's id and the secretKey in the env file

      if (isSame) {
        let token = jwt.sign({ id: user.id }, process.env.secretKey, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });

        //if senha matches wit the one in the database
        //go ahead and generate a cookie for the user
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(user, null, 2));
        console.log(token);
        //send user data
        return res.status(201).send(user);
      } else {
        return res.status(401).send("Authentication failed");
      }
    } else {
      return res.status(401).send("Authentication failed");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error });
  }
};

const updateUser = async (req, res) => {
  let user = {};

  try {
    await User.update(req.body, {
      where: { userHash: req.params.userHash },
    }).then(async () => {
      user = await User.findOne({
        where: { userHash: req.params.userHash },
      });
    });
    
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);

    return res.status(500).json(error);
  }
};
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne(( { where: { email: email} } ));

    if(!user){
      return res.status(400).send({ error: 'User not found' });
    }

    const token = crypto.randomBytes(4).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user.id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now,
      }
    });

    mailer.sendMail({
      to: email,
      from: 'hugoaraliveira@gmail.com',
      template: 'src/resources/mail',
      context: { token }
    }), (err) => {
      if (err)
        return res.status(400).send({ error: 'Cannot send forgot password email'});

      return res.send();
    }

    console.log(token, now);
    
  } catch (err) {
    res.status(400).send({ error: 'Error on forgot password, try again' });
    console.log(err)
  }
}

const resetPassword = async (req,res) => {
  const { email, token, password } = req.body;

  try {
    const user = await User.findOne( { where: { email: email} } )
      // .select('+passwordResetToken passwordResetExpires');

    if(!user){
      return res.status(400).send({ error: 'User not found' });
    }

    if(token !== user.passwordResetToken)
      return res.status(400).send({ error: 'Token Invalid'});

    const now = new Date();

    if(now > user.passwordResetExpires)
      return res.status(400).send({ error: 'Token expired, generate a new one' });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.send();

  } catch (err) {
    res.status(400).send({ error: 'Cannot reset password, try again' });
  }
}

module.exports = {
  signup,
  login,
  updateUser,
  forgotPassword,
  resetPassword
};

// module.exports = new UserController();
