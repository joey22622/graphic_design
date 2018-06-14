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