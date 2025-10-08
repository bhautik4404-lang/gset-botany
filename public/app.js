const contentDiv = document.getElementById("content");

let allData = []; // Array of topics

// Fetch JSON and initialize app
async function loadData() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/bhautik4404-lang/gset-botany/main/data.json?" + Date.now()
    );
    if (!res.ok) throw new Error("Failed to fetch data.json");

    const data = await res.json();
    allData = data.topics; // JSON has a 'topics' property
    showTopics(allData);

  } catch (err) {
    contentDiv.innerHTML = `<p style="color:red;">Error loading questions: ${err.message}</p>`;
    console.error(err);
  }
}

// Display all topics
function showTopics(data) {
  contentDiv.innerHTML = "<h2>Select a Topic</h2>";

  data.forEach(topic => {
    const btn = document.createElement("button");
    btn.textContent = topic.name; // JSON key
    btn.style.display = "block";
    btn.style.margin = "10px 0";
    btn.onclick = () => showSubtopics(topic);
    contentDiv.appendChild(btn);
  });
}

// Display subtopics of a selected topic
function showSubtopics(topic) {
  contentDiv.innerHTML = `<h2>${topic.name} → Select Subto
