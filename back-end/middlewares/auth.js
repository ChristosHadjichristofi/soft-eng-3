const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('X-OBSERVATORY-AUTH');
    if (!authHeader) {
        return res.status(401).json({msg: 'Not authenticated.'});
    }
    const token = authHeader;

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'denthaseafisoumenatovreispotepotepote');
    } catch (err) {
        return res.status(500).json({msg: 'Internal server error.'});
    }
    if (!decodedToken) {
        return res.status(401).json({msg: 'Not authenticated.'});
    }
    req.userId = decodedToken.userId;
    next();
};