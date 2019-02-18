var contentHeight = $(".cover-text").height() + 2;
// determines the height of the expanded exhibit
var exhibitHeight = 0;

//timeout variables
var hide;
var reveal;
var scrollLag;
var scrollInterval;
let portrait;
let landscape;

var hideReady = true;
var consultScroll = false;
var landingReady = true;
var shimmer = $(".shimmer").html();
//checks if scrolling has occured since last button click
var scrollTrack = 0;
var shimmering = true;
// boolean follows state of expanded/collapsed state of cover
var scrolled;
// console.log(scrolled);
window.addEventListener("resize", function(){
    contentHeight = $(".cover-text").height();
    // console.log("resizing");
    // console.log(contentHeight);
    
});
function screenOrientation(){
    if(window.innerHeight > window.innerWidth){
        console.log("portrait");
        portrait = true;
        landscape = false;
        
    } else if( window.innerHeight < window.innerWidth){
        console.log("landscape");
        landscape = true;
        portrait = false;
    }
}

window.addEventListener("rotate", function(){
    screenOrientation();
});
window.addEventListener("resize", function(){
    screenOrientation();
});

screenOrientation();

function toggleLanding(){
    var h1Top;
    if($(this).scrollTop() > 40){
        if(!scrolled){
            clearTimeout(hide);
            clearTimeout(reveal);
            $(".cover-text").addClass("scrolled");
            $(".content").addClass("scrolled");
            $("header").addClass("scrolled");
            $("h1").css("top" , h1Top);

            $("nav ul").css("min-height" , contentHeight);
            $('.shimmer').removeClass("shimmer-active")
            // $(".shimmer").empty();
            shimmering = false;
        //APPLY DISPLAY NONE TO ELEMENTS THAT HAVE FADED OUT
            hide = setTimeout(function(){
                scrollTimeout()
            },500);
            scrolled = true;
        }
    } else if ($(this).scrollTop() < 10) {
        if(scrolled){
            clearTimeout(hide);
            clearTimeout(reveal);
            h1Top = $("h1").scrollTop() - $(".header-wrap").height();
            $(".hide").removeClass("hide");
            $(".scrolled").removeClass("scrolled");
            $("nav ul, .cover-text").removeAttr("style");
            $(".scrolled-delay").removeClass("scrolled-delay");
            reveal = setTimeout(function(){
                if(!shimmering){
                    $(".shimmer").addClass("shimmer-active");
                }
            },200);

            scrolled = false;
        }
            
    }
}
function scrollTimeout(){
    $("h1").addClass("hide");
    $(".cover-text").addClass("scrolled-delay");
}

function scrollDown(event){
    var i = $(this).parent().attr("data-section");
    var destination = parseFloat($("section[data-section="+i+"]").offset().top - $(".header-wrap").height());
    // console.log(destination);
    if(Math.abs($(window).scrollTop() - destination) > 1){
        $("html, body").animate({scrollTop: destination}, 500);
    } else {
        event.preventDefault();
    }
}

function createClientRow(client){
    
    const clientName = $("<h3>").addClass("client-name").text(client.name);
    const clientDetail = $("<p>").addClass("client-detail").text(client.blurb);
    const clientLogoBackdrop = $("<div>").addClass("client-logo-backdrop");
    const xlMargin = $("<div class='x-margin x-left'>");
    const xrMargin = $("<div class='x-margin x-right'>");
    const clientLogoWrap = $("<div>").addClass("client-logo-wrap").append(clientLogoBackdrop, client.logo);
    const cutoutWrap = $("<div class='icon-cutout-wrap'>").append([xlMargin, clientLogoWrap, xrMargin]);
    const clientTextWrap = $("<div>").addClass("client-text-wrap").append(clientName, clientDetail);
    const clientThumbnail = $("<div>").addClass("client-thumbnail").append(cutoutWrap, clientTextWrap);
    const thumbnailWrap = $("<div>").addClass("client-thumbnail-wrap").append(clientThumbnail);
    const clientExhibits = $("<ul>").addClass("client-exhibits");
    const clientDescription = $("<div>").addClass("client-description");
    const description = client.description.split("\n");
    for(let i = 0; i < description.length; i++){
        if(description[i].length > 0){
            const graph = $("<p>").text(description[i]);
            clientDescription.append(graph);
        }
    }
    const clientLink = $("<a target='_blank'>").addClass("client-link").attr("href", client.link).text(client.linkText);
    const clientDescriptionWrap = $("<div>").addClass("client-description-wrap").append([clientDescription,clientLink]);
    const clientExhibitWrap = $("<div>").addClass("client-exhibit-wrap").append(clientDescriptionWrap, clientExhibits);

    return $("<li>").attr({"data-id" : client.id ,"data-order" : client.order , "data-active" : "false", "id" : "client-" + client.id}).addClass("client-wrap").append(thumbnailWrap, clientExhibitWrap);

}
function renderImageType(exhibit){
    if(exhibit.imageType === "image-url"){
        return $("<img>").attr({"src" : exhibit.imagePath, "alt" : exhibit.caption});
    } else {
        return imagePath;
    }
}
function getActiveInfo(){
    const activeOrder = $(".active").attr("data-order");
    const activeHeight = $(".active").height() -  $(".active .client-thumbnail-wrap").height();
    if(!activeHeight){
       return 0;
    } else {
        return {activeHeight, activeOrder};
    }
}
function handleExhibitCollapse(height, orderPrev, orderNew){


}

