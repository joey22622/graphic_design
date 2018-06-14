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
            validate : {
                len : [0,255]
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