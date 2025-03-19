'use strict';

const express = require('express');

//const dao = require('./newDao');
const morgan = require('morgan');

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Import routes

const userRoutes = require('./routes/users');

// init express
const app = new express();
const port = 3001;



// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());



// Configurazione Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API Documentation',
      version: '1.0.0',
      description: 'API documentation for Express with SQLite',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server'
      }
    ]
  },
  // Percorso ai file che contengono le annotazioni Swagger
  apis: ['./newServer.js', './routes/*.js']
};

// Inizializza swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Configura l'endpoint per la documentazione Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Usa le route
app.use('/api/users', userRoutes);

/*
// Query parametric /api/domande?admin=value
app.get('/api/questions',[check('admin').exists({ checkNull: false })] ,async (req, res) => {

  const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

  try {
    let result;

    const idQuest = req.query.admin
    

    if(idQuest.toString() !== "null"){
	console.log(idQuest);
      result = await dao.getQuestionsByAdmin(parseInt(idQuest));
    }else
      result = await dao.getTutteDomande()
     
    if (result.error)
          res.status(404).json(result);
      else
          res.json(result);
  } catch (err) {
      res.status(503).json({error: `Database error during query execution.`});
  }
});
*/

// Avvia il server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
});


