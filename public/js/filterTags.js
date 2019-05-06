function loadTags(events) {

    let tags = [];
    for (let i = 0; i < events.length; i++) {
        for (let j = 0; j < events[i].tags.length; j++) {
            if (!tags.includes(events[i].tags[j])) {
                tags.push(events[i].tags[j]);
            }
        }
    }
    return tags;
}

function filterOut(tag, events) {
    let displayedEvents = [];
    for (let i = 0; i < events.length; i++) {
        if (events[i].tags.includes(tag)) {
            displayedEvents.push(events[i]);
        }
    }
    return displayedEvents;
}