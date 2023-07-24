const { db } = require("../db/db.js");
const { publishMessage, client } = require('../utils/mqtt.js');
const Schedule = db.schedules;
const User = db.users;
const _ = require('lodash');
const fs = require('fs');

const History = db.histories;

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
          await sendSchedulesMQTT(req.body.userHash, createdSchedule).then((resolve) => {

            return res.status(200).json(createdSchedule);
          });
        });
    } else if (schedule) {
      return res.status(500).json({ error: 'There\'s a schedule registered for with same horario and quantidade!' });
    } else {
      return res.status(404).json({ error: 'Invalid user hash!' });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}

const updateSchedule = async (req, res) => {
  let scheduleId = req.params.scheduleId;

  const horario = scheduleId.split("_")[0];
  const quantidade = scheduleId.split("_")[1];
  const userHash = scheduleId.split("_")[2];
  let schedule = {};
  try {
    await Schedule.update(req.body, {
      where: {
        userHash: userHash,
        horario: horario,
        quantidade: quantidade
      },
    }).then(async (updateSchedule) => {
      schedule = await Schedule.findOne({
        where: {
          horario: req.body.horario,
          quantidade: req.body.quantidade,
          userHash: req.body.userHash
        }
      }).then(async (updatedSchedule) => {
        console.log(updatedSchedule);
        await sendSchedulesMQTT(userHash, updatedSchedule).then(async (resolve) => {
          return res.status(200).json(updatedSchedule);
        });
      })
    });


  }

  catch (error) {
    console.log(error);

    return res.status(500).json(error);
  }
}

const deleteSchedule = async (req, res) => {
  let schedule;
  let scheduleId = req.params.scheduleId;

  const horario = scheduleId.split("_")[0];
  const quantidade = scheduleId.split("_")[1];
  const userHash = scheduleId.split("_")[2];

  try {
    await Schedule.destroy({
      where: {
        userHash: userHash,
        horario: horario,
        quantidade: quantidade
      }
    }).then(async (resolve) => {
      schedule = await Schedule.findAll({
        limit: 1,
        where: {
          //your where conditions, or without them if you need ANY entry
        },
        order: [['createdAt', 'DESC']]
      }).then(async function (entries) {
        //only difference is that you get users list limited to 1
        //entries[0]

        const lastSchedule = entries[0];
        lastSchedule.ativo = "false"

        await sendSchedulesMQTT(userHash, lastSchedule).then(async (resolve) => {

          return res.status(200).json(lastSchedule);
        });
      });


    })
  } catch (error) {
    return res.status(500).json(error);
  }
}

const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findAll({ where: { userHash: req.params.userHash } });

    if (schedules.length) {
      return res.status(200).json(schedules);
    }

    return res.status(200).json({ message: 'No schedules found for this user!' });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

const getSchedulesByFeeder = async (req, res) => {
  try {
    const schedules = await Schedule.findAll({ where: { token: req.params.token } });

    if (schedules.length) {
      return res.status(200).json(schedules);
    }

    return res.status(200).json({ message: 'No schedules found for this feeder!' });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
}

const sendSchedulesMQTT = async (userHash, createdSchedule) => {
  try {
    const topic = `schedules/${userHash}`;

    await publishMessage(topic, createdSchedule);
  } catch (error) {
    console.log(error);

    throw (error);
  }
}

const autoFeedInfo = async (req, res) => {
  try {
    const { topic, ...feedInfo } = req.body;

    publishMessage(topic, feedInfo).then(onfulfilled => {
      return res.status(200).json(feedInfo);
    }).catch(onrejected => {
      return res.status(500).json(onrejected);
    })

  } catch (error) {
    return res.status(500).json(error);
  }
}

const receiveESPTopic = async (req, res) => {
  try {
    const { topic } = req.body;

    client.subscribe(topic, (err, granted) => {
      let success_message = "Subscribed to " + topic;
      console.log(success_message);
      if (err) { console.log(err); }

      return res.status(200).json(success_message);
    });


  } catch (error) {
    return res.status(500).json(error);
  }
}

const optimizedScheduleForAllPets = async (req, res) => {
  try {

    // Pega o caminho do arquivo JSON
    /*const animalAgendaPath = jsonFilePath;

    // Le o conteudo do arquivo JSON
    const animalAgendaData = fs.readFileSync(animalAgendaPath, 'utf8');

    // Converte os dados do arquivo JSON em objeto
    const animalAgenda = JSON.parse(animalAgendaData);*/
    const animalAgenda = await History.findAll();

    // Gera a sugestao de agenda otimizada
    const optimizedSchedule = generateOptimizedSchedule(animalAgenda);

    // Exibe a sugestao de agenda otimizada
    console.log('Sugestão de agenda otimizada:');

    return res.status(200).json(optimizedSchedule);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const optimizedScheduleForMyPet = async (req, res) => {
  try {

    // Pega o caminho do arquivo JSON
    /*const animalAgendaPath = jsonFilePath;

    // Le o conteudo do arquivo JSON
    const animalAgendaData = fs.readFileSync(animalAgendaPath, 'utf8');

    // Converte os dados do arquivo JSON em objeto
    const animalAgenda = JSON.parse(animalAgendaData);*/
    const animalAgenda = await History.findAll({
      where: { userHash: req.params.userHash }
    });

    // Gera a sugestao de agenda otimizada
    const optimizedSchedule = generateOptimizedSchedule(animalAgenda);

    // Exibe a sugestao de agenda otimizada
    console.log('Sugestão de agenda otimizada:');
    console.log(optimizedSchedule);

    return res.status(200).json(optimizedSchedule);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// gera todas as combinações possíveis de horário, quantidade consumida
// e tempo de bandeja
function generateCombinations(data) {
  const combinations = [];

  const uniqueHorarios = _.uniqBy(data, 'horario');
  const uniqueQuantidades = _.uniqBy(data, 'quantidadeConsumida');
  const uniqueQuantTotal = _.uniqBy(data, 'quantidadeTotal');

  uniqueHorarios.forEach(horario => {
    uniqueQuantidades.forEach(quantidade => {
      uniqueQuantTotal.forEach(quantidadeTotal => {
        combinations.push({
          horario: horario.horario,
          quantidade: quantidade.quantidadeConsumida,
          quantidadeTotal: quantidadeTotal.quantidadeTotal
        });
      });
    });
  });

  return combinations;
}

// calcula o total consumido com base na combinação fornecida
function calculateTotalConsumed(data, combination) {
  return _.sumBy(data, item => {
    if (
      item.horario === combination.horario &&
      item.quantidadeConsumida === combination.quantidade &&
      item.quantidadeTotal === combination.quantidadeTotal
    ) {
      return item.quantidadeConsumida;
    }
    return 0;
  });
}

// gera a sugestao de agenda otimizada
function generateOptimizedSchedule(data) {
  const combinations = generateCombinations(data);
  let maxTotalConsumed = 0;
  let optimizedSchedule = null;

  combinations.forEach(combination => {
    const totalConsumed = calculateTotalConsumed(data, combination);

    if (totalConsumed > maxTotalConsumed) {
      maxTotalConsumed = totalConsumed;
      optimizedSchedule = combination;
    }
  });

  return optimizedSchedule;
}

module.exports = {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  sendSchedulesMQTT,
  getSchedules,
  getSchedulesByFeeder,
  optimizedScheduleForAllPets,
  optimizedScheduleForMyPet,
  autoFeedInfo,
  receiveESPTopic
}