// ==UserScript==
// @name           Urlbar Auto-focus Fix
// @version        1.0
// @author         aminomancer
// @homepage       https://github.com/aminomancer
// @description    Stop firefox from focusing the first window's browser content area when a custom home page is set.
// @include    main
// ==/UserScript==

(function () {
    window.isBlankPageURL = function (aURL) {
        return (
            aURL == "about:blank" ||
            aURL == "about:home" ||
            aURL == "about:welcome" ||
            aURL == BROWSER_NEW_TAB_URL
        );
    };
    AboutNewTab.init();
    AboutNewTab.newTabURL = HomePage.get(window);
    gBrowser.tabContainer.addEventListener(
        "SSTabRestoring",
        (e) => {
            if (gBrowser.currentURI.spec === HomePage.get(window)) gURLBar.focus();
        },
        { once: true }
    );
})();