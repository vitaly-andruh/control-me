// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const db = require('electron-db');
const { getMockUser, fillStatisticRow, fillControlPersonRow, Person } = require('./persons.js');
var currentTableData;  
const path = require('path')
var location = path.join(__dirname, '')

const initControlPerson = () => {
  const dataTable = document.querySelectorAll('#dataTable > tbody');
  if (dataTable) {
    db.getAll('persons', location, (succ, data) => {
      data = succ ? data : [];
      currentTableData = data;
      data.forEach(element => {
        if (element.isUnderControl) {
          const dataTableBody = document.querySelector('#dataTable > tbody');
          dataTableBody.appendChild(fillControlPersonRow(element));
          const dataTableRows = document.querySelector('#dataTable > tbody ');
          if (dataTableRows) {
            dataTableRows.addEventListener('click', (e) => {
              fillModalWindow(data, e.target.parentNode.getAttribute("data-id"));
            });
          }
        }
      });
    })
  }
}

Object.filter = (obj, predicate) => 
  Object.keys(obj)
        .filter( key => predicate(obj[key]) )
        .reduce( (res, key) => (res[key] = obj[key], res), {} );

const addIsFilter = (data, fieldName, value) => {
  return Object.values(Object.filter(data, item => item[fieldName] === value))
}

const addIsBigerFilter = (data, fieldName, value) => {
  return Object.values(Object.filter(data, item => parseInt(item[fieldName]) >= parseInt(value)))
}

const addIsSmallerFilter = (data, fieldName, value) => {
  return Object.values(Object.filter(data, item => parseInt(item[fieldName]) <= parseInt(value)))
}

const addIsBigerDateFilter = (data, fieldName, value) => {
  return Object.values(Object.filter(data, item => new Date(item[fieldName]) >= new Date(value)))
}

const addIsSmallerDateFilter = (data, fieldName, value) => {
  return Object.values(Object.filter(data, item => new Date(item[fieldName]) <= new Date(value)))
}

const addTextFilter = (data, filter, fieldName) => {
  if (filter && filter[fieldName]) {
    return addIsFilter(data, fieldName, filter[fieldName]);
  }
  return data;
}

const addRangeFilter = (data, filter, fieldNameMin, fieldNameMax, targetField) => {
  if (filter && filter[fieldNameMax]) {
    data = addIsSmallerFilter(data, targetField, filter[fieldNameMax]);
  }

  if (filter && filter[fieldNameMin]) {
    data = addIsBigerFilter(data, targetField, filter[fieldNameMin]);
  }
  return data;
}

const addDateRangeFilter = (data, filter, fieldNameMin, fieldNameMax, targetField) => {
  if (filter && filter[fieldNameMax]) {
    data = addIsSmallerDateFilter(data, targetField, filter[fieldNameMax]);
  }

  if (filter && filter[fieldNameMin]) {
    data = addIsBigerDateFilter(data, targetField, filter[fieldNameMin]);
  }
  return data;
}

const addTextFilters = (data, filter, fieldNameArr) => {
  fieldNameArr.forEach((field) => {
    data = addTextFilter(data, filter, field);
  });
  return data;
}

const addFilterConditions = (filter, fieldArr) => {
  fieldArr.forEach((field) => {
    const someFilter = document.querySelector('.jumbotron #' + field);
    if (someFilter && someFilter.value) {
      filter[field] = someFilter.value;
    }
  })
  return filter;
}

const initStatistic = (filter) => {
  const statisticTable = document.querySelectorAll('#statisticTable > tbody');
  if (statisticTable) {
    db.getAll('persons', location, (succ, data) => {
      data = succ ? data : [];
      currentTableData = data;
      console.log(filter);
      //data = Object.values(Object.filter(data, item => parseInt(item.amount) > 1000))
      data = addTextFilters(data, filter, [
        'firstName',
        'lastName',
        'midleName',
        'nationality',
        'pasport',
        'idNumber',
        'moneyTools',
        'moneyToolsCurrency',
        'customs',
        'currency',
        'department'
      ]);

      data = addRangeFilter(data, filter, 
        'amountFrom',
        'amountTo',
        'amount');

      data = addRangeFilter(data, filter, 
        'moneyToolsAmountFrom',
        'moneyToolsAmountTo',
        'moneyToolsAmount');

      data = addDateRangeFilter(data, filter, 
        'moveDateFrom',
        'moveDateTo',
        'moveDate');

      if (filter && filter.direction !== 'Въезд и Выезд') {
        data = addTextFilters(data, filter, [
          'direction'
        ]);
      }


      //data = addIsFilter(data, 'currency', 'USD');
      //data = addIsBigerFilter(data, 'amount', 445);
      //data = addIsSmallerFilter(data, 'amount', 3000);

      document.querySelector('#statisticTable > tbody').innerHTML = '';
      data.forEach(element => {
          const dataTableBody = document.querySelector('#statisticTable > tbody');
          dataTableBody.appendChild(fillStatisticRow(element));
          const dataTableRows = document.querySelector('#statisticTable > tbody ');

          if (dataTableRows) {
            dataTableRows.addEventListener('click', (e) => {
              fillDetailModalWindow(data, e.target.parentNode.getAttribute("data-id"));
            });
          }
          const filterButton = document.querySelector('#filterButton');
          if (filterButton) {
            filterButton.onclick = (e) => {

              let filter = addFilterConditions({},
                [
                  'firstName',
                  'lastName',
                  'midleName',
                  'nationality',
                  'pasport',
                  'idNumber',
                  'moneyTools',
                  'currency',
                  'moneyToolsCurrency',
                  'customs',
                  'department',
                  'direction',
                  'amountFrom',
                  'amountTo',
                  'moneyToolsAmountFrom',
                  'moneyToolsAmountTo',
                  'moveDateFrom',
                  'moveDateTo'
                ]
                
                );


              initStatistic(filter)
              window.scrollTo({
                top: 730,
                left: 0,
                behavior: 'smooth'
              });
              //fillDetailModalWindow(data, e.target.parentNode.getAttribute("data-id"));
            };
          }

          const filterResetButton = document.querySelector('#filterResetButton');
          if (filterResetButton) {
            filterResetButton.onclick = (e) => {
              initStatistic();

            };
          }

      });
    })

  }
}

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

