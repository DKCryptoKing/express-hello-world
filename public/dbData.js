// Fetch the data from our Express server's /api/data endpoint
fetch('/api/data')
  .then(response => response.json()) // Parse the JSON data from the response
  .then(data => {
    // Log the data to the console
    console.log('Data from MongoDB:', data);

    // Select the table body
    const tableBody = document.querySelector('#data-table tbody');

    // Iterate over the data array
    data.forEach(item => {
      // Create a new table row
      const row = document.createElement('tr');

      // Create table cells for each property of the item
      const dateCell = document.createElement('td');
      dateCell.setAttribute('data-sort', new Date(item.date).getTime());
      dateCell.textContent = new Date(item.date).toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' });

      const locationCell = document.createElement('td');
      locationCell.textContent = item.location;

      const severityCell = document.createElement('td');
      severityCell.textContent = item.severity;

      const durationCell = document.createElement('td');
      durationCell.textContent = item.duration;

      const vomitingCell = document.createElement('td');
      vomitingCell.textContent = item.vomiting;

      const calledHomeCell = document.createElement('td');
      calledHomeCell.textContent = item.calledHome;

      const triggerCell = document.createElement('td');
      triggerCell.textContent = item.trigger;

      const noteCell = document.createElement('td');
      noteCell.textContent = item.note;

      // Append the cells to the row
      row.append(dateCell, locationCell, severityCell, durationCell, vomitingCell, calledHomeCell, triggerCell, noteCell);

      // Append the row to the table body
      tableBody.append(row);
    });

    // Call sorttable on the populated table
    const dataTable = document.querySelector('#data-table');
    sorttable.makeSortable(dataTable);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
