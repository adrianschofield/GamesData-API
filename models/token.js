var cryptojs = require('crypto-js');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('token', {
        token: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [1]
            },
            set: function (value) {
                var hash = cryptojs.SHA256(value).toString();

                this.setDataValue('token', value);
                this.setDataValue('token_hash', hash);
            }
        },
        token_hash: {
            type: DataTypes.STRING
        }
    });
};