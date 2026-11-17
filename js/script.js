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

const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = pageHeight > 0
        ? Math.min(100, (window.scrollY / pageHeight) * 100)
        : 0;

    scrollProgress.style.width = `${progress}%`;
    scrollProgress.setAttribute('aria-valuenow', String(Math.round(progress)));
}

window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

const nav = document.querySelector('nav');
const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
const navIndicator = document.getElementById('navIndicator');
const navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter((section) => section);
const intersectingNavSections = new Map();
let activeNavLink = null;
let navSectionOrder = 0;

function moveNavIndicator(link) {
    const navBounds = nav.getBoundingClientRect();
    const linkBounds = link.getBoundingClientRect();
    navIndicator.style.width = `${linkBounds.width}px`;
    navIndicator.style.top = `${linkBounds.bottom - navBounds.top + 2}px`;
    navIndicator.style.transform = `translateX(${linkBounds.left - navBounds.left}px)`;
}

function setActiveNavLink(section) {
    activeNavLink = navLinks.find((link) => link.hash === `#${section.id}`);
    if (!activeNavLink) {
        return;
    }

    navLinks.forEach((link) => {
        link.classList.toggle('active', link === activeNavLink);
    });
    moveNavIndicator(activeNavLink);
}

function clearActiveNavLink() {
    activeNavLink = null;
    navLinks.forEach((link) => link.classList.remove('active'));
    navIndicator.style.width = '0';
}

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            intersectingNavSections.set(entry.target, ++navSectionOrder);
        } else {
            intersectingNavSections.delete(entry.target);
        }
    });

    const activeSection = Array.from(intersectingNavSections.entries())
        .sort((first, second) => second[1] - first[1])[0];
    if (activeSection) {
        setActiveNavLink(activeSection[0]);
    } else {
        clearActiveNavLink();
    }
}, {
    rootMargin: '-50px 0px -60% 0px',
    threshold: 0
});

navSections.forEach((section) => navObserver.observe(section));
window.addEventListener('resize', () => {
    if (activeNavLink) {
        moveNavIndicator(activeNavLink);
    }
});

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

const skills = {
    frontend: ['HTML', 'CSS', 'JavaScript', 'React'],
    backend: ['Node.js', 'Python', 'Java'],
    tools: ['Git', 'Photoshop'],
    listAll() {
        return [...this.frontend, ...this.backend, ...this.tools];
    }
};

console.log('Frontend skill count:', skills.frontend.length);
skills.backend.push('Express.js');
console.log('All skills:', skills.listAll());
console.log('Skills JSON:', JSON.stringify(skills));

// project filters
const projectFilters = {
    all: () => true,
    web: (card) => card.dataset.category === 'web',
    app: (card) => card.dataset.category === 'app'
};
const projectFilter = document.getElementById('projectFilter');
const noProjectsMessage = document.getElementById('noProjectsMessage');
const projectsContainer = document.getElementById('projectsContainer');
const loadMoreButton = document.getElementById('loadMoreProjects');
const projectAnimations = new WeakMap();
let selectedProjectCategory = 'all';

function filterProjects(category) {
    const activeCategory = Object.prototype.hasOwnProperty.call(projectFilters, category)
        ? category
        : 'all';
    const matchesProject = projectFilters[activeCategory];
    let matchingProjects = 0;
    selectedProjectCategory = activeCategory;
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach((card) => {
        const shouldShow = matchesProject(card);
        const projectItem = card.closest('.project-card-link') || card;
        const previousAnimation = projectAnimations.get(card);
        if (previousAnimation) {
            previousAnimation.cancel();
        }

        if (shouldShow) {
            matchingProjects++;
            const wasHidden = projectItem.hidden;
            projectItem.hidden = false;
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
        } else if (!projectItem.hidden) {
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
                    projectItem.hidden = true;
                    projectAnimations.delete(card);
                }
            };
        }
    });

    noProjectsMessage.hidden = matchingProjects > 0 || !loadMoreButton.hidden;
}

projectFilter.addEventListener('change', () => filterProjects(projectFilter.value));

const projects = [
    {
        title: 'Slotz',
        tech: 'Python, Pygame',
        image: 'images/slotz.png',
        description: 'A game built with Python and Pygame.',
        category: 'app',
        featured: true,
        year: 2026,
        links: {
            github: 'https://github.com/privatetom1208/Project-Month-Python---slotz',
            live: ''
        }
    },
    {
        title: 'Zihh.',
        tech: 'Java, Java Swing',
        image: 'images/zihh.png',
        description: 'A Java application built with Java Swing.',
        category: 'app',
        featured: false,
        year: 2026,
        links: {
            github: 'https://github.com/privatetom1208/Project-Month-Java---zihh',
            live: ''
        }
    },
    {
        title: 'Arduino Morse Code',
        tech: 'C++, Arduino',
        image: 'images/morsecode.png',
        description: 'An Arduino project that works with Morse code.',
        category: 'app',
        featured: false,
        year: 2026,
        links: {
            github: '',
            live: ''
        }
    }
];

