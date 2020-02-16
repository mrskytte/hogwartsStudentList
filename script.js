window.addEventListener("DOMContentLoaded", init);

function init() {
  fetch("students1991.json")
    .then(e => e.json())
    .then(showStudents);
}

const Student = {
  firstName: "",
  lastName: "",
  middleName: null,
  nickName: null,
  gender: "",
  image: null,
  house: "",
  OWLScore: 0,
  isPrefect: false
};
const students = [];

function showStudents(allStudents) {
  allStudents.forEach(createArr);
  students.forEach(printStudent);
}

function createArr(oneStudent) {
  const studName = oneStudent.fullname.trim();
  const student = Object.create(Student);
  // Find and capitalize first name
  student.firstName = getFirstName(studName);
  // Find and capitalize last name
  if (studName.indexOf(" ") !== -1) {
    student.lastName = getLastName(studName);
  }
  // Capitalize character after hyphen
  if (student.lastName.indexOf("-") !== -1) {
    student.lastName = getHyphenLastName(student.lastName);
  }
  // Set all others to null
  student.middleName = null;
  student.nickName = null;
  // Find only nicknames and capitalize
  if (studName.indexOf(" ") + 1 == studName.indexOf('"')) {
    student.nickName = getNickName(studName);
  }
  // Find only middlename and capitalize
  else if (studName.indexOf(" ") !== studName.lastIndexOf(" ")) {
    student.middleName = getMiddleName(studName);
  }
  // Determine whether it's a boy or girl
  student.gender = getGender(oneStudent.gender);
  // Determine which house they belong to
  student.house = getHouse(oneStudent.house);
  // Add object to array
  students.push(student);
}

function getCleanName(name) {
  return name[0].toUpperCase() + name.substring(1, name.length).toLowerCase();
}

function getFirstName(name) {
  let firstName;
  if (name.indexOf(" ") === -1) {
    firstName = name.substring(0, name.length);
  } else {
    firstName = name.substring(0, name.indexOf(" "));
  }
  return getCleanName(firstName);
}

function getLastName(name) {
  let lastName = name.substring(name.lastIndexOf(" ") + 1, name.length);
  return getCleanName(lastName);
}

function getHyphenLastName(name) {
  return (
    name.substring(0, name.indexOf("-") + 1) +
    name[name.indexOf("-") + 1].toUpperCase() +
    name.substring(name.indexOf("-") + 2, name.length)
  );
}

function getNickName(name) {
  let nickName = name.substring(name.indexOf('"') + 1, name.lastIndexOf('"'));
  return getCleanName(nickName);
}

function getMiddleName(name) {
  let middleName = name.substring(name.indexOf(" ") + 1, name.lastIndexOf(" "));
  return getCleanName(middleName);
}

function getGender(gender) {
  if (gender === "boy") {
    return "Boy";
  } else {
    return "Girl";
  }
}

function getHouse(house) {
  if (house.trim().toLowerCase() == "gryffindor") {
    return "Gryffindor";
  } else if (house.trim().toLowerCase() == "hufflepuff") {
    return "Hufflepuff";
  } else if (house.trim().toLowerCase() == "ravenclaw") {
    return "Ravenclaw";
  } else {
    return "Slytherin";
  }
}

function printStudent(thisStudent) {
  const template = document.querySelector("#one-student").content;
  const clone = template.cloneNode(true);
  clone.querySelector("#firstname").textContent = thisStudent.firstName;
  clone.querySelector("#nickname").textContent = thisStudent.nickName;
  clone.querySelector("#middlename").textContent = thisStudent.middleName;
  clone.querySelector("#lastname").textContent = thisStudent.lastName;
  clone.querySelector(".house").textContent = thisStudent.house;
  clone.querySelector(".one-student").dataset.house = thisStudent.house;
  clone.querySelector("article").addEventListener("click", function() {
    modal(thisStudent);
  });
  document.querySelector("body").appendChild(clone);
}

function modal(clickedStudent) {
  const modal = document.querySelector(".modal");
  modal.querySelector("#firstname").textContent = clickedStudent.firstName;
  modal.querySelector("#nickname").textContent = clickedStudent.nickName;
  modal.querySelector("#middlename").textContent = clickedStudent.middleName;
  modal.querySelector("#lastname").textContent = clickedStudent.lastName;
  modal.querySelector("#gender").textContent = clickedStudent.gender;
  modal.querySelector(".modal-house").textContent = clickedStudent.house;

  modal.dataset.house = clickedStudent.house;
  modal
    .querySelector("object")
    .setAttribute("data", "assets/" + clickedStudent.house + ".svg");
  const modalBg = document.querySelector(".modal-bg");
  modalBg.classList.remove("hide");
  modalBg.addEventListener("click", e => {
    modalBg.classList.add("hide");
  });
}
