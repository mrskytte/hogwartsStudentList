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
  isSquad: false,
  isPrefect: false,
  isHacker: false
};

let countFiles = 0;
let enrolledStudents = [];
let expelledStudents = [];
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
  filterEnrollment: "enrolled",
  filterAddInfo: null,
  filterBlood: null,
  hacked: false
};

function init() {
  loadJSON("//petlatkea.dk/2020/hogwarts/students.json", prepareStudents);
  loadJSON("//petlatkea.dk/2020/hogwarts/families.json", storeFamilyBloodline);
  prepareSettingsNSearch();
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
  filteredStudents =
    settings.filterEnrollment === "enrolled"
      ? enrolledStudents
      : expelledStudents;
  console.log(filteredStudents);
  checkFilterNSort();
}

function checkFilterNSort() {
  filteredStudents = checkFilters();
  filteredStudents = checkSort(filteredStudents);

  displayInit();
}

function prepareSettingsNSearch() {
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
      let searchValue = searchBar.value.toLowerCase();
      console.log(searchValue);
      if (searchValue === "i solemnly swear that i am up to no good") {
        filteredStudents = enrolledStudents;
        hackTheSystem();
      } else {
        filteredStudents = [];
        enrolledStudents.forEach(student => {
          let fullName = student.fullName.toLowerCase();
          if (fullName.includes(searchValue)) {
            filteredStudents.push(student);
          }
        });
      }
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
      settings.filterEnrollment = "enrolled";
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
  enrolledStudents.push(student);
}

