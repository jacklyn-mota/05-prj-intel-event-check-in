// ===== VARIABLES =====

// Goal
let maxGoal = 50;

//Load saved data OR start at 0
let totalCount = localStorage.getItem("totalCount")
  ? parseInt(localStorage.getItem("totalCount"))
  : 0;

let teamCounts = localStorage.getItem("teamCounts")
  ? JSON.parse(localStorage.getItem("teamCounts"))
  : { water: 0, zero: 0, power: 0 };

let attendees = localStorage.getItem("attendees")
  ? JSON.parse(localStorage.getItem("attendees"))
  : [];

// ===== GET ELEMENTS =====

const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const greeting = document.getElementById("greeting");
const totalDisplay = document.getElementById("attendeeCount");

const waterDisplay = document.getElementById("waterCount");
const zeroDisplay = document.getElementById("zeroCount");
const powerDisplay = document.getElementById("powerCount");

const progressBar = document.getElementById("progressBar");
const celebrationMessage = document.getElementById("celebrationMessage");
const attendeeList = document.getElementById("attendeeList");

// ===== INITIAL PAGE LOAD UPDATE =====

updateDisplay();
renderAttendees();

// ===== FORM SUBMIT LISTENER =====

form.addEventListener("submit", function (event) {
  event.preventDefault(); // stop page reload

  // Get values
  let name = nameInput.value.trim();
  let team = teamSelect.value;

  if (name === "" || team === "") return;

  // Increment total
  totalCount++;

  // Increment correct team
  teamCounts[team]++;

  // Add to attendee list
  attendees.push({ name: name, team: team });

  // Save to localStorage
  localStorage.setItem("totalCount", totalCount);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));

  // Update UI
  updateDisplay();
  renderAttendees();

  // Show greeting
  showGreeting(name, team);

  // Reset form
  form.reset();
});

// ===== FUNCTIONS =====

function updateDisplay() {
  // Update total count
  totalDisplay.textContent = totalCount;

  // Update team counts
  waterDisplay.textContent = teamCounts.water;
  zeroDisplay.textContent = teamCounts.zero;
  powerDisplay.textContent = teamCounts.power;

  // Update progress bar
  let percentage = (totalCount / maxGoal) * 100;
  progressBar.style.width = percentage + "%";

  // Check for celebration
  if (totalCount >= maxGoal) {
    showCelebration();
  }

  function showCelebration() {
    let winningTeam = getWinningTeam();

    celebrationMessage.textContent =
      "🎉 Goal reached! Winning team: " + winningTeam + "!";
    celebrationMessage.style.display = "block";

    // Add confetti!
    confetti();
  }
}

function showGreeting(name, team) {
  let teamName = getTeamFullName(team);

  greeting.textContent = "Welcome " + name + "!  You joined " + teamName + "!";
  greeting.classList.add("success-message");
  greeting.style.display = "block";
}

function getTeamFullName(team) {
  if (team === "water") return "Team Water Wise";
  if (team === "zero") return "Team Net Zero";
  if (team === "power") return "Team Renewables";
}

function renderAttendees() {
  attendeeList.innerHTML = "";

  attendees.forEach(function (person) {
    let li = document.createElement("li");
    li.textContent = person.name + " - " + getTeamFullName(person.team);
    attendeeList.appendChild(li);
  });
}

function showCelebration() {
  let winningTeam = getWinningTeam();

  celebrationMessage.textContent =
    "🎉 Goal reached! Winning team: " + winningTeam + "!";
  celebrationMessage.style.display = "block";

  confetti();
}

function getWinningTeam() {
  if (
    teamCounts.water >= teamCounts.zero &&
    teamCounts.water >= teamCounts.power
  ) {
    return "Team Water Wise";
  }
  if (
    teamCounts.zero >= teamCounts.water &&
    teamCounts.zero >= teamCounts.power
  ) {
    return "Team Net Zero";
  }
  return "Team Renewables";
}
