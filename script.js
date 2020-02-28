"use strict";
window.addEventListener("DOMContentLoaded", init);

const Student = {
  fullName: "",
  firstName: "",
  lastName: "",
  middleName: null,
  nickName: null,
  gender: "",
  imageSrc: null,
  house: "",
  bloodstatus: "",
  isEnrolled: "enrolled",
  isSquad: true,
  isPrefect: false
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
  sortDirection: "asc",
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
  initFilterNSort();
}

function initFilterNSort() {
  filteredStudents = students;
  checkFilterNSort();
}

function checkFilterNSort() {
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

  sortBtn.addEventListener("input", () => setSort(sortBtn.value));

  sortDirectionBtn.addEventListener("click", changeSortDirection);

  houseFilterBtn.addEventListener("input", () => {
    settings.filterHouse = setFilter(houseFilterBtn.value, true);
    initFilterNSort();
  });

  enrollmentFilterBtn.addEventListener("input", () => {
    settings.filterEnrollment = setFilter(enrollmentFilterBtn.value);
    initFilterNSort();
  });

  addInfoFilterBtn.addEventListener("input", () => {
    settings.filterAddInfo = setFilter(addInfoFilterBtn.value);
    initFilterNSort();
  });

  bloodFilterBtn.addEventListener("input", () => {
    settings.filterBlood = setFilter(bloodFilterBtn.value);
    initFilterNSort();
  });

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
        student.fullName = fullName.toLowerCase();
        if (fullName.includes(searchBar.value.toLowerCase())) {
          filteredStudents.push(student);
        }
      });
      checkFilterNSort();
    }
  }

  function setSort(input) {
    settings.sort = input;
    activateClearBtn();
    initFilterNSort();
  }

  function changeSortDirection() {
    settings.sortDirection = settings.sortDirection === "asc" ? "desc" : "asc";
    initFilterNSort();
  }

  function setFilter(value, marker) {
    activateClearBtn();
    return marker ? getCleanName(value) : value;
  }

  function activateClearBtn() {
    clearFilterBtn.dataset.status = "enabled";
    clearFilterBtn.addEventListener("click", resetSettings);
    function resetSettings() {
      clearSettings();
      resetSelecters();
    }
    function clearSettings() {
      settings.sort = null;
      settings.filterHouse = null;
      settings.filterBlood = null;
      settings.filterEnrollment = null;
      settings.filterAddInfo = null;
      settings.sortDirection = "asc";
      clearFilterBtn.dataset.status = "disabled";
      initFilterNSort();
    }
    function resetSelecters() {
      sortBtn.value = "default";
      sortDirectionBtn.value = "default";
      houseFilterBtn.value = "default";
      enrollmentFilterBtn.value = "default";
      addInfoFilterBtn.value = "default";
      bloodFilterBtn.value = "default";
      sortDirectionBtn.dataset.status = "disabled";
    }
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
  // Set full clean name
  let fullName = student.firstName;
  if (student.middleName !== null) {
    fullName += ` ${student.middleName}`;
  }
  if (student.nickName !== null) {
    fullName += ` ${student.nickName}`;
  }
  fullName += ` ${student.lastName}`;
  student.fullName = fullName;
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
      thisStudent.imageSrc = `/assets/images/${thisStudent.lastName.toLowerCase()}_${thisStudent.firstName.toLowerCase()}.png`;
    } else if (thisStudent.lastName === "") {
      thisStudent.imageSrc = `/assets/hogwarts.png`;
    } else {
      thisStudent.imageSrc = `/assets/images/${thisStudent.lastName.toLowerCase()}_${thisStudent.firstName[0].toLowerCase()}.png`;
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
      ? (student.bloodstatus = "Half-Blood")
      : bloodLines.pure.includes(student.lastName)
      ? (student.bloodstatus = "Pure-Blood")
      : (student.bloodstatus = "Muggle-Born");
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
  currentStudentList.sort(compareFunction);
  function compareFunction(a, b) {
    if (settings.sortDirection === "asc") {
      return a[settings.sort] < b[settings.sort] ? -1 : 1;
    } else {
      return a[settings.sort] < b[settings.sort] ? 1 : -1;
    }
  }
  displaySortDirection();
  return currentStudentList;
}

