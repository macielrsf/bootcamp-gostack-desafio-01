const express = require('express');

const server = express();

/* Add JSON Support for HTTP requests */
server.use(express.json());

let countReq = 0;
let projects = [{
    id: 1,
    title: 'Node.js',
    tasks: []
}];
const fieldsRequired = ['id', 'title', 'tasks'];

/* Helpers */
function findProject(req) {
    var result = projects.filter(item => {
        return item.id === parseInt(req.params.id);
    });

    if ( result.length > 0 ) {
        return result[0];
    }

    return null;
}

/* Validation Middleware's */
function checkProjectExists(req, res, next) {
    var project = findProject(req);

    if ( !project ) {
        return res.status(400).json({
            status: 'error', 
            msg: 'Project does not exists'
        });
    }

    return next();
}

function payloadRequired(req, res, next) {
    fieldsRequired.map((field) => {
        if ( !req.body[field] ) {
            return res.json({
                status: 'error',
                msg: `${field} is required`
            })
        }
    });

    return next();
}

/* Request Counter Middleware */
function reqCounter(req, res, next) {
    countReq += 1;
    console.log(`${countReq} requests done.`);
    return next();
}

/* Global use Request Counter middleware */
server.use(reqCounter);

server.get('/projects', (req, res) => {
    return res.json({
        status: 'success',
        projects
    });
});

server.get('/projects/:id', checkProjectExists, (req, res) => {
    const project = findProject(req);

    return res.json({
        status: 'success',
        project
    });
});

server.post('/projects', payloadRequired, (req, res) => {
    projects.push(req.body);

    return res.json({
        status: 'success',
        projects
    });
});

server.put('/projects/:id', checkProjectExists, payloadRequired, (req, res) => {
    const { title } = req.body;

    let project = findProject(req); 
    let idx = projects.indexOf(project);

    project.title = title;
    
    projects[idx] = project;

    return res.json({
        status: 'success',
        project
    });
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
    let project = findProject(req);
    let idx = projects.indexOf(project);

    projects.splice(idx, 1);

    return res.json({
        status: 'success',
        projects
    });
});

/* Running HTTP server */
server.listen(3000);
