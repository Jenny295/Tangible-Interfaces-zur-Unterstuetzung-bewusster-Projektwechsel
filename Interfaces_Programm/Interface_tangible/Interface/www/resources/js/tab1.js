
import { logInput } from "./logger.js";


// creates input fields, tracks user interaction and progress,
// triggers experiment events, and detects when all inputs are completed.

window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("input-container");
    if (!container) return;

    const inputs = [];
    let done = false;

    // progress counter
    window.currentGapIndex = 0;

    // trigger points for tab3 tasks
    const taskTriggers = [4, 7, 10, 15, 19];


    // creates a labeled input group
    function createGroup(title) {

        const group = document.createElement("div");
        group.classList.add("input-group");

        const h = document.createElement("h3");
        h.textContent = title;

        const grid = document.createElement("div");
        grid.classList.add("input-grid");

        group.appendChild(h);
        group.appendChild(grid);
        container.appendChild(group);

        return grid;
    }

    // description for input fields
    const food = createGroup("Tragen Sie 10 verschiedene Tiere in die Lücken ein:");
    const colors = createGroup("Tragen Sie 10 verschiedene Gegenstände in die Lücken ein:");


    // creates a single tracked input field
    function createInput(label) {
        const input = document.createElement("input");
        input.placeholder = label;

        input.dataset.started = "false";

        let lastValue = "";

        // first interaction: counts progression + triggers events
        input.addEventListener("focus", () => {

            if (input.dataset.started === "false") {
                input.dataset.started = "true";

                window.currentGapIndex++;

                window.dispatchEvent(
                    new CustomEvent("gapStarted")
                );


                // triggers tab3 tasks
                if (taskTriggers.includes(window.currentGapIndex)) {
                    window.dispatchEvent(
                        new CustomEvent("tab3Task")
                    );
                }

                // starts tab2
                if (
                    window.currentGapIndex >= 12 &&
                    !window.tab2Started
                ) {
                    window.tab2Started = true;

                    window.dispatchEvent(
                        new CustomEvent("tab2Start")
                    );
                }
            }
        });


        // logs final value
        input.addEventListener("blur", () => {
            const value = input.value.trim();
            if (value === "") return;

            if (value !== lastValue) {
                logInput(
                    label,
                    value,
                    window.currentGapIndex
                );
                lastValue = value;
            }
        });

        // checks if all inputs are completed
        input.addEventListener("input", checkDone);

        inputs.push(input);

        return input;
    }

    // generate input fields
    for (let i = 0; i < 10; i++) {
        food.appendChild(
            createInput(`Tiere ${i + 1}`)
        );
    }

    for (let i = 0; i < 10; i++) {
        colors.appendChild(
            createInput(`Gegenstände ${i + 1}`)
        );
    }

    // completion check (fires once when all inputs filled)
    function checkDone() {
        if (
            !done &&
            inputs.every(i =>
                i.value.trim() !== ""
            )
        ) {
            done = true;

            window.dispatchEvent(
                new CustomEvent(
                    "inputsFinished"
                )
            );
        }
    }
});