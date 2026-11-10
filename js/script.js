// dark mode
let isDark = localStorage.getItem('theme') !== 'light';
document.body.classList.toggle('dark-theme', isDark);

const themeToggle = document.getElementById('themeToggle');
themeToggle.textContent = isDark ? 'Switch to light mode' : 'Switch to dark mode';
themeToggle.setAttribute('aria-pressed', String(isDark));

function toggleTheme() {
    isDark = !isDark;
    document.body.classList.toggle('dark-theme', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    themeToggle.setAttribute('aria-pressed', String(isDark));
}

themeToggle.addEventListener('click', toggleTheme);

// extra skills
const extraSkills = {
    Frontend: ['JavaScript', 'React'],
    Backend: ['Node.js'],
    Tools: ['Git']
};
const skillsList = document.getElementById('skillsList');

Object.entries(extraSkills).forEach(([category, skills]) => {
    skills.forEach((skill) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${category}: ${skill}`;
        skillsList.appendChild(listItem);
    });
});

// project filters
const projectFilters = {
    all: () => true,
    web: (card) => card.dataset.category === 'web',
    app: (card) => card.dataset.category === 'app'
};
const projectCards = document.querySelectorAll('.project-card');
const projectFilter = document.getElementById('projectFilter');
const noProjectsMessage = document.getElementById('noProjectsMessage');
const projectAnimations = new WeakMap();
let selectedProjectCategory = 'all';

function filterProjects(category) {
    const activeCategory = Object.prototype.hasOwnProperty.call(projectFilters, category)
        ? category
        : 'all';
    const matchesProject = projectFilters[activeCategory];
    let matchingProjects = 0;
    selectedProjectCategory = activeCategory;

    projectCards.forEach((card) => {
        const shouldShow = matchesProject(card);
        const previousAnimation = projectAnimations.get(card);
        if (previousAnimation) {
            previousAnimation.cancel();
        }

        if (shouldShow) {
            matchingProjects++;
            const wasHidden = card.hidden;
            card.hidden = false;
            if (wasHidden || previousAnimation) {
                const animation = card.animate(
                    [
                        { opacity: 0, transform: 'translateY(8px)' },
                        { opacity: 1, transform: 'translateY(0)' }
                    ],
                    { duration: 200, easing: 'ease-out' }
                );
                projectAnimations.set(card, animation);
                animation.onfinish = () => projectAnimations.delete(card);
            }
        } else if (!card.hidden) {
            const animation = card.animate(
                [
                    { opacity: 1, transform: 'translateY(0)' },
                    { opacity: 0, transform: 'translateY(8px)' }
                ],
                { duration: 200, easing: 'ease-in' }
            );
            projectAnimations.set(card, animation);
            animation.onfinish = () => {
                if (projectAnimations.get(card) === animation
                    && selectedProjectCategory === activeCategory) {
                    card.hidden = true;
                    projectAnimations.delete(card);
                }
            };
        }
    });

    noProjectsMessage.hidden = matchingProjects > 0;
}

projectFilter.addEventListener('change', () => filterProjects(projectFilter.value));

// start timer
console.time("Page Load Time");

// print a welcome and warning message to the console
console.log("Welcome to Thomas' Portfolio!");
console.warn("⚠️ Warning: Extreme talent and awesome projects ahead!");

// end timer
console.timeEnd("Page Load Time");

// create getCurrentYear() function
function getFullDate() {
    return new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

const yearSpan = document.getElementById('year');
yearSpan.textContent = getFullDate();

// create sayHello() function
function sayHello() {
    alert('Thanks for visiting!');
}

document.getElementById('btn-hello').addEventListener('click', sayHello);
        
document.getElementById('btn-print').addEventListener('click', function() {
    window.print();
});
        
document.getElementById('btn-clear').addEventListener('click', function() {
    console.clear();
});

// calculate completed years and months since the experience start date
function calculateExperience(startDate) {
    const now = new Date();
    let months = (now.getFullYear() - startDate.getFullYear()) * 12
        + now.getMonth() - startDate.getMonth();

    if (now.getDate() < startDate.getDate()) {
        months--;
    }

    months = Math.max(0, months);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    return `${years} ${years === 1 ? 'year' : 'years'}, ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
}

const experienceStartDate = new Date(2025, 8, 5);
document.getElementById("expYears").textContent = calculateExperience(experienceStartDate);

const certificationExpirationDate = new Date(2027, 5, 14, 23, 59, 59);
function updateCertificationCountdown() {
    const remainingSeconds = Math.max(0, Math.floor((certificationExpirationDate - new Date()) / 1000));
    const days = Math.floor(remainingSeconds / 86400);
    const hours = Math.floor((remainingSeconds % 86400) / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    document.getElementById("certificationCountdown").textContent = remainingSeconds === 0
        ? "Expired"
        : `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

updateCertificationCountdown();
setInterval(updateCertificationCountdown, 1000);

// 1. Select the table body and existing rows to count projects
const tableBody = document.getElementById('projectTableBody');
const table = tableBody.closest('table');

const countParagraph = document.createElement('p');
countParagraph.id = 'project-count';
table.parentNode.insertBefore(countParagraph, table);

function updateRowCount() {
  const rows = tableBody.querySelectorAll('tr');
  const statusCounts = {
    Live: 0,
    Demo: 0,
    'Open Source': 0
  };

  for (const row of rows) {
    switch (row.cells[3].textContent.trim()) {
      case 'Live':
        statusCounts.Live++;
        break;
      case 'Demo':
        statusCounts.Demo++;
        break;
      case 'Open Source':
        statusCounts['Open Source']++;
        break;
    }
  }

  console.log(`Row count: ${rows.length}`);

  countParagraph.textContent = `Total Projects: ${rows.length}`;
  document.getElementById('project-status-count').textContent =
    `Live: ${statusCounts.Live} | Demo: ${statusCounts.Demo} | Open Source: ${statusCounts['Open Source']}`;
}

updateRowCount();

const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      updateRowCount();
    }
  }
});

observer.observe(tableBody, { childList: true });

function validateForm() {
    const name = document.querySelector('#contactForm [name="name"]').value.trim();
    const email = document.querySelector('#contactForm [name="email"]').value.trim();
    const message = document.querySelector('#contactForm [name="message"]').value.trim();

    if (!name || !email) {
        alert("Please fill in all fields");
        return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email address");
        return false;
    }

    if (message.length < 10) {
        alert("Message must be at least 10 characters long");
        return false;
    }

    alert("Message sent!");
    return false;
}