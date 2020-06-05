const express = require('express');

const server = express();

const projectsRouter = require('./projects/projectsRouter.js')




server.get('/', (req, res) => {
    res.send(`
    <h2>Lambda Sprint Challenge Main Page</h2>
  
  `);
});


server.use(express.json());
server.use('/api/projects', projectsRouter)


module.exports = server;