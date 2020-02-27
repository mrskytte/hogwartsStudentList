"use strict";
window.addEventListener("DOMContentLoaded", init);

const Student = {
  firstName: "",
  lastName: "",
  middleName: null,
  nickName: null,
  gender: "",
  imageSrc: null,
  house: "",
  bloodstatus: "",
  isEnrolled: "enrolled",
  isSquad: null,
  isPrefect: null
};

let countFiles = 0;
const students = [];
let filteredStudents;
const bloodLines = { half: [], pure: [] };
let gryffindorStudents = 0;
let hufflepuffStudents = 0;
let ravenclawStudents = 0;
let slytherinStudents = 0;
const expelled = [];

const settings = {
  sort: null,
  filterHouse: null,
  filterEnrollment: null,
  filterAddInfo: null,
  filterBlood: null,
  hacked: false
};

// arrow code down : "&#x2B07;" up &#x2B06;

function init() {
  loadJSON("//petlatkea.dk/2020/hogwarts/students.json", prepareStudents);
  loadJSON("//petlatkea.dk/2020/hogwarts/families.json", storeFamilyBloodline);
  prepareEventListeners();
}

function loadJSON(url, callback) {
  fetch(url)
    .then(e => e.json())
    .then(callback);
}

function storeFamilyBloodline(allBloodlines) {
  bloodLines.half = allBloodlines.half;
  bloodLines.pure = allBloodlines.pure;
  countFiles++;
  if (countFiles === 2) {
    checkBloodline();
    prepareData();
  }
}

function prepareStudents(allStudents) {
  allStudents.forEach(createStudentObject);
  countFiles++;
  if (countFiles === 2) {
    checkBloodline();
    prepareData();
  }
}

function prepareData() {
  addImgSrc();
  houseCount();
  filteredStudents = students;
  checkFilterNSort();
}

function checkFilterNSort() {
  console.log("called");
  filteredStudents = checkFilters();
  filteredStudents = checkSort(filteredStudents);

  displayList();
}

function prepareEventListeners() {
  const searchBtn = document.querySelector("#search");
  const sortBtn = document.querySelector("#sort");
  const sortDirectionBtn = document.querySelector("#sort-direction");
  const houseFilterBtn = document.querySelector("#house");
  const enrollmentFilterBtn = document.querySelector("#enrollment");
  const addInfoFilterBtn = document.querySelector("#additional");
  const bloodFilterBtn = document.querySelector("#blood");
  const clearFilterBtn = document.querySelector("#clear");
  searchBtn.addEventListener("click", prepareSearch);
  sortBtn.addEventListener("input", prepareSearch);
  sortDirectionBtn.addEventListener("click", prepareSearch);
  houseFilterBtn.addEventListener("input", prepareSearch);
  enrollmentFilterBtn.addEventListener("input", prepareSearch);
  addInfoFilterBtn.addEventListener("input", prepareSearch);
  bloodFilterBtn.addEventListener("input", prepareSearch);
  clearFilterBtn.addEventListener("click", prepareSearch);
}

function prepareSearch() {
  const searchBar = document.querySelector("#searchbar");
  const searchModal = document.querySelector("#search-modal");
  searchModal.classList.remove("hide");
  searchBar.focus();
  startSearch();
  searchBar.addEventListener("input", startSearch);
  window.addEventListener("keydown", e => {
    if (e.keyCode === 13 || e.keyCode === 27) {
      searchModal.classList.add("hide");
      searchBar.value = "";
    }
  });
  function startSearch() {
    filteredStudents = [];
    students.forEach(student => {
      let fullName = student.firstName;
      if (student.middleName !== null) {
        fullName += ` ${student.middleName}`;
      }
      if (student.nickName !== null) {
        fullName += ` ${student.nickName}`;
      }
      fullName += ` ${student.lastName}`;
      fullName = fullName.toLowerCase();
      if (fullName.includes(searchBar.value.toLowerCase())) {
        filteredStudents.push(student);
      }
    });
    settings.filterHouse = "Gryffindor";
    checkFilterNSort();
  }
}

