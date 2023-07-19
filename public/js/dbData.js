// Function to handle editing a record
function editRecord(recordId) {
  console.log('Record ID:', recordId);
  // Fetch the record data from the API
  fetch(`/api/data/${recordId}`)
    .then((response) => response.json())
    .then((record) => {
      // Populate the form fields with the record data
      document.getElementById('editModalLabel').textContent = 'Edit Record';
      document.getElementById('location').value = record.location;
      document.getElementById('severity').value = record.severity;
      document.getElementById('duration').value = record.duration;
      document.getElementById('vomiting').value = record.vomiting;
      document.getElementById('calledHome').value = record.calledHome;
      document.getElementById('date').value = formatDate(record.date);
      document.getElementById('trigger').value = record.trigger;

      // Show the edit modal
      const editModal = new bootstrap.Modal(document.getElementById('editModal'));
      editModal.show();

      // Save button event listener
      document.getElementById('saveButton').addEventListener('click', () => {
        const updatedRecord = {
          location: document.getElementById('location').value,
          severity: document.getElementById('severity').value,
          duration: document.getElementById('duration').value,
          vomiting: document.getElementById('vomiting').value,
          calledHome: document.getElementById('calledHome').value,
          date: new Date(document.getElementById('date').value),
          trigger: document.getElementById('trigger').value,
        };

        // Send the updated record to the API for saving
        fetch(`/api/data/${recordId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedRecord),
        })
          .then(() => {
            // Refresh the table after saving the updated record
            fetchTableData();
            // Close the edit modal
            editModal.hide();
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

// Function to format date as yyyy-mm-dd
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Fetch table data
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

            row.appendChild(td);
          }
        });

        // Create Edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('btn', 'btn-primary', 'btn-sm');
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
        buttonCell.appendChild(deleteButton);

        row.appendChild(buttonCell);
        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      tableDiv.appendChild(table);
    })
    .catch((error) => {
      console.log('Error fetching data:', error);
    });
}

// Function to handle deleting a record
function deleteRecord(recordId) {
  // Confirm deletion with the user
  if (confirm('Are you sure you want to delete this record?')) {
    // Send delete request to the API
    fetch(`/api/data/${recordId}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Refresh the table after deleting the record
        fetchTableData();
      })
      .catch((error) => {
        console.log('Error deleting record:', error);
      });
  }
}

// Fetch initial table data on page load
fetchTableData();
