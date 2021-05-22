const { response } = require('express');
const express = require('express');

//const { uuid } = require('uuidv4');

const { v4: uuidv4, v4: isUuidv4 } = require('uuid'); 


const app = express();

app.use(express.json()); // capturar o retorno no padrão JSON

/**
 * Métodos HTTP
 * 
 * GET: Buscar informações do back-end
 * POST: Criar uma informação no back-end
 * PUT/PATCH: Alterar uma informação no back-end
 *   PUT: Quando se altera todos as informaçẽos
 *   PATCH: Quando se altera somente um campo.
 *   
 *   Normalmente se utiliza somente o PUT
 * 
 * DELETE: Deletar uma informação no back-end
 */

/**
 * Tipos de parâmetros
 * Query Params: Filtros e paginação
 * Route Params: Identificar recursos (Atualizar/Deletar)
 * Request Body: Conteúdo na hora de criar ou editar um recurso (JSON)
 */

const projects = [];


function logRequests(request, response, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next (); // Próximo middleware

    console.timeEnd(logLabel);

}

function validateProjectId( request, response, next) {
    const { id } = request.params;
    
    if (!isUuidv4(id)) {
        return response.status(400).json({ error: 'Invalid project ID.'});
    }

    return next();
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId);

app.get('/projects',(request, response) => {
    //return response.send('Hello World Devs Web and Mobile!'); // retorna somente texto para o browse
    //return response.json({
    //    message: "Hello World Devs Web and Mobile!"
    //});

    //const query = request.query;
    //console.log(query);

    // para desestruturar os parâmetros( ter cada variável separada)
    //const {title, owner}= request.query;
    //console.log(title);
    //console.log(owner);

    //return response.json([
    //    'Projeto 1',
    //    'Projeto 2',
    //]);

    const { title } = request.query;

    const results = title
      ? projects.filter(project => project.title.includes(title))
      : projects;

    return response.json(results);
});



app.post('/projects',(request, response) =>{
    //const body = request.body;
    const { title, owner } = request.body;

    const project = { id: uuidv4(), title, owner };

    projects.push(project);    

    return response.json(project);
});



app.put('/projects/:id', (request, response) => {
    //const params = request.params;
    const { id } = request.params;
    const { title, owner } = request.body;

    //const project = projects.find(project => project.id == id);
    
    // cria a variável projectindex que irá conter o conteúdo retornado da busca dentro do array
    // diferente do find o findindex retorna a posição dentro do vetor
    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0 ) {
        return response.status(400).json({ error: 'Project not found.' })
    };

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;

    return response.json(project);

});



app.delete('/projects/:id',(request, response) =>{
   //const params = request.params;
   const { id } = request.params;

   // cria a variável projectindex que irá conter o conteúdo retornado da busca dentro do array
    // diferente do find o findindex retorna a posição dentro do vetor
    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0 ) {
        return response.status(400).json({ error: 'Project not found.' })
    };

    projects.splice(projectIndex, 1);

    return response.status(204).send();

    
});


app.listen(3333,() => {
    console.log('🚀 Back-end started! 🌠')
});

// para startar o servidor usa-se: node src/indes.js
// executar com o nodemon usa-se: yarn nodemon src/index.js 

// Com as alterações realizadas no package.json utiliza-se: yarn dev
//"main": "src/index.js",
//"scripts":{
//  "dev": "nodemon"
//},
