// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

    app.get("/api/clients/", function(req, res){
        db.Client.findAll({
            order : [["order" , "ASC"]]
            // order : [db.sequelize.fn('MAX', db.sequelize.col('order'))],
        }).then(function(data) {
            res.json(data);
          });
      });

    app.post("/api/clients", function(req, res){
        console.log(res)
        db.Client.create({
            name : req.body.name,
            blurb : req.body.blurb,
            logo : req.body.logo,
            description: req.body.description,
            order : req.body.order
        }).then(function(data){
            res.json(data);
        });
    });

    app.put("/api/clients/reorder", function(req, res){
        db.Client.update(
            {
                order : req.body.newVal
            },{
                where : {
                    id : req.body.id
                }
            }
    ).then(function(data){ 
            res.json(data);
        });
    });

    app.put("/api/clients/update", function(req,res){
        db.Client.update({           
                name : req.body.name,
                blurb : req.body.blurb,
                logo : req.body.logo,
                description: req.body.description
            },{
                where : {
                    id : req.body.id
                }

    }).then(function(data){
        res.json(data);
    }).catch(function(err){
        console.log("res.send failed");
        res.send(err);
    });
});

    app.get("/api/clients/:id", function(req, res){
        db.Client.findOne({
            where : {
                id : req.params.id
            }
        }).then(function(data){
            res.json(data);
            
        }).catch(function(err){
            if(err) throw err;
        });
    });

    app.get("/api/clients/init/new" , function(req,res){
        db.Client.findAll({
                order: [ [ 'createdAt', 'DESC' ]]
            
        }).then(function(data){
            res.json(data);
        });
    });

    app.delete("/api/clients/delete/:id" , function(req,res){
        db.Client.destroy({
            where : {
                id : req.params.id
            }
        }).then(function(data){
            res.json(data);
        });

    });
//============ EXHIBITS TABLE ================

// NEW EXHIBIT FOR UNDEFINED CLIENT
    app.post("/api/exhibits/init", function(req, res){
        console.log("received");
        db.Exhibit.create({
            order : req.body.order


        }).then(function(data){
            res.json(data);
        });
    });
    app.get("/api/exhibits/init", function(req, res){
        db.Exhibit.findOne({

                  order: [ [ 'createdAt', 'DESC' ]]

        }).then(function(data){
            res.json(data);
        });
    });


    app.get("/api/exhibits/:id", function(req, res){
        db.Exhibit.findAll({
            
            order : [["order" , "ASC"]],
            where : {
                ClientId : req.params.id
            }

        }).then(function(data){
            res.json(data);
            console.log(req.params.id)
        });
    });
    
    app.delete("/api/exhibits/delete/:id", function(req, res){
        db.Exhibit.destroy({
            where : {
                id : req.params.id
            }
        });
    });

    app.delete("/api/exhibits/homeless", function(req, res){
        db.Exhibit.destroy({
            where : {
                ClientId : null
            }
        }).then(function(data){
            res.json(data);
        });
    });

    app.post("/api/exhibits/submit", function(){

    });

    app.post("/api/exhibits/new", function(req, res){
        db.Exhibit.create({
            order : req.body.order
        });
    });

    app.put("/api/exhibits/submit", function(req, res){
        db.Exhibit.update({
            
            order : req.body.order,
            imagePath : req.body.imagePath,
            imageType : req.body.imageType,
            caption : req.body.caption,
            ClientId : req.body.clientId,
        } , {
            where : {
                id: req.body.exhibitId
            }



            
        }).then(function(data){
            res.json(data);
        });

    });



// Routes end =======================
};