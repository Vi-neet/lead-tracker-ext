let myLeads = [];
const inputBtn = document.getElementById("input-btn");
const tabBtn = document.getElementById("tab-btn");
const deleteBtn = document.getElementById("delete-btn");
const exportBtn = document.getElementById("export-btn");
const copyAllBtn = document.getElementById("copy-all-btn");
const inputEl = document.getElementById("input-el");
const ulEl = document.getElementById("ul-el");
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));
console.log(leadsFromLocalStorage);

if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  render(myLeads);
}

copyAllBtn.addEventListener("click", function () {
  const leads = JSON.parse(localStorage.getItem("myLeads"));
  if (leads && leads.length > 0) {
    const allLeads = leads.join("\n");
    navigator.clipboard
      .writeText(allLeads)
      .then(() => {
        copyAllBtn.innerHTML = `<img src="./icons/check.svg" class="copy-icon">`;
        setTimeout(() => {
          copyAllBtn.innerHTML = `<img src="./icons/copy.svg" class="copy-icon">`;
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        alert("Failed to copy links!");
      });
  } else {
    alert("No links to copy!");
  }
});
exportBtn.addEventListener("click", function () {
  const leads = JSON.parse(localStorage.getItem("myLeads"));
  if (leads && leads.length > 0) {
    let csvContent = "data:text/csv;charset=utf-8,URL\n";
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
    listItems += `
            <li>
                <span class="delete-item" data-index="${i}">x</span>
                <a href='${leads[i]}' target='_blank'>${leads[i]}</a>
            </li>
        `;
  }
  ulEl.innerHTML = listItems;

  const deleteButtons = document.querySelectorAll(".delete-item");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const index = parseInt(e.target.getAttribute("data-index"));
      deleteIndividualLead(index);
    });
  });
}

function deleteIndividualLead(index) {
  myLeads.splice(index, 1);
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  render(myLeads);
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
