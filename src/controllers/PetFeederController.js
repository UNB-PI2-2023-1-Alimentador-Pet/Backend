const fs = require("fs");
const { db } = require("../db/db.js");
const uuidv4 = require("uuid").v4;

const PetFeeder = db.petfeeders;

const createPetFeeder = async (req, res) => {
  try {
    const data = req.body;
    data.token = uuidv4();

    await PetFeeder.create(data).then(async (feeder) => {
      return res.status(200).json(feeder);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updatePetFeeder = async (req, res) => {};

const getPetFeeders = async (req, res) => {
  try {
    const feeders = await PetFeeder.findAll({
      where: { userHash: req.params.userHash },
    });

    if (feeders.length) {
      return res.status(200).json(feeders);
    }

    return res.status(200).json({ message: "No feeders found for this user!" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const bindImageToFeeder = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(200).json(`You must select a file.`);
    }

    const feeder = await PetFeeder.findOne({
      where: {
        token: req.params.token,
      },
    });

    if (!feeder) {
      return res.status(404).json("This feeder does not exists!");
    }

    PetFeeder.update(
      {
        fotoPet: fs.readFileSync("./public/upload/pets/" + req.file.filename),
      },
      {
        where: {
          id: req.params.id,
        },
      }
    ).then(async () => {
      return res.status(200).json(`File has been uploaded.`);
    });
  } catch (error) {
    return res.send(`Error when trying upload images: ${error}`);
  }
};

module.exports = {
  bindImageToFeeder,
  createPetFeeder,
  getPetFeeders,
};
