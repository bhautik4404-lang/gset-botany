let data = {};
let currentPaper = null;
let currentTopic = null;
let currentSubtopic = null;

// Fetch data.json from server
fetch('/data.json')
    .then(res => res.json())
    .then(json => {
        data = json;
    })
    .catch(err => {
        document.getElementById('content').textContent = `Error loading data: ${err.message}`;
    });

// Handle paper selection
document.getElementById('paper1-btn').onclick = () => {
    currentPaper = 'paper1';
    showTopics();
};

document.getElementById('paper2-btn').onclick = () => {
    currentPaper = 'paper2';
    showTopics();
};

// Show Topics (in single column)
function showTopics() {
    const content = document.getElementById('content');
    content.innerHTML = '';

    addBackButton(content, null); // no back at first page

    const list = document.createElement('ul');
    list.classList.add('list');
    data.topics.forEach(topic => {
        const li = document.createElement('li');
        li.textContent = topic.name;
        li.onclick = () => showSubtopics(topic);
        list.appendChild(li);
    });
    content.appendChild(list);
}

// Show Subtopics (in single column)
function showSubtopics(topic) {
    currentTopic = topic;
    const content = document.getElementById('content');
    content.innerHTML = '';

    addBackButton(content, 'topics');

    const list = document.createElement('ul');
    list.classList.add('list');
    topic.subtopics.forEach(sub => {
        const li = document.createElement('li');
        li.textContent = sub.name;
        li.onclick = () => showMCQs(sub);
        list.appendChild(li);
    });
    content.appendChild(list);
}

// Show MCQs with reshuffled answers & explanation
function showMCQs(subtopic) {
    currentSubtopic = subtopic;
    const content = document.getElementById('content');
    content.innerHTML = '';

    addBackButton(content, 'subtopics');

    subtopic.mcqs.forEach(mcq => {
        const div = document.createElement('div');
        div.className = 'mcq-container';

        const q = document.createElement('p');
        q.className = 'question';
        q.textContent = mcq.q;
        div.appendChild(q);

        // Shuffle answer options
        const options = mcq.options.map((opt, i) => ({ opt, i }));
        options.sort(() => Math.random() - 0.5);

        options.forEach(o => {
            const btn = document.createElement('button');
            btn.textContent = o.opt;
            btn.className = 'mcq-option';
            btn.onclick = () => {
                // Disable all buttons after answering
                div.querySelectorAll('button').forEach(b => b.disabled = true);

                // Mark right/wrong
                if (o.i === mcq.answer) {
                    btn.classList.add('correct');
                } else {
                    btn.classList.add('wrong');
                    // highlight correct answer
                    div.querySelectorAll('button')[mcq.answer].classList.add('correct');
                }

                // Show explanation after answering
                const exp = document.createElement('div');
                exp.className = 'mcq-explanation';
                exp.textContent = `💡 Explanation: ${mcq.explanation}`;
                div.appendChild(exp);
            };
            div.appendChild(btn);
        });

        content.appendChild(div);
    });
}

// Add Back button
function addBackButton(container, level) {
    if (!level) return;

    const btn = document.createElement('button');
    btn.id = 'back-btn';
    btn.textContent = '⬅ Back';
    btn.onclick = () => {
        if (level === 'topics') showTopics();
        else if (level === 'subtopics') showSubtopics(currentTopic);
    };

    container.appendChild(btn);
}
