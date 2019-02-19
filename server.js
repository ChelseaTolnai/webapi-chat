const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan')

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

function teamNamer(req, res, next) {
  req.team = 'Web 16';

  next();
}

// global middleware
server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));
server.use(teamNamer);
// server.use(moodyGateKeeper);

server.use('/api/hubs', restricted('Joe'), hubsRouter)

server.get('/', restricted('po'), async (req, res, next) => {
  if (req.headers.name === 'po') {
    res.send(`
      <h2>Lambda Hubs API</h2>
      <p>Welcome ${req.team} to the Lambda Hubs API</p>
    `);
  } else {
    next('any error argument will trigger');
  }
});

server.use(errorHandler);

function restricted(name) {
  return function (req, res, next) {
    const personName = req.headers.name;

    if (personName === name) {
      next();
    } else {
      res
        .status(401)
        .json({ messgae: 'please login to access this information' });
    }
  };
};

function moodyGateKeeper(req, res, next) {
  const seconds = new Date().getSeconds();

  if (seconds % 3 === 0) {
    res.status(403).json({ you: 'shall not pass!' });
  } else {
    next();
  }
};

function errorHandler(err, req, res, next) {
  res.status(400).json({ messgae: 'Bad Panda!', err });
}

module.exports = server;