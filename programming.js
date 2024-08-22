document.addEventListener('DOMContentLoaded', () => {
    const jokeDisplay = document.getElementById('joke-display');
    const getJokeButton = document.getElementById('get-joke');
    const shareJokeButton = document.getElementById('share-joke');
    const saveJokeButton = document.getElementById('save-joke');
    const jokeOfTheDayButton = document.getElementById('joke-of-the-day');
    const customJokeButton = document.getElementById('custom-joke');
    const voiceJokeButton = document.getElementById('voice-joke');
    const clearHistoryButton = document.getElementById('clear-history');
    const submitCustomJokeButton = document.getElementById('submit-custom-joke');
    const customJokeForm = document.getElementById('custom-joke-form');
    const customJokeText = document.getElementById('custom-joke-text');
    const historyList = document.getElementById('history-list');
    const upvoteButton = document.getElementById('upvote-button');
    const downvoteButton = document.getElementById('downvote-button');
    const upvoteCount = document.getElementById('upvote-count');
    const downvoteCount = document.getElementById('downvote-count');

    let jokeHistory = JSON.parse(localStorage.getItem('jokeHistory')) || [];
    let currentUpvotes = 0;
    let currentDownvotes = 0;
    let voices = [];

const loadVoices = () => {
    voices = speechSynthesis.getVoices();
};

loadVoices(); // Load voices initially

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
}


    const updateJokeHistory = () => {
        historyList.innerHTML = '';
        jokeHistory.forEach(joke => {
            const listItem = document.createElement('li');
            listItem.textContent = joke;
            historyList.appendChild(listItem);
        });
    };

    const fetchJoke = async (category) => {
        try {
            const response = await fetch(`https://official-joke-api.appspot.com/jokes/${category}/random`);
            const data = await response.json();
            return `${data[0].setup} ${data[0].punchline}`;
        } catch (error) {
            console.error('Failed to fetch joke:', error);
            return 'Oops! Could not fetch a joke. Please try again later.';
        }
    };

    const speakJoke = (joke) => {
        const utterance = new SpeechSynthesisUtterance(joke);
        const femaleVoice = voices.find(voice => voice.name.includes('Female'));
        utterance.voice = femaleVoice || voices[0];
        speechSynthesis.speak(utterance);
    };
    

    getJokeButton.addEventListener('click', async () => {
        const category = 'programming';
        const joke = await fetchJoke(category);
        jokeDisplay.textContent = joke;
    });

    shareJokeButton.addEventListener('click', () => {
        const joke = jokeDisplay.textContent;
        if (navigator.share) {
            navigator.share({
                title: 'Joke',
                text: joke,
                url: window.location.href
            }).catch(console.error);
        } else {
            alert('Sharing is not supported by your browser.');
        }
    });

    saveJokeButton.addEventListener('click', () => {
        const joke = jokeDisplay.textContent;
        if (joke && !jokeHistory.includes(joke)) {
            jokeHistory.push(joke);
            localStorage.setItem('jokeHistory', JSON.stringify(jokeHistory));
            updateJokeHistory();
        }
    });

    jokeOfTheDayButton.addEventListener('click', () => {
        const joke = "Why don't scientists trust atoms? Because they make up everything!";
        jokeDisplay.textContent = joke;
    });

    customJokeButton.addEventListener('click', () => {
        customJokeForm.style.display = customJokeForm.style.display === 'none' ? 'block' : 'none';
        if (customJokeForm.style.display === 'block') {
            customJokeText.focus();
        }
    });

    submitCustomJokeButton.addEventListener('click', () => {
        const customJoke = customJokeText.value;
        if (customJoke) {
            jokeDisplay.textContent = customJoke;
            customJokeText.value = '';
            customJokeForm.style.display = 'none';
        }
    });

    voiceJokeButton.addEventListener('click', () => {
        const joke = jokeDisplay.textContent;
        if (joke) {
            speakJoke(joke);
        }
    });

    clearHistoryButton.addEventListener('click', () => {
        jokeHistory = [];
        localStorage.removeItem('jokeHistory');
        updateJokeHistory();
    });

    upvoteButton.addEventListener('click', () => {
        currentUpvotes += 1;
        upvoteCount.textContent = currentUpvotes;
    });

    downvoteButton.addEventListener('click', () => {
        currentDownvotes += 1;
        downvoteCount.textContent = currentDownvotes;
    });

    updateJokeHistory();
});
