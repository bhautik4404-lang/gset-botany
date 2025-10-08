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
    btn.textContent = topic.name;
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
    btn.textContent = sub.name;
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

// Show MCQs for a subtopic with tags, search, and progress saving
function showMCQs(subtopic) {
  let score = 0;
  let answered = 0;

  // Load progress from localStorage
  const savedProgress = JSON.parse(localStorage.getItem(subtopic.id)) || {};

  // Shuffle answers for all MCQs
  subtopic.mcqs.forEach((qObj, i) => {
    const correctAnswerText = qObj.options[qObj.answer];
    qObj.options = shuffleArray([...qObj.options]);
    qObj.answer = qObj.options.indexOf(correctAnswerText);

    // Restore previous answer if exists
    if (savedProgress[i] !== undefined) {
      qObj.selected = savedProgress[i];
    }
  });

  contentDiv.innerHTML = `<h2>${subtopic.name} → MCQs</h2>`;

  // Score display
  const scoreDisplay = document.createElement("div");
  scoreDisplay.style.margin = "15px 0";
  scoreDisplay.style.fontWeight = "bold";
  scoreDisplay.textContent = `Score: ${Object.values(savedProgress).filter((sel, idx) => sel === subtopic.mcqs[idx]?.answer).length} / ${subtopic.mcqs.length}`;
  contentDiv.appendChild(scoreDisplay);

  // SEARCH BAR
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search questions...";
  searchInput.style.marginBottom = "10px";
  searchInput.style.width = "100%";
  searchInput.style.padding = "5px";
  contentDiv.appendChild(searchInput);

  // TAG BUTTONS
  const tagDiv = document.createElement("div");
  tagDiv.style.marginBottom = "10px";
  const allTags = Array.from(new Set(subtopic.mcqs.flatMap(q => q.tags || [])));

  const allBtn = document.createElement("button");
  allBtn.textContent = "All";
  allBtn.style.margin = "0 5px 5px 0";
  allBtn.onclick = () => displayMCQs(subtopic.mcqs);
  tagDiv.appendChild(allBtn);

  allTags.forEach(tag => {
    const btn = document.createElement("button");
    btn.textContent = tag;
    btn.style.margin = "0 5px 5px 0";
    btn.onclick = () => {
      const filteredMCQs = subtopic.mcqs.filter(q => q.tags.includes(tag));
      displayMCQs(filteredMCQs);
    };
    tagDiv.appendChild(btn);
  });

  contentDiv.appendChild(tagDiv);

  // Initial display: all MCQs
  displayMCQs(subtopic.mcqs);

  // Search input listener
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    const filtered = subtopic.mcqs.filter(q => q.q.toLowerCase().includes(keyword));
    displayMCQs(filtered);
  });

  function displayMCQs(mcqsToShow) {
    const existingMCQs = contentDiv.querySelectorAll(".mcq-container");
    existingMCQs.forEach(e => e.remove());

    mcqsToShow.forEach((qObj, i) => {
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

        // Restore previous answer colors if answered
        if (qObj.selected !== undefined) {
          btn.disabled = true;
          if (index === qObj.selected) {
            btn.style.backgroundColor = index === qObj.answer ? "#2ecc71" : "#e74c3c";
            btn.style.color = "white";
          }
        }

        btn.onclick = () => {
          qObj.selected = index;
          // Save progress
          const progress = JSON.parse(localStorage.getItem(subtopic.id)) || {};
          progress[i] = index;
          localStorage.setItem(subtopic.id, JSON.stringify(progress));

          if (index === qObj.answer) {
            btn.style.backgroundColor = "#2ecc71";
            btn.style.color = "white";
            score++;
          } else {
            btn.style.backgroundColor = "#e74c3c";
            btn.style.color = "white";
          }

          Array.from(div.querySelectorAll("button")).forEach(b => b.disabled = true);

          // Show explanation
          const explanationDiv = document.createElement("div");
          explanationDiv.style.marginTop = "5px";
          explanationDiv.style.fontStyle = "italic";
          explanationDiv.style.color = "#34495e";
          explanationDiv.textContent = "Explanation: " + qObj.explanation;
          div.appendChild(explanationDiv);

          answered++;
          scoreDisplay.textContent = `Score: ${Object.values(JSON.parse(localStorage.getItem(subtopic.id))).filter((sel, idx) => sel === subtopic.mcqs[idx]?.answer).length} / ${subtopic.mcqs.length}`;

          if (answered === subtopic.mcqs.length) {
            showFinalSummary(subtopic.name, score, subtopic.mcqs.length);
          }
        };

        div.appendChild(btn);
      });

      contentDiv.appendChild(div);
    });
  }

  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back to Subtopics";
  backBtn.style.marginTop = "20px";
  backBtn.onclick = () => showSubtopics(findTopicForSub(subtopic));
  contentDiv.appendChild(backBtn);
}

// Final summary
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

// Find parent topic
function findTopicForSub(sub) {
  return allData.find(topic => topic.subtopics.includes(sub));
}

// Initialize app
loadData();
