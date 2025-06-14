// ==UserScript==
// @name         Boostellar Bypass
// @namespace    http://tampermonkey.net/
// @version      2025-06-14
// @description  Bypass Boostellar links instantly!
// @author       srn73
// @match        https://bstlar.com/2l/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bstlar.com
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';

    let screen = document.createElement("div");
    screen.textContent = "Bypassing link, please wait a moment...";
    screen.style = "background: #2f2f2f; width: 100vw; height: 100vh; margin: 0; padding: 0; position: absolute; z-index: 999999; display: flex; justify-content: center; align-items: center; font-size: 50px; text-align: center;";
    document.body.appendChild(screen);

    // get the link id
    console.log(`[Bypass] Fetching link info...`);

    let linkInfo = await fetch(`https://bstlar.com/api/link?url=${window.location.pathname.substring(1)}`, {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": "null",
            "priority": "u=1, i",
        },
        "referrer": `${window.location.href}`,
        "referrerPolicy": "same-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then(r => r.json());

    if (!linkInfo.link || !linkInfo.link.id) {
        screen.textContent = "Failed to bypass. Check DevTools network tab for debugging info.";
        return;
    };

    console.log(`[Bypass] Fetching result link...`);

    let finalLink = await fetch("https://bstlar.com/api/link-completed", {
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": "null",
            "content-type": "application/json;charset=UTF-8",
            "priority": "u=1, i",
        },
        "referrer": `${window.location.href}`,
        "referrerPolicy": "same-origin",
        "body": `{\"link_id\":${linkInfo.link.id}}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(r => r.text());

    screen.textContent = "Redirecting...";

    window.location.href = `${finalLink}`;
})();
