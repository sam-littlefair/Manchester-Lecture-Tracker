let lecturesJSON = localStorage.getItem("lectures");
let speed_settings = ["0.5x", "0.75x", "1x", "1.25x", "1.5x", "1.75x", "2x", "2.25x", "2.5x", "2.75x", "3x"];
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
        lecturesJSON[title][episodes[i].getElementsByTagName("a")[0].innerHTML] = JSON.parse("{\"hasCompleted\":false, \"timestamp\":\"\", \"playback\":\"\", \"videolength\":\"\"}");
    }
    localStorage.setItem("lectures", JSON.stringify(lecturesJSON));
}

if (watching === 1) title = document.getElementsByClassName("open")[0].getElementsByTagName("a")[0].textContent;

let episode, timestamp, length, percent, totalSeconds;

for (let i = 0; i < episodes.length / 2; i++) {
    episode = episodes[i].getElementsByTagName("a")[0];
    title = title.replace(" & ", " &amp; ");
    title = title.replace(" + ", " &plus; ");
    title = title.replace(" = ", " &equals; ");
    if (typeof lecturesJSON[title][episode.innerHTML] === "undefined") {
        lecturesJSON[title][episode.innerHTML] = JSON.parse("{\"hasCompleted\":false, \"timestamp\":\"\", \"playback\":\"\", \"videolength\":\"\"}");
        localStorage.setItem("lectures", JSON.stringify(lecturesJSON));
    } else if(typeof lecturesJSON[title][episode.innerHTML].playback === "undefined"){
        lecturesJSON[title][episode.innerHTML].playback = "";
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
    document.getElementsByClassName('vjs-playback-rate vjs-menu-button vjs-control')[0].setAttribute("onclick", "handleClick(this)");

    let interval = setInterval(function () {
        if (video.readyState > 0) {
            let speedsettings = document.getElementsByClassName("vjs-menu-content")[0];
            let speeds = speedsettings.getElementsByClassName('vjs-menu-item');

            for(var i = 0; i < speeds.length; i++){
                speeds[i].style.display = 'none';
            }

            speedsettings.insertAdjacentHTML("afterbegin", '<li class="vjs-menu-item-new" onclick="selectSpeed(this)" role="button" aria-live="polite" tabindex="0" aria-selected="false">0.5x</li>');
            speedsettings.insertAdjacentHTML("afterbegin", '<li class="vjs-menu-item-new" onclick="selectSpeed(this)" role="button" aria-live="polite" tabindex="0" aria-selected="false">0.75x</li>');
            speedsettings.insertAdjacentHTML("afterbegin", '<li class="vjs-menu-item-new" onclick="selectSpeed(this)" role="button" aria-live="polite" tabindex="0" aria-selected="false">1x</li>');
            speedsettings.insertAdjacentHTML("afterbegin", '<li class="vjs-menu-item-new" onclick="selectSpeed(this)" role="button" aria-live="polite" tabindex="0" aria-selected="false">1.25x</li>');
            speedsettings.insertAdjacentHTML("afterbegin", '<li class="vjs-menu-item-new" onclick="selectSpeed(this)" role="button" aria-live="polite" tabindex="0" aria-selected="false">1.5x</li>');
            speedsettings.insertAdjacentHTML("afterbegin", '<li class="vjs-menu-item-new" onclick="selectSpeed(this)" role="button" aria-live="polite" tabindex="0" aria-selected="false">1.75x</li>');
            speedsettings.insertAdjacentHTML("afterbegin", '<li class="vjs-menu-item-new" onclick="selectSpeed(this)" role="button" aria-live="polite" tabindex="0" aria-selected="false">2x</li>');
            speedsettings.insertAdjacentHTML("afterbegin", '<li class="vjs-menu-item-new" onclick="selectSpeed(this)" role="button" aria-live="polite" tabindex="0" aria-selected="false">2.25x</li>');
            speedsettings.insertAdjacentHTML("afterbegin", '<li class="vjs-menu-item-new" onclick="selectSpeed(this)" role="button" aria-live="polite" tabindex="0" aria-selected="false">2.5x</li>');
            speedsettings.insertAdjacentHTML("afterbegin", '<li class="vjs-menu-item-new" onclick="selectSpeed(this)" role="button" aria-live="polite" tabindex="0" aria-selected="false">2.75x</li>');
            speedsettings.insertAdjacentHTML("afterbegin", '<li class="vjs-menu-item-new" onclick="selectSpeed(this)" role="button" aria-live="polite" tabindex="0" aria-selected="false">3x</li>');

            let speed = lecturesJSON[title][episode].playback;

            if(typeof lecturesJSON[title][episode].playback !== "undefined") {
                video.playbackRate = speed.substring(0, speed.length - 1);
            }
            lecturesJSON[title][episode].videolength = video.duration;
            localStorage.setItem("lectures", JSON.stringify(lecturesJSON));
            if (lecturesJSON[title][episode].timestamp)
                video.currentTime = lecturesJSON[title][episode].timestamp;
            clearInterval(interval);
        }
    }, 200);

    video.ontimeupdate = function () {
        lecturesJSON[title][episode].timestamp = video.currentTime;
        lecturesJSON[title][episode].playback = document.getElementsByClassName("vjs-playback-rate-value")[0].textContent;
        if (video.currentTime / lecturesJSON[title][episode].videolength > 0.95) {
            lecturesJSON[title][episode].hasCompleted = true;
        }
        localStorage.setItem("lectures", JSON.stringify(lecturesJSON));
    };
}

function handleClick(){
    let speed_now = document.getElementsByClassName("vjs-playback-rate-value")[0].textContent;
    let index = 10 - speed_settings.indexOf(speed_now);

    if(speed_now === "2x"){
        selectSpeed(document.getElementsByClassName("vjs-menu-item-new")[3]);
    }else if(index > 0){
        selectSpeed(document.getElementsByClassName("vjs-menu-item-new")[index - 1]);
    }else{
        selectSpeed(document.getElementsByClassName("vjs-menu-item-new")[10]);
    }
}

function selectSpeed(speed){
    let parent = document.getElementsByClassName("vjs-menu-content")[0];
    let selected = parent.getElementsByClassName("vjs-selected")[0];

    if(typeof selected !== "undefined") {
        selected.setAttribute("aria-selected", false);
        selected.classList.remove("vjs-selected");
    }

    speed.setAttribute("aria-selected", true);
    speed.classList.add("vjs-selected");

    let video = document.getElementById("video_html5_api");
    video.playbackRate = speed.textContent.substring(0, speed.textContent.length - 1);
}
