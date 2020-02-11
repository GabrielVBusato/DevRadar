const { Router } = require('express');
const DevController = require('./controllers/DevController')
const SearchController = require('./controllers/SearchControlle')
const routes = Router();

routes.get('/devs', DevController.index)
routes.post('/devs', DevController.store)
routes.delete('/devs/:github_username', DevController.delete)
routes.get('/search', SearchController.index)
routes.put('/devs/:github_username', DevController.update)

module.exports = routes;