function addImgSrc() {
  enrolledStudents.forEach(thisStudent => {
    if (
      enrolledStudents.filter(student =>
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
    return "Wizard";
  } else {
    return "Witch";
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
  if (settings.hacked) {
    enrolledStudents.forEach(student => {
      const randomNumber = Math.floor(Math.random() * 2);
      if (bloodLines.pure.includes(student.lastName)) {
        student.bloodstatus = randomNumber === 0 ? "Half-Blood" : "Muggle-Born";
      } else {
        student.bloodstatus = "Pure-Blood";
      }
    });
  } else {
    enrolledStudents.forEach(student => {
      bloodLines.half.includes(student.lastName)
        ? (student.bloodstatus = "Half-Blood")
        : bloodLines.pure.includes(student.lastName)
        ? (student.bloodstatus = "Pure-Blood")
        : (student.bloodstatus = "Muggle-Born");
    });
  }
}

function houseCount() {
  enrolledStudents.forEach(student => {
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
    if (settings.filterAddInfo === "prefects") {
      filteredStudents = filteredStudents.filter(student =>
        student.isPrefect ? true : false
      );
    }
    if (settings.filterAddInfo === "squad") {
      filteredStudents = filteredStudents.filter(student =>
        student.isSquad ? true : false
      );
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
      student.bloodstatus === filterOption
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

function displayInit() {
  displayList();
  displayAboutNumbers();
}

function displayAboutNumbers() {
  const gryfNumber = document.querySelector("#gryfnumber");
  const huffleNumber = document.querySelector("#hufflenumber");
  const ravenNumber = document.querySelector("#ravennumber");
  const slythNumber = document.querySelector("#slythnumber");
  const enrolledNumber = document.querySelector("#enrollednumber");
  const expelledNumber = document.querySelector("#expellednumber");
  const displayedNumber = document.querySelector("#displayednumber");

  gryfNumber.textContent = gryffindorStudents;
  huffleNumber.textContent = hufflepuffStudents;
  ravenNumber.textContent = ravenclawStudents;
  slythNumber.textContent = slytherinStudents;
  enrolledNumber.textContent = enrolledStudents.length;
  expelledNumber.textContent = expelledStudents.length;
  displayedNumber.textContent = filteredStudents.length;
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
    displayModal(thisStudent);
  });
  document.querySelector("#studentlist").appendChild(clone);
}

function displayModal(currentStudent) {
  const modal = document.querySelector("#modal");
  resetModal(modal);
  setBaseInfo(modal, currentStudent);
  checkAdditionalData(modal, currentStudent);
  activateModalBtns();
  checkEnrollmentStatus(currentStudent);

  const modalBg = document.querySelector(".modal-bg");
  modalBg.classList.remove("hide");

  function activateModalBtns() {
    modal
      .querySelector("#prefect-button")
      .addEventListener("click", togglePrefectStatus);

    function togglePrefectStatus() {
      const otherPrefect = enrolledStudents.filter(student =>
        student.isPrefect &&
        student.house === currentStudent.house &&
        student.gender === currentStudent.gender
          ? true
          : false
      );
      if (otherPrefect.length === 0 || currentStudent.isPrefect) {
        currentStudent.isPrefect = currentStudent.isPrefect ? false : true;
      } else {
        displayPrefectWarning(currentStudent, otherPrefect[0]);
      }
      removeEventListeners();
      displayModal(currentStudent);
    }

    modal
      .querySelector("#squad-button")
      .addEventListener("click", toggleSquadStatus);

    function toggleSquadStatus() {
      if (
        currentStudent.house === "Slytherin" ||
        currentStudent.bloodstatus === "Pure-Blood"
      ) {
        currentStudent.isSquad = currentStudent.isSquad ? false : true;
        if (settings.hacked) {
          setTimeout(displaySquadWarning, 1000);
        }
      } else {
        displaySquadWarning();
      }

      removeEventListeners();
      displayModal(currentStudent);
    }

    modal
      .querySelector("#enrollment-button")
      .addEventListener("click", toggleEnrollmentStatus);

    function toggleEnrollmentStatus() {
      if (currentStudent.isEnrolled === "enrolled") {
        currentStudent.isHacker
          ? displayHackerWarning()
          : expelStudent(currentStudent);
      } else {
        readmitStudent(currentStudent);
      }
      removeEventListeners();
      displayModal(currentStudent);
      displayInit();
    }

    function removeEventListeners() {
      modal
        .querySelector("#prefect-button")
        .removeEventListener("click", togglePrefectStatus);
      modal
        .querySelector("#squad-button")
        .removeEventListener("click", toggleSquadStatus);
      modal
        .querySelector("#enrollment-button")
        .removeEventListener("click", toggleEnrollmentStatus);
    }

    modal.querySelector("#close").addEventListener("click", closeModal);

    function closeModal() {
      modalBg.classList.add("hide");
      modal.querySelector("#close").removeEventListener("click", closeModal);
      removeEventListeners();
    }
  }

  function displaySquadWarning() {
    const squadWarning = document.querySelector("#squadwarning");
    if (settings.hacked) {
      squadWarning.querySelector("h1").textContent =
        "The Inquisitorial Squad has been desolved due to sucking to much";
      squadWarning.querySelector("h2").textContent =
        "Dumbledore's Army send their regards";
      currentStudent.isSquad = false;
      displayModal(currentStudent);
    }
    squadWarning.classList.remove("hide");
    squadWarning.querySelector("button").addEventListener("click", () => {
      squadWarning.classList.add("hide");
      squadWarning.querySelector("h1").textContent =
        "This student is not eligible for the Inguisitorial Squad";
      squadWarning.querySelector("h2").textContent =
        "Only Pure-Bloods or students of Slytherin are allowed";
    });
  }
}

function displayHackerWarning() {
  document.querySelector("#hackerwarning").classList.remove("hide");
  document
    .querySelector("#closehackerwarning")
    .addEventListener("click", () =>
      document.querySelector("#hackerwarning").classList.add("hide")
    );
}

function checkEnrollmentStatus(currentStudent) {
  document.querySelector("#student-modal").dataset.enrolmentstatus =
    currentStudent.isEnrolled;
}

function readmitStudent(currentStudent) {
  enrolledStudents = enrolledStudents.concat(
    expelledStudents.splice(expelledStudents.indexOf(currentStudent), 1)
  );
  if (currentStudent.house === "Gryffindor") {
    gryffindorStudents++;
  } else if (currentStudent.house === "Hufflepuff") {
    hufflepuffStudents++;
  } else if (currentStudent.house === "Ravenclaw") {
    ravenclawStudents++;
  } else {
    slytherinStudents++;
  }
  currentStudent.isEnrolled = "enrolled";
  document.querySelector("#student-modal").dataset.enrolmentstatus = "enrolled";
}

function expelStudent(currentStudent) {
  expelledStudents = expelledStudents.concat(
    enrolledStudents.splice(enrolledStudents.indexOf(currentStudent), 1)
  );
  if (currentStudent.house === "Gryffindor") {
    gryffindorStudents--;
  } else if (currentStudent.house === "Hufflepuff") {
    hufflepuffStudents--;
  } else if (currentStudent.house === "Ravenclaw") {
    ravenclawStudents--;
  } else {
    slytherinStudents--;
  }
  currentStudent.isEnrolled = "expelled";
  document.querySelector("#student-modal").dataset.enrolmentstatus = "expelled";
}

function displayPrefectWarning(currentStudent, otherPrefect) {
  const prefectWarning = document.querySelector("#prefectwarning");
  prefectWarning.classList.remove("hide");
  prefectWarning.querySelector("#currentprefect").textContent =
    otherPrefect.fullName;
  prefectWarning.querySelector("#prefectgender").textContent =
    otherPrefect.gender;
  prefectWarning.querySelector("#prefecthouse").textContent =
    otherPrefect.house;
  prefectWarning.querySelector("#newprefectname").textContent =
    currentStudent.fullName;
  prefectWarning.querySelector("#currentprefectname").textContent =
    otherPrefect.fullName;

  preparePrefectBtns(currentStudent, otherPrefect, prefectWarning);
}

function preparePrefectBtns(newPrefect, oldPrefect, prefectWarning) {
  document
    .querySelector("#choosenewprefect")
    .addEventListener("click", chooseNewPrefect);
  document
    .querySelector("#keepoldprefect")
    .addEventListener("click", keepOldPrefect);
  function chooseNewPrefect() {
    newPrefect.isPrefect = true;
    oldPrefect.isPrefect = false;
    prefectWarning.classList.add("hide");
    displayModal(newPrefect);
    removeEventListeners();
  }
  function keepOldPrefect() {
    prefectWarning.classList.add("hide");
    removeEventListeners();
  }
  function removeEventListeners() {
    document
      .querySelector("#choosenewprefect")
      .removeEventListener("click", chooseNewPrefect);
    document
      .querySelector("#keepoldprefect")
      .removeEventListener("click", keepOldPrefect);
  }
}

function checkAdditionalData(modal, currentStudent) {
  if (currentStudent.isPrefect) {
    setPrefectText(modal, true);
  } else {
    setPrefectText(modal, false);
  }
  if (currentStudent.isSquad) {
    setSquadText(modal, true);
  } else {
    setSquadText(modal, false);
  }
  if (currentStudent.isEnrolled === "enrolled") {
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

function setBaseInfo(modal, currentStudent) {
  modal.querySelector("#student-name").textContent = currentStudent.fullName;
  modal.querySelector("#first-name").textContent = currentStudent.firstName;
  if (!currentStudent.nickName) {
    modal.querySelector("#nickname").classList.add("hide");
    modal.querySelector("#nick-title").classList.add("hide");
  } else {
    modal.querySelector("#nickname").textContent = currentStudent.nickName;
  }
  if (!currentStudent.middleName) {
    modal.querySelector("#middle-name").classList.add("hide");
    modal.querySelector("#middle-title").classList.add("hide");
  } else {
    modal.querySelector("#middle-name").textContent = currentStudent.middleName;
  }
  if (!currentStudent.lastName) {
    modal.querySelector("#last-name").classList.add("hide");
    modal.querySelector("#last-title").classList.add("hide");
  } else {
    modal.querySelector("#last-name").textContent = currentStudent.lastName;
  }
  modal.querySelector("#last-name").textContent = currentStudent.lastName;
  modal.querySelector("#gender").textContent = currentStudent.gender;
  modal
    .querySelector("#housecrest img")
    .setAttribute("src", `assets/${currentStudent.house}.png`);
  modal.dataset.house = currentStudent.house;
  modal
    .querySelector("#student-photo img")
    .setAttribute("src", currentStudent.imageSrc);
  modal.querySelector("#blood-status").textContent = currentStudent.bloodstatus;
}

function resetModal(modal) {
  modal.querySelector("#nickname").classList.remove("hide");
  modal.querySelector("#nick-title").classList.remove("hide");
  modal.querySelector("#middle-name").classList.remove("hide");
  modal.querySelector("#middle-title").classList.remove("hide");
  modal.querySelector("#last-name").classList.remove("hide");
  modal.querySelector("#last-title").classList.remove("hide");
}

function hackTheSystem() {
  if (!settings.hacked) {
    settings.hacked = true;
    injectHackerToSystem();
    removeAllFromSquad();
    displayInit();
  }
}

function injectHackerToSystem() {
  const student = Object.create(Student);
  student.firstName = "Christoffer";
  student.middleName = "Skytte";
  student.nickName = "Hackerman";
  student.lastName = "Wielsøe";
  student.fullName = "Christoffer Skytte Wielsøe";
  student.house = "Hufflepuff";
  student.gender = "Wizard";
  student.bloodstatus = "Pure-Blood";
  student.imageSrc = "assets/images/hackerman.png";
  student.isHacker = true;
  enrolledStudents.push(student);
}

function removeAllFromSquad() {
  enrolledStudents.forEach(student => (student.isSquad = false));
}