function displaySortDirection() {
  const sortDirectionBtn = document.querySelector("#sort-direction");
  if (settings.sortDirection === "asc") {
    sortDirectionBtn.innerHTML = "&#x2B06";
  } else {
    sortDirectionBtn.innerHTML = "&#x2B07";
  }
  if (settings.sort) {
    sortDirectionBtn.dataset.status = "enabled";
  }
}

function displayList() {
  document.querySelector("#studentlist").innerHTML = "";
  filteredStudents.forEach(displayStudents);
}

function displayStudents(thisStudent) {
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

function modal(cs) {
  const modal = document.querySelector("#modal");
  resetModal(modal);
  setBaseInfo(modal, cs);
  checkAdditionalData(modal, cs);

  const modalBg = document.querySelector(".modal-bg");
  modalBg.classList.remove("hide");
  modalBg.addEventListener("click", e => {
    modalBg.classList.add("hide");
  });
}

function checkAdditionalData(modal, cs) {
  if (cs.isPrefect) {
    setPrefectText(modal, true);
  } else {
    setPrefectText(modal, false);
  }
  if (cs.isSquad) {
    setSquadText(modal, true);
  } else {
    setSquadText(modal, false);
  }
  if (cs.isEnrolled === "enrolled") {
    setEnrolledText(modal, true);
  } else {
    setEnrolledText(modal, false);
  }
}

function setPrefectText(modal, status) {
  if (status) {
    modal.querySelector("#prefect-status p").textContent =
      "This Student is a Prefect";
    modal.querySelector("#prefect-button").textContent = "Demote from Prefect";
  } else {
    modal.querySelector("#prefect-status p").textContent =
      "This Student is not a Prefect";
    modal.querySelector("#prefect-button").textContent = "Promote to Prefect";
  }
}

function setSquadText(modal, status) {
  if (status) {
    modal.querySelector("#squad-status p").textContent =
      "This Student is a Member of the Inguisitorial Squad";
    modal.querySelector("#squad-button").textContent = "Revoke Membership";
  } else {
    modal.querySelector("#squad-status p").textContent =
      "This Student is not a Member of the Inguisitorial Squad";
    modal.querySelector("#squad-button").textContent = "Grant Membership";
  }
}

function setEnrolledText(modal, status) {
  if (status) {
    modal.querySelector("#enrolled-status p").textContent =
      "This Student is Currently Enrolled at Hogwarts";
    modal.querySelector("#enrollment-button").textContent = "Expel Student";
  } else {
    modal.querySelector("#enrolled-status p").textContent =
      "This Student has been Expelled from Hogwarts";
    modal.querySelector("#enrollment-button").textContent = "Re-Admit Student";
  }
}

function setBaseInfo(modal, cs) {
  modal.querySelector("#student-name").textContent = cs.fullName;
  modal.querySelector("#first-name").textContent = cs.firstName;
  if (!cs.nickName) {
    console.log("no nickname");
    modal.querySelector("#nickname").classList.add("hide");
    modal.querySelector("#nick-title").classList.add("hide");
  } else {
    console.log("nickname");
    modal.querySelector("#nickname").textContent = cs.nickName;
  }
  if (!cs.middleName) {
    console.log("no middlename");
    modal.querySelector("#middle-name").classList.add("hide");
    modal.querySelector("#middle-title").classList.add("hide");
  } else {
    console.log("middlename");
    modal.querySelector("#middle-name").textContent = cs.middleName;
  }
  if (!cs.lastName) {
    console.log("no lastname");
    modal.querySelector("#last-name").classList.add("hide");
    modal.querySelector("#last-title").classList.add("hide");
  } else {
    console.log("lastname");
    modal.querySelector("#last-name").textContent = cs.lastName;
  }
  modal.querySelector("#last-name").textContent = cs.lastName;
  modal.querySelector("#gender").textContent = cs.gender;
  modal
    .querySelector("#housecrest img")
    .setAttribute("src", `assets/${cs.house}.png`);
  modal.dataset.house = cs.house;
  modal.querySelector("#student-photo img").setAttribute("src", cs.imageSrc);
  modal.querySelector("#blood-status").textContent = cs.bloodstatus;
}

function resetModal(modal) {
  modal.querySelector("#nickname").classList.remove("hide");
  modal.querySelector("#nick-title").classList.remove("hide");
  modal.querySelector("#middle-name").classList.remove("hide");
  modal.querySelector("#middle-title").classList.remove("hide");
  modal.querySelector("#last-name").classList.remove("hide");
  modal.querySelector("#last-title").classList.remove("hide");
}
