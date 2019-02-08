module.exports = function(sequelize, dataTypes){
    var Keys = sequelize.define("Keys",{
        key : {
            type : dataTypes.TEXT
        }
    });

    return Keys;

}