projects.sort((firstProject, secondProject) => firstProject.year - secondProject.year);
console.log('Projects:', projects);
console.log('Second project title:', projects[1].title);

let renderedProjectCount = 0;
const projectsPerLoad = 3;

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.category = project.category;
    card.dataset.projectTitle = project.title;
    let projectItem = card;

    if (project.links.github) {
        const projectLink = document.createElement('a');
        projectLink.className = 'project-card-link';
        projectLink.href = project.links.github;
        projectLink.target = '_blank';
        projectLink.rel = 'noopener noreferrer';
        projectLink.draggable = true;
        projectLink.appendChild(card);
        card.draggable = false;
        projectItem = projectLink;
    } else {
        card.draggable = true;
    }

    if (project.featured) {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = 'Featured';
        card.appendChild(badge);
    }

    const image = document.createElement('img');
    image.src = project.image;
    image.alt = `${project.title} project screenshot`;
    image.width = 300;
    image.height = 200;
    card.appendChild(image);

    const title = document.createElement('h3');
    title.textContent = project.title;
    card.appendChild(title);

    const description = document.createElement('p');
    description.textContent = project.description;
    card.appendChild(description);

    return projectItem;
}

function loadMoreProjects() {
    const nextProjects = projects.slice(
        renderedProjectCount,
        renderedProjectCount + projectsPerLoad
    );

    nextProjects.forEach((project) => {
        projectsContainer.appendChild(createProjectCard(project));
    });

    renderedProjectCount += nextProjects.length;
    loadMoreButton.hidden = renderedProjectCount >= projects.length;
    filterProjects(projectFilter.value);
}

function updateProjectOrder() {
    const reorderedProjects = Array.from(projectsContainer.children).map((item) => {
        const card = item.matches('.project-card') ? item : item.querySelector('.project-card');
        const title = card.dataset.projectTitle;
        return projects.find((project) => project.title === title);
    });

    projects.splice(0, renderedProjectCount, ...reorderedProjects);
}

let draggedProject = null;

projectsContainer.addEventListener('dragstart', (event) => {
    const projectItem = event.target.closest('.project-card-link')
        || event.target.closest('.project-card');
    if (!projectItem) {
        return;
    }

    const card = projectItem.matches('.project-card')
        ? projectItem
        : projectItem.querySelector('.project-card');
    draggedProject = projectItem;
    draggedProject.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', card.dataset.projectTitle);
});

projectsContainer.addEventListener('dragover', (event) => {
    if (!draggedProject) {
        return;
    }

    const targetProject = event.target.closest('.project-card-link')
        || event.target.closest('.project-card');
    if (!targetProject) {
        return;
    }

    event.preventDefault();
    if (targetProject === draggedProject) {
        return;
    }

    const bounds = targetProject.getBoundingClientRect();
    const insertAfter = event.clientY > bounds.top + bounds.height / 2
        || (event.clientY >= bounds.top && event.clientX > bounds.left + bounds.width / 2);

    projectsContainer.insertBefore(
        draggedProject,
        insertAfter ? targetProject.nextSibling : targetProject
    );
});

projectsContainer.addEventListener('drop', (event) => {
    event.preventDefault();
    updateProjectOrder();
});

projectsContainer.addEventListener('dragend', () => {
    if (draggedProject) {
        draggedProject.classList.remove('dragging');
        draggedProject = null;
        updateProjectOrder();
    }
});

loadMoreButton.addEventListener('click', loadMoreProjects);
loadMoreProjects();

function showFeaturedProject() {
    const featuredProject = projects.find((project) => project.featured);
    if (!featuredProject) {
        console.error('No featured project is configured.');
        return;
    }

    document.getElementById('featured-project-title').textContent = featuredProject.title;
    document.getElementById('featured-project-description').textContent = featuredProject.description;
    console.log("Today's featured project: " + featuredProject.title);
}

showFeaturedProject();

// start timer
console.time("Page Load Time");

// print a welcome and warning message to the console
console.log("Welcome to Thomas' Portfolio!");
console.warn("⚠️ Warning: Extreme talent and awesome projects ahead!");

// end timer
console.timeEnd("Page Load Time");

// create getCurrentYear() function
function getCurrentYear() {
    return new Date().getFullYear();
}

const yearSpan = document.getElementById('year');
yearSpan.textContent = getCurrentYear();

// Update this timestamp whenever the site content changes.
const lastUpdated = new Date('2026-11-16T17:38:08.646Z');
const pageStartedAt = new Date();
const formattedDate = lastUpdated.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
});
document.getElementById('lastUpdated').textContent = formattedDate;

