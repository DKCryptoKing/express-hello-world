// dbData.js
const rowHeaders = [
  'Date',
  'Location',
  'Severity',
  'Duration',
  'Vomiting',
  'Called Home',
  'Trigger',
  'Note'
];

function unlockPage() {
  const modalBackdrop = document.querySelector('.modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.remove();
  }
}

function fetchTableData() {
  fetch('/api/data')
    .then((response) => response.json())
    .then((data) => {
      console.log('Data from MongoDB:', data);
      const tableDiv = document.getElementById('tableDiv');
      tableDiv.innerHTML = '';

      if (data.length === 0) {
        const noDataMsg = document.createElement('p');
        noDataMsg.textContent = 'No data available.';
        tableDiv.appendChild(noDataMsg);
        return;
      }

      const table = document.createElement('table');
      table.classList.add('table', 'table-striped');

      // Create table head
      const thead = document.createElement('thead');
      const tableHeadRow = document.createElement('tr');

      const headers = Object.keys(data[0]).filter((key) => key !== '_id' && key !== '__v');

      headers.forEach((key) => {
        const th = document.createElement('th');
        th.textContent = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();
        th.classList.add('text-center'); // Center align the column headers
        tableHeadRow.appendChild(th);
      });

      thead.appendChild(tableHeadRow);
      table.appendChild(thead);

      // Create table body
      const tbody = document.createElement('tbody');

      data.forEach((item) => {
        const row = document.createElement('tr');

        headers.forEach((key) => {
          if (key !== '_id' && key !== '__v') {
            const td = document.createElement('td');

            if (
              key === 'location' ||
              key === 'severity' ||
              key === 'duration' ||
              key === 'vomiting' ||
              key === 'calledHome' ||
              key === 'date' ||
              key === 'trigger'
            ) {
              td.classList.add('text-center'); // Center align the specific fields
            }

            if (key === 'date') {
              const date = new Date(item[key]);
              const formattedDate = formatDate(date);
              td.textContent = formattedDate;
            } else {
              td.textContent = item[key];
            }

            if (key === 'note') {
              // Truncate note text and add click event to open modal
              const truncatedNote = truncateText(item[key], 100);
              td.innerHTML = `<span class="note-preview">${truncatedNote}</span>`;
              td.addEventListener('click', () => openCompleteDataModal(item));
            }

            row.appendChild(td);
          }
        });

        // Create Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('btn', 'btn-primary', 'btn-sm', 'me-1'); // Added 'me-1' class for margin
        editButton.setAttribute('data-bs-toggle', 'modal');
        editButton.setAttribute('data-bs-target', '#editModal');
        editButton.addEventListener('click', () => editRecord(item._id));

        // Create Delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteButton.addEventListener('click', () => deleteRecord(item._id));

        // Append buttons to a cell
        const buttonCell = document.createElement('td');
        buttonCell.appendChild(editButton);
        buttonCell.appendChild(document.createTextNode(' ')); // Added space between buttons
        buttonCell.appendChild(deleteButton);

        row.appendChild(buttonCell);
        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      tableDiv.appendChild(table);

      // Update the total count in the headline
      const totalCount = data.length;
      const pageHeading = document.querySelector('.page-heading');
      pageHeading.textContent = `Seizures (${totalCount})`;
    })
    .catch((error) => {
      console.log('Error fetching data:', error);
    })
    .finally(() => {
      // Unlock the screen after updating or deleting a record
      unlockPage();
    });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

function openCompleteDataModal(record) {
  const completeDataModal = new bootstrap.Modal(document.getElementById('completeDataModal'));

  completeDataModal.show();

  const completeDataContainer = document.getElementById('completeDataContainer');
  completeDataContainer.innerHTML = '';

  const table = document.createElement('table');
  table.classList.add('table');

  const tbody = document.createElement('tbody');

  Object.entries(record).forEach(([key, value]) => {
    if (key !== '_id' && key !== '__v' && key !== 'edit' && key !== 'delete') {
      const row = document.createElement('tr');

      const header = document.createElement('th');
      header.textContent = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();
      row.appendChild(header);

      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);

      tbody.appendChild(row);
    }
  });

  table.appendChild(tbody);
  completeDataContainer.appendChild(table);

  completeDataModal._element.addEventListener('hidden.bs.modal', () => {
    unlockPage();
  });
}

function editRecord(recordId) {
  fetch(`/api/data/${recordId}`)
    .then((response) => response.json())
    .then((record) => {
      document.getElementById('editModalLabel').textContent = 'Edit Record';
      document.getElementById('location').value = record.location;
      document.getElementById('severity').value = record.severity;
      document.getElementById('duration').value = record.duration;
      document.getElementById('vomiting').value = record.vomiting;
      document.getElementById('calledHome').value = record.calledHome;
      document.getElementById('date').valueAsDate = new Date(record.date); // Set the date value
      document.getElementById('trigger').value = record.trigger;
      document.getElementById('note').value = record.note;

      const editModal = new bootstrap.Modal(document.getElementById('editModal'));
      editModal.show();

      const saveButton = document.getElementById('saveButton');
      saveButton.addEventListener('click', () => {
        const updatedRecord = {
          location: document.getElementById('location').value,
          severity: document.getElementById('severity').value,
          duration: document.getElementById('duration').value,
          vomiting: document.getElementById('vomiting').value,
          calledHome: document.getElementById('calledHome').value,
          date: new Date(document.getElementById('date').value),
          trigger: document.getElementById('trigger').value,
          note: document.getElementById('note').value,
        };

        fetch(`/api/data/${recordId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedRecord),
        })
          .then(() => {
            fetchTableData();
            editModal.hide();
            unlockPage();
          })
          .catch((error) => {
            console.log('Error updating record:', error);
          });
      });
    })
    .catch((error) => {
      console.log('Error fetching record:', error);
    });
}

function deleteRecord(recordId) {
  const confirmation = confirm('Are you sure you want to delete this record?');

  if (confirmation) {
    fetch(`/api/data/${recordId}`, {
      method: 'DELETE',
    })
      .then(() => {
        fetchTableData();
      })
      .catch((error) => {
        console.log('Error deleting record:', error);
      });
  }
}

// Fetch initial table data on page load
fetchTableData();
// Fetch total record count
fetchTotalRecordCount();
