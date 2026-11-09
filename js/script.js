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