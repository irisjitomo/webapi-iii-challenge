const express = require('express');
const dataBase = require('./userDb')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
    const newUser = req.body
    dataBase
    .insert(newUser)
    .then(newUsers => {
        res.status(201).json(newUsers)
    })
    .catch(() => {
        res.status(500).json({ error: 'not saved'})
    })
});

router.post('/:id/posts', validateUserId, validatePost,(req, res) => {
    // const id = req.params.id
    const newUser = req.body
    dataBase
    .insert(newUser)
    .then(post => {
        res.status(201).json(newUser)
    })
    .catch(() => {
        res.status(500).json({ error: 'not saved'})
    })
});

router.get('/', (req, res) => {
    dataBase.get()
    .then(database => {
        res.status(200).json(database)
    })
    .catch(() => {
        res.status(500).json({ error: 'not getting data'})
    })
});

router.get('/:id', validateUserId, (req, res) => {
    const id = req.params.id
    dataBase
    .getById(id)
    .then(user => {
        res.status(200).json(user)
    })
    .catch(() => {
        res.status(500).json({ error: 'not getting data'})
    })
});

router.get('/:id/posts', (req, res) => {
    const id = req.params.id
    dataBase
    .getUserPosts(id)
    .then(user => {
        res.status(200).json(user)
    })
    .catch(() => {
        res.status(500).json({ error: 'not getting data'})
    })
});

router.delete('/:id', (req, res) => {
    const id = req.params.id
    dataBase
    .remove(id)
    .then(user => {
        res.json(user)
    })
    .catch(() => {
        res.status(500).json({ error: "The user could not be removed" })
    })
});

router.put('/:id', validateUser, (req, res) => {
    const id = req.params.id
    const newUser = req.body
    dataBase.update(id, newUser)
    .then(changes => {
        res.json(changes)
    })
    .catch(() => {
        res.status(500).json({ error: "The post information could not be modified." })
    })
});

//custom middleware

function validateUserId(req, res, next) {
 const userId = req.params.id;
 const user = req.body
 console.log(userId)
 console.log(user)
 if (!userId) {
    res.status(400).json({ message: "invalid user id" })
 } else {
    res.user = user
 }
 next();
};

function validateUser(req, res, next) {
    if(req.body){
        if (!req.body.name) {
          res.status(400).json({ message: "missing required name field" })
        } else {
          res.json(req.body)
        }
      } else {
        res.status(400).json({ message: "missing user data" })
      }
      next();
};

function validatePost(req, res, next) {
    if(req.body){
        if (!req.body.text){
          res.status(400).json({ message: "missing required text field" })
        } else {
          res.json(req.body.text)
        }
      } else {
        res.status(400).json({ message: "missing post data" })
      }
      next();
};

module.exports = router;
