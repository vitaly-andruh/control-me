const path = require('path')
const location = path.join(__dirname, '');
const db = require('electron-db');

class Person {
  id;
  firstName;
  lastLame;
  midleName;

  nationality;

  pasport;

  idNumber;

  birthDate;
  moveDate;

  amount;
  currency;

  customs;
  department;

  direction;

  accidentDate
  accedentReason
  recomendations;
}
const getMockUser = () => {
  let person = new Person();

  person.id = 0;
  person.firstName = 'Степан';
  person.lastLame = 'Степанов';
  person.midleName = 'Степанович';

  person.nationality = 'Республика Беларусь';

  person.pasport = '79 1111111';

  person.idNumber = '';

  person.birthDate = new Date('December 1, 1980 00:00:00');
  person.moveDate = new Date('December 1, 2021 00:30:00');

  person.amount = 9999;
  person.currency = 'USD';

  person.customs = 'Брестская';
  person.department = 'Мокараны';

  person.direction = 'Въезд';

  person.accidentDate = new Date('December 1, 2021 00:30:00');
  person.accedentReason = 'Часть 2 статьи 15.5. КоАП РБ «Недекларирование либо представление недостоверных сведений о товарах»';
  person.recomendations = 'Провести:\n 1. Устный опрос; \n2. Таможенный осмотр/досмотр личных вещей подконтрольного лица, транспортного средства; лиц, следующих совместно с подконтрольным лицом (в случае следования на транспортном средстве для личного пользования); \n3. Личный таможенный досмотр (при наличии обоснованных подозрений о возможном риске недекларирования наличных денежных средств или денежных инструментов, подлежащих обязательному таможенному декларированию, в отношении подконтрольного лица и лиц, совместно с ним следующих).';
  return person;

}

const getAllPersons = () => {

  const location = path.join(__dirname, '');
    db.getAll('persons', location, (succ, data) => {
      return succ ? data : [];
    })

  return [];
}



module.exports.Person = Person;
module.exports.getMockUser = getMockUser;
module.exports.getAllPersons = getAllPersons;