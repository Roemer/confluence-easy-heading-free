package com.binguo.confluence.headingfree;

import java.util.Map;

public class MacroContentUpdateHelper {

    public static String ApplyMacroToBody(Map<String, String> map, String bodyContent) {
        // Get multiple value parameters input by users
        String expandOption = map.get("expandOption") != null ? map.get("expandOption") : Constants.DEFAULT_EXPAND_OPTIONS;
        Boolean enableExpandCollapse = !expandOption.equals("disable-expand-collapse");
        Boolean expandAllByDefault = expandOption.equals("expand-all-by-default");

        // Get actual parameters to be used in javascript
        String selector = map.get("selector") != null ? map.get("selector"): Constants.DEFAULT_SELECTOR;
        Boolean useNavigation = map.get("useNavigation") != null ? map.get("useNavigation").equals("true") : Constants.DEFAULT_USE_NAVIGATION;
        String navigationTitle = map.get("navigationTitle") != null ? map.get("navigationTitle"): Constants.DEFAULT_NAVIGATION_TITLE;
        int navigationWidth = map.get("navigationWidth") != null ? Integer.valueOf(map.get("navigationWidth")): Constants.DEFAULT_NAVIGATION_WIDTH;
        int navigationIndent = map.get("navigationIndent") != null ? Integer.valueOf(map.get("navigationIndent")): Constants.DEFAULT_NAVIGATION_INDENT;
        int headingIndent = map.get("headingIndent") != null ? Integer.valueOf(map.get("headingIndent")): Constants.DEFAULT_HEADING_INDENT;

        // Create html for hidden fields for parameters
        return new StringBuilder()
                .append("<div class='heading-expand'>")
                .append("<input class='hid-selector' type='hidden' value='" + selector.toString() + "' />")
                .append("<input class='hid-useNavigation' type='hidden' value='" + useNavigation.toString() + "' />")
                .append("<input class='hid-navigationTitle' type='hidden' value='" + navigationTitle + "' />")
                .append("<input class='hid-navigationWidth' type='hidden' value='" + navigationWidth + "' />")
                .append("<input class='hid-navigationIndent' type='hidden' value='" + navigationIndent + "' />")
                .append("<input class='hid-headingIndent' type='hidden' value='" + headingIndent + "' />")
                .append("<input class='hid-enableExpandCollapse' type='hidden' value='" + enableExpandCollapse.toString() + "' />")
                .append("<input class='hid-expandAllByDefault' type='hidden' value='" + expandAllByDefault.toString() + "' />")
                .append(bodyContent)
                .append("</div><div class='heading-expand-end'></div>")
                .toString();
    }
}
