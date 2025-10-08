// Elements
const paperSelect = document.getElementById("paperSelect");
const topicContainer = document.getElementById("topicContainer");
const subtopicContainer = document.getElementById("subtopicContainer");
const mcqContainer = document.getElementById("mcqContainer");
const status = document.getElementById("status");

let currentData = null;

// Fetch data for selected paper
async function loadData(paper) {
  try {
    status.innerText = "Loading questions…";
    const res = await fetch(`/api/${paper}`);
    if (!res.ok) throw new Error("Failed to fetch data");
    currentData = await res.json();
    showTopics();
    status.innerText = "";
  } catch (e) {
    status.innerText = "Error loading questions: " + e.message;
  }
}

// Show list of topics
function showTopics() {
  topicContainer.innerHTML = "";
  subtopicContainer.innerHTML = "";
  mcqContainer.innerHTML = "";

  if (!currentData || !currentData.topics) return;

  currentData.topics.forEach((topic) => {
    const btn = document.createElement("button");
    btn.innerText = topic.name;
    btn.onclick = () => showSubtopics(topic);
    topicContainer.appendChild(btn);
  });
}

// Show subtopics of a topic
function showSubtopics(topic) {
  subtopicContainer.innerHTML = "";
  mcqContainer.innerHTML = "";

  topic.subtopics.forEach((sub) => {
    const btn = document.createElement("button");
    btn.innerText = sub.name;
    btn.onclick = () => showMCQs(sub);
    subtopicContainer.appendChild(btn);
  });
}

// Show MCQs of a subtopic
function showMCQs(subtopic) {
  mcqContainer.innerHTML = "";

  subtopic.mcqs.forEach((mcq, index) => {
    const qDiv = document.createElement("div");
    qDiv.className = "mcq";

    const question = document.createElement("p");
    question.innerText = `${index + 1}. ${mcq.q}`;
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

// Paper selection handler
paperSelect.addEventListener("change", (e) => {
  const paper = e.target.value;
  if (paper) loadData(paper);
});

// Initial load: optional, load Paper 1 by default
loadData("paper1");
