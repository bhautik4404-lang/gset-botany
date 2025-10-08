const paperSelect = document.getElementById("paper-select");
const searchInput = document.getElementById("search");
const container = document.getElementById("mcq-container");

let mcqs = [];
let currentPaper = "paper2";

async function loadMCQs(paper) {
  const res = await fetch(`/api/${paper}`);
  mcqs = await res.json();
  displayMCQs(mcqs);
}

function displayMCQs(data) {
  container.innerHTML = "";
  data.forEach((q, i) => {
    const qDiv = document.createElement("div");
    qDiv.classList.add("question");
    
    let options = shuffleOptions(q.options, q.answer);

    qDiv.innerHTML = `
      <p><b>${i+1}. ${q.question}</b></p>
      ${options.map((opt, idx) => `<button onclick="checkAnswer('${opt}', '${q.answer}', '${q.explanation}', this)">${opt}</button>`).join("")}
      <p class="explanation" style="display:none;"></p>
    `;
    container.appendChild(qDiv);
  });
}

function shuffleOptions(options, answer) {
  let opts = [...options];
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts;
}

function checkAnswer(selected, correct, explanation, btn) {
  const parent = btn.parentElement;
  const exp = parent.querySelector(".explanation");
  if (selected === correct) {
    btn.style.backgroundColor = "green";
  } else {
    btn.style.backgroundColor = "red";
  }
  exp.style.display = "block";
  exp.textContent = "Explanation: " + explanation;
}

// Event listeners
paperSelect.addEventListener("change", () => {
  currentPaper = paperSelect.value;
  loadMCQs(currentPaper);
});

searchInput.addEventListener("input", () => {
  const filtered = mcqs.filter(q => q.question.toLowerCase().includes(searchInput.value.toLowerCase()));
  displayMCQs(filtered);
});

// Initial load
loadMCQs(currentPaper);
