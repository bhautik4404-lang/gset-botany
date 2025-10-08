const contentDiv = document.getElementById("content");

let allData = []; // will store the topics array

async function loadData() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/bhautik4404-lang/gset-botany/main/data.json?" + Date.now()
    );
    if (!res.ok) throw new Error("Failed to fetch data.json");

    const data = await res.json();
    allData = data.topics; // your JSON has a 'topics' property
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
    btn.textContent = topic.name; // JSON key: name
    btn.style.display = "block";
    btn.style.margin = "10px 0";
    btn.onclick = () => showSubtopics(topic);
    contentDiv.appendChild(btn);
  });
}

// Show subtopics
function showSubtopics(topic) {
  contentDiv.innerHTML = `<h2>${topic.name} → Select Subtopic</h2>`;

  topic.subtopics.forEach(sub => {
    const btn = document.createElement("button");
    btn.textContent = sub.name; // JSON key: name
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

// Show MCQs for selected subtopic
function showMCQs(subtopic) {
  let score = 0;
  contentDiv.innerHTML = `<h2>${subtopic.name} → MCQs</h2>`;

  // Score display
  const scoreDisplay = document.createElement("div");
  scoreDisplay.style.margin = "15px 0";
  scoreDisplay.style.fontWeight = "bold";
  scoreDisplay.textContent = `Score: 0 / ${subtopic.mcqs.length}`;
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
      const optBtn = document.createElement("button");
      optBtn.textContent = opt;
      optBtn.style.margin = "5px";

      optBtn.onclick = () => {
        if (index === qObj.answer) {
          optBtn.style.backgroundColor = "#2ecc71"; // green for correct
          optBtn.style.color = "white";
          score++;
        } else {
          optBtn.style.backgroundColor = "#e74c3c"; // red for wrong
          optBtn.style.color = "white";
        }

        // Disable all options after selection
        Array.from(div.querySelectorAll("button")).forEach(b => b.disabled = true);

        // Update score display
        scoreDisplay.textContent = `Score: ${score} / ${subtopic.mcqs.length}`;
      };

      div.appendChild(optBtn);
    });

    contentDiv.appendChild(div);
  });

  // Back button
  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back to Subtopics";
  backBtn.style.marginTop = "20px";
  backBtn.onclick = () => showSubtopics(findTopicForSub(subtopic));
  contentDiv.appendChild(backBtn);
}

// Helper to find parent topic for a given subtopic
function findTopicForSub(sub) {
  return allData.find(topic => topic.subtopics.includes(sub));
}

// Initialize
loadData();
