const { db } = require("../db/db.js");
const { publishMessage } = require('../utils/mqtt.js');
const Schedule = db.schedules;
const User = db.users;
const _ = require('lodash');
const fs = require('fs');

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
        await sendSchedulesMQTT(userHash).then(async (resolve) => {
          schedule = await Schedule.findOne({
            where: {
              userHash:  userHash,
              horario: horario,
              quantidade: quantidade
            }
          });

          return res.status(200).json(schedule);
        });
    });

  } catch (error) {
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
        userHash:  userHash,
        horario: horario,
        quantidade: quantidade
      }
    }).then(async (resolve) => {
      await sendSchedulesMQTT(userHash).then(async (resolve) => {
        schedule = await Schedule.findOne({
          where: {
            userHash:  userHash,
            horario: horario,
            quantidade: quantidade
          }
        });

        return res.status(200).json(schedule);
      });
    })
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

const optimizedSchedule = async (req, res) => {
  try {
    // gera todas as combinações possíveis de horário, quantidade consumida
    // e tempo de bandeja
    function generateCombinations(data) {
      const combinations = [];
  
      const uniqueHorarios = _.uniqBy(data, 'horario');
      const uniqueQuantidades = _.uniqBy(data, 'quantidadeConsumida');
      const uniqueTemposBandeja = _.uniqBy(data, 'tempoBandeja');
  
      uniqueHorarios.forEach(horario => {
        uniqueQuantidades.forEach(quantidade => {
          uniqueTemposBandeja.forEach(tempoBandeja => {
            combinations.push({
              horario: horario.horario,
              quantidade: quantidade.quantidadeConsumida,
              tempoBandeja: tempoBandeja.tempoBandeja
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
          item.tempoBandeja === combination.tempoBandeja
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

    // Verifica o corpo da requisição
    if (!req.body.animalAgendaPath) {
      return res.status(400).json({ error: 'Missing animalAgendaPath in request body' });
    }

    // Pega o caminho do arquivo JSON
    const animalAgendaPath = req.body.animalAgendaPath;

    // Le o conteudo do arquivo JSON
    const animalAgendaData = fs.readFileSync(animalAgendaPath, 'utf8');

    // Converte os dados do arquivo JSON em objeto
    const animalAgenda = JSON.parse(animalAgendaData);

    // Gera a sugestao de agenda otimizada
    const optimizedSchedule = generateOptimizedSchedule(animalAgenda);

    // Exibe a sugestao de agenda otimizada
    console.log('Sugestão de agenda otimizada:');
    console.log(optimizedSchedule);

    res.status(200).json(optimizedSchedule);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  createSchedule,
  updateSchedule,
  deleteSchedule,
  sendSchedulesMQTT,
  getSchedules,
  optimizedSchedule
}