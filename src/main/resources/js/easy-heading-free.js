var MAX_WIDTH_NAVIGATION = 600;
var MIN_WIDTH_NAVIGATION = 40;
var MARGIN_RIGHT_NAVIGATION = 20;
var SCROLLING_OFFSET_FIX = 100;
var SCROLLING_ANIMATION_DURATION = 500;
var SCROLLING_EXPAND_WAIT_TIME = 500;
var EMPTY_SELECTOR_HEADERS = "h1,h2,h3,h4,h5,h6";
var selectorPage = "#main";
var selectorBody = "#main-content";
var selectorMacro = ".easy-heading-free";
var selectorHeaders = "h1,h2,h3";

AJS.toInit(function ($) {
    // Use parameters of the first macro if there are multiple
    var paras = getParameters($(selectorPage + " " + selectorMacro + ":eq(0)"));
    if (paras.selector == null || paras.selector.trim() == "") {
        paras.selector = EMPTY_SELECTOR_HEADERS;
    }
    selectorHeaders = paras.selector;
    console.log(paras);

    // Update block to all headings
    $(selectorBody + " " + selectorHeaders).each(function(){
        processHeadings($(this), paras);
    });

    // It will only use the paras of the first macro block for navigation set up
    addNavigation(paras);
});

var mouseXPosition;
var mouseIsDown = false;
var navigationCreated = false;
function addNavigation(paras) {
    if (!paras.useNavigation || navigationCreated) return;

    // Copy all heading text and create a list
    var divContent = $("#content")
    var divNavigationWrapper =  $('<div id="eh-navigation-wrapper"></div>');
    var divNavigation = $('<div id="eh-navigation"></div>');
	var divNavigationContent = $('<div id="eh-navigation-content"></div>');
	var divDragBar = $('<div id="eh-drag-bar"></div>');
    var divTitle = $('<div id="eh-navigation-title">' + paras.navigationTitle + '</div>');
    var ulList = $('<ul id="eh-navigation-list"></ul>');

    // Set indent for each item in side bar
    $(selectorBody).find(".heading-expand-header").each(function(index){
        var text = $(this).find(":header").text();
        var levels = $(this).parents(".heading-expand-body").length;
        var indent = paras.navigationIndent * levels;
        $('<li style="padding-left: '+ indent + 'px;"><a href="">' + $(this).text() + '</a></li>').appendTo(ulList);
    });

    if (ulList.find("li").length == 0) return;
	
	// Bind event for scrolling
	ulList.find("a").click(function(e){
		event.preventDefault();
		
		// Expand the target heading and scroll to the target heading only once it's completely expanded
		var index = $(this).parent().index();
		var expanded = isHeadingExpanded(index);

		if (expanded) {
			scrollToHeading(index);
		} else {
			expandHeading(index);
			setTimeout(function(){
				scrollToHeading(index);
			}, SCROLLING_EXPAND_WAIT_TIME);
		}
	});
	
	// Set width for navigation
	var widthNavSetting = paras.navigationWidth;
	divNavigation.css("width", widthNavSetting + "px");
	divContent.css("margin-right", (widthNavSetting + MARGIN_RIGHT_NAVIGATION) + "px");

	// Compose Navigation
    divNavigationContent.append(divDragBar).append(divTitle).append(ulList).appendTo(divNavigation);
    divNavigationWrapper.append(divNavigation).appendTo(divContent);	
	
	// Dragging to resize
	dragBar = $("#eh-drag-bar")[0];
	dragBar.addEventListener('mousedown', function(e) {
		event.preventDefault();
		mouseIsDown = true;	
		mouseXPosition = e.clientX;		
	}, true);

	document.addEventListener('mouseup', function() {
		mouseIsDown = false;
	}, true);

	document.addEventListener('mousemove', function(event) {
	    if ($("#eh-navigation").length == 0) return;

		var navigationWidth = Number($("#eh-navigation").css("width").replace("px", ""));
		var xOffset = event.clientX - mouseXPosition;
		var canDragRight = xOffset > 0 && navigationWidth > MIN_WIDTH_NAVIGATION;
		var canDragLeft = xOffset < 0 && navigationWidth < MAX_WIDTH_NAVIGATION;
		if (mouseIsDown && (canDragRight || canDragLeft)) {
			mouseXPosition = event.clientX;
			resizeNavigation(xOffset);
		}
	}, true);

	navigationCreated = true;
}

