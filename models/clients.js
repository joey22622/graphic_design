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
            type : dataTypes.TEXT
        },
        description : {
            type: dataTypes.TEXT
        },
        link : {
            type : dataTypes.STRING
        },
        linkText : {
            type : dataTypes.STRING,
            validate : {
                len : [0,255]
            }
        }
    },{
        associate: function(models) {
          Client.hasMany(models.Exhibit, { onDelete: 'cascade' });
        }
    });

    return Client;

}