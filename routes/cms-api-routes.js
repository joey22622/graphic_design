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
    let authReady = true;
    let clientTrusted = false;
    let keyDB = [];

    function validateKey(key){
        for(let i = 0; i < keyDB.length; i++){
            if(key === keyDB[i]){
                console.log("found it");
                return true;
            }
        }
    }

    function loadKeys(){
        keyDB = [];
            db.Keys.findAll({}).then(data => {
                console.log(data);
                for(let i = 0; i < data.length; i++){
                    const key = data[i].dataValues.key;
                    keyDB.push(key);
                }
                console.log(keyDB);
            });
    }

    app.post("/api/key", function(req, res){
        const key = req.body.key;
        console.log("req.body.key:")
        console.log("key: " + key);
        if(key.length === 25){
        db.Keys.count({
            where : {
                key : key
            }
        }).then(function(data){
            if(data > 0){
            clientTrusted = true;
            res.json(true);
            loadKeys();
            console.log("key exists");
            
            } else {
                console.log("key invalid");
                res.json(false);
            }


            
        }).catch(function(err){
            if(err) throw err;
        });
        } else{
            res.json("key too short, false");
        }
    });
    
    app.delete("/api/logout/:id", function(req, res){
        db.Keys.destroy({
            where : {
                key : req.params.id
            }
        }).then(function(data){
            loadKeys();
            res.json(data);
        });

    });

    function makeid() {
        
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 25; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
        
      }
      
      console.log(makeid());

    app.post("/api/auth", function(req, res){
        let auth = {
            key : false,
            delay : false
        };
        // checks if timeout not in progress
        if(authReady){        
            console.log("timeout not in progress")
            const user = "joey2262";
            const password = "1234";
            // checks if informatiion is valid, generates key, stores, returns to client
            if(user === req.body.user && password === req.body.password){
                // console.log(user + " = " + req.body.user);
                // console.log(password + " = " + req.body.password);
                // auth = true;
                const key = makeid();
                console.log("auth valid");
                console.log(key);
                auth.key = key;
                auth.message = "auth valid";
                db.Keys.create({
                    key : key
                    
                }).then(function(data){
                    loadKeys();
                    res.json(auth);
                });
            
            // if information is invalid, delays login for 5 seconds
            } else {
                console.log("auth invalid");
                auth.delay = true;
                authReady = false;
                auth.message = "auth invalid";
                setTimeout(function(){
                    authReady = true;
                    auth.delay = false;
                }, 5000);
                res.json(auth);
            }
        } else {
            console.log("timeout in progress, please wait");
            auth.message = "timeout in progress, please wait";
            res.json(auth);

        }
    });

    app.get("/api/clients", function(req, res){
        // if(!validateKey(req.params.key)){
        //     console.log(req.params.key);
        //     console.log("client not trusted");
        //     res.json("access denied");
        // } else {
            db.Client.findAll({
                order : [["order" , "ASC"]]
                // order : [db.sequelize.fn('MAX', db.sequelize.col('order'))],
            }).then(function(data) {
                res.json(data);
            });
        // }
      });

    app.post("/api/clients/:key", function(req, res){
        console.log(res)
        if(!validateKey(req.params.key)){
            console.log("client not trusted");
            res.json("access denied");
        } else {
            db.Client.create({
                name : req.body.name,
                blurb : req.body.blurb,
                logo : req.body.logo,
                link : req.body.link,
                linkText : req.body.linkText,
                description: req.body.description,
                order : req.body.order
            }).then(function(data){
                res.json(data);
            });
        }
    });

    app.put("/api/clients/reorder/:key", function(req, res){
        if(!validateKey(req.params.key)){
            console.log("client not trusted");
            res.json("access denied");
        } else {
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
        }
    });

    app.put("/api/clients/update/:key", function(req,res){
        if(!validateKey(req.params.key)){
            console.log("client not trusted");
            res.json("access denied");
        } else {
            db.Client.update({           
                    name : req.body.name,
                    blurb : req.body.blurb,
                    link : req.body.link,
                    linkText : req.body.linkText,
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
        }
    });

    app.get("/api/clients/:id/:key", function(req, res){
        if(!validateKey(req.params.key)){
            console.log("client not trusted");
            res.json("access denied");
        } else {
            db.Client.findOne({
                where : {
                    id : req.params.id
                }
            }).then(function(data){
                res.json(data);
                
            }).catch(function(err){
                if(err) throw err;
            });
        }
    });

    app.get("/api/clients/init/new/:key" , function(req,res){
        if(!validateKey(req.params.key)){
            console.log("client not trusted");
            res.json("access denied");
        } else {
            db.Client.findAll({
                    order: [ [ 'createdAt', 'DESC' ]]
                
            }).then(function(data){
                res.json(data);
            });
        }
    });

    app.delete("/api/clients/delete/:id/:key" , function(req,res){
        if(!validateKey(req.params.key)){
            console.log("client not trusted");
            res.json("access denied");
        } else {
            db.Client.destroy({
                where : {
                    id : req.params.id
                }
            }).then(function(data){
                res.json(data);
            });
        }
    });
//============ EXHIBITS TABLE ================

// NEW EXHIBIT FOR UNDEFINED CLIENT
    app.post("/api/exhibits/init/:key", function(req, res){
        if(!validateKey(req.params.key)){
            console.log("client not trusted");
            res.json("access denied");
        } else {
            console.log("received");
            db.Exhibit.create({
                order : req.body.order


            }).then(function(data){
                res.json(data);
            });
        }
    });
    app.get("/api/exhibits/init/:key", function(req, res){
        if(!validateKey(req.params.key)){
            console.log("client not trusted");
            res.json("access denied");
        } else {
            db.Exhibit.findOne({

                    order: [ [ 'createdAt', 'DESC' ]]

            }).then(function(data){
                res.json(data);
            });
        }
    });


    app.get("/api/exhibits/:id", function(req, res){
        // if(!validateKey(req.params.key)){
        //     console.log("client not trusted");
        //     res.json("access denied");
        // } else {
            db.Exhibit.findAll({
                
                order : [["order" , "ASC"]],
                where : {
                    ClientId : req.params.id
                }

            }).then(function(data){
                res.json(data);
                console.log(req.params.id)
            });
        // }
    });
    
    app.delete("/api/exhibits/delete/:id/:key", function(req, res){
        if(!validateKey(req.params.key)){
            console.log("client not trusted");
            res.json("access denied");
        } else {
            db.Exhibit.destroy({
                where : {
                    id : req.params.id
                }
            });
        }
    });

    app.delete("/api/exhibits/homeless/:key", function(req, res){
        if(!validateKey(req.params.key)){
            console.log("client not trusted");
            res.json("access denied");
        } else {
            db.Exhibit.destroy({
                where : {
                    ClientId : null
                }
            }).then(function(data){
                res.json(data);
            });
        }
    });

    app.post("/api/exhibits/submit/:key", function(){

    });

    app.post("/api/exhibits/new/:key", function(req, res){
        if(!validateKey(req.params.key)){
            console.log("client not trusted");
            res.json("access denied");
        } else {
            db.Exhibit.create({
                order : req.body.order
            });
        }
    });

    app.put("/api/exhibits/submit/:key", function(req, res){
        if(!validateKey(req.params.key)){
            console.log("client not trusted");
            res.json("access denied");
        } else {
            db.Exhibit.update({
                order : req.body.order,
                imagePath : req.body.imagePath,
                imageLink : req.body.imageLink,
                imageTitle : req.body.imageTitle,
                imageDescription : req.body.imageDescription,
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
        }
    });



// Routes end =======================
};


