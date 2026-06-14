// =========================
// FITNESS DASHBOARD SCRIPT
// =========================

const form = document.getElementById("fitnessForm");

if (form) {

    let entries = JSON.parse(localStorage.getItem("fitnessEntries")) || [];

    // =========================
    // CHARTS
    // =========================

    const weightChart = new Chart(
        document.getElementById("weightChart"),
        {
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    label: "Weight (kg)",
                    data: [],
                    borderWidth: 3,
                    tension: 0.3
                }]
            }
        }
    );

    const calorieChart = new Chart(
        document.getElementById("calorieChart"),
        {
            type: "bar",
            data: {
                labels: [],
                datasets: [{
                    label: "Calories",
                    data: []
                }]
            }
        }
    );

    const exerciseChart = new Chart(
        document.getElementById("exerciseChart"),
        {
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    label: "Exercise Minutes",
                    data: [],
                    borderWidth: 3,
                    tension: 0.3
                }]
            }
        }
    );

    const goalChart = new Chart(
        document.getElementById("goalChart"),
        {
            type: "doughnut",
            data: {
                labels: ["Completed", "Remaining"],
                datasets: [{
                    data: [0, 100]
                }]
            }
        }
    );

    // =========================
    // LOAD DATA
    // =========================

    loadDashboard();

    // =========================
    // FORM SUBMIT
    // =========================

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const today = new Date().toLocaleDateString();

        const data = {

            date: today,

            name: document.getElementById("name").value,
            age: Number(document.getElementById("age").value),
            gender: document.getElementById("gender").value,

            height: Number(document.getElementById("height").value),
            weight: Number(document.getElementById("weight").value),
            goalWeight: Number(document.getElementById("goalWeight").value),

            calories: Number(document.getElementById("calories").value),
            exercise: Number(document.getElementById("exercise").value),

            steps: Number(document.getElementById("steps").value),
            water: Number(document.getElementById("water").value),
            sleep: Number(document.getElementById("sleep").value),

            goal: document.getElementById("goal").value
        };

        entries.push(data);

        localStorage.setItem(
            "fitnessEntries",
            JSON.stringify(entries)
        );

        loadDashboard();

        form.reset();

        alert("Fitness entry saved successfully!");
    });

    // =========================
    // MAIN FUNCTION
    // =========================

    function loadDashboard() {

        if (entries.length === 0) return;

        const latest = entries[entries.length - 1];

        // BMI

        const bmi =
            latest.weight /
            Math.pow(latest.height / 100, 2);

        let bmiStatus = "";

        if (bmi < 18.5) {
            bmiStatus = "Underweight";
        }
        else if (bmi < 25) {
            bmiStatus = "Normal";
        }
        else if (bmi < 30) {
            bmiStatus = "Overweight";
        }
        else {
            bmiStatus = "Obese";
        }

        document.getElementById("bmiValue").textContent =
            bmi.toFixed(1);

        document.getElementById("bmiStatus").textContent =
            bmiStatus;

        // =========================
        // FITNESS SCORE
        // =========================

        let score = 0;

        if (latest.exercise >= 60) score += 30;
        else if (latest.exercise >= 30) score += 20;
        else score += 10;

        if (latest.water >= 3) score += 20;
        else if (latest.water >= 2) score += 15;
        else score += 5;

        if (latest.sleep >= 8) score += 20;
        else if (latest.sleep >= 6) score += 15;
        else score += 5;

        if (latest.steps >= 10000) score += 30;
        else if (latest.steps >= 7000) score += 20;
        else score += 10;

        document.getElementById(
            "fitnessScore"
        ).textContent = `${score} / 100`;

        // =========================
        // GOAL PROGRESS
        // =========================

        const firstWeight = entries[0].weight;

        let progress = 0;

        if (latest.goal === "Weight Loss") {

            progress =
                ((firstWeight - latest.weight) /
                    (firstWeight - latest.goalWeight)) * 100;

        } else if (latest.goal === "Weight Gain") {

            progress =
                ((latest.weight - firstWeight) /
                    (latest.goalWeight - firstWeight)) * 100;

        } else {

            progress = score;
        }

        if (!isFinite(progress)) progress = 0;

        progress = Math.max(
            0,
            Math.min(100, progress)
        );

        document.getElementById(
            "goalProgress"
        ).textContent =
            progress.toFixed(0) + "%";

        // =========================
        // REPORT
        // =========================

        document.getElementById(
            "reportName"
        ).textContent = latest.name;

        document.getElementById(
            "reportWeight"
        ).textContent = latest.weight + " kg";

        document.getElementById(
            "reportGoalWeight"
        ).textContent =
            latest.goalWeight + " kg";

        document.getElementById(
            "reportCalories"
        ).textContent =
            latest.calories + " kcal";

        document.getElementById(
            "reportExercise"
        ).textContent =
            latest.exercise + " min";

        document.getElementById(
            "reportSteps"
        ).textContent =
            latest.steps;

        document.getElementById(
            "reportWater"
        ).textContent =
            latest.water + " L";

        document.getElementById(
            "reportSleep"
        ).textContent =
            latest.sleep + " hrs";

        // =========================
        // SUGGESTIONS
        // =========================

        let suggestion = "";

        if (latest.water < 2) {

            suggestion =
                "Increase your daily water intake.";

        } else if (latest.sleep < 6) {

            suggestion =
                "Try getting more sleep for better recovery.";

        } else if (latest.exercise < 30) {

            suggestion =
                "Increase workout duration for better results.";

        } else if (score >= 80) {

            suggestion =
                "Excellent progress! Keep following your routine.";

        } else {

            suggestion =
                "You are progressing steadily. Stay consistent.";
        }

        document.getElementById(
            "suggestionText"
        ).textContent = suggestion;

        // =========================
        // HISTORY TABLE
        // =========================

        const historyBody =
            document.getElementById("historyBody");

        historyBody.innerHTML = "";

        entries.forEach(entry => {

            historyBody.innerHTML += `
                <tr>
                    <td>${entry.date}</td>
                    <td>${entry.weight}</td>
                    <td>${entry.calories}</td>
                    <td>${entry.exercise}</td>
                    <td>${entry.steps}</td>
                </tr>
            `;
        });

        // =========================
        // CHART DATA
        // =========================

        const labels =
            entries.map(item => item.date);

        weightChart.data.labels = labels;
        weightChart.data.datasets[0].data =
            entries.map(item => item.weight);
        weightChart.update();

        calorieChart.data.labels = labels;
        calorieChart.data.datasets[0].data =
            entries.map(item => item.calories);
        calorieChart.update();

        exerciseChart.data.labels = labels;
        exerciseChart.data.datasets[0].data =
            entries.map(item => item.exercise);
        exerciseChart.update();

        goalChart.data.datasets[0].data = [
            progress.toFixed(0),
            100 - progress.toFixed(0)
        ];

        goalChart.update();
    }
}