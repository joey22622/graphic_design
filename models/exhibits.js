module.exports = function (sequelize, dataTypes){

    var Exhibit = sequelize.define("Exhibit", {
        caption : {
            type : dataTypes.STRING
        },
        imagePath : {
            type : dataTypes.TEXT,
        },
        imageType : {
            type : dataTypes.STRING
        },
        order : {
            type : dataTypes.INTEGER
        },
        imageLink : {
            type : dataTypes.STRING
        },
        imageTitle : {
            type : dataTypes.TEXT
        },
        imageDescription : {
            type : dataTypes.TEXT
        }
    });

    Exhibit.associate = function(models){
        Exhibit.belongsTo(models.Client, {
            // foreignKey : {
            //     allowNull : false
            // }
        });
    };

    return Exhibit;
}