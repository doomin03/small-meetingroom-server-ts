import { FastifyInstance, FastifyPluginAsync } from 'fastify';

const routes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/health', async () => ({ status: 'ok' }));

};

export default routes;
