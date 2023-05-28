const { pool } = require("../db/db.js");

class UserController {
  async createUser(req, res) {
    const { nome, email, senha, user_hash } = req.body;

    try {
      const data = await pool.query(
        "INSERT INTO USUARIO (nome, email, senha, user_hash) VALUES ($1, $2, $3, $4)",
        [nome, email, senha, user_hash]
      );

      return res.status(200).json({ message: "Data added successfully!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }

  async fetchUsers(req, res) {
    try {
      const data = await pool.query("SELECT * FROM USUARIO");

      return res.status(200).json(data.rows);
    } catch (error) {
      console.error(error);
      return res.status(200).json({ error: error });
    }
  }

  async updateUser(req, res) {
    try {
      const user_hash = req.params.user_hash;
      const new_data = req.body;

      console.log(user_hash);

      let query = ["UPDATE USUARIO"];
      let cols = Object.keys(new_data);
      console.log(new_data);

      query.push("SET");

      let set = [];
      cols.forEach(function (key, i) {
        set.push(key + " = ($" + (i + 1) + ")");
      });

      query.push(set.join(", "));

      query.push("WHERE user_hash = '" + user_hash + "'");

      query = query.join(" ");

      console.log(query);

      const data = await pool.query(query, Object.values(new_data));

      return res.status(200).json({ user: data });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error });
    }
  }
}

module.exports = new UserController();
