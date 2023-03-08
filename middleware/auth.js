const jwt = require('jsonwebtoken');

//verify if token is valid and transfers to other middlewares or to gestionnaire de routes
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //récupérer token en 2e position / bearer ?
        const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
        const userId = decodedToken.userId; //property userId from decodedToken object
        req.auth = {
            userId: userId
        };
    } catch (error) {
        res.status(401).json({ error })
    }
    next()
};