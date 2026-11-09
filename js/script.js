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