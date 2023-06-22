let data = localStorage.getItem("data");

// If don't have anything in the local storage, assign dummy data to the variable
if (!data) {
  data = [
    {
      order: 1,
      student: "Cyrus",
      score: 80,
    },
    {
      order: 2,
      student: "Maria",
      score: 90,
    },
    {
      order: 3,
      student: "Roger",
      score: 70,
    },
    {
      order: 4,
      student: "Ethan",
      score: 60,
    },
    {
      order: 5,
      student: "Anna",
      score: 100,
    },
    {
      order: 6,
      student: "Gilbert",
      score: 40,
    },
    {
      order: 7,
      student: "Francesca",
      score: 50,
    },
  ];
} else {
  data = JSON.parse(data);
}

function openInNewTab(index) {
  // Find the coresponding element in the "data" variable
  const dataRow = data.find((row) => row.order === index + 1);

  window
    .open("/Exercise_2/index.html?score=" + dataRow.score, "_blank")
    .focus();
}

window.openInNewTab = openInNewTab;

// Create table based on "data"
let placeholder = document.querySelector("#data-output");
let out = "";

for (let i = 0; i < data.length; i++) {
  out += `
    <tr>
    <td onclick="window.openInNewTab(${i})">${data[i].order}</td>
    <td contenteditable="true">${data[i].student}</td>
    <td contenteditable="true">${data[i].score}</td>
    </tr>
    `;
}

placeholder.innerHTML = out;

const editableCells = document.querySelectorAll(
  "#data-output [contenteditable='true']"
);

function saveCellData(cell, index) {
  let headerCell;

  // Verify if we're on the "student" of "score" column
  if (index % 2 == 0) {
    headerCell = document.getElementById("student");
    cell.innerText = toUpperCase(cell.innerText);
    data[Math.floor(index / 2)]["student"] = cell.innerText;
  } else {
    headerCell = document.getElementById("score");
    cell.innerText = restrictToNumbers(cell.innerText);
    data[Math.floor(index / 2)]["score"] = cell.innerText;
  }

  localStorage.setItem("data", JSON.stringify(data));

  // Sort the column again only if it was already sorted
  const currentIsAscending = headerCell.classList.contains("th-sort-asc");
  const currentIsDescending = headerCell.classList.contains("th-sort-desc");

  if (currentIsAscending || currentIsDescending) {
    const tableElement = headerCell.parentElement.parentElement.parentElement;
    const headerIndex = Array.prototype.indexOf.call(
      headerCell.parentElement.children,
      headerCell
    );

    sortTable(tableElement, headerIndex, currentIsAscending);
  }
}

// Add functionality to the cells
editableCells.forEach((cell, index) => {
  cell.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      saveCellData(cell, index);
      event.preventDefault();
      cell.blur();
    }
  });

  cell.addEventListener("blur", () => {
    saveCellData(cell, index);
  });
});

function restrictToNumbers(value) {
  return value.replace(/[^\d]/g, "").substring(0, 3);
}

function toUpperCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function sortTable(table, column, asc = true) {
  // If we're at the "Order" column, we don't want any sorting to be applied
  if (column === 0) return;

  let dirModifier;

  if (asc) {
    dirModifier = 1;
  } else {
    dirModifier = -1;
  }

  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));

  const sortedRows = rows.sort((a, b) => {
    const cellA = a.querySelector(`td:nth-child(${column + 1})`);
    const cellB = b.querySelector(`td:nth-child(${column + 1})`);
    let textA = cellA.textContent.trim();
    let textB = cellB.textContent.trim();

    // If we're at the "Score" column we want to sort numbers, not strings
    if (column === 2) {
      textA = parseInt(textA, 10);
      textB = parseInt(textB, 10);
    }

    if (textA < textB) {
      return -1 * dirModifier;
    } else if (textA > textB) {
      return 1 * dirModifier;
    } else {
      return 0;
    }
  });

  // Update the table content
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  tBody.append(...sortedRows);

  // Apply the corect classes to the table's headings
  table
    .querySelectorAll("th")
    .forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-asc", asc);
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-desc", !asc);
}

const headerCells = document.querySelectorAll(".table-sortable th");

// Add event listeners to the table's headings
for (let i = 0; i < headerCells.length; i++) {
  const headerCell = headerCells[i];

  headerCell.addEventListener("click", function () {
    const tableElement = headerCell.parentElement.parentElement.parentElement;

    const headerIndex = Array.prototype.indexOf.call(
      headerCell.parentElement.children,
      headerCell
    );

    const currentIsAscending = headerCell.classList.contains("th-sort-asc");

    sortTable(tableElement, headerIndex, !currentIsAscending);
  });
}
