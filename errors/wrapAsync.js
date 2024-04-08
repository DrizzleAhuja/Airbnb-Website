module.exports.wrapAsync = (fn) => {
    return (req, res, next) => {
        const promise = fn(req, res, next);
        if (!promise.catch) {
            return promise;
        }
        promise.catch(next);
    }
}