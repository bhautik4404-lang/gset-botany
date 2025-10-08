let data;
let currentTopic, currentSubtopic;
const content = document.getElementById("content");

// 🧭 Step 1: Show Paper selection
function showPapers() {
  content.innerHTML = `
    <h2>Select a Paper</h2>
    <div class="paper-buttons">
      <button onclick="loadData('data1.json', 'Paper 1')">Paper 1</button>
      <button onclick="loadData('data.json', 'Paper 2')">Paper 2</button>
    </div>
  `;
}

// 🧾 Step 2: Load data for selected paper
async function loadData(file, paperName) {
  try {
    content.innerHTML = `<p>Loading ${paperName}…</p>`;
    const response = await fetch(file + "?" + Date.now());
    data = await response.json();
    showTopics(paperName);
  } catch (e) {
    content.innerHTML = `<p style="color:red;">Error loading data.</p>`;
    console.error("Error loading:", e);
  }
}

// 🧩 Step 3: Show list of topics
function showTopics(paperName) {
  content.innerHTML = `<h2>${paperName} — Select a Topic</h2>`;

  // Search bar
  const searchDiv = document.createElement("div");
  searchDiv.innerHTML = `
    <input type="text" id="searchTopic" placeholder="Search Topic..." style="margin-bottom:10px; padding:5px; width:80%;">
  `;
  content.appendChild(searchDiv);

  const topicContainer = document.createElement("div");
  content.appendChild(topicContainer);

  function renderTopics(filter = "") {
    topicContainer.innerHTML = "";
    data.topics
      .filter(t => t.name.toLowerCase().includes(filter.toLowerCase()))
      .forEach(topic => {
        const btn = document.createElement("button");
        btn.textContent = topic.name;
        btn.onclick = () => showSubtopics(topic, paperName);
        topicContainer.appendChild(btn);
      });
  }

  document.getElementById("searchTopic").addEventListener("input", e => {
    renderTopics(e.target.value);
  });

  renderTopics();

  const back = document.createElement("button");
  back.textContent = "← Back to Papers";
  back.onclick = showPapers;
  content.appendChild(back);
}

// 📚 Step 4: Show subtopics
function showSubtopics(topic, paperName) {
  content.innerHTML = `<h2>${paperName} — ${topic.name}</h2>`;

  // Search bar
  const searchDiv = document.createElement("div");
  searchDiv.innerHTML = `
    <input type="text" id="searchSubtopic" placeholder="Search Subtopic..." style="margin-bottom:10px; padding:5px; width:80%;">
  `;
  content.appendChild(searchDiv);

  const subtopicContainer = document.createElement("div");
  content.appendChild(subtopicContainer);

  function renderSubtopics(filter = "") {
    subtopicContainer.innerHTML = "";
    topic.subtopics
      .filter(s => s.name.toLowerCase().includes(filter.toLowerCase()))
      .forEach(subtopic => {
        const btn = document.createElement("button");
        btn.textContent = subtopic.name;
        btn.onclick = () => showMCQs(subtopic, paperName, topic);
        subtopicContainer.appendChild(btn);
      });
  }

  document.getElementById("searchSubtopic").addEventListener("input", e => {
    renderSubtopics(e.target.value);
  });

  renderSubtopics();

  const back = document.createElement("button");
  back.textContent = "← Back to Topics";
  back.onclick = () => showTopics(paperName);
  content.appendChild(back);
}

// 🎯 Step 5: Show MCQs with explanation after answer selection
function showMCQs(subtopic, paperName, topic) {
  content.innerHTML = `<h2>${paperName} — ${topic.name} → ${subtopic.name}</h2>`;

  // Search bar
  const searchDiv = document.createElement("div");
  searchDiv.innerHTML = `
    <input type="text" id="searchMCQ" placeholder="Search question..." style="margin-bottom:10px; padding:5px; width:80%;">
  `;
  content.appendChild(searchDiv);

  const mcqContainer = document.createElement("div");
  content.appendChild(mcqContainer);

  function renderMCQs(filter = "") {
    mcqContainer.innerHTML = "";

    subtopic.mcqs
      .filter(mcq => mcq.q.toLowerCase().includes(filter.toLowerCase()))
      .forEach((mcq, index) => {
        const div = document.createElement("div");
        div.className = "mcq-container";

        const q = document.createElement("p");
        q.textContent = `${index + 1}. ${mcq.q}`;
        div.appendChild(q);

        // Shuffle options
        const shuffled = mcq.options
          .map((opt, i) => ({ opt, i }))
          .sort(() => Math.random() - 0.5);

        shuffled.forEach(obj => {
          const btn = document.createElement("button");
          btn.textContent = obj.opt;
          btn.onclick = () => {
            // Disable all buttons after selection
            div.querySelectorAll("button").forEach(b => (b.disabled = true));

            // Highlight answer
            btn.style.backgroundColor = obj.i === mcq.answer ? "lightgreen" : "salmon";

            // Show explanation
            const exp = document.createElement("p");
            exp.textContent = "Explanation: " + mcq.explanation;
            exp.style.fontStyle = "italic";
            exp.style.color = "#333";
            exp.style.marginTop = "5px";
            div.appendChild(exp);
          };
          div.appendChild(btn);
        });

        mcqContainer.appendChild(div);
      });
  }

  document.getElementById("searchMCQ").addEventListener("input", e => {
    renderMCQs(e.target.value);
  });

  renderMCQs();

  const back = document.createElement("button");
  back.textContent = "← Back to Subtopics";
  back.onclick = () => showSubtopics(topic, paperName);
  content.appendChild(back);
}

// 🏁 Start app
showPapers();
