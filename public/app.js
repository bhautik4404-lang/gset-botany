let data = {}; // Will load from server
let currentPaper = null;
let currentTopic = null;
let currentSubtopic = null;

// Fetch data
fetch('/data.json')
    .then(res => res.json())
    .then(json => {
        data = json;
    })
    .catch(err => {
        const content = document.getElementById('content');
        content.textContent = `Error loading data: ${err.message}`;
    });

// Paper selection
document.getElementById('paper1-btn').onclick = () => {
    currentPaper = 'paper1';
    showTopics();
};

document.getElementById('paper2-btn').onclick = () => {
    currentPaper = 'paper2';
    showTopics();
};

// Display topics
function showTopics() {
    currentTopic = null;
    currentSubtopic = null;
    const content = document.getElementById('content');
    content.innerHTML = '';

    addBackButton(content, null); // no back for first page

    const ul = document.createElement('ul');
    data.topics.forEach(topic => {
        const li = document.createElement('li');
        li.textContent = topic.name;
        li.onclick = () => showSubtopics(topic);
        ul.appendChild(li);
    });
    content.appendChild(ul);
}

// Display subtopics
function showSubtopics(topic) {
    currentTopic = topic;
    currentSubtopic = null;
    const content = document.getElementById('content');
    content.innerHTML = '';

    addBackButton(content, 'topics');

    const ul = document.createElement('ul');
    topic.subtopics.forEach(sub => {
        const li = document.createElement('li');
        li.textContent = sub.name;
        li.onclick = () => showMCQs(sub);
        ul.appendChild(li);
    });
    content.appendChild(ul);
}

// Display MCQs
function showMCQs(subtopic) {
    currentSubtopic = subtopic;
    const content = document.getElementById('content');
    content.innerHTML = '';

    addBackButton(content, 'subtopics');

    subtopic.mcqs.forEach(mcq => {
        const div = document.createElement('div');
        div.className = 'mcq-container';

        const q = document.createElement('p');
        q.textContent = mcq.q;
        div.appendChild(q);

        // Shuffle options
        const options = mcq.options.map((opt, i) => ({ opt, i }));
        options.sort(() => Math.random() - 0.5);

        options.forEach(o => {
            const btn = document.createElement('button');
            btn.textContent = o.opt;
            btn.className = 'mcq-option';
            btn.onclick = () => {
                // Disable buttons
                div.querySelectorAll('button').forEach(b => b.disabled = true);

                // Color answers
                if (o.i === mcq.answer) btn.style.backgroundColor = 'green';
                else {
                    btn.style.backgroundColor = 'red';
                    div.querySelectorAll('button')[mcq.answer].style.backgroundColor = 'green';
                }

                // Show explanation
                const exp = document.createElement('div');
                exp.className = 'mcq-explanation';
                exp.textContent = mcq.explanation;
                div.appendChild(exp);
            };
            div.appendChild(btn);
        });

        content.appendChild(div);
    });
}

// Back button helper
function addBackButton(container, level) {
    if (level === null) return; // no back on main
    const btn = document.createElement('button');
    btn.id = 'back-btn';
    btn.textContent = 'Back';
    btn.onclick = () => {
        if (level === 'topics') showTopics();
        else if (level === 'subtopics') showSubtopics(currentTopic);
    };
    container.appendChild(btn);
}
