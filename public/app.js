// paper 1
const contentDiv = document.getElementById("content");

async function loadData() {
  const res = await fetch("https://raw.githubusercontent.com/bhautik4404-lang/gset-botany/main/data.json?" + Date.now());
  const data = await res.json();
  allData = data;
  showTopics(data);
}

// Show all topics
function showTopics(data) {
  contentDiv.innerHTML = "<h2>Select a Topic</h2>";
  data.forEach(topic => {
    const btn = document.createElement("button");
    btn.textContent = topic.topic;
    btn.onclick = () => showSubtopics(topic);
    btn.style.display = "block";
    btn.style.margin = "10px 0";
    contentDiv.appendChild(btn);
  });
}

// Show subtopics
function showSubtopics(topic) {
  contentDiv.innerHTML = `<h2>${topic.topic} → Select Subtopic</h2>`;
  topic.subtopics.forEach(sub => {
    const btn = document.createElement("button");
    btn.textContent = sub.subtopic;
    btn.onclick = () => showMCQs(sub);
    btn.style.display = "block";
    btn.style.margin = "10px 0";
    contentDiv.appendChild(btn);
  });

  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back to Topics";
  backBtn.onclick = () => showTopics(allData);
  backBtn.style.marginTop = "20px";
  contentDiv.appendChild(backBtn);
}

// Show MCQs with interactive answers
function showMCQs(subtopic) {
  contentDiv.innerHTML = `<h2>${subtopic.subtopic} → MCQs</h2>`;

  subtopic.mcqs.forEach((q, i) => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.padding = "10px";
    div.style.marginBottom = "10px";

    const questionHTML = document.createElement("div");
    questionHTML.innerHTML = `<strong>Q${i + 1}: ${q.question}</strong>`;
    div.appendChild(questionHTML);

    q.options.forEach(opt => {
      const optBtn = document.createElement("button");
      optBtn.textContent = opt;
      optBtn.style.margin = "5px";
      optBtn.onclick = () => {
        if (opt === q.answer) {
          optBtn.style.backgroundColor = "#2ecc71"; // green for correct
          optBtn.style.color = "white";
        } else {
          optBtn.style.backgroundColor = "#e74c3c"; // red for wrong
          optBtn.style.color = "white";
        }

        // Disable all buttons after selection
        Array.from(div.querySelectorAll("button")).forEach(b => b.disabled = true);
      };
      div.appendChild(optBtn);
    });

    contentDiv.appendChild(div);
  });

  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back to Subtopics";
  backBtn.onclick = () => showSubtopics(findTopicForSub(subtopic));
  backBtn.style.marginTop = "20px";
  contentDiv.appendChild(backBtn);
}

// Helper to find parent topic for a subtopic
function findTopicForSub(sub) {
  return allData.find(topic => topic.subtopics.includes(sub));
}

let allData = [];
loadData().then(data => allData = data);

// paper 2
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
