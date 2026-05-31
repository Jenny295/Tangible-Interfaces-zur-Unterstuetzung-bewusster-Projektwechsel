
import { handleTabClick } from "./tabs.js";
import "./tab1.js";
import "./tab2.js";
import "./notifications.js";
import { finishExperiment, downloadCSV, logEvent } from "./logger.js";

const buttons = document.querySelectorAll(".tab-button");
const doneButton = document.getElementById("doneButton");

let inputsDone = false;
let notificationsDone = false;
let tab2Done = false;
let tab3Done = false;


// to switch tabs
buttons.forEach(button => {
    button.addEventListener("click", handleTabClick);
});


// button to finish, downloads csv data (time, answers)
doneButton.addEventListener("click", () => {
    finishExperiment();
    downloadCSV();
    alert("Experiment abgeschlossen");
});


// tracks states

window.addEventListener("inputsFinished", () => {
    inputsDone = true;
    checkDone();
});

window.addEventListener("notificationsFinished", () => {
    notificationsDone = true;
    checkDone();
});

window.addEventListener("tab2Finished", () => {
    tab2Done = true;
    checkDone();
});

window.addEventListener("tab3TaskDone", () => {
    tab3Done = true;
    checkDone();
});


// checks if all tasks are completed and enables the done button.
function checkDone() {
    if (inputsDone && notificationsDone && tab2Done && tab3Done) {
        doneButton.disabled = false;
        doneButton.classList.add("enabled");
    } else {
        doneButton.disabled = true;
        doneButton.classList.remove("enabled");
    }
}


// global overlay to inform about new event in tab2 and pop up message
window.addEventListener("tab2Start", () => {
    logEvent("tab2_notification_shown", { message: "Neue Aufgabe in Tab2 - sofort überprüfen." });
    showOverlay("Neue Aufgabe in Tab2 - sofort überprüfen.");
});

function showOverlay(PopUpText) {
    const overlay = document.createElement("div");
    overlay.id = "global-notification";

    const box = document.createElement("div");
    box.classList.add("box");

    const text = document.createElement("p");
    text.textContent = PopUpText;

    const btn = document.createElement("button");
    btn.textContent = "OK";

    btn.onclick = () => overlay.remove();

    box.appendChild(text);
    box.appendChild(btn);
    overlay.appendChild(box);

    document.body.appendChild(overlay);
}
