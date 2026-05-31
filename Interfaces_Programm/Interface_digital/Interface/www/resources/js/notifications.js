
// tab3 tasks and badge system

import { createNotification, notificationWrong, notificationCorrect } from "./logger.js";

const container = document.getElementById("notification-container");
const badge = document.getElementById("tab3-badge");
const doneText = document.getElementById("tab3-placeholder");

let openTasks = 0;
let current = 0;
let specialTask = 1;


// standard tasks
const notifications = [
    { type: "number", text: "Drücken Sie die Zahl 1", correct: 1 },
    { type: "check", text: "Bestätigen Sie diese Meldung" },
    { type: "cross", text: "Lehnen Sie diese Meldung ab" },
    { type: "number", text: "Drücken Sie die Zahl 7", correct: 7 },
    { type: "check", text: "Bestätigen Sie diese Meldung" }
];


// start standard tab3 task
window.addEventListener("tab3Task", () => {
    addTask();
    renderNotification();
});


// "hallo"-task
window.addEventListener("tab2Finished", () => {
    window.dispatchEvent(
        new CustomEvent("tab3TaskHallo")
    );
});


// "hallo"-task
window.addEventListener(
    "tab3TaskHallo",
    () => {
        addTask();

        const notificationId = createNotification(
                "text",
                "Schreibe das Wort hallo"
            );
        const box = document.createElement("div");

        box.classList.add("notification");

        const text = document.createElement("p");

        text.textContent = "Schreibe das Wort: hallo";

        const input = document.createElement("input");

        input.placeholder = "hallo eingeben";

        const btn = document.createElement("button");

        btn.textContent = "OK";

        btn.onclick = () => {
            if (
                input.value.trim().toLowerCase() === "hallo"
            ) {
                notificationCorrect(
                    notificationId
                );
                box.remove();
                resolveTask();
                specialTask--;

                checkNotificationsFinished();

                window.dispatchEvent(new CustomEvent("tab3TaskDone"));
            } else {
                notificationWrong(notificationId);
                box.classList.add("error");
            }
        };
        box.appendChild(text);
        box.appendChild(input);
        box.appendChild(btn);
        container.appendChild(box);
    }
);


// badge system to track active open tasks
function addTask() {
    openTasks++;

    // update badge number in UI
    badge.textContent = openTasks;

    // ensure badge is visible when tasks exist
    badge.classList.remove("hidden");
}

function resolveTask() {
    openTasks--;

    // if no task remains
    if (openTasks <= 0) {
        openTasks = 0;

        // hide badge completely when nothing is left
        badge.classList.add("hidden");
    } else {
        // else update badge number
        badge.textContent = openTasks;
    }
}


// standard tasks (notifications)

// creates and displays the next notification in the list
function renderNotification() {

    // stop if all notifications are already shown
    if (
        current >= notifications.length
    ) return;

    const data = notifications[current];

    // register notification in logger and get its ID
    const notificationId = createNotification(data.type,data.text);

    // create UI container for notification
    const box = document.createElement("div");
    box.classList.add("notification");

    const text = document.createElement("p");
    text.textContent = data.text;
    box.appendChild(text);


    // number task

    // user must click correct number button
    if (data.type === "number") {
        for (let i = 1; i <= 10; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;

            btn.onclick = () => {
                if (i === data.correct) {
                    // handles correct answer
                    notificationCorrect(notificationId);
                    box.remove();
                    resolveTask();

                    checkNotificationsFinished();
                } else {
                    // handles wrong answer
                    notificationWrong(notificationId);
                    box.classList.add(
                        "error"
                    );
                }
            };
            box.appendChild(btn);
        }
    }


    // check/cross task

    // user must choose correct action (✔ or ✖)
    if (data.type === "check" || data.type === "cross") {
        const yes = document.createElement("button");
        yes.textContent = "✔";

        const no = document.createElement("button");
        no.textContent = "✖";

        yes.onclick = () => {
            if (data.type === "check") {
                notificationCorrect(notificationId);
                box.remove();
                resolveTask();

                checkNotificationsFinished();
            } else {
                notificationWrong(notificationId);
                box.classList.add("error");
            }
        };

        no.onclick = () => {
            if (data.type === "cross") {
                notificationCorrect(notificationId);
                box.remove();
                resolveTask();

                checkNotificationsFinished();
            } else {
                notificationWrong(notificationId);
                box.classList.add("error");
            }
        };
        box.appendChild(yes);
        box.appendChild(no);
    }
    // add notification to page
    container.appendChild(box);

    // move to next notification
    current++;
}


// checks if tasks are finished
function checkNotificationsFinished() {
    if (current >= notifications.length && openTasks === 0) {
        window.dispatchEvent(new CustomEvent("notificationsFinished"));

        if (specialTask === 0) {
            doneText.textContent = "Aufgaben erledigt";
        }

    }
}
