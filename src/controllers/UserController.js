const { pool } = require("../db/db.js");

class UserController {
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

    async updateUser(req, res) {
        try {
            const user_hash = req.params["user_hash"];
            const new_data = req.body;

            console.log(user_hash);

            let query = ['UPDATE USUARIO'];
            let cols = Object.keys(new_data);

            query.push('SET');

            let set = [];
            Object.keys(cols).forEach(function (key, i) {
                set.push(key + ' = ($' + (i + 1) + ')'); 
            });

            query.push(set.join(', '));

            query.push('WHERE user_hash = ' + user_hash );

            query = query.join(' ');

            console.log(query);

            const data = await pool.query(query, new_data)

            return res.status(200).json({user: data["rows"][0]});
        } catch (error) {
            console.log(error);
            return res.status(400).json({error: error});
        }
    }
}

module.exports = new UserController();
