/*
| ==========================================================
| Preloader
| ========================================================== */
jQuery(window).load(function() {
    $('#preloader').fadeOut('100');
});





/*
| ==========================================================
| Scroll To Top
| ========================================================== */

$(document).ready(function() {
    'use strict';
    // Scroll To Top
    $('body').prepend('<div class="go-top"><span id="top"><img src="assets/img/scroll-to-top.svg" alt="top" /></span></div>');

    $(window).scroll(function() {
        if ($(window).scrollTop() > 500) {
            $('.go-top').fadeIn(600);
        } else {
            $('.go-top').fadeOut(600);
        }
    });
    $('#top').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 800, 'easeInQuad');
        return false;
    });



});


/*
| ==========================================================
| Fixed Menu
| ========================================================== */

$(document).ready(function() {

    'use strict';

    var c, currentScrollTop = 0,
        navbar = $('nav');

    $(window).scroll(function() {
        var a = $(window).scrollTop();
        var b = navbar.height();

        currentScrollTop = a;

        if (c < currentScrollTop && a > b + b) {
            navbar.addClass("scrollUp");
        } else if (c > currentScrollTop && !(a <= b)) {
            navbar.removeClass("scrollUp");
        }
        c = currentScrollTop;
    });

});



/*
| ==========================================================
| Mobile Menu
| ========================================================== */

$(document).ready(function() {
    $('.nex-menu').nexmenu({
        nexBarPosition: "right", // left right 
        nexMenuBg: "black",
        brandLogo: '<a href="https://customketodiet.com"><img src="/support_assets/img/logo.svg" alt="logo" /></a>',
        nexBarColor: "white",
        nexMenuPosition: "",
        brandPosition: "left",
        nexScreenWidth: "767",
        nexShowChildren: true,
        nexExpandableChildren: true,
        nexExpand: "+",
        nexContract: "-",
        nexRemoveAttrs: true,
        // onePage:true,
        removeElements: ".desk-nav"
    });

});





// accordion
$(function() {
    var Accordion = function(el, multiple) {
        this.el = el || {};
        this.multiple = multiple || false;

        var links = this.el.find('.article-title');
        links.on('click', {
            el: this.el,
            multiple: this.multiple
        }, this.dropdown)
    }

    Accordion.prototype.dropdown = function(e) {
        var $el = e.data.el;
        $this = $(this),
            $next = $this.next();

        $next.slideToggle();
        $this.parent().toggleClass('open');

        // if (!e.data.multiple) {
        //     $el.find('.accordion-content').not($next).slideUp().parent().removeClass('open');
        // };
    }
    var accordion = new Accordion($('.accordion-container'), false);
});