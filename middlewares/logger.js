const logger = (req, res, next) => {
    console.log("Method:", req.method);
    console.log("Protocol:", req.protocol);
    console.log("Original URL:", req.originalUrl);

    next();
};
module.exports = logger;