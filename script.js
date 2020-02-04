window.addEventListener("DOMContentLoaded", init);

function init() {
  fetch("students1991.json")
    .then(e => e.json())
    .then(showStudents);
}

function showStudents(student) {
  student.forEach(printStudent);
}

function printStudent(OneStudent) {
  var template = document.querySelector("#one-student").content;
  var clone = template.cloneNode(true);
  clone.querySelector(".name").textContent = OneStudent.fullname;
  clone.querySelector(".house").textContent = OneStudent.house;

  document.querySelector("body").appendChild(clone);
  console.log(OneStudent);
}
