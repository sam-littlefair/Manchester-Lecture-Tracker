let lecturesJSON = localStorage.getItem("lectures");

let header = document.getElementsByTagName("h1");
let watching = 0;
if (typeof header[0] !== 'undefined') {
    let title = header[0].innerHTML;
} else {
    watching = 1;
}

if (lecturesJSON == null) {
    lecturesJSON = '{}';
}

var episodes = document.getElementsByClassName("episode");
lecturesJSON = JSON.parse(lecturesJSON);
if (lecturesJSON[title] == null && title !== 'Your lecture recordings' && watching !== 1) {
    let blankJSON = JSON.parse('{}');
    lecturesJSON[title] = blankJSON;
    let toAdd = JSON.parse('{"hasCompleted":false, "timestamp":"", "videolength":""}');
    for (let i = 0; i < episodes.length; i++) {
        lecturesJSON[title][episodes[i].getElementsByTagName("a")[0].innerHTML] = toAdd;
    }
    localStorage.setItem("lectures", JSON.stringify(lecturesJSON));
}

if (watching === 1) var title = document.getElementsByClassName("open")[0].getElementsByTagName("a")[0].textContent;

let episode, timestamp, length, percent, totalSeconds;
for (let i = 0; i < episodes.length; i++) {
    episode = episodes[i].getElementsByTagName("a")[0];
    if (lecturesJSON[title][episode.innerHTML].hasCompleted === false) {
        timestamp = lecturesJSON[title][episode.innerHTML].timestamp;
        length = lecturesJSON[title][episode.innerHTML].videolength;

        if (timestamp) {
            percent = (timestamp / length) * 100;

            if (percent > 95) {
                episode.innerHTML += " - ✔";
                episode.style.color = "green";
            } else {
                episode.innerHTML += " - " + percent.toFixed(2) + "% watched";
            }

        } else {
            episode.innerHTML += " - ✘";
        }
    } else {
        episode.innerHTML += " - ✔";
        episode.style.color = "green";
    }
}

let boxes = document.getElementsByClassName("title outspecify");
for (let i = 0; i < boxes.length; i++) {
    timestamp = lecturesJSON[title][boxes[i].textContent].timestamp;
    length = lecturesJSON[title][boxes[i].textContent].videolength;

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

        if (percent > 95) {
            boxes[i].innerHTML = "You have completed this lecture ✔";
            boxes[i].style.color = 'green';
        } else {
            boxes[i].innerHTML = 'Watched - ' + hours + ':' + minutes.toFixed(0) + ':' + seconds.toFixed(0) + ' / ' + hours2 + ':' + minutes2.toFixed(0) + ':' + seconds2.toFixed(0);
        }
    } else {
        boxes[i].innerHTML = "You haven't watched this lecture yet."
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