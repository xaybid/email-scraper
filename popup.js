let scrapeEmails = document.getElementById('scrapeEmails');
let list = document.getElementById('emailList');

// Handler to receive emails from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Get emails
    let emails = request.emails;

    // Display emails on popup
    if (emails == null || emails.length == 0) {
        let li = document.createElement("li");
        li.innerText = "No email found.";
        list.appendChild(li);
    } else {
        // Display emails
        emails.forEach((email) => {
            let li = document.createElement("li");
            li.innerText = email;
            list.appendChild(li);
        });
    }
});

scrapeEmails.addEventListener("click", async () => {
    // Get Current Tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Script to parse emails on page
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: scrapeEmailsFromPage,
    });
});

// Function to scrape
function scrapeEmailsFromPage() {
    const emailRegEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;

    // Parse emails from the page
    let emails = document.body.innerHTML.match(emailRegEx);

    // Send emails to popup
    chrome.runtime.sendMessage({ emails });
}
