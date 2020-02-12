const express = require('express');

const server = express();

/* Add JSON Support for HTTP requests */
server.use(express.json());

let countReq = 0;
let projects = [];
const fieldsRequired = ['id', 'title', 'tasks'];

/* Validation Middleware's */
function checkProjectExists(req, res, next) {
    if ( !req.params.id ) {
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

server.post('/projects', payloadRequired, (req, res) => {
    projects.push(req.body);

    return res.json({
        status: 'success',
        projects
    });
});

/* Running HTTP server */
server.listen(3000);
