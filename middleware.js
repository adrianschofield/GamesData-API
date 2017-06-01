var cryptojs = require('crypto-js');

module.exports = function (db) {
    return {
        requireAuthentication: function (req, res, next) {
            var token = req.get('Auth') || '';

            db.token.findOne({
                where: {
                    token_hash: cryptojs.SHA256(token).toString()
                }
            }).then(function (tokenInstance) {
                if (!tokenInstance) {
                   throw new Error(); 
                }

                req.token = tokenInstance;

                return db.users.findByToken(token);

            }).then(function (user) {
                req.user = user;
                next();
            }).catch(function () {
                res.status(401).send();
            })
            
            //db.users.findByToken(token).then(function (user) {
             //   req.user = user;
            //  next();
            //}, function () {
            //   res.status(401).send();
            //});
        }
    };
};