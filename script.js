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

document.querySelector("select#theme").addEventListener("change", selected);

function selected() {
  const modal = document.querySelector(".modal");
  modal.dataset.house = this.value;
  console.log(modal.dataset.house);
}
