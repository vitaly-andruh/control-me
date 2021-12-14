// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const db = require('electron-db');
const { getMockUser, getAllPersons, Person } = require('./persons.js');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  // Create database if don't exist
  const path = require('path')
  // This will save the database in the same directory as the application.
  const location = path.join(__dirname, '')

  
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

    const dataTable = document.querySelectorAll('#dataTable');

    if (dataTable) {

      var data = [];

      db.getAll('persons', location, (succ, data) => {
        data = succ ? data : [];
        data.forEach(element => {
          console.log(element);
          const dataTable = document.querySelector('#dataTable');
          const tr = document.createElement('tr');
  
          const td = document.createElement('td');
          td.innerText = element.id;
  
          tr.appendChild(td);
  
          dataTable.appendChild(tr);
        });
      })

    }

})
