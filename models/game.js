module.exports = function (sequelize, DataTypes) {
    return sequelize.define('game', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 250]
            }
        },
        platform: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 250]
            }
        },
        timePlayed: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        hours: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: true
            }
        },
        minutes: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: true
            }
        },
        like: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        current: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        finished: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        mutiplayer: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    });
};
