const express = require('express');

const server = express();
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');


//custom middleware

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} and ${req.url}`)
  next();
};

function hello(req, res, next) {
  console.log('hello')
  next()
}

server.use(express.json());
server.use(logger);
server.use(hello)
server.use('/api/users',  userRouter)
server.use('/api/posts',  postRouter)



server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

module.exports = server;
