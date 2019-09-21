package com.binguo.confluence.headingfree;

import java.util.Map;

public class MacroContentUpdateHelper {

    public static String ApplyMacroToBody(Map<String, String> map, String bodyContent) {
        // Get multiple value parameters input by users
        String expandOption = map.get("expandOption") != null ? map.get("expandOption") : Constants.DEFAULT_EXPAND_OPTIONS;

        // Get actual parameters to be used in javascript
        Boolean useNavigation = map.get("useNavigation") != null ? map.get("useNavigation").equals("true") : Constants.DEFAULT_USE_NAVIGATION;
        String navigationTitle = map.get("navigationTitle") != null ? map.get("navigationTitle"): Constants.DEFAULT_NAVIGATION_TITLE;
        int navigationWidth = map.get("navigationWidth") != null ? Integer.valueOf(map.get("navigationWidth")): Constants.DEFAULT_NAVIGATION_WIDTH;
        Boolean enableExpandCollapse = !expandOption.equals("disable-expand-collapse");
        Boolean expandAllByDefault = expandOption.equals("expand-all-by-default");
        Boolean useIndent = map.get("useIndent") != null ? map.get("useIndent").equals("true") : Constants.DEFAULT_USE_INDENT;

        // Create html for hidden fields for parameters
        return new StringBuilder()
                .append("<div class='heading-expand'>")
                .append("<input class='hid-useNavigation' type='hidden' value='" + useNavigation.toString() + "' />")
                .append("<input class='hid-navigationTitle' type='hidden' value='" + navigationTitle + "' />")
                .append("<input class='hid-navigationWidth' type='hidden' value='" + navigationWidth + "' />")
                .append("<input class='hid-enableExpandCollapse' type='hidden' value='" + enableExpandCollapse.toString() + "' />")
                .append("<input class='hid-expandAllByDefault' type='hidden' value='" + expandAllByDefault.toString() + "' />")
                .append("<input class='hid-useIndent' type='hidden' value='" + useIndent.toString() + "' />")
                .append(bodyContent)
                .append("</div><div class='heading-expand-end'></div>")
                .toString();
    }
}
