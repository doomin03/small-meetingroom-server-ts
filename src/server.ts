import Fastify from 'fastify';
import routes from './routes/index.router';

const buildServer = () => {
  const fastify = Fastify({
    logger: true,
  });

  fastify.register(routes, { prefix: '/api' });

  return fastify;
};

const start = async () => {
  const fastify = buildServer();
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
