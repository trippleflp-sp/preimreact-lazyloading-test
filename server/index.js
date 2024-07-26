import Fastify from 'fastify'
import cors from '@fastify/cors'

const fastify = Fastify({
    logger: true
})
await fastify.register(cors, {
    origin: '*'
})

const items = Array.from({ length: 30000 }, (_, index) => ({ id: index + 1, name: `Item #${index +1}` }));

fastify.get('/items', async (request, reply) => {
    const { batch = 0 } = request.query;
    const batchSize = 30;
    const startIndex = (batch) * batchSize;
    const endIndex = startIndex + batchSize;

    if (startIndex >= items.length) {
        return reply.code(400).send({ error: 'Batch number out of range' });
    }

    const batchItems = items.slice(startIndex, endIndex);
    console.info("SENT ITEMS: ",batchItems)
    return { batch, items: batchItems };
});

/**
 * Run the server!
 */
const start = async () => {
    try {
        await fastify.listen({ port: 3001 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()