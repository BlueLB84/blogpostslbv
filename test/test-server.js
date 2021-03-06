const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog Posts', function() {
	before(function() {
		return runServer();
	});

	after(function() {
		return closeServer();
	});

	it('should list blog posts on GET', function() {
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.length.should.be.at.least(1);
				const expectedKeys = ['id', 'title', 'content', 'author'];
				res.body.forEach(function(item) {
					item.should.be.a('object');
					item.should.include.keys(expectedKeys);
				});
			});
	});

	it('should add an item on POST', function() {
		const newPost = {title: 'Blog Post 3', content: 'This is the third blog post.', author: 'Zoe'};
		return chai.request(app)
			.post('/blog-posts')
			.send(newPost)
			.then(function(res) {
				res.should.have.status(201);
				res.should.be.json;
				res.body.should.be.a('object');
				res.body.should.include.keys('id', 'title', 'content', 'author');
				res.body.id.should.not.be.null;
				res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate}));
			});
	});


	it('should update blog posts on PUT', function() {
	    const updateData = {
	      author: 'Chief',
		  title: 'This is a test title',
		  content: 'This is test content'
	    };

	    return chai.request(app)
	      .get('/blog-posts')
	      .then(function(res) {
	        updateData.id = res.body[0].id;
	        updateData.publishDate = res.body[0].publishDate;

	        return chai.request(app)
	          .put(`/blog-posts/${updateData.id}`)
	          .send(updateData);
	      })
	      .then(function(res) {
	        res.should.have.status(204);
	      });
	});


	it('should delete a post on DELETE', function() {
		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				return chai.request(app)
					.delete(`/blog-posts/${res.body[0].id}`);
			})
			.then(function(res) {
				res.should.have.status(204);
			});
	});
});

