fetch('/api/data')
  .then((response) => response.json())
  .then((data) => {
    console.log('Data from MongoDB:', data);
    const tableDiv = document.getElementById('tableDiv');
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped');

    // Create table head
    const thead = document.createElement('thead');
    const tableHeadRow = document.createElement('tr');

    const headers = Object.keys(data[0]).filter(
      (key) => key !== '_id' && key !== '__v'
    );

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
            key === 'date' ||  // Add this condition for "Date"
            key === 'trigger'  // Add this condition for "Trigger"
          ) {
            td.classList.add('text-center'); // Center align the specific fields
          }

          if (key === 'date') {
            const date = new Date(item[key]);
            const formattedDate = date.toLocaleDateString('da-DK', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });
            td.textContent = formattedDate;
          } else {
            td.textContent = item[key];
          }

          row.appendChild(td);
        }
      });

      tbody.appendChild(row);
    });

    table.appendChild(tbody);

    tableDiv.appendChild(table);
  })
  .catch((error) => {
    console.log('Error fetching data:', error);
  });
