let currentData = null;

async function loadPaper(paper) {
  try {
    const res = await fetch(`/api/${paper}`);
    const data = await res.json();
    currentData = data;
    renderTopics(data.topics);
  } catch (e) {
    document.getElementById("content").textContent = "Error loading data: " + e.message;
  }
}

function renderTopics(topics) {
  const container = document.getElementById("content");
  container.innerHTML = "";
  topics.forEach(topic => {
    const btn = document.createElement("button");
    btn.textContent = topic.name;
    btn.onclick = () => renderSubtopics(topic.subtopics);
    container.appendChild(btn);
  });
}

function renderSubtopics(subtopics) {
  const container = document.getElementById("content");
  container.innerHTML = "";
  subtopics.forEach(sub => {
    const btn = document.createElement("button");
    btn.textContent = sub.name;
    btn.onclick = () => renderMCQs(sub.mcqs);
    container.appendChild(btn);
  });
}

function renderMCQs(mcqs) {
  const container = document.getElementById("content");
  container.innerHTML = "";

  mcqs.forEach(mcq => {
    const qDiv = document.createElement("div");
    qDiv.classList.add("mcq");

    const qText = document.createElement("p");
    qText.textContent = mcq.q;
    qDiv.appendChild(qText);

    // Shuffle options
    const shuffled = mcq.options
      .map((opt, i) => ({ opt, index: i }))
      .sort(() => Math.random() - 0.5);

    shuffled.forEach(({ opt, index }) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.onclick = () => {
        btn.style.backgroundColor = index === mcq.answer ? "green" : "red";
      };
      qDiv.appendChild(btn);
    });

    container.appendChild(qDiv);
  });
}

document.getElementById("paper1Btn").onclick = () => loadPaper("paper1");
document.getElementById("paper2Btn").onclick = () => loadPaper("paper2");
