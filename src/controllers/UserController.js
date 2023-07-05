const bcrypt = require("bcrypt");
const { db } = require("../db/db.js");
const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid").v4;
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { Op } = require("sequelize");

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

var transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: "",
  },
});


const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send("Usuário não encontrado");
    }

    const token = crypto.randomBytes(5).toString("hex");

    // const user = await User.create(data);

    user.resetpToken = token;
    user.resetpExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    const mailOptions = {
      from: "miaufeeder@gmail.com", 
      to: user.email,
      subject: "Redefinir senha",
      text: `Você está recebendo este email porque solicitou a redefinição de senha.\n\n` +
        `Clique no link para criar uma nova senha:\n\n` +
        `http://${req.headers.host}/users/reset-password/${token}\n\n` +
        `Se você não solicitou uma mudança de senha, entre em contato com miaufeeder@gmail.com.\n`,
    };

    await transport.sendMail(mailOptions);

    return res.status(200).send("Email de redefinição de senha enviado");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Ocorreu um erro ao enviar o email.");
  }
};

const resetPassword = async (req, res) => {
  const { token, senha } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetpToken: token,
        resetpExpires: { [Op.gt]: Date.now() }, // Verifica se o token ainda é válido
      },
    });

    if (!user) {
      return res.status(400).send("Token inválido ou expirado");
    }

    // Define a nova senha e limpa os campos relacionados ao reset de senha
    user.senha = await bcrypt.hash(senha, 10);
    user.resetpToken = null;
    user.resetppExpires = null;
    await user.save();

    return res.status(200).send("Senha redefinida com sucesso");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Ocorreu um erro ao redefinir a senha");
  }
};

module.exports = {
  signup,
  login,
  updateUser,
  forgotPassword,
  resetPassword,
};

// module.exports = new UserController();
