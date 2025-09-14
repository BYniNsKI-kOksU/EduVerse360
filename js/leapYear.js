let previousResult = "";
let history = [];
let isHistoryExpanded = false;
const MAX_HISTORY = 10;

// Zmienione na let — przypisujemy w initializeLeapYear
let yearInput, checkBtn, resultContainer, historyBox;

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
    if (!yearInput) return;
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

    // Znajdź różniące się słowa używając prostego porównania
    const diffIndices = [];
    const isFirstCheck = !oldText || oldText === '';
    
    if (isFirstCheck) {
        // Dla pierwszego sprawdzenia - animuj wszystkie słowa na czarno
        for (let i = 0; i < newWords.length; i++) {
            diffIndices.push(i);
        }
    } else {
        // Dla kolejnych sprawdzeń - animuj tylko różniące się słowa na czerwono
        for (let i = 0; i < newWords.length; i++) {
            if (i >= oldWords.length || newWords[i] !== oldWords[i]) {
                diffIndices.push(i);
            }
        }
    }
    
    const spans = [];
    newWords.forEach((word, i) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'result-word';
        wordSpan.style.padding = '0 4px';
        
        if (diffIndices.includes(i)) {
            // Słowo będzie animowane - zaczynamy z pustym tekstem
            wordSpan.textContent = '';
            wordSpan.style.color = isFirstCheck ? 'black' : 'red'; // Czarny dla pierwszego, czerwony dla kolejnych
            spans.push({ span: wordSpan, text: word, animate: true, isFirst: isFirstCheck });
        } else {
            // Słowo nie zmienione - pokazujemy od razu na czarno
            wordSpan.textContent = word;
            wordSpan.style.color = 'black';
            spans.push({ span: wordSpan, text: word, animate: false, isFirst: false });
        }
        
        centerContainer.appendChild(wordSpan);
        
        if (i < newWords.length - 1) {
            centerContainer.appendChild(document.createTextNode(' '));
        }
    });

    resultContainer.appendChild(centerContainer);
    resultContainer.classList.add('active');
    
    // Rozpocznij animację typewriter
    animateWords(spans);
}

function animateWords(spans, idx = 0) {
    // Znajdź następne słowo do animacji
    while (idx < spans.length && !spans[idx].animate) {
        idx++;
    }
    
    if (idx >= spans.length) return;
    
    const { span, text, isFirst } = spans[idx];
    
    function typeChar(pos = 0) {
        if (pos <= text.length) {
            span.textContent = text.slice(0, pos);
            // Ustaw finalny kolor: czarny dla pierwszego sprawdzenia, czerwony dla kolejnych
            span.style.color = pos === text.length ? (isFirst ? 'black' : 'red') : '';
            setTimeout(() => typeChar(pos + 1), 40);
        } else {
            animateWords(spans, idx + 1); // Przejdź do następnego słowa
        }
    }
    
    typeChar();
}

function clearResultContainer() {
    resultContainer.innerHTML = '';
    resultContainer.classList.remove('active');
}

function animateWord(element, word, index = 0) {
    // Ta funkcja jest już zastąpiona przez animateWords, ale zostawiamy dla kompatybilności
    const totalDuration = 400;
    const speed = Math.max(50, totalDuration / word.length);
    if (index <= word.length) {
        element.textContent = word.substring(0, index);
        setTimeout(() => animateWord(element, word, index + 1), speed);
    } else {
        element.style.color = 'red';
    }
}

function updateHistory(year, result) {
    const entry = `${year}: ${result}`;
    history.unshift(entry);
    if (history.length > MAX_HISTORY) history.pop();
    updateHistoryBox();
}

function updateHistoryBox() {
    const historyBox = document.getElementById('historyBox');
    historyBox.innerHTML = '';
    
    if (history.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'history-entry';
        emptyMsg.textContent = translations[currentLang].leapYear.emptyHistory || 'Brak historii';
        historyBox.appendChild(emptyMsg);
    } else {
        history.forEach(item => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'history-entry';
            entryDiv.textContent = item;
            historyBox.appendChild(entryDiv);
        });
    }
    
    if (isHistoryExpanded) {
        historyBox.classList.add('expanded');
        document.querySelector('.history-title').classList.add('expanded');
        historyBox.style.maxHeight = '200px';
        historyBox.style.padding = '15px';
        historyBox.style.opacity = '1';
        historyBox.style.visibility = 'visible';
    }
}

function toggleHistory() {
    const historyBox = document.querySelector('.history-box');
    const historyTitle = document.querySelector('.history-title');

    if (historyBox.classList.contains('expanded')) {
        // Rozpocznij animację zamykania
        historyBox.classList.remove('expanded');
        historyBox.classList.add('collapsing');
        historyTitle.classList.remove('expanded');

        // Po zakończeniu animacji ukryj element i zresetuj style
        historyBox.addEventListener('animationend', function handler() {
            historyBox.classList.remove('collapsing');
            historyBox.style.visibility = 'hidden';
            historyBox.style.maxHeight = '0';
            historyBox.style.padding = '0';
            historyBox.style.opacity = '0';
            historyBox.removeEventListener('animationend', handler);
        }, { once: true });
    } else {
        // Pokazanie historii
        historyBox.style.visibility = 'visible';
        historyBox.style.maxHeight = '200px';
        historyBox.style.padding = '20px 15px';
        historyBox.style.opacity = '1';
        historyBox.classList.add('expanded');
        historyTitle.classList.add('expanded');
    }
}

const btn = document.querySelector('.history-title');
btn.addEventListener('click', toggleHistory);

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

function initializeLeapYear() {
    // Pobierz referencje dopiero przy inicjalizacji
    yearInput = document.getElementById('yearInput');
    checkBtn = document.getElementById('checkBtn');
    resultContainer = document.getElementById('resultContainer');
    historyBox = document.getElementById('historyBox');

    if (checkBtn && !checkBtn.dataset.bound) {
        checkBtn.addEventListener('click', checkLeapYear);
        checkBtn.dataset.bound = '1';
    }
    
    if (yearInput && !yearInput.dataset.bound) {
        yearInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkLeapYear();
                
                if (checkBtn) {
                    checkBtn.classList.add('active');
                    setTimeout(() => checkBtn.classList.remove('active'), 200);
                }
            }
        });
        
        yearInput.addEventListener('focus', function() {
            this.select();
        });
        yearInput.dataset.bound = '1';
    }

    const historyTitle = document.querySelector('.history-title');
    if (historyTitle && !historyTitle.dataset.bound) {
        historyTitle.addEventListener('click', toggleHistory);
        historyTitle.dataset.bound = '1';
        
        const hb = document.querySelector('.history-box');
        if (hb) {
            hb.style.display = 'block';
            hb.style.maxHeight = '0';
            hb.style.padding = '0';
            hb.style.opacity = '0';
            hb.style.visibility = 'hidden';
        }
    }

    // Initialize history box to show "Brak historii" on start
    updateHistoryBox();
    
    // Initialize help system for leap year calculator
    setTimeout(() => {
        if (typeof helpSystem !== 'undefined') {
            helpSystem.addLeapYearHelpButton();
        }
    }, 500);
}

// Add keyboard shortcuts for help
document.addEventListener('keydown', (e) => {
    // F1 key opens help
    if (e.key === 'F1' && document.getElementById('leapYearApp')?.classList.contains('active')) {
        e.preventDefault();
        if (typeof helpSystem !== 'undefined') {
            helpSystem.openModal('leapYear');
        }
    }
});