const fillDetailModalWindow = (data, id) => {

  const modal = document.querySelector('#statisticModal #exampleModalLabel');
  const personRecord = data.find(x => x.id === parseInt(id));

  console.log(personRecord)

  modal.innerHTML = personRecord.lastName + ' ' + personRecord.firstName 
      + ' ' + personRecord.midleName + ' (' +  personRecord.pasport + ')';

  let fields = [
    'firstName',
    'lastName',
    'midleName',
    'nationality',
    'pasport',
    'idNumber',
    'birthDate',
    'amount',
    'currency',
    'moneyTools',
    'moneyToolsAmount',
    'moneyToolsCurrency',
    'moveDate',
    'customs',
    'department',
    'direction',
    'isUnderControl',
    'accidentDate',
    'accedentReason',
    'recomendations',
  ];

  fields.forEach(item => {
    if (personRecord[item]) {
      document.querySelector("#statisticModal #" + item).value = personRecord[item];
    }
  });


}

const fillPersonObjectFromForm = (arrFields) => {
  const person = new Person();
  db.getAll('persons', location, (succ, data) => {
    arrFields.forEach((item) => {
      let field = document.querySelector("#" + item)
      if (field && field.value) {
        person[item] = document.querySelector("#" + item).value;
      }
      if (field && field.type === "checkbox") {
        person[item] = document.querySelector("#" + item).checked;
      }
    });
    data = succ ? data : [];
    person['number'] = data.length + 1;
  });
  return person;
}

const register = () => {
  let fields = [
    'firstName',
    'lastName',
    'midleName',
    'nationality',
    'pasport',
    'idNumber',
    'birthDate',
    'amount',
    'currency',
    'moneyTools',
    'moneyToolsAmount',
    'moneyToolsCurrency',
    'moveDate',
    'customs',
    'department',
    'direction',
    'isUnderControl',
    'accidentDate',
    'accedentReason',
    'recomendations',
  ];
  db.insertTableContent('persons', location, fillPersonObjectFromForm(fields), (succ, msg) => {
    // succ - boolean, tells if the call is successful
    console.log("Success: " + succ);
    console.log("Message: " + msg);
  })
}

const initRegister = () => {
  const controlCheckbox =  document.querySelector('#isUnderControl');
  const controlForms =  document.querySelector('#controlForms');
  if (controlCheckbox) {
    controlCheckbox.addEventListener('change', (e) => {

      if (e.target.checked) {
        controlForms.classList.remove('d-none');
        document.querySelector('#accidentDate').setAttribute('required','');
        document.querySelector('#accedentReason').setAttribute('required','');
        document.querySelector('#recomendations').setAttribute('required','');
      } else {
        controlForms.classList.add('d-none');
        document.querySelector('#accidentDate').removeAttribute('required');
        document.querySelector('#accedentReason').removeAttribute('required');
        document.querySelector('#recomendations').removeAttribute('required');
      }
    });
  }

  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      var forms = document.getElementsByClassName('needs-validation');
      var alert = document.getElementsByClassName('alert-success')[0];
      // Loop over them and prevent submission

      var isValid = false;
      Array.prototype.filter.call(forms, function(form) {
          if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
          }
          isValid = form.checkValidity();
          form.classList.add('was-validated');
      });

      if (isValid) {
        e.preventDefault();
        register();
        form.classList.add('d-none');
        alert.classList.remove('d-none');
      }

    });
  }
}

window.addEventListener('DOMContentLoaded', () => {

  const currentPage = document.location.pathname.split("/").at(-1);
  switch (currentPage) {
    case 'listOfCustomers.html':
      initControlPerson();
      break;
    case 'statistic.html':
      initStatistic();
      break;
    case 'register.html':
      initRegister();

    default:
      //Здесь находятся инструкции, которые выполняются при отсутствии соответствующего значения
      //statements_def
      break;
  }

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

});
