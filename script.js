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
const houses = ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"];

function showStudents(allStudents) {
  allStudents.forEach(createArr);
  students.forEach(printStudent);
}

function createArr(oneStudent) {
  const studName = oneStudent.fullname.trim();
  const student = Object.create(Student);
  // Find and capitalize first name
  if (studName.indexOf(" ") === -1) {
    student.firstName = studName.substring(0, studName.length);
  } else {
    student.firstName = studName.substring(0, studName.indexOf(" "));
    // Find and capitalize last name
    student.lastName = studName.substring(
      studName.lastIndexOf(" ") + 1,
      studName.length
    );
    student.lastName =
      student.lastName[0].toUpperCase() +
      student.lastName.substring(1, student.lastName.length).toLowerCase();

    if (student.lastName.indexOf("-") !== -1) {
      student.lastName =
        student.lastName.substring(0, student.lastName.indexOf("-") + 1) +
        student.lastName[student.lastName.indexOf("-") + 1].toUpperCase() +
        student.lastName.substring(
          student.lastName.indexOf("-") + 2,
          student.lastName.length
        );
    }
  }
  student.firstName =
    student.firstName[0].toUpperCase() +
    student.firstName.substring(1, student.firstName.length).toLowerCase();

  // Find nicknames and middlenames
  if (studName.indexOf(" ") !== studName.lastIndexOf(" ")) {
    // Find only nicknames and capitalize
    if (studName.indexOf(" ") + 1 == studName.indexOf('"')) {
      student.nickName = studName.substring(
        studName.indexOf('"') + 1,
        studName.lastIndexOf('"')
      );
      student.nickName =
        student.nickName[0].toUpperCase() +
        student.nickName.substring(1, student.nickName.length).toLowerCase();
    }
    // Find only middlename and capitalize
    else {
      student.middleName = studName.substring(
        studName.indexOf(" ") + 1,
        studName.lastIndexOf(" ")
      );
      student.middleName =
        student.middleName[0].toUpperCase() +
        student.middleName
          .substring(1, student.middleName.length)
          .toLowerCase();
      student.nickName = null;
    }
  }
  // Set all others to null
  else {
    student.middleName = null;
    student.nickName = null;
  }
  // Determine whether it's a boy or girl
  if (oneStudent.gender === "boy") {
    student.gender = "Boy";
  } else {
    student.gender = "Girl";
  }
  // Determine which house they belong to
  if (oneStudent.house.trim()[0].toLowerCase() === "g") {
    student.house = houses[0];
  } else if (oneStudent.house.trim()[0].toLowerCase() === "h") {
    student.house = houses[1];
  } else if (oneStudent.house.trim()[0].toLowerCase() === "r") {
    student.house = houses[2];
  } else {
    student.house = houses[3];
  }
  students.push(student);
  console.log(students);
}

function printStudent(thisStudent) {
  console.log(thisStudent);
  var template = document.querySelector("#one-student").content;
  var clone = template.cloneNode(true);
  clone.querySelector("#firstname").textContent = thisStudent.firstName;
  clone.querySelector("#nickname").textContent = thisStudent.nickName;
  clone.querySelector("#middlename").textContent = thisStudent.middleName;
  clone.querySelector("#lastname").textContent = thisStudent.lastName;
  clone.querySelector(".house").textContent = thisStudent.house;
  clone.querySelector(".one-student").dataset.house = thisStudent.house;
  clone.querySelector("article").addEventListener("click", modal);
  document.querySelector("body").appendChild(clone);
  function modal() {
    var modal = document.querySelector(".modal");
    modal.querySelector("#firstname").textContent = thisStudent.firstName;
    modal.querySelector("#nickname").textContent = thisStudent.nickName;
    modal.querySelector("#middlename").textContent = thisStudent.middleName;
    modal.querySelector("#lastname").textContent = thisStudent.lastName;
    modal.querySelector("#gender").textContent = thisStudent.gender;
    modal.querySelector(".modal-house").textContent = thisStudent.house;

    modal.dataset.house = thisStudent.house;
    modal
      .querySelector("object")
      .setAttribute("data", "assets/" + thisStudent.house + ".svg");
    var modalBg = document.querySelector(".modal-bg");
    modalBg.classList.remove("hide");
    modalBg.addEventListener("click", e => {
      modalBg.classList.add("hide");
    });
  }
}
