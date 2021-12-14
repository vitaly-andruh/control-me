// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const db = require('electron-db');
const { getMockUser, getAllPersons, fillControlPersonRow, Person } = require('./persons.js');
var currentTableData;  
const path = require('path')
var location = path.join(__dirname, '')
window.addEventListener('DOMContentLoaded', () => {

  // Create database if don't exist

  // This will save the database in the same directory as the application.


  
  if (!db.valid('persons', location)) {
    db.createTable('persons', location, (succ, msg) => {
      // succ - boolean, tells if the call is successful
      if (succ) {
        replaceText(`result`, msg)
      } else {
        replaceText(`result`, 'An error has occured. ' + msg)
      }
    })
  }

  // Create mock Data If No records

    db.getAll('persons', location, (succ, data) => {
      if (data.length === 0) {
        db.insertTableContent('persons', location, getMockUser(), (succ, msg) => {
          // succ - boolean, tells if the call is successful
          console.log("Success: " + succ);
          console.log("Message: " + msg);
        })
      }
      // succ - boolean, tells if the call is successful
      // data - array of objects that represents the rows.
    })

    const dataTable = document.querySelectorAll('#dataTable > tbody');

    if (dataTable) {
      db.getAll('persons', location, (succ, data) => {
        data = succ ? data : [];
        currentTableData = data;
        data.forEach(element => {
          console.log(element);
          const dataTableBody = document.querySelector('#dataTable > tbody');
          dataTableBody.appendChild(fillControlPersonRow(element));
          const dataTableRows = document.querySelector('#dataTable > tbody ');
          if (dataTableRows) {
            dataTableRows.addEventListener('click', (e) => {
              console.log(e.target);
              fillModalWindow(data, e.target.parentNode.getAttribute("data-id"));
            });
          }
        });
      })
    }
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log(e.target);
        register();
      });
    }
})

const fillModalWindow = (data, id) => {
  const tr = document.querySelector('#modalData > table > tbody > tr');
  tr.innerHTML = '';
  const modal = document.querySelector('#exampleModalLabel');
  const personRecord = data.find(x => x.id === parseInt(id));

  modal.innerHTML = personRecord.lastName + ' ' + personRecord.firstName 
      + ' ' + personRecord.midleName + ' (' +  personRecord.pasport + ')';

  let td = document.createElement('td');
  td.innerText = personRecord.accedentReason;
  tr.appendChild(td);

  td = document.createElement('td');
  td.innerText = personRecord.accidentDate;
  tr.appendChild(td);

  td = document.createElement('td');
  td.innerText = personRecord.recomendations;
  tr.appendChild(td);

}

const register = () => {
  console.log('register');

  let person = getMockUser();

  person.firstName = document.querySelector("#firstName").value;
  person.lastName = document.querySelector("#lastName").value;
  person.midleName = document.querySelector("#midleName").value;

  db.insertTableContent('persons', location, person, (succ, msg) => {
    // succ - boolean, tells if the call is successful
    console.log("Success: " + succ);
    console.log("Message: " + msg);
  })
}
