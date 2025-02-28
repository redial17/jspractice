const story = fetch('anabasis.json');
const h1 = document.querySelector('h1');
const infopane = document.getElementsByClassName('infopane')[0];
const page = document.getElementsByClassName('page')[0];
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const dictform = document.getElementById('dictform');
const error = document.querySelector('.error'); // Define the error element
let index = 0;

story.then(response => response.json())
.then(jsondata => {
    h1.textContent = jsondata.title;
    infopane.textContent = "author: " + jsondata.author + "\n" + "translator: " + jsondata.translator;
    page.innerHTML = jsondata.pages[index];

    prev.addEventListener('click', () => {
        if (index > 0) {
            index--;
        }
        page.innerHTML = jsondata.pages[index];
    });

    next.addEventListener('click', () => {
        if (index < jsondata.pages.length - 1) {
            index++;
        }
        page.innerHTML = jsondata.pages[index];
    });

    if (dictform) { // Check if the form exists
        dictform.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission

                const formData = new FormData(dictform); // Create FormData inside the submit event
                fetch('http://127.0.0.1:8000/cgi-bin/whatmeans', { 
                    method: 'POST',
                    body: formData 
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    // You can update the UI with the dictionary result here
                })
                .catch(error => {
                    console.error('Error:', error);
                    error.innerHTML = "There was an issue with the request.";
                });
        });
    } else {
        console.error('Form element not found');
    }

})
.catch(error => {
    console.error('Error loading story:', error);
});
