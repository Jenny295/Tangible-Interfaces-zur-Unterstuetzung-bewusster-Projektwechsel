
import { trackTabSwitch } from "./logger.js";

const buttons = document.querySelectorAll(".tab-button");


// handles tab changes

export function handleTabClick(event) {
    const tabId = event.currentTarget.dataset.tab;
    trackTabSwitch(tabId);

    // hides contents
    document.querySelectorAll(".tab-content")
        .forEach(t => t.classList.remove("active"));


    buttons.forEach(b => b.classList.remove("active"));

    // set active
    document.getElementById(tabId).classList.add("active");
    event.currentTarget.classList.add("active");
}
