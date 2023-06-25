const { db } = require("../db/db.js");
const { publishMessage } = require('../utils/mqtt.js');
const Schedule = db.schedules;
const User = db.users;

const createSchedule = async (req, res) => {
  const topic = `schedules/${req.body.userHash}`;

  try {
    const user = await User.findOne({
      where: { userHash: req.body.userHash }
    });

    const schedule = await Schedule.findOne({
      where: {
        horario: req.body.horario,
        quantidade: req.body.quantidade,
        userHash: req.body.userHash
      }
    });

    if (user && !schedule) {
      await Schedule.create(req.body)
      .then(async (createdSchedule) => {
        const schedules = await Schedule.findAll({ where: { userHash: req.body.userHash }});

        await sendSchedulesMQTT(req.body.userHash).then((resolve) => {
          return res.status(200).json(createdSchedule);
        });
      });
    } else if (schedule) {
      return res.status(500).json({error: 'There\'s a schedule registered for with same horario and quantidade!'});
    } else {
      return res.status(404).json({error: 'Invalid user hash!'});
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}

const updateSchedule = async (req, res) => {
  let schedule = {};
  let scheduleId = req.params.scheduleId;

  const horario = scheduleId.split("_")[0];
  const quantidade = scheduleId.split("_")[1];
  const userHash = scheduleId.split("_")[2];


  try {
    await Schedule.update(req.body, {
      where: {
        userHash: userHash,
        horario: horario,
        quantidade: quantidade
      },
    }).then(async () => {
      schedule = await Schedule.findOne({
        where: {
          userHash:  userHash,
          horario: horario,
          quantidade: quantidade
        }
      });
    });

    return res.status(200).json(schedule);
  } catch (error) {
    console.log(error);

    return res.status(500).json(error);
  }
}

const deleteSchedule = async (req, res) => {
  let scheduleId = req.params.scheduleId;

  const horario = scheduleId.split("_")[0];
  const quantidade = scheduleId.split("_")[1];
  const userHash = scheduleId.split("_")[2];

  try {
    await Schedule.destroy({
      where: {
        userHash:  userHash,
        horario: horario,
        quantidade: quantidade
      }
    });

    return res.status(200).json({message: 'Schedule deleted!'});
  } catch (error) {
    return res.status(500).json(error);
  }
}

const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findAll({ where: { userHash: req.params.userHash }});

    if (schedules.length) {
      return res.status(200).json(schedules);
    }

    return res.status(200).json({message: 'No schedules found for this user!'});
  } catch (error) {
    return res.status(500).json({error: error});
  }
}

const sendSchedulesMQTT = async (userHash) => {
  try {
    const schedules = await Schedule.findAll({ where: { userHash: userHash }});
    const topic = `schedules/${userHash}`;

    await publishMessage(topic, schedules);
  } catch (error) {
    console.log(error);

    throw(error);
  }
}

module.exports = {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  sendSchedulesMQTT,
  getSchedules
}