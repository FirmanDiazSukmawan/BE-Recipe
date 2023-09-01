const client = require("../config/redisConfig");

const hitByID = async (req, res, next) => {
    const id = req.params.id;
    try {
        const user = await client.get(`getFromRedis/${id}`);
        // console.log(user);

        if (user) {
            let result = JSON.parse(user);
            res.send({
                fromCache: true,
                data: result
            });
        } else {
            next();
        }
    } catch (err) {
        console.log(err.message);
        res.status(404);
    }
};

module.exports = hitByID;