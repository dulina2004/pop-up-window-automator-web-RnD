let popupWindow = null;
let failsafe = false;
let totalCycles = 0;
let timerInterval = null;

function updateTimer(remainingTime) {
    document.getElementById("timeRemaining").textContent = remainingTime + "s";
}

function startTimer(duration) {
    let timeLeft = duration;
    updateTimer(timeLeft);

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer(timeLeft);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
}

async function open0() {
    const counts = parseInt(document.getElementById("counts").value) || 0;
    const duration = parseInt(document.getElementById("duration").value) || 3;

    document.getElementById("cycleStatus").textContent = "Running";
    document.getElementById("totalCount").textContent = totalCycles;

    for (let i = 1; i <= counts; i++) {
        if (failsafe) {
            break;
        }

        openPopup();

        // Update progress
        document.getElementById("currentCount").textContent = i;
        document.getElementById("progressBar").style.width =
            (i / counts) * 100 + "%";

        // Start timer
        startTimer(duration);
        await new Promise((resolve) => setTimeout(resolve, duration * 1000));

        closePopup();

        if (failsafe) {
            popupWindow = null;
            failsafe = false;
            document.getElementById("cycleStatus").textContent = "Stopped";
            break;
        }

        totalCycles++;
        document.getElementById("totalCount").textContent = totalCycles;

        // delay between cycles
        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (!failsafe) {
        document.getElementById("cycleStatus").textContent = "Completed";
    }

    // Reset timer
    setTimeout(() => {
        document.getElementById("currentCount").textContent = "0";
        document.getElementById("progressBar").style.width = "0%";
        document.getElementById("timeRemaining").textContent = "0s";
        if (timerInterval) {
            clearInterval(timerInterval);
        }
    }, 1500);
}

function close0() {
    failsafe = true;
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    document.getElementById("cycleStatus").textContent = "Stopping...";
    document.getElementById("timeRemaining").textContent = "0s";
}

function openPopup() {
    const url = document.getElementById("urlInput").value;
    if (!url) {
        alert("Please enter a URL");
        return;
    }

    if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
    }

    popupWindow = window.open(url, "popupWindow", "width=800,height=600");

    if (popupWindow) {
        document.getElementById("status").textContent =
            "Window opened successfully";
        document.getElementById("status").style.backgroundColor =
            "rgba(61, 90, 254, 0.2)";
    } else {
        document.getElementById("status").textContent =
            "Pop-up blocked! Please allow pop-ups for this site.";
        document.getElementById("status").style.backgroundColor =
            "rgba(255, 64, 129, 0.2)";
    }
}

function closePopup() {
    if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
        document.getElementById("status").textContent =
            "Window closed successfully";
        document.getElementById("status").style.backgroundColor =
            "rgba(61, 90, 254, 0.2)";
    } else {
        document.getElementById("status").textContent = "No window to close";
        document.getElementById("status").style.backgroundColor =
            "rgba(255, 193, 7, 0.2)";
    }
    popupWindow = null;
}

window.onbeforeunload = function () {
    if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
    }
    if (timerInterval) {
        clearInterval(timerInterval);
    }
};
