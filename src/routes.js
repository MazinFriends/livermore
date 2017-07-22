const routes = [{
  description: 'Get todo',
  handler: (request, reply) => reply('Hello world'),
  method: 'GET',
  notes: 'Returns a todo item by the id passed in the path',
  path: '/',
  tags: ['api'],
}];

module.exports = routes;
