let lecturesJSON = localStorage.getItem("lectures");

let header = document.getElementsByTagName("h1");
let watching = 0;

let title;
if (typeof header[0] !== "undefined") {
    title = header[0].innerHTML;
} else {
    watching = 1;
}

if (lecturesJSON == null) {
    lecturesJSON = "{}";
}

let episodes = document.getElementsByClassName("episode");
lecturesJSON = JSON.parse(lecturesJSON);
if (lecturesJSON[title] == null && title !== "Your lecture recordings" && watching !== 1) {
    lecturesJSON[title] = JSON.parse("{}");
    for (let i = 0; i < episodes.length; i++) {
        lecturesJSON[title][episodes[i].getElementsByTagName("a")[0].innerHTML] = JSON.parse("{\"hasCompleted\":false, \"timestamp\":\"\", \"videolength\":\"\"}");
    }
    localStorage.setItem("lectures", JSON.stringify(lecturesJSON));
}

if (watching === 1) title = document.getElementsByClassName("open")[0].getElementsByTagName("a")[0].textContent;

let episode, timestamp, length, percent, totalSeconds;

for (let i = 0; i < episodes.length / 2; i++) {
    episode = episodes[i].getElementsByTagName("a")[0];

    if (typeof lecturesJSON[title][episode.innerHTML] === "undefined") {
        lecturesJSON[title][episode.innerHTML] = JSON.parse("{\"hasCompleted\":false, \"timestamp\":\"\", \"videolength\":\"\"}");
        localStorage.setItem("lectures", JSON.stringify(lecturesJSON));
    }

    let tick = document.createElement("div");
    tick.textContent = " - ✔ ";
    tick.style.display = "inline-block";

    let cross = document.createElement("div");
    cross.textContent = " - ✘ ";
    cross.style.display = "inline-block";

    if (lecturesJSON[title][episode.innerHTML].hasCompleted === false) {
        timestamp = lecturesJSON[title][episode.innerHTML].timestamp;
        length = lecturesJSON[title][episode.innerHTML].videolength;

        percent = (timestamp / length) * 100;

        let watched = document.createElement("div");
        watched.textContent = " - " + percent.toFixed(2) + "% watched";
        watched.style.display = "inline-block";

        if (timestamp) {

            if (percent > 95) {
                episode.appendChild(tick);
                episode.style.color = "green";
            } else {
                episode.appendChild(watched);
            }
        } else {
            episode.appendChild(cross);
        }
    } else {
        episode.appendChild(tick);
        episode.style.color = "green";
    }
}

let boxes = document.getElementsByClassName("title outspecify");
let hours, hours2, seconds, seconds2, minutes, minutes2, hasCompleted;
for (let i = 0; i < boxes.length; i++) {
    timestamp = lecturesJSON[title][boxes[i].textContent].timestamp;
    length = lecturesJSON[title][boxes[i].textContent].videolength;
    hasCompleted = lecturesJSON[title][boxes[i].textContent].hasCompleted;

    let completed = document.createElement("div");
    completed.textContent = "You have completed this lecture ✔";
    completed.style.display = "inline-block";

    let incompleted = document.createElement("div");
    incompleted.textContent = "You haven't watched this lecture yet.";
    incompleted.style.display = "inline-block";

    if (timestamp) {
        percent = (timestamp / length) * 100;
        totalSeconds = length;
        hours2 = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        minutes2 = Math.floor(totalSeconds / 60);
        seconds2 = totalSeconds % 60;

        totalSeconds = timestamp;
        hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        minutes = Math.floor(totalSeconds / 60);
        seconds = totalSeconds % 60;

        let watchtime = document.createElement("div");
        watchtime.textContent = "Watched - " + hours + ":" + minutes.toFixed(0) + ":" + seconds.toFixed(0) + "/" + hours2 + ":" + minutes2.toFixed(0) + ":" + seconds2.toFixed(0);

        if (hasCompleted) {
            boxes[i].appendChild(completed);
            boxes[i].style.color = "green";
        } else {
            boxes[i].appendChild(watchtime);
        }
    } else {
        boxes[i].appendChild(incompleted);
    }
}
if (watching === 1) {
    let video = document.getElementById("video_html5_api");
    episode = document.getElementsByClassName("active")[1].textContent;

    let interval = setInterval(function () {
        if (video.readyState > 0) {
            lecturesJSON[title][episode].videolength = video.duration;
            localStorage.setItem("lectures", JSON.stringify(lecturesJSON));
            if (lecturesJSON[title][episode].timestamp)
                video.currentTime = lecturesJSON[title][episode].timestamp;
            clearInterval(interval);
        }
    }, 200);

    video.ontimeupdate = function () {
        lecturesJSON[title][episode].timestamp = video.currentTime;

        if (video.currentTime / lecturesJSON[title][episode].videolength > 0.95) {
            lecturesJSON[title][episode].hasCompleted = true;
        }
        localStorage.setItem("lectures", JSON.stringify(lecturesJSON));
    };
}