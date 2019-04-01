const  redis = require('redis'),
       RDS_PORT = 6379,
       RDS_HOST = '127.0.0.1',
       RDS_OPTS = {};
const redisClient = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
redisClient.on('error', function (err) {
    console.log('Error:' + err);
});
 
redisClient.on('connect', function () {
    console.log('Redis is ready');
});
exports.redis = redis;
exports.redisClient = redisClient;