//LOADER
$(window).on("load", function () {
    "use strict";
    //$(".loader").fadeOut(1200);

});


// JavaScript Document
jQuery(function ($) {
    "use strict";

    $("#donateRow").sticky({topSpacing: 84, zIndex: 999});
    $("#not-live").sticky({topSpacing: 84, zIndex: 999});

    // +++++ open for Search section
    $(".toggler").on("click", function () {
        $(".property-query-area").slideToggle(300);
    });


    // +++++ Toggle for Form
    $(".advanced").on("click", function () {
        $(".opened").slideToggle();
        return false;
    });


    // +++++ open the testimonials modal
    var testimonial = $(".cd-testimonials-all");
    $('.cd-see-all').on("click", function () {
        testimonial.addClass('is-visible');
    });
    $('.cd-testimonials-all .close-btn').on("click", function () {
        testimonial.removeClass('is-visible');
    });
    $(document).keyup(function (event) {
        if (event.which == '27') {
            testimonial.removeClass('is-visible');
        }
    });


    // +++++Back to Top
    $("body").append('<a href="#" class="back-to"><i class="icon-arrow-up2"></i></a>');
    var amountScrolled = 700;
    var backBtn = $("a.back-to");
    $(window).on("scroll", function () {
        if ($(window).scrollTop() > amountScrolled) {
            backBtn.fadeIn("slow");
        } else {
            backBtn.fadeOut("slow");
        }
    });
    backBtn.on("click", function () {
        $("html, body").animate({
            scrollTop: 0
        }, 700);
        return false;
    });


    // +++++ Advance Search
    $(window).on("scroll", function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop >= 50) {
            $(".blue_navi").addClass("static");
        } else {
            $(".blue_navi").removeClass("static");
        }
        return false;
    });


    //Full Height Banner BG
    function resizebanner() {
        $(".fullscreen").css("height", $(window).height());
    }

    $(window).resize(function () {
        resizebanner();
    });
    resizebanner();


    // bottom home-header custom fixed
    var $window = $(window);
    var $mainMenuBar = $('.white_header');
    var $mainMenuBarAnchor = $('#mainMenuBarAnchor');
    if ($('#mainMenuBarAnchor').length) {
        // Run this on scroll events.
        $window.scroll(function () {
            var window_top = $window.scrollTop();
            var div_top = $mainMenuBarAnchor.offset().top;
            if (window_top > div_top) {
                // Make the div sticky.
                $mainMenuBar.addClass('static');
                $mainMenuBarAnchor.height($mainMenuBar.height());
            }
            else {
                // Unstick the div.
                $mainMenuBar.removeClass('static');
                $mainMenuBarAnchor.height(0);
            }
        });
    }


    //Form Container Full height
    getWidthAndHeight();
    $(window).on("resize", function () {
        getWidthAndHeight();
    });
    function getWidthAndHeight() {
        var formoffset = $(".white_header").height();
        var winHeight = $(window).height() - formoffset;
        $(".tp_overlay, .banner form.callus").css({"height": winHeight,});
    }


    $(".form_opener").on("click", function () {
        $(".tp_overlay").fadeToggle();
    });

    $(".form_opener_2").on("click", function () {
        $(".tp_overlay").fadeToggle();
    });


    /*Accordions*/
    var $active = $('#accordion .panel-collapse.in').prev().addClass('active');
    $active.find('a').append('<i class="fa fa-minus-circle"></i>');
    $('#accordion .panel-heading').not($active).find('a').append('<i class="fa fa-plus-circle"></i>');
    $('#accordion').on('show.bs.collapse', function (e) {
        $('#accordion .panel-heading.active').removeClass('active').find('.fa').toggleClass('fa-plus-circle fa-minus-circle');
        $(e.target).prev().addClass('active').find('.fa').toggleClass('fa-plus-circle fa-minus-circle');
    })


    // *********SHOW FILTER
    $('.more-filter').on("click", function () {
        $('.more-filter').toggleClass('show-more');
        $('.more-filter .text-1').toggleClass('hide');
        $('.more-filter .text-2').toggleClass('hide');
    });


    // ********* Check Box
    $('input[name="radio-btn"]').wrap('<div class="radio-btn"><i></i></div>');
    $(".radio-btn").on("click", function () {
        var _this = $(this),
            block = _this.parent().parent();
        block.find('input:radio').attr('checked', false);
        block.find(".radio-btn").removeClass('checkedRadio');
        _this.addClass('checkedRadio');
        _this.find('input:radio').attr('checked', true);
    });
    $('input[name="check-box"]').wrap('<div class="check-box"><i></i></div>');
    $.fn.toggleCheckbox = function () {
        this.attr('checked', !this.attr('checked'));
    }
    $('.check-box').on("click", function () {
        $(this).find(':checkbox').toggleCheckbox();
        $(this).toggleClass('checkedBox');
    });


    // +++++ Parallax Backgrounds
    $("#parallax").parallax('50%', 0.3);
    $("#parallax_two").parallax('50%', 0.3);
    $("#parallax_three").parallax('50%', 0.3);
    $("#testinomial").parallax('50%', -0.2);
    $("#parallax_four").parallax('50%', 0.1);
    $(".page-banner").parallax('50%', -0.3);
});
