const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');
const {checkParams} = require('./middlewares/checkParams');
const {checkID} = require('./middlewares/checkID');


BlogPosts.create('Blog Post 1', 'This is the first blog post.', 'LBV');
BlogPosts.create('Blog Post 2', 'This is the second blog post.', 'MBV');


router.get('/', (req, res) => {
	
	res.json(BlogPosts.get());
});

router.post('/', jsonParser, checkParams(['title', 'content', 'author']), (req, res) => {
	const postItem = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(postItem); 
	});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog entry \`${req.params.id}\``);
	res.status(204).end();
});

router.put('/:id', jsonParser, checkParams(['title', 'content', 'author', 'id']), checkID(), (req, res) => {
	console.log(`Updating blog entry \`${req.params.id}\``);
	const updatedBlogPost = BlogPosts.update({
		id: req.body.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
	});
	res.status(204).end();
});

module.exports = router;