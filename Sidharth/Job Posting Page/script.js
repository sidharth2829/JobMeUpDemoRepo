

const scroll = document.querySelector(".scroll");
var isDown = false;
var scrollX;
var scrollLeft;


document.getElementById('categoryForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission

    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(input => input.value);
    if (selectedCategories.length === 0) {
        alert('Please select at least one job category.');
        return;
    }

    try {
        const categoryParam = selectedCategories.map(category => `category=${category}`).join('&');
        const response = await fetch(`https://remotive.io/api/remote-jobs?${categoryParam}&limit=10`);
        const data = await response.json();
        const jobs = data.jobs;

        const jobContainer = document.querySelector(".scroll");
        jobContainer.innerHTML = ''; // Clear previous job listings

        jobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.classList.add('card');

            const jobImage = document.createElement('div');
            jobImage.classList.add('card-image');
            const img = document.createElement('img');
            img.src = job.company_logo; // Use 'company_logo' instead of 'company_logo_url'
            img.alt = 'Company Logo';
            img.classList.add('responsive');
            jobImage.appendChild(img);

            const jobInner = document.createElement('div');
            jobInner.classList.add('card-inner');

            const jobTitle = document.createElement('h3');
            jobTitle.classList.add('text', 'text-title');
            jobTitle.textContent = job.title;

            const jobDescription = document.createElement('p');
            jobDescription.classList.add('paragraph', 'truncate');
            jobDescription.innerHTML = job.description; 

            const jobSalary = document.createElement('h2');
            jobSalary.classList.add('text');
            jobSalary.innerHTML = job.salary; // Use innerHTML to render HTML description

            const applyLink = document.createElement('a');
            applyLink.textContent = 'Apply Here';
            applyLink.href = job.url;
            applyLink.target = '_blank'; // Open link in a new tab

            jobInner.appendChild(jobTitle);
            // jobInner.appendChild(jobDescription);
            jobInner.appendChild(jobSalary);
            jobInner.appendChild(applyLink);
            jobCard.appendChild(jobImage);
            jobCard.appendChild(jobInner);

            jobContainer.appendChild(jobCard);
        });
    } catch (error) {
        console.error('Error fetching job listings:', error);
        // Display error message
    }
});
// Mouse Up Function
scroll.addEventListener("mouseup", () => {
	isDown = false;
	scroll.classList.remove("active");
});

// Mouse Leave Function
scroll.addEventListener("mouseleave", () => {
	isDown = false;
	scroll.classList.remove("active");
});

// Mouse Down Function
scroll.addEventListener("mousedown", (e) => {
	e.preventDefault();
	isDown = true;
	scroll.classList.add("active");
	scrollX = e.pageX - scroll.offsetLeft;
	scrollLeft = scroll.scrollLeft;
});

// Mouse Move Function
scroll.addEventListener("mousemove", (e) => {
	if (!isDown) return;
	e.preventDefault();
	var element = e.pageX - scroll.offsetLeft;
	var scrolling = (element - scrollX) * 2;
	scroll.scrollLeft = scrollLeft - scrolling;
});
