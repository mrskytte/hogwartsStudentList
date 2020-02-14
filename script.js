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
  nickName: undefined
};
console.log(Student.middleName);

const students = [];
function showStudents(student) {
  student.forEach(createArr);
}

function printStudent(OneStudent) {
  var template = document.querySelector("#one-student").content;
  var clone = template.cloneNode(true);
  clone.querySelector(".name").textContent = OneStudent.fullname;
  clone.querySelector(".house").textContent = OneStudent.house;
  clone.querySelector(".one-student").dataset.house = OneStudent.house;
  clone.querySelector("article").addEventListener("click", modal);
  document.querySelector("body").appendChild(clone);
  function modal() {
    var modal = document.querySelector(".modal");
    modal.querySelector("h1").textContent = OneStudent.fullname;
    modal.querySelector("h2").textContent = OneStudent.house;
    modal.dataset.house = OneStudent.house;
    modal
      .querySelector("object")
      .setAttribute("data", "assets/" + OneStudent.house + ".svg");
    var modalBg = document.querySelector(".modal-bg");
    modalBg.classList.remove("hide");
    modalBg.addEventListener("click", e => {
      modalBg.classList.add("hide");
    });
  }
}

// document.querySelector("select#theme").addEventListener("change", selected);

// function selected() {
//   document.querySelector(".modal").dataset.house = this.value;
// }
