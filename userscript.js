// ==UserScript==
// @name         Remove YouTube Shorts
// @namespace    https://github.com/kylecorry31
// @version      1.0.0
// @description  Removes YouTube Shorts from the Subscriptions page.
// @author       Kyle Corry
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

let isRemovalRunning = false;

const removeShorts = () =>
{
    if (window.location.href !== 'https://www.youtube.com/feed/subscriptions' || isRemovalRunning){
        return;
    }

    try {

        isRemovalRunning = true;

        // Remove shorts
        const videoSelector = 'ytd-rich-item-renderer';
        const shortsSelector = `${videoSelector} a[href^="/shorts"]`;
        const rowSelector = 'ytd-rich-grid-row #contents';
        const itemsPerRowAttribute = 'items-per-row';

        const shorts= document.querySelectorAll(shortsSelector).forEach(a =>
                                                                                           {
            const video = a.closest(videoSelector);
            video.remove();
        });

        // Fill in gaps
        const itemsPerRow = +document.querySelector(videoSelector)?.getAttribute(itemsPerRowAttribute);
        if (!itemsPerRow){
            return;
        }

        const rows = document.querySelectorAll(rowSelector);
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            while (row.children.length < itemsPerRow) {
                let nextRow = rows[i + 1];

                // Search for the next non-empty row
                while (nextRow && nextRow.children.length === 0) {
                    nextRow = rows[++i];
                }

                if (nextRow && nextRow.children.length > 0) {
                    const child = nextRow.children[0];
                    row.appendChild(child);
                } else {
                    break;
                }
            }
        }
    } finally {
        isRemovalRunning = false;
    }
}

const observer = new MutationObserver(removeShorts);
observer.observe(document, {
    childList:  true,
    subtree:    true,
});

removeShorts();
