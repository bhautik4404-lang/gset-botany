const contentDiv = document.getElementById("content");

async function loadData() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/bhautik4404-lang/gset-botany/main/data.json?" + Date.now()
    );
    if (!res.ok) throw new Error("Failed to fetch data.json");
    allData = await res.json();
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

// Show MCQs with interactive answers + score
function showMCQs(subtopic) {
  let score = 0;
  contentDiv.innerHTML = `<h2>${subtopic.subtopic} → MCQs</h2>`;

  const scoreDisplay = document.createElement("div");
  scoreDisplay.style.margin = "15px 0";
  scoreDisplay.style.fontWeight = "bold";
  scoreDisplay.textContent = `Score: 0 / ${subtopic.mcqs.length}`;
  contentDiv.appendChild(scoreDisplay);

  subtopic.mcqs.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "mcq-container";

    const questionHTML = document.createElement("div");
    questionHTML.innerHTML = `<strong>Q${i + 1}: ${q.question}</strong>`;
    div.appendChild(questionHTML);

    q.options.forEach(opt => {
      const optBtn = document.createElement("button");
      optBtn.textContent = opt;
      optBtn.style.margin = "5px";
      optBtn.onclick = () => {
        if (opt === q.answer) {
          optBtn.style.backgroundColor = "#2ecc71";
          optBtn.style.color = "white";
          score++;
        } else {
          optBtn.style.backgroundColor = "#e74c3c";
          optBtn.style.color = "white";
        }

        Array.from(div.querySelectorAll("button")).forEach(b => b.disabled = true);
        scoreDisplay.textContent = `Score: ${score} / ${subtopic.mcqs.length}`;
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

// Helper to find parent topic
function findTopicForSub(sub) {
  return allData.find(topic => topic.subtopics.includes(sub));
}

let allData = [];
loadData().then(data => allData = data);
