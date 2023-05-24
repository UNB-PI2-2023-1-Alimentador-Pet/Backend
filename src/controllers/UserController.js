const { pool } = require("../db/db.js");

class UserController {
  async sayHi(req, res) {
    console.log("It works!");
    return res.status(200).json({ message: "Everything is ok!" });
  }

  async createUser(req, res) {
    const { nome, email, senha } = req.body;

    try {
      const data = await pool.query(
        "INSERT INTO USUARIO (nome, email, senha) VALUES ($1, $2, $3)",
        [nome, email, senha]
      );
      console.log(`Added data: ${data}`);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }
  
    async fetchUsers(req, res) {
        try {
            const data = await pool.query("SELECT * FROM USUARIO");
            console.log(res.rows);
            return res.status(200).json(data.rows);
          } catch (error) {
            console.error(error);
            return res.status(200).json({error: error});
          }
    }
}

  async fetchUsers(req, res) {
    try {
      const data = await pool.query("SELECT * FROM USUARIO");
      console.log(res.rows);
      return res.status(200).json(data.rows);
    } catch (error) {
      console.error(error);
      return res.status(200).json({ error: error });
    }
  }
}

module.exports = new UserController();
