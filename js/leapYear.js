let previousResult = "";
let history = [];
const MAX_HISTORY = 10;

const yearInput = document.getElementById('yearInput');
const checkBtn = document.getElementById('checkBtn');
const resultContainer = document.getElementById('resultContainer');
const historyBox = document.getElementById('historyBox');

function isLeapYear(year) {
    return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
}

function getVerb(year, lang) {
    const now = new Date().getFullYear();
    const tense = year < now ? "past" : year === now ? "present" : "future";
    return translations[lang].leapYear.verbs[tense];
}

function checkLeapYear() {
    const lang = translations[currentLang].leapYear;
    try {
        const year = parseInt(yearInput.value);
        if (isNaN(year) || year < 1) {
            throw new Error(lang.error);
        }
        
        const verb = getVerb(year, currentLang);
        const result = isLeapYear(year) 
            ? lang.yes.replace('{verb}', verb)
            : lang.no.replace('{verb}', verb);
        
        animateTextChange(result, previousResult);
        updateHistory(year, result);
        previousResult = result;
    } catch (error) {
        alert(error.message);
    }
}

function animateTextChange(newText, oldText) {
    resultContainer.innerHTML = '';
    const newWords = newText.split(' ');
    const oldWords = oldText ? oldText.split(' ') : [];

    const centerContainer = document.createElement('div');
    centerContainer.classList.add('result-wrapper');

    centerContainer.addEventListener('mousemove', e => {
        const rect = centerContainer.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        centerContainer.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255, 0, 0, 0.25) 0%, transparent 60%)`;
    });

    centerContainer.addEventListener('mouseleave', () => {
        centerContainer.style.background = `radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.1) 0%, transparent 60%)`;
    });

    const diffIndices = [];
    for (let i = 0; i < newWords.length; i++) {
        if (i >= oldWords.length || newWords[i] !== oldWords[i]) {
            diffIndices.push(i);
        }
    }

    newWords.forEach((word, i) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'result-word';
        
        if (diffIndices.includes(i)) {
            wordSpan.style.color = 'var(--clr-anim)';
            animateWord(wordSpan, word);
        } else {
            wordSpan.textContent = word;
            wordSpan.style.color = 'black';
        }
        
        centerContainer.appendChild(wordSpan);
        
        if (i < newWords.length - 1) {
            centerContainer.appendChild(document.createTextNode(' '));
        }
    });

    resultContainer.appendChild(centerContainer);
    resultContainer.classList.add('active');
}

function clearResultContainer() {
    resultContainer.innerHTML = '';
    resultContainer.classList.remove('active');
}

function animateWord(element, word, index = 0) {
    const totalDuration = 400;
    const speed = Math.max(50, totalDuration / word.length);
    if (index <= word.length) {
        element.textContent = word.substring(0, index);
        setTimeout(() => animateWord(element, word, index + 1), speed);
    } else {
        element.style.color = 'black';
    }
}

function updateHistory(year, result) {
    const entry = `${year}: ${result}`;
    history.unshift(entry);
    if (history.length > MAX_HISTORY) history.pop();
    updateHistoryBox();
}

function translateHistory() {
    if (history.length === 0) return;
    const newHistory = history.map(entry => {
        const match = entry.match(/^(\d+):\s*(.*)$/);
        if (!match) return entry;
        const year = parseInt(match[1]);
        const verb = getVerb(year, currentLang);
        const translated = isLeapYear(year)
            ? translations[currentLang].leapYear.yes.replace('{verb}', verb)
            : translations[currentLang].leapYear.no.replace('{verb}', verb);
        return `${year}: ${translated}`;
    });
    history = newHistory;
    updateHistoryBox();
}

function updateHistoryBox() {
    historyBox.innerHTML = '';
    history.forEach(item => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'history-entry';
        entryDiv.textContent = item;
        historyBox.appendChild(entryDiv);
    });
}

function initializeLeapYear() {
    if (checkBtn) checkBtn.addEventListener('click', checkLeapYear);
    if (yearInput) yearInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') checkLeapYear();
    });
}