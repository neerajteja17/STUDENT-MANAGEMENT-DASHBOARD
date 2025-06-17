let students = JSON.parse(localStorage.getItem("students")) || [];

function saveToStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

function renderTable(data = students) {
  const table = document.getElementById("studentTableBody");
  table.innerHTML = "";
  data.forEach((student, index) => {
    table.innerHTML += `
      <tr>
        <td class="p-2 border">${student.name}</td>
        <td class="p-2 border">${student.regno}</td>
        <td class="p-2 border">${student.dept}</td>
        <td class="p-2 border">${student.year}</td>
        <td class="p-2 border">${student.marks}</td>
        <td class="p-2 border">
          <button onclick="editStudent(${index})" class="text-yellow-600 hover:text-yellow-800 mx-1">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button onclick="deleteStudent(${index})" class="text-red-600 hover:text-red-800 mx-1">
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      </tr>`;
  });
}

function addStudent() {
  const name = document.getElementById("name").value.trim();
  const regno = document.getElementById("regno").value.trim();
  const dept = document.getElementById("dept").value.trim();
  const year = document.getElementById("year").value.trim();
  const marks = document.getElementById("marks").value.trim();

  if (!name || !regno || !dept || !year || !marks) {
    Swal.fire("Error", "Please fill all fields", "error");
    return;
  }

  students.push({ name, regno, dept, year, marks });
  saveToStorage();
  renderTable();

  document.querySelectorAll("input").forEach(input => input.value = "");

  const btn = document.getElementById("addBtn");
  btn.classList.add("bg-green-600");
  setTimeout(() => btn.classList.remove("bg-green-600"), 800);

  Swal.fire("Success", "Student added successfully!", "success");
}

function deleteStudent(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "This student will be removed.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!"
  }).then(result => {
    if (result.isConfirmed) {
      students.splice(index, 1);
      saveToStorage();
      renderTable();
      Swal.fire("Deleted!", "Student has been deleted.", "success");
    }
  });
}

function editStudent(index) {
  const student = students[index];
  Swal.fire({
    title: "Edit Student Info",
    html: `
      <input id="swal-name" class="swal2-input" value="${student.name}" placeholder="Name"/>
      <input id="swal-regno" class="swal2-input" value="${student.regno}" placeholder="Reg No"/>
      <input id="swal-dept" class="swal2-input" value="${student.dept}" placeholder="Department"/>
      <input id="swal-year" class="swal2-input" type="number" value="${student.year}" placeholder="Year"/>
      <input id="swal-marks" class="swal2-input" type="number" value="${student.marks}" placeholder="Marks"/>
    `,
    confirmButtonText: "Save",
    focusConfirm: false,
    preConfirm: () => {
      const name = document.getElementById("swal-name").value;
      const regno = document.getElementById("swal-regno").value;
      const dept = document.getElementById("swal-dept").value;
      const year = document.getElementById("swal-year").value;
      const marks = document.getElementById("swal-marks").value;
      if (!name || !regno || !dept || !year || !marks) {
        Swal.showValidationMessage("All fields required");
      }
      return { name, regno, dept, year, marks };
    }
  }).then(result => {
    if (result.isConfirmed) {
      students[index] = result.value;
      saveToStorage();
      renderTable();
      Swal.fire("Updated", "Student info updated.", "success");
    }
  });
}

function searchStudents() {
  const keyword = document.getElementById("search").value.toLowerCase();
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(keyword) || s.regno.toLowerCase().includes(keyword)
  );
  renderTable(filtered);
}

// Initial table load
renderTable();
