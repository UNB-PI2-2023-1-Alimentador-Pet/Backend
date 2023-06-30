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
    
}

const bindImage = async (req, res) => {
  try {
    console.log(req.file);

    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }

    History.update({
      photo: fs.writeFileSync(
        __basedir + "/images" + req.file
      ),
    }, {
        where: {
            id: req.params.id
        }
    }).then(async () => {
        return res.send(`File has been uploaded.`);
    });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};

module.exports = {
  bindImage,
  createHistory,
  getHistories
};