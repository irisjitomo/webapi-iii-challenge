const express = require('express');
const userDataBase = require('./userDb');
const postDataBase = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
	const newUser = req.body;
	userDataBase
		.insert(newUser)
		.then((newUsers) => {
			res.status(201).json(newUsers);
		})
		.catch(() => {
			res.status(500).json({ error: 'not saved' });
		});
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
	const newPost = { ...req.body, user_id: req.params.id };
	postDataBase
		.insert(newPost)
		.then((post) => {
			res.status(201).json(post);
		})
		.catch(() => {
			res.status(500).json({ error: 'not saved' });
		});
});

router.get('/', (req, res) => {
	userDataBase
		.get()
		.then((database) => {
			res.status(200).json(database);
		})
		.catch(() => {
			res.status(500).json({ error: 'not getting data' });
		});
});

router.get('/:id', validateUserId, (req, res) => {
	const id = req.params.id;
	userDataBase
		.getById(id)
		.then((user) => {
			user ? res.status(200).json(user) : res.status(404).json({ error: 'does not exist' });
		})
		.catch(() => {
			res.status(500).json({ error: 'not getting data' });
		});
});

router.get('/:id/posts', (req, res) => {
	const id = req.params.id;
	userDataBase
		.getUserPosts(id)
		.then((user) => {
			res.status(200).json(user);
		})
		.catch(() => {
			res.status(500).json({ error: 'not getting data' });
		});
});

router.delete('/:id', (req, res) => {
	const id = req.params.id;
	userDataBase
		.remove(id)
		.then((user) => {
			res.json(user);
		})
		.catch(() => {
			res.status(500).json({ error: 'The user could not be removed' });
		});
});

router.put('/:id', validateUser, validateUserId, (req, res) => {
	const id = req.params.id;
	const newUser = req.body;
	userDataBase
		.update(id, newUser)
		.then((changes) => {
			res.json(changes);
		})
		.catch(() => {
			res.status(500).json({ error: 'The post information could not be modified.' });
		});
});

//custom middleware

function validateUserId(req, res, next) {
	const userId = req.params.id;
	const user = req.body;
	console.log(userId);
	console.log(req.params);
	if (!userId || userId !== req.params.id) {
		return res.status(404).json({ message: 'invalid user id' });
	} else {
		res.user = user;
	}
	console.log('validateusrId activated')
	next();
}

function validateUser(req, res, next) {
	if (!req.body){
		res.status(400).json({ message: 'missing user data'})
	} else if (!req.body.name) {
		res.status(400).json({ message: 'missing required name field' });
	} else {
		console.log('validateUserActivated')
		next()
	}
}

function validatePost(req, res, next) {
	if (req.body) {
		if (!req.body.text) {
			res.status(400).json({ message: 'missing required text field' });
		} else {
			next();
		}
	} else {
		res.status(400).json({ message: 'missing post data' });
	}
}

module.exports = router;
