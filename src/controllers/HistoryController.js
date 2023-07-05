const fs = require("fs");
const { db } = require("../db/db.js");

const History = db.histories;

const createHistory = async (req, res) => {
    try {
        await History.create(req.body)
          .then(async (history) => {
            return res.status(200).json(history);
          });
    } catch (error) {
        return res.status(500).json(error);
    }
}

const getHistories = async (req, res) => {
    try {
        const history = await History.findAll({ where: { userHash: req.params.userHash }});

        if (history.length) {
          return res.status(200).json(history);
        }

        return res.status(200).json({message: 'No histories found for this user!'});
      } catch (error) {
        return res.status(500).json({error: error});
      }
}

const bindImageToHistory = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(200).json(`You must select a file.`);
    }

    const history = await History.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!history) {
      return res.status(404).json('This history does not exists!');
    }

    History.update({
      foto: fs.readFileSync(
        "./public/upload/histories/" + req.file.filename
      ),
    }, {
        where: {
            id: req.params.id
        }
    }).then(async () => {
        return res.status(200).json(`File has been uploaded.`);
    });
  } catch (error) {
    return res.send(`Error when trying upload images: ${error}`);
  }
};

module.exports = {
  bindImageToHistory,
  createHistory,
  getHistories
};