
// logging time and input for tab changes and tasks

// time format
function formatTime(timestamp) {
    return new Date(timestamp).toLocaleString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}


// data
export const experimentData = {
    startedAt: Date.now(),
    finishedAt: null,
    totalDurationMs: null,

    currentTab: "tab1",
    tabEnteredAt: Date.now(),
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
        timestamp: Date.now(),
        ...data
    });
}


// tracks tab switches
export function trackTabSwitch(newTab) {
    const now = Date.now();

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

    experimentData.inputs.push({
        label,
        value,
        gapIndex,
        timestamp: Date.now()
    });

    logEvent("input", {
        label,
        value,
        gapIndex
    });
}


// tracks data tasks tab3
export function createNotification(type, text) {

    const notification = {
        id: experimentData.notifications.length,
        type,
        text,
        shownAt: Date.now(),
        answeredAt: null,
        reactionTimeMs: null,
        correct: null,
        wrongClicks: 0
    };

    experimentData.notifications.push(notification);

    return notification.id;
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

    notif.answeredAt = Date.now();
    notif.reactionTimeMs =
        notif.answeredAt - notif.shownAt;
    notif.correct = true;
}


// tracks when finished
export function finishExperiment() {

    const now = Date.now();

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
            (t.durationMs / 1000).toFixed(2)
        ]);
    });

    rows.push([]);
    rows.push([]);

    // inputs
    rows.push([
        "FELD",
        "EINGABE",
        "POSITION",
        "ZEIT"
    ]);

    experimentData.inputs.forEach(i => {
        rows.push([
            i.label,
            i.value,
            i.gapIndex,
            formatTime(i.timestamp)
        ]);
    });

    rows.push([]);
    rows.push([]);

    // tasks 
    rows.push([
        "ID",
        "TYP",
        "TEXT",
        "ANGEZEIGT",
        "BEANTWORTET",
        "REAKTIONSZEIT_SEK",
        "RICHTIG",
        "FEHLER"
    ]);

    experimentData.notifications.forEach(n => {

        rows.push([
            n.id,
            n.type,
            n.text,
            formatTime(n.shownAt),
            n.answeredAt
                ? formatTime(n.answeredAt)
                : "-",
            n.reactionTimeMs
                ? (n.reactionTimeMs / 1000).toFixed(2)
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
        (experimentData.totalDurationMs / 1000).toFixed(2)
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
