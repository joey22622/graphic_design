
var clientCount = 0;
var exhibitCount = 0; 
var editActive;
var newPost = true;
var editing = false;
var clientTrusted = false;
//restricts use of createNewExhibit function until AJAX request is complete
var exhibitReady = true;
// var cmsPage = $("body").html();
// console.log(cmsPage);
// $("body").empty();
// $("body").append(cmsPage);
let key = localStorage.getItem('key');
// checks local storage for existing key
function initAuth(){
    if(key){
        // checks the db for matching key
        const req = {key};
        $.post("/api/key", req, function(data){
            console.log(data);
            if(data){
                clientTrusted = true;
                loadResources();
            }
        });
        // deletes login screen if matches
    }
    console.log(key);
}

function loadResources(){
    if(clientTrusted){
        renderClientList();
        $("body").removeClass("locked");
        $('.user-auth-wrap').remove();
    }
}

initAuth();


//Authenticates User
function clientLogout(){
    localStorage.clear();
    $.ajax({
        url : "api/logout/" + key,
        method : "DELETE"

    }).done(function(){
        location.reload();
    }); 
}
$(".logout").on("click", clientLogout);
function userAuth(e){
    e.preventDefault();
    var authInfo = {
        user : $(".user").val(),
        password : $(".password").val()
    }

    $.post("/api/auth", authInfo, function(data){
        console.log(authInfo);
        console.log(data);
        if(data.key){
            console.log("key valid");
            localStorage.setItem('key' , data.key);
            key = data.key;
            clientTrusted = true;
            console.log("halsdkfjasd");
            loadResources();

            
        }
    });
    
}
$(".user-auth button").on("click", function(event){
    userAuth(event);
});

//============= CLIENT LIST FUNCTIONS ===================

//Builds list of Clients that appears at the top of the screen
function renderClientList(){
    var clientList = $(".client-list ol");
    clientList.empty();
    $.get("/api/clients", function(data){
        console.log(data);
            for(var i = 0; i < data.length; i++){
                // console.log(data[i]);
            clientList.append(createClientRow(data[i]));
            }
            clientCount = data.length;
            // var clientNew = $("<li class='client'>");
            // clientNew.attr({"class" : "add-client"});
            // var anchor = $("<a href='#'>");
            // clientNew.append(anchor);
            // anchor.text("Add new client");
            // clientList.append(clientNew);

            if(clientCount > 0){
                var addClient = $("<button type='submit' class='client-new'>").text("New Client");
                $(".client-button-row").empty();
                $(".client-button-row").append(addClient);
            }
    });
    
}

function createClientRow(client) {
    var listOption = $("<li class='ui-state-default client'>");
    var anchor = $("<a href='#'>");
    listOption.attr("value", client.order);
    listOption.attr("data-id", client.id);
    anchor.attr("data-id", client.id);
    listOption.append(anchor);
    anchor.append($("<span>").text(eval(listOption.val()+1)+". "));
    anchor.append($("<span>").text(client.name));
    return listOption;
  }

var activeClient = {};



//=================== JQUERY UI 'SORTABLE' FUNCTIONS =================
//enables client list sorting
$(function() {
    $( "#sortable" ).sortable({
        //STOP method reorganizes order values and then reloads list
        stop: function(){
            //variable that increments inside .done portion of AJAX call to determine when all data has been received
            var completeTracker = 0;
            for(var i = 0; i < clientCount; i++){
                var orderValues = {
                    newVal : i,
                    id : $(".client-list li:nth-child("+eval(i+1)+")").attr("data-id"),
                };
                $.ajax({
                    url : "api/clients/reorder/" + key,
                    method : "PUT",
                    data : orderValues
                }).done(function(){
                    completeTracker++;
                    if(completeTracker === clientCount){
                        renderClientList();
                    }
                });
            }
        }
    });
    $( "#sortable" ).disableSelection();
  });
  
  $(function() {
    $( "#sortable-2" ).sortable({
        //STOP method reorganizes order values and then reloads list
        stop: function(){
            updateExhibitOrder();

        }
    });
    $( "#sortable-2" ).disableSelection();
  });


//=========== GENERAL FORM RENDERRING ==================

