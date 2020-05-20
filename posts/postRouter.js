const express = require('express');
const postDb = require("./postDb");

const router = express.Router();

router.get('/', (req, res) => {
    postDb
    .get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving posts" });
    });
});

router.get('/:id', validatePostId, (req, res) => {
    const id = req.params.id
    postDb
    .getById(id)
    .then(post => {
        res.status(200).json(post)
    })
    .catch(err => {
        res.status(500).json({ message: "unable to retrieve post" })
    })
});

router.delete('/:id', validatePostId, (req, res) => {
    postDb
    .remove(id)
    .then(deleted => {
        res.status(200).json(deleted)
    })
    .catch(() => {
        res.status(500).json({ message: "unable to delete post" })
    })
});

router.put('/:id', validatePostId, (req, res) => {
    const changes = req.body

    postDb
    .update(id, changes)
    .then(updated => {
        res.status(200).json(updated)
    })
    .catch(() => {
        res.status(500).json({ message: 'could not update' })
    })
});

// custom middleware

function validatePostId(req, res, next) {
    const id = req.params.id
    postDb
    .getById(id)
    .then(post => {
        if (post) {
            next()
        } else {
            res.status(400).json({ message: "invalid post ID"})
        }
    })

};

module.exports = router;