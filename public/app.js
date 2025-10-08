const contentDiv = document.getElementById("content");
let allData = []; // Array of topics

// Utility function to shuffle an array
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Fetch JSON from GitHub and initialize app
async function loadData() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/bhautik4404-lang/gset-botany/main/data.json?" + Date.now()
    );
    if (!res.ok) throw new Error("Failed to fetch data.json");

    const data = await res.json();
    allData = data.topics; // JSON has "topics" array
    showTopics(allData);
  } catch (err) {
    contentDiv.innerHTML = `<p style="color:red;">Error loading questions: ${err.message}</p>`;
    console.error(err);
  }
}

// Show all topics
function showTopics(data) {
  contentDiv.innerHTML = "<h2>Select a Topic</h2>";
  data.forEach(topic => {
    const btn = document.createElement("button");
    btn.textContent = topic.name; // JSON key "name"
    btn.style.display = "block";
    btn.style.margin = "10px 0";
    btn.onclick = () => showSubtopics(topic);
    contentDiv.appendChild(btn);
  });
}

// Show subtopics for a topic
function showSubtopics(topic) {
  contentDiv.innerHTML = `<h2>${topic.name} → Select Subtopic</h2>`;
  topic.subtopics.forEach(sub => {
    const btn = document.createElement("button");
    btn.textContent = sub.name; // JSON key "name"
    btn.style.display = "block";
    btn.style.margin = "10px 0";
    btn.onclick = () => showMCQs(sub);
    contentDiv.appendChild(btn);
  });

  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back to Topics";
  backBtn.style.marginTop = "20px";
  backBtn.onclick = () => showTopics(allData);
  contentDiv.appendChild(backBtn);
}

// Show MCQs for a subtopic
function showMCQs(subtopic) {
  let score = 0;
  let answered = 0;
  const total = subtopic.mcqs.length;

  // **Shuffle answers for all MCQs first**
  subtopic.mcqs.forEach(qObj => {
    const correctAnswerText = qObj.options[qObj.answer];
    qObj.options = shuffleArray([...qObj.options]);
    qObj.answer = qObj.options.indexOf(correctAnswerText);
  });

  contentDiv.innerHTML = `<h2>${subtopic.name} → MCQs</h2>`;

  // Score display
  const scoreDisplay = document.createElement("div");
  scoreDisplay.style.margin = "15px 0";
  scoreDisplay.style.fontWeight = "bold";
  scoreDisplay.textContent = `Score: 0 / ${total}`;
  contentDiv.appendChild(scoreDisplay);

  subtopic.mcqs.forEach((qObj, i) => {
    const div = document.createElement("div");
    div.className = "mcq-container";
    div.style.border = "1px solid #ccc";
    div.style.padding = "10px";
    div.style.marginBottom = "10px";

    const questionHTML = document.createElement("div");
    questionHTML.innerHTML = `<strong>Q${i + 1}: ${qObj.q}</strong>`;
    div.appendChild(questionHTML);

    qObj.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.style.margin = "5px";

      btn.onclick = () => {
        if (index === qObj.answer) {
          btn.style.backgroundColor = "#2ecc71"; // green
          btn.style.color = "white";
          score++;
        } else {
          btn.style.backgroundColor = "#e74c3c"; // red
          btn.style.color = "white";
        }

        // Disable all options
        Array.from(div.querySelectorAll("button")).forEach(b => b.disabled = true);

        answered++;
        scoreDisplay.textContent = `Score: ${score} / ${total}`;

        // Show final summary when done
        if (answered === total) {
          showFinalSummary(subtopic.name, score, total);
        }
      };

      div.appendChild(btn);
    });

    contentDiv.appendChild(div);
  });

  // Back button to subtopics
  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back to Subtopics";
  backBtn.style.marginTop = "20px";
  backBtn.onclick = () => showSubtopics(findTopicForSub(subtopic));
  contentDiv.appendChild(backBtn);
}

// Final summary function
function showFinalSummary(subtopicName, score, total) {
  contentDiv.innerHTML = `
    <h2>${subtopicName} — Result</h2>
    <p style="font-size:18px; font-weight:bold;">You scored ${score} / ${total}</p>
  `;

  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back to Subtopics";
  backBtn.onclick = () => {
    const subtopic = allData
      .flatMap(t => t.subtopics)
      .find(s => s.name === subtopicName);
    showSubtopics(findTopicForSub(subtopic));
  };
  contentDiv.appendChild(backBtn);
}

// Helper: find parent topic of subtopic
function findTopicForSub(sub) {
  return allData.find(topic => topic.subtopics.includes(sub));
}

// Initialize app
loadData();
