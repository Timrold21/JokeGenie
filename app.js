document.addEventListener('DOMContentLoaded', () => {
    // Handle category page
    const category = document.querySelector('body').dataset.category;

    if (category) {
        initializeCategoryPage(category);
    }

    // Initialize EmailJS
    emailjs.init("timrold@gmail.com"); // Replace with your EmailJS User ID

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Collect form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Send email using EmailJS
            emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
                to_email: "timrold21@gmail.com",
                from_name: name,
                from_email: email,
                message: message,
            }).then(function(response) {
                alert('Message sent successfully!');
                contactForm.reset(); // Reset form after successful submission
            }, function(error) {
                alert('Failed to send the message, please try again.');
                console.log('FAILED...', error);
            });
        });
    }
});

function initializeCategoryPage(category) {
    const apiEndpoints = {
        programming: 'https://api.programming-jokes.com/jokes/random',
        general: 'https://api.general-jokes.com/jokes/random',
        'knock-knock': 'https://api.knock-knock-jokes.com/jokes/random',
        'dark-humor': 'https://api.dark-humor-jokes.com/jokes/random',
        'dad-jokes': 'https://api.dad-jokes.com/jokes/random',
        puns: 'https://api.puns-jokes.com/jokes/random'
    };

    const apiUrl = apiEndpoints[category] || apiEndpoints.general;
    const jokeContainer = document.getElementById('joke-container');
    const jokeBtn = document.getElementById('get-joke');
    const saveBtn = document.getElementById('save-joke');
    const shareBtn = document.getElementById('share-joke');
    const clearHistoryBtn = document.getElementById('clear-history');
    const customJokeInput = document.getElementById('custom-joke');
    const customJokeBtn = document.getElementById('submit-custom-joke');
    const jokeOfTheDayBtn = document.getElementById('joke-of-the-day');
    const voiceJokeBtn = document.getElementById('voice-joke');

    // Fetch joke from API
    async function fetchJoke() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            jokeContainer.textContent = data.joke || data.message || 'No joke available.';
        } catch (error) {
            jokeContainer.textContent = 'Failed to fetch joke.';
        }
    }

    // Save joke
    function saveJoke() {
        const joke = jokeContainer.textContent;
        if (joke && joke !== 'No joke available.') {
            const savedJokes = JSON.parse(localStorage.getItem('savedJokes')) || [];
            savedJokes.push(joke);
            localStorage.setItem('savedJokes', JSON.stringify(savedJokes));
            alert('Joke saved!');
        } else {
            alert('No joke to save.');
        }
    }

    // Share joke
    function shareJoke() {
        const joke = jokeContainer.textContent;
        if (joke && joke !== 'No joke available.') {
            const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(joke)}`;
            window.open(shareUrl, '_blank');
        } else {
            alert('No joke to share.');
        }
    }

    // Display joke of the day
    function displayJokeOfTheDay() {
        // Example URL; replace with the actual endpoint if available
        fetch('https://api.jokes.com/joke-of-the-day')
            .then(response => response.json())
            .then(data => {
                jokeContainer.textContent = data.joke || 'No joke of the day available.';
            });
    }

    // Submit custom joke
    function submitCustomJoke() {
        const customJoke = customJokeInput.value;
        if (customJoke) {
            jokeContainer.textContent = customJoke;
            customJokeInput.value = '';
        } else {
            alert('Please enter a custom joke.');
        }
    }

    // Read joke aloud
    function readJokeAloud() {
        const joke = jokeContainer.textContent;
        if (joke && joke !== 'No joke available.') {
            const utterance = new SpeechSynthesisUtterance(joke);
            utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === 'Google UK English Male');
            speechSynthesis.speak(utterance);
        } else {
            alert('No joke to read aloud.');
        }
    }

    // Clear history
    function clearHistory() {
        localStorage.removeItem('savedJokes');
        alert('History cleared!');
    }

    // Event listeners
    jokeBtn.addEventListener('click', fetchJoke);
    saveBtn.addEventListener('click', saveJoke);
    shareBtn.addEventListener('click', shareJoke);
    clearHistoryBtn.addEventListener('click', clearHistory);
    customJokeBtn.addEventListener('click', submitCustomJoke);
    jokeOfTheDayBtn.addEventListener('click', displayJokeOfTheDay);
    voiceJokeBtn.addEventListener('click', readJokeAloud);

    // Initial joke load
    fetchJoke();
}
