
var clientCount = 0;
var exhibitCount = 0; 
var newPost = true;


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
            var clientNew = $("<li class='client'>");
            clientNew.attr({"data-id" : "new" , "class" : "add-client"});
            var anchor = $("<a href='#'>");
            clientNew.append(anchor);
            anchor.text("Add new client");
            clientList.append(clientNew);
    });
    
}
//Builds the list of exhibits that appears beneath the main form
function renderExhibits(){
    var exhibits = $(".exhibits");
    exhibits.empty();

    $get("/api/exhibits", function(data){
        for(var i; i<data.length; i++){
            exhibits.append(createExhibitRow(data[i]));
        }
        var newExhibit = $("<button type=submit class='exhibit-new'>")
    });
}


//enables client list sorting
$(function() {
    $( "#sortable" ).sortable({
        //STOP method reorganizes order values and then reloads list
        stop: function(){
            for(var i = 0; i < clientCount; i++){
                var orderValues = {
                    newVal : i,
                    id : $(".client-list li:nth-child("+eval(i+1)+")").attr("data-id"),
                };
                $.ajax({
                    url : "api/clients/reorder",
                    method : "PUT",
                    data : orderValues
                }).then(function(){
                    console.log(i);
                });
            }
            renderClientList();

        }
    });
    $( "#sortable" ).disableSelection();
  });

function createNewExhibit(){
    var exhibit = {
        order : exhibitCount
    }
    $.post("/api/exhibits", exhibit, function(){

    }).then(function(){
        $.get("/api/exhibits/new", function(data){
            createExhibitRow(data);
        });
    });
    console.log("create new exhibit");
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
  function createExhibitRow(exhibit){
      var exhibitItem = $("<li class='ui-state-default exhibit'>");
      var input = $("<input placeholder='image path/SVG code' data-exhibit-id='"+exhibit.id +"'>").val(exhibit.id);
      var radioWrap = $("<div type='exhibit-radio'>");
      var imgURL = $("<input type= 'radio"+exhibit.id + "' value='image-url'>");
      var svg = $("<input type= 'radio"+exhibit.id + "' value='png'>");
      radioWrap.append([imgURL , svg]);
      exhibitItem.append([input, radioWrap]);
      return exhibitOption;
}

var activeClient = {};

function renderForm(){
    newPost = false;
    var id = $(this).attr("data-id");
    var queryURL = "/api/clients/" + id;
    $(".client-submit").attr("data-id" , id);

    $.get(queryURL, function(data){
        if(data){
            console.log(data);
            $(".client-name").val(data.name);
            $(".client-blurb").val(data.blurb);
            $(".client-logo").val(data.logo);
            $(".client-description").val(data.description);
            $(".client-submit").text("Update " + data.name);
            $(".client-delete").remove();
            var clientDelete = $("<button class='client-delete' type='submit' data-id='"+id+"'>").text("Delete " + data.name);
            $(".client-button-row").append(clientDelete);
        }
    });
    console.log(id);
}


function sendForm(){
    event.preventDefault();
    var client = {
        name : $(".client-name").val().trim(),
        blurb : $(".client-blurb").val().trim(),
        logo :  $(".client-logo").val().trim(),
        description :  $(".client-description").val().trim(),
        order : clientCount
        
    };
      if(!newPost){
        console.log("this is not a new post");
        client.id = $(this).attr("data-id");
        $.ajax({
            url : "/api/clients/update",
            method : "PUT",
            data : client
        }).done(submitReset).fail(function (msg) {
            console.log('FAIL');
        });
      } else {
        $.post("/api/clients", client, function(){
            console.log(client);
        }).then(submitReset);



      }
      
  }





  function submitReset(){
    $(".client-form textarea").val("");
    $(".client-form input").val("");
    $(".client-submit").removeAttr("data-id");
    $(".client-delete").remove();
    console.log("reseting....");

    newPost = true;
    renderClientList();
  }

//   function update


$("body").on("click", ".client-submit", sendForm);
$("body").on("click", ".client-list li", renderForm);
$("body").on("click", ".exhibit-new", createNewExhibit);
renderClientList();



/*
WHEN CLICKING A LIST ITEM
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