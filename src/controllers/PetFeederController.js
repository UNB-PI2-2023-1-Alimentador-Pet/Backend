const fs = require("fs");
const { db } = require("../db/db.js");

const PetFeeder = db.petfeeders;
const User = db.users;

const createPetFeeder = async (req, res) => {
  try {
    const user = await User.findOne({ where: { userHash: req.body.userHash }});

    if (!user)
      return res.status(200).json({message: 'This user doesn\'t exists!'});

    const data = req.body;

    await PetFeeder.create(data).then(async (feeder) => {
      return res.status(200).json(feeder);
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updatePetFeeder = async (req, res) => {
  let feeder = {};

  try {
    await PetFeeder.update(req.body, {
      where: { token: req.params.token },
    }).then(async () => {
      feeder = await PetFeeder.findOne({
        where: { token: req.params.token },
      });
    });
    
    return res.status(200).json(feeder);
  } catch (error) {
    console.log(error);

    return res.status(500).json(error);
  }
};

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
        fotoPet: fs.readFileSync("./public/upload/pets/images/" + req.file.filename),
      },
      {
        where: {
          token: req.params.token,
        },
      }
    ).then(async () => {
      return res.status(200).json(`File has been uploaded.`);
    });
  } catch (error) {
    return res.send(`Error when trying upload images: ${error}`);
  }
};

const bindAudioToFeeder = async (req, res) => {
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
        audio: fs.readFileSync("./public/upload/pets/audio/" + req.file.filename),
      },
      {
        where: {
          token: req.params.token,
        },
      }
    ).then(async () => {
      return res.status(200).json(`File has been uploaded.`);
    });
  } catch (error) {
    return res.send(`Error when trying upload images: ${error}`);
  }
};

const getPetFeeder = async (req, res) => {
  try {
    const feeder = await PetFeeder.findOne({
      where: {
        token: req.params.token,
      },
    });

    if (!feeder) {
      return res.status(404).json("This feeder does not exists!");
    }

    return res.status(200).json(feeder);
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  bindImageToFeeder,
  bindAudioToFeeder,
  createPetFeeder,
  getPetFeeders,
  getPetFeeder,
  updatePetFeeder
};