function createExhibitRow(exhibit){
    let link = $("<div class='exhibit-outer-wrap'>");
    if(exhibit.imageLink.length > 0){
        link = $("<a class='exhibit-outer-wrap' target='_blank'>").attr("href", exhibit.imageLink);
    }
    const exhibitDetail = $("<p class='exhibit-detail'>").html(exhibit.imageDescription);

    // const exhibitCaption = $("<p>").addClass("exhibit-caption").text(exhibit.caption);
    const exhibitTitle = $("<h4 class='exhibit-title'>").text(exhibit.imageTitle);
    const exhibitImage = $("<div>").addClass("exhibit-image-wrap").append([exhibitTitle, renderImageType(exhibit), exhibitDetail]);
    link.append(exhibitImage);
    const exhibitRow = $("<li>").addClass("exhibit-row").attr({"data-exhibit-id" : exhibit.id, "data-client-id" : exhibit.clientId, "id" : exhibit.ClientId + "-" + exhibit.id}).append(link);
    $("[data-id='" + exhibit.ClientId +"'] .client-exhibits").append(exhibitRow);
}


function renderClientThumbnails(){
    var clientList = $(".client-list");
    $.get("/api/clients", function(data){
        // console.log(data);
            for(var i = 0; i < data.length; i++){
                // console.log(data[i]);
            // console.log(createClientRow(data[i]))
            clientList.append(createClientRow(data[i]));
            }
    });
}


function renderExhibits(id){
    const activeInfo = getActiveInfo();
    // console.log(activeInfo);
    const wrapper = $("[data-id='"+ id +"']");
    const order = wrapper.attr("data-order");
    if(order > activeInfo.activeOrder){
        var scrollIndex = $(window).scrollTop();
        $(window).scrollTop(scrollIndex - activeInfo.activeHeight);
    }
    // console.log("order : " +order)
    if(wrapper.hasClass("active")){
        $(".client-exhibits").empty();
        $(".client-wrap.active").removeClass("active");
        $(".thumb-active").removeClass("thumb-active");
        return;
    }
    $(".client-wrap.active").removeClass("active");
    $(".thumb-active").removeClass("thumb-active");
    wrapper.addClass("active");
    $(".client-exhibits").empty();
    $(".client-wrap").attr("data-active" , "false");
    $(".client-exhibits").empty();
    var exhibits = $(".exhibit-list ol");
    exhibits.empty();
    var exhibitQuery = "/api/exhibits/"+ id; 
    $.get(exhibitQuery, function(data){
        for(var i = 0; i<data.length; i++){
            exhibits.append(createExhibitRow(data[i]));
        }
        exhibitCount = data.length;
    });
}



function tabScroll(timeout){
    var num1 = $(".consult").offset().top;
    var num2 = $(window).scrollTop();
    var num3 = $(window).height();
    var diff = num1-num2-num3;
    var navHeight = diff+contentHeight;
    if(!scrolled){
        $("nav ul").css("min-height", 0);
        $(".minimize").removeClass("minimize");
    } else if(diff < 0 && navHeight > 50){
        scrollTimeout();
        if(timeout){
          scrollLag =  setTimeout(function(){
                tabScroll(false);
            }, 10);
        }
        // console.log("hi");

        $("nav ul").css("min-height", navHeight);
        $("#item-1").removeClass("minimize");


    } else if (diff < 0){
        $("nav ul").css("min-height", 0);
        $("#item-1").addClass("minimize");
        
        // console.log(navHeight + " navHeight");
        // console.log(diff + " diff");
    } else {
        $("nav ul").css("min-height", contentHeight);

    }
}


$(document).ready(renderClientThumbnails);
$(".nav-list-item a").on("click" , scrollDown);
$(document).on("click", ".client-wrap .client-thumbnail", function(){
    const id = $(this).parent().parent().attr("data-id");
    // const active
    renderExhibits(id);
    toggleLanding();
    // tabScroll();
    scrollInterval = setInterval(function(){
        tabScroll();
    }, 30);
    setTimeout(function(){
        clearInterval(scrollInterval);
    }, 300);


});

$(window).on("scroll", function(){
    toggleLanding();
    tabScroll();
});


//=============== AJAX CALLS =====================

function blankClient(){
    var banner = $("<li class='client-banner'>");
    var thumbnail = $("<div class='client-thumbnail-wrap'>");
    var introWrap = $("<div class='client-intro-wrap'>");
    var name = $("<h2 class='client-name'>");
    var blurb = $("<p class='client-blurb'>");
    introWrap.append([name, blurb]);
    banner.append([thumbnail, introWrap]);

    return banner;
}

function blankExhibit(){

}
function blankExhibitWrap(){
    
}
tabScroll();
setTimeout(function(){
    tabScroll();
}, 300);


$(".header-logo-wrap").on("click", function(){
    $("html, body").animate({scrollTop: 0}, 300);
    
});
$(document).on("mouseover", ".client-thumbnail", function(){
    $(this).parent().css("background" , "white");
});
$(document).on("mouseleave", ".client-thumbnail", function(){
    $(this).parent().removeAttr("style");
    if($(this).parent().parent().hasClass("active")){
        $(this).parent().addClass("thumb-active");
    }
});

// $.get("/api/clients/front", function(data){

// });

