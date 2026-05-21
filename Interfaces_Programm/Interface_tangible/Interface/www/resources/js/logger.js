
// logging time and input for tab changes and tasks
// time is tracked correctly in csv but sometimes, where the needed seconds should be, a date is displayed instead

// time format
function formatTime(timestamp) {

    const date = new Date(Number(timestamp))

    return (
        String(date.getHours()).padStart(2, "0") + ":" +
        String(date.getMinutes()).padStart(2, "0") + ":" +
        String(date.getSeconds()).padStart(2, "0")
        )
}


// data
export const experimentData = {
    startedAt: new Date().getTime(),
    finishedAt: null,
    totalDurationMs: null,

    currentTab: "tab1",
    tabEnteredAt: new Date().getTime(),
    tabTimes: [],
    tabSwitches: [],

    inputs: [],
    notifications: [],
    events: [],
    totalErrors: 0
};


// generic event logger
export function logEvent(type, data = {}) {
    experimentData.events.push({
        type,
        timestamp: new Date().getTime(),
        ...data
    });
}


// tracks tab switches
export function trackTabSwitch(newTab) {
    const now = new Date().getTime();

    experimentData.tabTimes.push({
        tab: experimentData.currentTab,
        enteredAt: experimentData.tabEnteredAt,
        leftAt: now,
        durationMs: now - experimentData.tabEnteredAt
    });

    experimentData.tabSwitches.push({
        from: experimentData.currentTab,
        to: newTab,
        timestamp: now
    });

    logEvent("tab_switch", {
        from: experimentData.currentTab,
        to: newTab
    });

    experimentData.currentTab = newTab;

    experimentData.tabEnteredAt = now;
}


// input tracking
export function logInput(label, value, gapIndex) {

    const now = new Date().getTime();

    experimentData.inputs.push({
        label,
        value,
        gapIndex,
        timestamp: now,
        tab: experimentData.currentTab,
        tabEnteredAt: experimentData.tabEnteredAt
    });

    logEvent("input", {
        label,
        value,
        gapIndex
    });
}


// tracks data tasks tab3
export function createNotification(type, text) {

    const now = new Date().getTime();

    const notification = {
        id: experimentData.notifications.length,
        type,
        text,
        shownAt: now,
        tab: experimentData.currentTab,
        tabEnteredAt: experimentData.tabEnteredAt,
        answeredAt: null,
        reactionTimeMs: null,
        correct: null,
        wrongClicks: 0
    };

    experimentData.notifications.push(notification);

    logEvent("notification_shown",{
        id: notification.id,
        type,
        text,
        timestamp: now
    });

    return notification.id;
}

// helper for time tab switch in tab3
function getNextTabEntry(tabName, time) {
    return experimentData.tabTimes
        .filter(t => t.tab === tabName)
        .find(t => t.enteredAt > time);
}


// for wrong answer
export function notificationWrong(notificationId) {

    const notif =
        experimentData.notifications[notificationId];

    if (!notif) return;

    notif.wrongClicks++;
    experimentData.totalErrors++;
}

// for correct answer
export function notificationCorrect(notificationId) {

    const notif =
        experimentData.notifications[notificationId];

    if (!notif) return;

    notif.answeredAt = new Date().getTime();
    notif.reactionTimeMs =
        notif.answeredAt - notif.shownAt;
    notif.correct = true;
}


// tracks when finished
export function finishExperiment() {

    const now = new Date().getTime();

    experimentData.tabTimes.push({
        tab: experimentData.currentTab,
        enteredAt: experimentData.tabEnteredAt,
        leftAt: now,
        durationMs: now - experimentData.tabEnteredAt
    });

    experimentData.finishedAt = now;

    experimentData.totalDurationMs = now - experimentData.startedAt;
}

// csv export
export function downloadCSV() {

    let rows = [];

    // tab times
    rows.push([
        "TAB",
        "BETRETEN",
        "VERLASSEN",
        "DAUER_SEKUNDEN"
    ]);

    experimentData.tabTimes.forEach(t => {

        rows.push([
            t.tab,
            formatTime(t.enteredAt),
            formatTime(t.leftAt),
            (Number(t.durationMs) / 1000).toFixed(2).replace(".", ",")
        ]);
    });

    rows.push([]);
    rows.push([]);

    // inputs
    rows.push([
        "FELD",
        "EINGABE",
        "POSITION",
        "ZEIT",
        "TAB_BETRETEN"
    ]);

    experimentData.inputs.forEach(i => {
        rows.push([
            i.label,
            i.value,
            i.gapIndex,
            formatTime(i.timestamp),
            formatTime(i.tabEnteredAt)
        ]);
    });

    rows.push([]);
    rows.push([]);

    // tab2
    rows.push([
        "EVENT",
        "Zeit",
        "DETAILS"
    ]);

    const tab2Events = experimentData.events.filter(e =>
        e.type.startsWith("tab2_") || e.type === "tab_switch"
    );

    tab2Events.forEach(e => {

        const details = { ...e };
        delete details.type;
        delete details.timestamp;

        rows.push([
            e.type,
            formatTime(e.timestamp),
            JSON.stringify(details)

        ]);
    });

    rows.push([]);
    rows.push([]);

    // tasks tab3
    rows.push([
        "ID",
        "TYP",
        "TEXT",
        "ANGEZEIGT",
        "TAB_BETRETEN",
        "BEANTWORTET",
        "REAKTIONSZEIT_SEK",
        "RICHTIG",
        "FEHLER"
    ]);

    experimentData.notifications.forEach(n => {

        const nextTabEntry = getNextTabEntry("tab3", n.shownAt);

        rows.push([
            n.id,
            n.type,
            n.text,
            formatTime(n.shownAt),
            nextTabEntry
                ? formatTime(nextTabEntry.enteredAt)
                : "-",
            n.answeredAt != null
                ? formatTime(n.answeredAt)
                : "-",
            n.reactionTimeMs != null
                ? (Number(n.reactionTimeMs) / 1000).toFixed(2).replace(".", ",")
                : "-",
            n.correct,
            n.wrongClicks
        ]);
    });

    rows.push([]);
    rows.push([]);

    // summary
    rows.push([
        "GESAMTDAUER_SEKUNDEN",
        (Number(experimentData.totalDurationMs) / 1000).toFixed(2).replace(".", ",")
    ]);

    rows.push([
        "GESAMT_FEHLER",
        experimentData.totalErrors
    ]);


    // csv string
    const csvContent = rows
        .map(row => row.join(";"))
        .join("\n");


    // download
    const blob = new Blob(
        [csvContent],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "experiment_data.csv";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}