function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const timeParts = [];

    if (hours > 0) {
        timeParts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
    }

    if (minutes > 0 || hours > 0) {
        timeParts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    }

    timeParts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
    return timeParts.join(', ');
}

function updateTimeOnSite() {
    const timeSinceUpdate = Math.max(0, Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
    const timeOnSite = Math.floor((Date.now() - pageStartedAt.getTime()) / 1000);

    document.getElementById('relativeUpdated').textContent = timeSinceUpdate === 0
        ? 'Updated just now'
        : `Updated ${formatDuration(timeSinceUpdate)} ago`;
    document.getElementById('timeOnSite').textContent = formatDuration(timeOnSite);
}

updateTimeOnSite();
setInterval(updateTimeOnSite, 1000);

function showWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    welcomeMessage.hidden = false;
    setTimeout(() => {
        welcomeMessage.hidden = true;
    }, 5000);
}

setTimeout(showWelcomeMessage, 5000);

const visitTips = [
    'Browse my project cards to see my work.',
    'Try filtering projects by type.',
    'Use the contact form to reach me.'
];
let currentTip = 0;

function showNextTip() {
    currentTip = (currentTip + 1) % visitTips.length;
    document.getElementById('visitTip').textContent = visitTips[currentTip];
}

setInterval(showNextTip, 10000);

function printPortfolio() {
    window.print();
}

document.getElementById('btn-print').addEventListener('click', printPortfolio);
        
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

const graduationDate = new Date(2027, 5, 14, 23, 59, 59);
function updateGraduationCountdown() {
    const remainingSeconds = Math.max(0, Math.floor((graduationDate - new Date()) / 1000));
    const days = Math.floor(remainingSeconds / 86400);
    const hours = Math.floor((remainingSeconds % 86400) / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;

    document.getElementById("certificationCountdown").textContent = remainingSeconds === 0
        ? "Graduated"
        : `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

updateGraduationCountdown();
setInterval(updateGraduationCountdown, 1000);

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
    const statuses = row.cells[3].textContent.split(',').map((status) => status.trim());
    statuses.forEach((status) => {
      if (Object.prototype.hasOwnProperty.call(statusCounts, status)) {
        statusCounts[status]++;
      }
    });
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

const contactForm = document.getElementById('contactForm');
const contactMessage = document.getElementById('contactMessage');
const charCount = document.getElementById('charCount');
const messageProgress = document.getElementById('messageProgress');
const submitButton = contactForm.querySelector('[type="submit"]');

function updateMessageCount() {
    const messageLength = contactMessage.value.length;
    charCount.textContent = messageLength;
    charCount.classList.toggle('near-limit', messageLength > 450);
    messageProgress.value = messageLength;
    messageProgress.setAttribute(
        'aria-valuetext',
        `${messageLength} of ${contactMessage.maxLength} characters`
    );
    submitButton.disabled = messageLength >= contactMessage.maxLength;
}

contactMessage.addEventListener('input', updateMessageCount);
contactForm.addEventListener('reset', () => {
    setTimeout(updateMessageCount, 0);
});
updateMessageCount();

function standardizeName(rawInput) {
    const trimmedInput = rawInput.trim();
    console.log('After trimming:', trimmedInput);

    const lowercaseInput = trimmedInput.toLowerCase();
    console.log('After lowercasing:', lowercaseInput);

    const cleanedInput = lowercaseInput.replace(/[0-9]/g, '');
    console.log('After removing numbers:', cleanedInput);

    const capitalizedInput = cleanedInput.split(' ').map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
    console.log('Standardized name:', capitalizedInput);

    return capitalizedInput;
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const nameField = form.querySelector('[name="name"]');
    nameField.value = standardizeName(nameField.value);
    const name = nameField.value;
    const emailField = form.querySelector('[name="email"]');
    const email = emailField.value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name) {
        alert("Please enter your name.");
        return false;
    }

    if (!/^[A-Za-z ]+$/.test(name)) {
        alert("Your name can only contain letters and spaces.");
        return false;
    }

    if (!email || !emailField.validity.valid) {
        alert("Please enter a valid email address.");
        return false;
    }

    if (message.length < 10) {
        alert("Message must be at least 10 characters long.");
        return false;
    }

    const budgetField = form.querySelector('[name="budget"]:checked');
    const formInformation = {
        name: name,
        email: email,
        message: message,
        projectType: form.querySelector('[name="projectType"]').value,
        budget: budgetField ? budgetField.value : 'Not selected',
        newsletter: form.querySelector('[name="newsletter"]').checked
    };

    console.log('Contact form submission:', formInformation);
    alert('Your form information was printed to the console.');
    return false;
}