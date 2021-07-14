// ==UserScript==
// @name           Copy Current URL Hotkey
// @version        1.0
// @author         aminomancer
// @homepage       https://github.com/aminomancer
// @description    Adds a new hotkey (Ctrl+Alt+C by default) that copies whatever is in the urlbar, even when it's not in focus.
// ==/UserScript==

(function () {
    class CopyCurrentURL {
        static config = {
            "context menu shortcut hint": true, // when you right-click the urlbar, the context menu has a "copy" command. set this to "true" to show a "Ctrl+Alt+C" hint next to this command, like firefox does with many other commands. the hint text will reflect the actual hotkey. so on macOS it will show "Cmd+Alt+C" and if you modify the modifiers below, it will show your modifiers instead. this setting isn't enabled by default because 1) unlike our custom hotkey, this command actually only copies the selection, not the full input content. so it's disabled if nothing is highlighted. and 2) the context menu is very thin due to the short names of the commands. adding "Ctrl+Alt+C" makes it kind of cramped. but it's easy to forget that hotkeys exist if they're not visually displayed anywhere, so you may want to enable this feature.
            shortcut: {
                key: "C", // shortcut key, combined with modifiers.
                modifiers: "alt", // ctrl + alt or cmd + alt (use accel, it's cross-platform. it can be changed in about:config with ui.key.accelKey. if you leave the "" quotes empty, no modifier will be used. that means the hotkey will just be "C" which is a bad idea — only do that if your "key" value is something obscure like a function key, since this key will be active at all times and in almost all contexts.
                id: "key_copyCurrentUrl", // no need to change this.
            },
        };
        constructor() {
            this.hotkey = _ucUtils.registerHotkey(CopyCurrentURL.config.shortcut, (win, key) => {
                if (win === window && gURLBar.value) this.clipboardHelper.copyString(gURLBar.value);
            });
            if (CopyCurrentURL.config["context menu shortcut hint"]) this.shortcutHint();
        }

        get clipboardHelper() {
            return (
                this._clipboardHelper ||
                (this._clipboardHelper = Cc["@mozilla.org/widget/clipboardhelper;1"].getService(
                    Ci.nsIClipboardHelper
                ))
            );
        }

        get contextMenu() {
            return (
                this._contextMenu ||
                (this._contextMenu = gURLBar.querySelector("moz-input-box")?.menupopup)
            );
        }

        handleEvent(e) {
            this.contextMenu
                .querySelector(`[cmd="cmd_copy"]`)
                .setAttribute("key", CopyCurrentURL.config.shortcut.id);
        }

        setAccelText() {
            if (this.hotkey) {
                if (this.contextMenu?.getAttribute("hasbeenopened") === "true") this.handleEvent();
                else gURLBar.addEventListener("contextmenu", this, { once: true });
            }
        }

        shortcutHint() {
            if (gBrowserInit.delayedStartupFinished) this.setAccelText();
            else {
                let delayedListener = (subject, topic) => {
                    if (topic == "browser-delayed-startup-finished" && subject == window) {
                        Services.obs.removeObserver(delayedListener, topic);
                        this.setAccelText();
                    }
                };
                Services.obs.addObserver(delayedListener, "browser-delayed-startup-finished");
            }
        }
    }

    new CopyCurrentURL();
})();