function renderForm(){
    if(editing === true){
        var  conf = confirm("You have unsaved changes! press OK to continue anyway, Cancel to go back");
        if(conf === false){
            return;
        }
    }

    var id = $(this).attr("data-id");
    if(id){
        var queryURL = "/api/clients/" + id + "/" + key;
        $(".client-submit").attr("data-id" , id);

        $.get(queryURL, function(data){
            if(data){
                console.log(data);
                var formHeader = $(".form-header").text("Now editing : " + data.name);

                $(".client-name").val(data.name);
                $(".client-blurb").val(data.blurb);
                $(".client-logo").val(data.logo);
                $(".client-description").val(data.description);
                $(".client-link").val(data.link);
                $(".client-link-text").val(data.linkText);
                $(".client-submit").text("Update " + data.name);
                $(".client-delete").remove();
                var clientDelete = $("<button class='client-delete' data-id='"+id+"'>").text("Delete " + data.name);
                $(".form-button-row").append(clientDelete);
            } 
        }).then(function(){ 
            newPost = false;
        });
        renderExhibits(id);
        console.log(id);
    } else {
        $('.form-header').text("'Fill' and 'submit' to add new client");
        $(".client-submit").text("Add New Client");
        submitReset();
    }
} 


//========== EXHIBIT RENDERING/CREATION FUNCTIONS ============

//Builds the list of exhibits that appears beneath the main form
//parameter targets CLIENT ID

function createNewExhibit(){
    event.preventDefault();
    editing = false;
    var exhibit = {
        order : exhibitCount,
        id : 0
    };
    // if(newPost){
        exhibitReady = false;
        $.post("/api/exhibits/init/" + key, exhibit, function(){
            console.log("It's going... hopefully");
        }).done(function(){
            $.get("/api/exhibits/init/" + key, function(data){
                console.log("It worked?");
                exhibit.id = data.id
                exhibit.clientId = data.ClientId
                exhibit.order = exhibitCount;
            }).then(function(){
            
            $(".exhibit-list ol").append(createExhibitRow(exhibit));
            console.log(exhibit);
            exhibitCount++;
            exhibitReady = true;
            });

        });
    // } else {
    //     $(".exhibit-list ol").append(createExhibitRow(exhibit));
    //     console.log(exhibit);
    //     exhibitCount++;
    //     exhibitReady = true;
    // }
    // console.log("create new exhibit");
}

function renderExhibits(id){
    var exhibits = $(".exhibit-list ol");
    exhibits.empty();
    var exhibitQuery = "/api/exhibits/"+ id; 
    console.log("renderexhibit");
    $.get(exhibitQuery, function(data){
        console.log(data);
        for(var i = 0; i<data.length; i++){
            exhibits.append(createExhibitRow(data[i]));
        }
        exhibitCount = data.length;
    });
}

function createExhibitRow(exhibit){
    console.log(exhibit["order"]);
      var exhibitItem = $("<li class='ui-state-default exhibit' data-foreign-key='"+exhibit.clientId+"' data-exhibit-order='"+exhibit.order+"' data-exhibit-id='"+exhibit["id"]+"'>");
      var rowWrap = $("<div class='row-wrap'>")
      var row1 = $("<div class='row-1'>");
      var row2 = $("<div class='row-2'>");

      var num = $("<span class='exhibit-count'>").text(eval(exhibit.order+1)+".");
      var imgPath = $("<input class='image-path' placeholder='image path/SVG code' data-exhibit-order='"+exhibit.order+"' data-exhibit-id='"+exhibit.id +"'>").val(exhibit.imagePath);
      var caption = $("<input class='image-caption' placeholder='image caption' data-exhibit-order='"+exhibit.order+"' data-exhibit-id='"+exhibit.id +"'>").val(exhibit.caption);
      var link = $("<input class='image-link' placeholder='image link' data-exhibit-order='"+exhibit.order+"' data-exhibit-id='"+exhibit.id +"'>").val(exhibit.imageLink);
      var radioWrap = $("<div class='exhibit-radio'>");
      var imgSpan = $('<span>').text("SRC");
      var svgSpan = $('<span>').text("SVG");
      var imgURL = $("<input type='radio' data-exhibit-order='"+exhibit.order+"' name='radio"+exhibit.id + "' value='image-url' checked>");
      var svg = $("<input type='radio' data-exhibit-order='"+exhibit.order+"' name='radio"+exhibit.id + "' value='svg'>");
      var description = $("<input class='image-description' placeholder='image description (optional)' data-exhibit-order='"+exhibit.order+"' data-exhibit-id='"+exhibit.id +"'>").val(exhibit.imageDescription);
      var title = $("<input class='image-title' placeholder='image title (optional)' data-exhibit-order='"+exhibit.order+"' data-exhibit-id='"+exhibit.id +"'>").val(exhibit.imageTitle);

      var exhibitDelete = $("<button class='exhibit-delete' type='submit' data-exhibit-order='"+exhibit.order+"' data-exhibit-id='"+exhibit.id+"'>").text("X");
      radioWrap.append([imgSpan, imgURL, svgSpan, svg]);
      row1.append([link, imgPath, caption, radioWrap]);
      row2.append([title, description]);
      var rowWrap = $("<div class='row-wrap'>").append([row1,row2]);
      exhibitItem.append([num,rowWrap,exhibitDelete]);
      return exhibitItem;
}