function expandHeading(headingIndex) {
    var header = $(selectorBody).find(".heading-expand-header").eq(headingIndex);
	var body = header.next(".heading-expand-body").show();
	var parentBody = header.closest(".heading-expand-body");
	
	var i = 0;
	while (parentBody.length == 1 && i < 20) {
		parentBody = parentBody.show().parent().closest(".heading-expand-body");
		i++;
	}
}

function isHeadingExpanded(headingIndex) {
    var header = $(selectorBody).find(".heading-expand-header").eq(headingIndex);
	var body = header.next(".heading-expand-body").show();
	if (body.is(":hidden")) return false;
	
	var parentBody = header.closest(".heading-expand-body");
	
	var i = 0;
	while (parentBody.length == 1 && i < 20) {
		if (parentBody.is(":hidden")) return false;
		parentBody = parentBody.parent().closest(".heading-expand-body");
		i++;
	}
	return true;
}

function scrollToHeading(headingIndex) {
	var targetHeading = $(selectorBody).find(selectorHeaders).eq(headingIndex);
	var position = targetHeading.offset();
	$('html, body').stop().animate({ scrollTop: position.top - SCROLLING_OFFSET_FIX }, SCROLLING_ANIMATION_DURATION);
}

function resizeNavigation(xOffset) {
	var contentMarginRight = Number($("#content").css("margin-right").replace("px", ""));
	$("#content").css("margin-right",  (contentMarginRight - xOffset) +  "px");
	
	var navigationWidth = Number($("#eh-navigation").css("width").replace("px", ""));
	$("#eh-navigation").css("width",  (navigationWidth - xOffset) +  "px");
}

function getParameters(macroBlock) {
    return {
        selector: macroBlock.find(".hid-selector:eq(0)").val(),
        useNavigation : macroBlock.find(".hid-useNavigation:eq(0)").val() == "true",
        navigationTitle : macroBlock.find(".hid-navigationTitle:eq(0)").val(),
        navigationWidth : Number(macroBlock.find(".hid-navigationWidth:eq(0)").val()),
        navigationIndent : Number(macroBlock.find(".hid-navigationIndent:eq(0)").val()),
        headingIndent : Number(macroBlock.find(".hid-headingIndent:eq(0)").val()),
        enableExpandCollapse : macroBlock.find(".hid-enableExpandCollapse:eq(0)").val() == "true",
        expandAllByDefault : macroBlock.find(".hid-expandAllByDefault:eq(0)").val() == "true"
    };
}

// Attention, this is a recursive function
function processHeadings(h, paras) {
    if (h == null || h.length == 0) return;
    // Don't process empty headings
    if (h.text().trim() == "") {
        processHeadings(h.next(selectorHeaders), paras);
        return;
    }
    // Don't process the same heading second time
    if (h.parent().hasClass("heading-expand-header")) return;

    var divHeader = updateHeading(h, paras);
    var divBody = divHeader.next("div.heading-expand-body");
    processHeadings(divBody.find(selectorHeaders).eq(0), paras);
    var hNext = divBody.next(selectorHeaders);
    processHeadings(hNext, paras);
}

function updateHeading(h, paras){
	// Create the body div and move all its sub H elements into it
	var level = parseInt(h[0].nodeName.substring(1), 10);
    var until = ".easy-heading-free-end";
    for (i = level; i > 0; i--){
        if (until != "") until += ",";
        until += "h" + i;
    }
    var styleIndent = "padding-left: " + paras.headingIndent + "px;";
    var style = !paras.expandAllByDefault && paras.enableExpandCollapse ? styleIndent + "display:none;" : styleIndent;

	$("<div class='heading-expand-body' style='" + style + "'></div>").insertAfter(h);
	h.next("div").each(function(){
		$(this).nextUntil(until).appendTo($(this));
	});
	
	// Move header elements into the header div along with the expanding/collapsing icon
	var buttonClass = paras.expandAllByDefault ? "expanded-button" : "collapsed-button";
	var buttonHtml = paras.enableExpandCollapse ? "<span class='arrow " + buttonClass + "'></span>" : "";
	var divHeader = $("<div class='heading-expand-header'>" + buttonHtml + "</div>");
	divHeader.insertAfter(h);
	h.appendTo(divHeader);

    // Bind expand/collapse event
    if (paras.enableExpandCollapse) {
        divHeader.find("span.arrow, " + selectorHeaders).click(function(e){
            e.preventDefault();
            $(this).parent().find("span.arrow").toggleClass("collapsed-button").toggleClass("expanded-button");
            $(this).parent().next("div.heading-expand-body").toggle();
        });
    }

	return divHeader;
}

