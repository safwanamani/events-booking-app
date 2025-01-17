const Redis = require("ioredis");
const { redis } = require("../../config");

const redisClient = new Redis({
  host: redis.host,
  port: redis.port,
});

redisClient.on('connect', () => {
    console.log('Connected to Redis')
})

redisClient.on('error', (error) => {
    console.log("Redis error:", error)
})

module.exports = redisClient;
