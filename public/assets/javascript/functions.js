// function stretchText(){
//     var element = $(this);
//     var content = element.html()
//     var containerWidth = element.width();
//     var charCount = element.text().length;
//     var span = $('<span class="stretch">' + content + '</span>');

//     element.html(span);
//     console.log(element);
// }
var contentHeight = $(".cover-text").height();
var hide;
var hideReady = true;
var consultScroll = false;
var landingReady = true;
//checks if scrolling has occured since last button click
var scrollTrack = 0;

function toggleLanding(){
    if(landingReady){
        if($(this).scrollTop() > 40){
            $("header").addClass("scrolled");
            $("nav ul").css("min-height" , contentHeight);
        //APPLY DISPLAY NONE TO ELEMENTS THAT HAVE FADED OUT
            if(hideReady){
                hide = setTimeout(function(){
                    scrollTimeout()
                },500);
                hideReady = false;
            }
        } else if ($(this).scrollTop() < 10) {
                clearTimeout(hide);
                $(".hide").removeClass("hide");
                $("h1").fadeIn(1000);
                $(".scrolled").removeClass("scrolled");
                $("nav ul, .cover-text").removeAttr("style");
                $(".scrolled-delay").removeClass("scrolled-delay");

                hideReady = true;
                
        }
    }

}

// function toggleUp(){
//     $(".cover-text").addClass("stack-top");
//     $("nav ul").removeAttr("style");

// }

// function toggleDown(){
//     $(".stack-top").removeClass("stack-top");
//     toggleLanding();
// }

function scrollTimeout(){
    $("h1").addClass("hide");
    $(".cover-text").addClass("scrolled-delay");
    $(".cover-text").css("justify-content" , "flex-start");
}

function tabScroll(){
    var num1 = $(".consult").offset().top;
    var num2 = $(window).scrollTop();
    var num3 = $(window).height();
    var diff = num1-num2-num3;
    var navHeight = diff+contentHeight;
    if(diff < 0 && navHeight > 50){
        clearTimeout(hide);
        scrollTimeout();
        $("nav ul").css("min-height", navHeight);
        $("#item-1").removeClass("minimize");

        console.log(diff + " diff");
    } else if (diff < 0){
        $("nav ul").css("min-height", 0);
        $("#item-1").addClass("minimize");
        console.log(navHeight + " navHeight");
        console.log(diff + " diff");


    }
}

function scrollDown(){

    var i = $(this).parent().attr("data-section");
    var destination = $("section[data-section="+i+"]");
    var scrollLength = destination.offset().top - $(this).parent().height()*i*.6 - $(".header-wrap").height();
    var firstCategory = $("section[data-section='1'").offset().top;
    var windowPosition = $(window).scrollTop();
    console.log("first cat " + firstCategory);
    console.log("window pos" + windowPosition);
    if(windowPosition >= firstCategory){
    landingReady = false;
    console.log("it should work");
    }

    $("html, body").animate({scrollTop: scrollLength}, 500, function(){
        landingReady = true;
    });
    // console.log("window " + $(window.scrollTop))
    

}

$(".nav-list-item a").on("click" , scrollDown);
$(window).on("scroll", toggleLanding);
$(window).on("scroll", function(){
    
    tabScroll();
    // if($(this).scrollTop() > 400){
    //     toggleUp();
    // } else if ($(this).scrollTop() < 400){
    //     toggleDown();
    // }
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