function submitForm(){
    event.preventDefault();
    console.log("a;lsdkfja;lsdkfj;aslgj");
    console.log(newPost);
    var id;
    var client = {
        name : $(".client-name").val().trim(),
        blurb : $(".client-blurb").val().trim(),
        link : $(".client-link").val().trim(),
        linkText : $(".client-link-text").val().trim(),
        logo :  $(".client-logo").val().trim(),
        description :  $(".client-description").val().trim(),
        order : clientCount  
    };
      if(!newPost){
        console.log("this is not a new post");
        client.id = $(this).attr("data-id");
        $.ajax({
            url : "/api/clients/update/" + key,
            method : "PUT",
            data : client
        }).done(function(){
            console.log("post update");
            console.log(client.id);
            sendExhibits(client.id);
        }).fail(function (msg) {
            console.log('FAIL');
        });
      } else {
        $.post("/api/clients/" + key, client, function(){
            console.log(client);
        }).done(function(){
            //gets the ClientId of the most recently created post in Clients table
            $.get("/api/clients/init/new/" + key, function(data){
              console.log("hi there");
              console.log(data);
              id = data[0].id;
              console.log("id : " + id);
            }).then(function(){
                console.log(id);
                sendExhibits(id);
            });
             
        });



      }
      editing = false;
  }

  function sendExhibits(id){
      console.log("sending" + id);
      console.log("exhibit count " + exhibitCount);
        for(var i = 0; i < exhibitCount; i++){
            var dataAttr = "[data-exhibit-order='"+i+"']";
            var exId = $("li" + dataAttr).attr("data-exhibit-id");
            var dataId = "[data-exhibit-id='"+exId+"']";
            var exhibit = {
                imageLink : $(".image-link" + dataId).val(),
                imageDescription : $(".image-description" + dataId).val(),
                imageTitle : $(".image-title" + dataId).val(),
                imagePath : $(".image-path" + dataId).val(),
                caption : $(".image-caption" + dataId).val(),
                imageType : $("input[name='radio"+exId+"']:checked").val(),

                order : i,
                exhibitId : exId,
                clientId : id
            };

            
            $.ajax({
                url : "api/exhibits/submit/" + key, 
                method : "PUT",
                data : exhibit
            }).then(function(){
                console.log("It worked!");
            });
            console.log(exhibit);


        }
        submitReset();


  }

//Deletes all rows that don't have a value for ClientId
  function deleteHomeless(){
    console.log("Homeless exhibits removed");

    var exhibitQuery = "/api/exhibits/homeless/" + key;
    $.ajax({
        url : exhibitQuery,
        method : "DELETE"

    }).done(function(){

    });
  }




$("form :input").change(function() {
    $("form").data("changed",true);
    editing = true;
 });
 

