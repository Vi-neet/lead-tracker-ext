let myLeads = [];
const inputBtn = document.getElementById("input-btn");
const tabBtn = document.getElementById("tab-btn");
const deleteBtn = document.getElementById("delete-btn");
const exportBtn = document.getElementById("export-btn"); // Add this line
const inputEl = document.getElementById("input-el");
const ulEl = document.getElementById("ul-el");
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));
console.log(leadsFromLocalStorage);

if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  render(myLeads);
}

// Add the export functionality
exportBtn.addEventListener("click", function () {
  const leads = JSON.parse(localStorage.getItem("myLeads"));
  if (leads && leads.length > 0) {
    let csvContent = "data:text/csv;charset=utf-8,URL\n"; // Header
    leads.forEach(function (url) {
      csvContent += url + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "saved_links.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert("No links to export!");
  }
});

// Rest of your existing code remains the same
tabBtn.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    myLeads.push(tabs[0].url);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
  });
});

function render(leads) {
  let listItems = "";
  for (let i = 0; i < leads.length; i++) {
    listItems += `<li> <a href='${leads[i]}' target='_blank'> ${leads[i]}</a></li> `;
  }
  ulEl.innerHTML = listItems;
}

deleteBtn.addEventListener("dblclick", function () {
  localStorage.clear();
  myLeads = [];
  render(myLeads);
});

inputBtn.addEventListener("click", function () {
  myLeads.push(inputEl.value);
  clearField();
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  render(myLeads);
});

function clearField() {
  inputEl.value = "";
}
