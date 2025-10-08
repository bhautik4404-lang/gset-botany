const paperSelect = document.getElementById("paperSelect");
const searchInput = document.getElementById("searchInput");
const topicContainer = document.getElementById("topicContainer");
const subtopicContainer = document.getElementById("subtopicContainer");
const mcqContainer = document.getElementById("mcqContainer");
const status = document.getElementById("status");

let currentData = null;
let filteredTopics = [];

// Load JSON data for selected paper
async function loadData(paper) {
  try {
    status.innerText = "Loading questions…";
    const res = await fetch(`/api/${paper}`);
    if (!res.ok) throw new Error("Failed to fetch data");
    currentData = await res.json();
    filteredTopics = currentData.topics;
    showTopics();
    status.innerText = "";
  } catch (e) {
    status.innerText = "Error loading questions: " + e.message;
  }
}

// Show topics
function showTopics() {
  topicContainer.innerHTML = "";
  subtopicContainer.innerHTML = "";
  mcqContainer.innerHTML = "";

  filteredTopics.forEach(topic => {
    const btn = document.createElement("button");
    btn.innerText = topic.name;
    btn.onclick = () => showSubtopics(topic);
    topicContainer.appendChild(btn);
  });
}

// Show subtopics
function showSubtopics(topic) {
  subtopicContainer.innerHTML = "";
  mcqContainer.innerHTML = "";

  topic.subtopics.forEach(sub => {
    const btn = document.createElement("button");
    btn.innerText = sub.name;
    btn.onclick = () => showMCQs(sub);
    subtopicContainer.appendChild(btn);
  });
}

// Show MCQs
function showMCQs(subtopic) {
  mcqContainer.innerHTML = "";

  subtopic.mcqs.forEach((mcq, idx) => {
    const qDiv = document.createElement("div");
    qDiv.className = "mcq";

    const question = document.createElement("p");
    question.innerText = `${idx + 1}. ${mcq.q}`;
    qDiv.appendChild(question);

    mcq.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.onclick = () => {
        alert(
          i === mcq.answer
            ? "Correct!\n" + mcq.explanation
            : "Wrong!\n" + mcq.explanation
        );
      };
      qDiv.appendChild(btn);
    });

    mcqContainer.appendChild(qDiv);
  });
}

// Search topics/subtopics
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  filteredTopics = currentData.topics.filter(topic =>
    topic.name.toLowerCase().includes(term) ||
    topic.subtopics.some(sub => sub.name.toLowerCase().includes(term))
  );
  showTopics();
});

// Paper selection
paperSelect.addEventListener("change", e => loadData(e.target.value));

// Load default paper
loadData("paper2");
