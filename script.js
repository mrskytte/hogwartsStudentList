window.addEventListener("DOMContentLoaded", init);

function init() {
  fetch("students1991.json")
    .then(e => e.json())
    .then(showStudents);
}

const Student = {
  firstName: "",
  lastName: "",
  middleName: undefined,
  nickName: undefined,
  gender: "",
  image: null,
  house: "",
  OWLScore: 0,
  isPrefect: false
};
const students = [];

function showStudents(allStudents) {
  allStudents.forEach(createArr);
}

function createArr(oneStudent) {
  const studName = oneStudent.fullname.trim();
  const student = Object.create(Student);
  // Find and capitalize first name
  if (studName.indexOf(" ") === -1) {
    student.firstName = studName.substring(0, studName.length);
  } else {
    student.firstName = studName.substring(0, studName.indexOf(" "));
  }
  student.firstName =
    student.firstName[0].toUpperCase() +
    student.firstName.substring(1, student.firstName.length).toLowerCase();

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
  console.log(student);
}

let fullname = jsonObject.fullname;
let animal = Object.create(Animals);
animal.name = fullname.substring(0, fullname.indexOf(" "));
animal.type = fullname.substring(
  fullname.lastIndexOf(" ") + 1,
  fullname.length
);
animal.description = fullname.substring(
  fullname.indexOf(" "),
  fullname.lastIndexOf(" ")
);
animal.description = animal.description.substring(
  animal.description.lastIndexOf(" ") + 1,
  animal.description.length
);
animal.age = jsonObject.age;
// TODO: MISSING CODE HERE !!!
allAnimals.push(animal);

// function printStudent(OneStudent) {
//   var template = document.querySelector("#one-student").content;
//   var clone = template.cloneNode(true);
//   clone.querySelector(".name").textContent = OneStudent.fullname;
//   clone.querySelector(".house").textContent = OneStudent.house;
//   clone.querySelector(".one-student").dataset.house = OneStudent.house;
//   clone.querySelector("article").addEventListener("click", modal);
//   document.querySelector("body").appendChild(clone);
//   function modal() {
//     var modal = document.querySelector(".modal");
//     modal.querySelector("h1").textContent = OneStudent.fullname;
//     modal.querySelector("h2").textContent = OneStudent.house;
//     modal.dataset.house = OneStudent.house;
//     modal
//       .querySelector("object")
//       .setAttribute("data", "assets/" + OneStudent.house + ".svg");
//     var modalBg = document.querySelector(".modal-bg");
//     modalBg.classList.remove("hide");
//     modalBg.addEventListener("click", e => {
//       modalBg.classList.add("hide");
//     });
//   }
// }
