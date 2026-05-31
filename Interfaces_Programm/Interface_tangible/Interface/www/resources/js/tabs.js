
import { trackTabSwitch } from "./logger.js";

const buttons = document.querySelectorAll(".tab-button");


// handles tab changes
export function activateTab(tabId) {
    trackTabSwitch(tabId);

    document.querySelectorAll(".tab-content")
        .forEach(t => t.classList.remove("active"));

    buttons.forEach(b => b.classList.remove("active"));


    document
        .getElementById(tabId)
        .classList.add("active");


    const activeButton = document.querySelector(
        `[data-tab="${tabId}"]`
    );

    if (activeButton) {
        activeButton.classList.add("active");
    }
}