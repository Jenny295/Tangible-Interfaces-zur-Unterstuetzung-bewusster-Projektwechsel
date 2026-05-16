
// generates clickable bubbles, tracks user clicks, and completes the task after a set number of interactions

import { logEvent } from "./logger.js";

window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("bubble-container");
    if (!container) return;

    // variables for current progress, amount bubbles, to ensure that the task is only triggered once
    let index = 0;
    const total = 10;
    let started = false;
    let firstClickLogged = false;

    // start task when tab2 begins
    window.addEventListener("tab2Start", () => {
        if (started) return;
        started = true;
        spawn();
    });

    // creates or updates bubble task
    function spawn() {
        // task finished
        if (index >= total) {
            logEvent("tab2_task_finished", {
                completedBubbles: total
            });

            container.innerHTML = "";

            const done = document.createElement("div");
            done.textContent = "Aufgabe erledigt";
            done.style.fontSize = "20px";

            container.appendChild(done);

            window.dispatchEvent(new CustomEvent("tab2Finished"));
            return;
        }

        // clear previous bubble
        container.innerHTML = "";

        // create new bubble
        const bubble = document.createElement("div");
        bubble.classList.add("bubble");
        bubble.textContent = "Klick mich";

        // random position
        const x = Math.random() * 200;
        const y = Math.random() * 200;

        bubble.style.position = "absolute";
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;

        // click increases progress and respawns bubble
        bubble.addEventListener("click", () => {
            if (!firstClickLogged) {
                firstClickLogged = true;

                logEvent("tab2_task_started", {
                    totalBubbles: total,
                    trigger: "first_bubble_click"
                });
            }
            index++;
            spawn();
        });
        container.appendChild(bubble);
    }
});