function submitReset(){
    $(".client-form textarea").val("");
    $(".client-form input").val("");
    $(".client-submit").removeAttr("data-id");
    $(".client-delete").remove();
    $(".exhibit-list ol").empty();
    $(".client-submit").text("Add new client");
    $(".form-header").text("'Fill' and 'submit' to add new client")
    console.log("reseting....");
    exhibitCount = 0;
    newPost = true;
    renderClientList();

    // GOAL IS TO RUN SUBMITRESET INSTEAD OF RENDERFORM, THE BELOW CODE CRASHES THE SITE THOUGH...
    // deleteHomeless();
    // renderClientList();
    // renderForm()

}

//   function update


function updateExhibitOrder(){
    for(var i = 0; i < exhibitCount; i++){
            console.log("updating order...")
            $(".exhibit-list #sortable-2 li:nth-child("+eval(i+1)+"), .exhibit-list #sortable-2 li:nth-child("+eval(i+1)+") input, .exhibit-list #sortable-2 li:nth-child("+eval(i+1)+") .exhibit-delete").attr("data-exhibit-order", i);
            $(".exhibit-list #sortable-2 li:nth-child("+eval(i+1)+") .exhibit-count").text(eval(i+1) + ".");
        }
        console.log("updating order...")

}

//================= ITEM DELETE FUNCTIONS =========================

//  function that deletes row and reorders other rows
function deleteExhibit(){
    event.preventDefault();
    var orderId = $(this).attr("data-exhibit-order");
    var dataId = $(this).attr("data-exhibit-id");
    console.log("data id " + dataId);
    var queryURL = "/api/exhibits/delete/" + dataId + "/" + key;
    $("li[data-exhibit-order='"+orderId+"']").remove();
    $.ajax({
        url: queryURL,
        method: "DELETE"
        
    }).done(function(){

    });

    console.log(orderId);
    exhibitCount--;
    updateExhibitOrder();   
}

function deleteClient(){
    event.preventDefault();
    dataId = $(this).attr("data-id");
    console.log(dataId);
    queryURL = "/api/clients/delete/" + dataId + "/" + key;
    $.ajax({
        url: queryURL,
        method: "DELETE"
        
    }).done(function(){
        submitReset();

    });



 }

//================CALL BACK EVENTS ====================

$(document).ready(deleteHomeless);
// $(document).on("click", ".client-delete", deleteClient);
$(document).on("click", ".exhibit-delete", deleteExhibit);
$(document).on("click", ".client-delete", deleteClient);
$(document).on("click", ".client-submit", submitForm);
$(document).on("click", ".client-list li", renderForm);
$(document).on("click", ".client-new", renderForm);
$(document).on("click", ".exhibit-new", function(){
    if(exhibitReady){
        createNewExhibit();
    }
});
// renderClientList();


/*
WHEN CLICKING A LIST ITEM (IF EDITS IN PROGRESS === FALSE){
    GET REQUEST CLIENT ROW> FIND ONE WHERE id = req.body.id (data-id)
        render values in form
    GET REQUEST EXHIBITS > FIND ALL WHERE foreignKey = req.body.id (data-id) ORGANIZE BY ORDER
        IF data.length > 0
            renders values in form

    


}
  CREATES A GET REQUEST FOR CLIENT TABLE INFO
  


CREATES A GET REQUEST THAT PASSES THE FOLLOWING VALUES INTO LINES OF THE 'EXHIBITS' OL
    DATA-EXHIBIT-ID data.id
    DATA-EXHIBIT-ORDER data.order
    INPUT VALUE data.caption
    INPUT VALUE data.imagePath
    RADIO INPUT VALUE data.imageType
    DELETE BUTTON
    
    

    ONCE ALL LINES HAVE BEEN PRINTED
        A FINAL BUTTON IS PRINTED THAT WILL RUN 'RENDER NEW LINE FUNCTION' WHEN CLICKED

    NEW LINE FUNCTION
        POST REQUEST THAT CREATES A NEW ROW IN EXHIBITS THAT ONLY PASSES:
            DATA-EXHIBIT-ORDER data.order
        .THEN OF POST REQUEST WILL THEN MAKE A GET CALL AND RENDER:
            DATA-EXHIBIT-ID data.id
            DATA-EXHIBIT-ORDER data.order

    

    
        






*/