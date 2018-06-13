module.exports = function(sequelize, dataTypes){
    var Client = sequelize.define("Client",{
        order : {
            type : dataTypes.INTEGER
        },
        name : {
            type : dataTypes.STRING
        },
        blurb : {
            type : dataTypes.STRING,
            allowNull : false,
            validate : {
                len : [1,255]
            }
        },
        logo : {
            type : dataTypes.STRING
        },
        description : {
            type: dataTypes.TEXT
        }
    });

    return Client;

}