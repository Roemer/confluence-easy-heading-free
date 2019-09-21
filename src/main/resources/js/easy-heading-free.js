var MAX_WIDTH_NAVIGATION = 600;
var MIN_WIDTH_NAVIGATION = 40;
var MARGIN_RIGHT_NAVIGATION = 20;
var SCROLLING_OFFSET_FIX = 100;
var SCROLLING_ANIMATION_DURATION = 500;
var SCROLLING_EXPAND_WAIT_TIME = 500;
var selectorBody = "#main-content";
var selectorMacro = ".heading-expand";
var selectorHeaders = "h1,h2,h3";

AJS.toInit(function ($) {
    // Use parameters of the first macro if there are multiple
    var paras = getParameters($(selectorBody + " " + selectorMacro + ":eq(0)"));
    console.log(paras);

    // It will only use the paras of the first macro block for navigation set up
    addNavigation(paras);

    // Update block to support heading functions
    console.log($(selectorBody + " " + selectorMacro).length);
    $(selectorBody + " " + selectorMacro).each(function(){
        var divContainer = $(this).parent().parent().closest("div");
        console.log("class name = " + divContainer.attr("class"));
        processHeadings(divContainer.find(selectorHeaders).eq(0), paras);
    });
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
    $(selectorBody).find(selectorHeaders).each(function(){
        if ($(this).text().trim() != "") {
            $('<li><a href="">' + $(this).text() + '</a></li>').appendTo(ulList);
        }
    });
    if (ulList.find("li").length == 0) return;
	
	// Bind event for scrolling
	ulList.find("a").click(function(e){
		event.preventDefault();
		
		// Expand the target heading and scroll to the target heading only once it's completely expanded
		var index = $(this).parent().index();
		var expanded = isHeadingExpanded(index);
		//console.log(expanded);
		if (expanded) {
			scrollToHeading(index);
		} else {
			expandHeading(index);
			setTimeout(function(){
				console.log("moving");
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
        useNavigation : macroBlock.find(".hid-useNavigation:eq(0)").val() == "true",
        navigationTitle : macroBlock.find(".hid-navigationTitle:eq(0)").val(),
        navigationWidth : Number(macroBlock.find(".hid-navigationWidth:eq(0)").val()),
        enableExpandCollapse : macroBlock.find(".hid-enableExpandCollapse:eq(0)").val() == "true",
        expandAllByDefault : macroBlock.find(".hid-expandAllByDefault:eq(0)").val() == "true",
        useIndent : macroBlock.find(".hid-useIndent:eq(0)").val() == "true"
    };
}

// Attention, this is a recursive function
function processHeadings(h, paras) {
    if (h == null || h.length == 0) return;
    if (h.text().trim() == "") {
        processHeadings(h.next(selectorHeaders), paras);
        return;
    }

    var divHeader = updateHeading(h, paras);
    var divBody = divHeader.next("div.heading-expand-body");
    processHeadings(divBody.find(selectorHeaders).eq(0), paras);
    var hNext = divBody.next(selectorHeaders);
    processHeadings(hNext, paras);
}

function updateHeading(h, paras){
    //console.log("header text: " + h.text());

	// Create the body div and move all its sub H elements into it
	var level = parseInt(h[0].nodeName.substring(1), 10);
    var until = ".heading-expand-end";
    for (i = level; i > 0; i--){
        if (until != "") until += ",";
        until += "h" + i;
    }
    var classes = paras.useIndent ? "heading-expand-body heading-expand-indent" : "heading-expand-body";
    var style = !paras.expandAllByDefault && paras.enableExpandCollapse ? " style='display:none'" : "";
	$("<div class='" + classes + "' " + style + " ></div>").insertAfter(h);
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