function createStudentObject(oneStudent) {
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
    student.nickName = getNickname(studName);
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

function addImgSrc() {
  students.forEach(thisStudent => {
    if (
      students.filter(student =>
        student.lastName === thisStudent.lastName ? true : false
      ).length > 1
    ) {
      thisStudent.imageSrc = `/assets/images/${thisStudent.lastName.toLowerCase()}_${thisStudent.firstName.toLowerCase()}`;
    } else {
      thisStudent.imageSrc = `/assets/images/${thisStudent.lastName.toLowerCase()}_${thisStudent.firstName[0].toLowerCase()}`;
    }
  });
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

function getNickname(name) {
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

function checkBloodline() {
  students.forEach(student => {
    bloodLines.half.includes(student.lastName)
      ? (student.bloodstatus = "half")
      : bloodLines.pure.includes(student.lastName)
      ? (student.bloodstatus = "pure")
      : (student.bloodstatus = "muggleborn");
  });
}

function houseCount() {
  students.forEach(student => {
    student.house === "Gryffindor"
      ? gryffindorStudents++
      : student.house === "Hufflepuff"
      ? hufflepuffStudents++
      : student.house === "Ravenclaw"
      ? ravenclawStudents++
      : slytherinStudents++;
  });
}

function checkFilters() {
  if (
    settings.filterHouse === null &&
    settings.filterEnrollment === null &&
    settings.filterBlood === null &&
    settings.filterAddInfo === null
  ) {
    return filteredStudents;
  } else {
    if (settings.filterHouse !== null) {
      filteredStudents = filterStudents(settings.filterHouse);
    }
    if (settings.filterEnrollment !== null) {
      filteredStudents = filterStudents(settings.filterEnrollment);
    }
    if (settings.filterBlood !== null) {
      filteredStudents = filterStudents(settings.filterBlood);
    }
    if (settings.filterAddInfo !== null) {
      filteredStudents = filterStudents(settings.filterAddInfo);
    }
    return filteredStudents;
  }
}

function filterStudents(filterOption) {
  let thisFilter = filteredStudents.filter(hasFilterOption);
  return thisFilter;
  function hasFilterOption(student) {
    if (
      student.house === filterOption ||
      student.isEnrolled === filterOption ||
      student.bloodstatus === filterOption ||
      student.isPrefect === filterOption ||
      student.isSquad === filterOption
    ) {
      return true;
    } else {
      return false;
    }
  }
}

function checkSort(currentStudentList) {
  settings.sort = "firstName";
  currentStudentList.sort(compareFunction);
  function compareFunction(a, b) {
    return a[settings.sort] < b[settings.sort] ? -1 : 1;
  }
  console.log(currentStudentList);
  return currentStudentList;
}

function displayList() {
  document.querySelector("#studentlist").innerHTML = "";
  filteredStudents.forEach(displayStudents);
}

function displayStudents(thisStudent) {
  console.log("show");
  const template = document.querySelector("#one-student").content;
  const clone = template.cloneNode(true);
  clone.querySelector("#firstname").textContent = thisStudent.firstName;
  clone.querySelector("#nickname").textContent = thisStudent.nickName;
  clone.querySelector("#middlename").textContent = thisStudent.middleName;
  clone.querySelector("#lastname").textContent = thisStudent.lastName;
  clone.querySelector("article").addEventListener("click", function() {
    modal(thisStudent);
  });
  document.querySelector("#studentlist").appendChild(clone);
}

function modal(clickedStudent) {
  // const modal = document.querySelector(".modal");
  // modal.querySelector("#firstname").textContent = clickedStudent.firstName;
  // modal.querySelector("#nickname").textContent = clickedStudent.nickName;
  // modal.querySelector("#middlename").textContent = clickedStudent.middleName;
  // modal.querySelector("#lastname").textContent = clickedStudent.lastName;
  // modal.querySelector("#gender").textContent = clickedStudent.gender;
  // modal.querySelector(".modal-house").textContent = clickedStudent.house;
  // modal.dataset.house = clickedStudent.house;
  // // modal
  // //   .querySelector("img")
  // //   .setAttribute("src", "assets/" + clickedStudent.house + ".png");
  const modalBg = document.querySelector(".modal-bg");
  modalBg.classList.remove("hide");
  modalBg.addEventListener("click", e => {
    modalBg.classList.add("hide");
  });
}
