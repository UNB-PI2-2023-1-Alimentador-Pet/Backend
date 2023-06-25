const { db } = require("../db/db.js");

const Schedule = db.schedules;
const User = db.users;

const createSchedule = async (req, res) => {
  let schedule;

  try {
    const user = await User.findOne({
      where: { userHash: req.body.userHash }
    });

    const schedule = await Schedule.findOne({
      where: { horario: req.body.horario }
    });

    if (user && !schedule) {
      await Schedule.create(req.body)
      .then((createdSchedule) => {
        return res.status(200).json(createdSchedule);
      });
    } else if (schedule) {
      return res.status(500).json({error: 'There\'s a schedule registered for the same time!'});
    } else {
      return res.status(404).json({error: 'Invalid user hash!'});
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}

const updateSchedule = async (req, res) => {

}

const deleteSchedule = async (req, res) => {

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

const sendSchedulesMQTT = async () => {
  
}

module.exports = {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  sendSchedulesMQTT,
  getSchedules
}