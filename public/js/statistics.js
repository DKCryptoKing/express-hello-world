// Fetch total number of seizures
fetch('/api/data')
  .then((response) => response.json())
  .then((data) => {
    const totalSeizures = data.length;
    const totalSeizuresDiv = document.getElementById('totalSeizures');
    totalSeizuresDiv.textContent = `Total Seizures: ${totalSeizures}`;

    // Fetch seizures by location
    const seizuresByLocation = {};
    // Fetch seizures by severity
    const seizuresBySeverity = {};
    // Fetch seizures by trigger
    const seizuresByTrigger = {};
    // Fetch seizures by duration
    const seizuresByDuration = {};
    // Fetch seizures by vomiting
    const seizuresByVomiting = {};

    // Count seizures for each category
    data.forEach((item) => {
      // Seizures by location
      const location = item.location;
      if (seizuresByLocation[location]) {
        seizuresByLocation[location]++;
      } else {
        seizuresByLocation[location] = 1;
      }

      // Seizures by severity
      const severity = item.severity;
      if (seizuresBySeverity[severity]) {
        seizuresBySeverity[severity]++;
      } else {
        seizuresBySeverity[severity] = 1;
      }

      // Seizures by trigger
      const trigger = item.trigger;
      if (seizuresByTrigger[trigger]) {
        seizuresByTrigger[trigger]++;
      } else {
        seizuresByTrigger[trigger] = 1;
      }

      // Seizures by duration
      const duration = item.duration;
      if (seizuresByDuration[duration]) {
        seizuresByDuration[duration]++;
      } else {
        seizuresByDuration[duration] = 1;
      }

      // Seizures by vomiting
      const vomiting = item.vomiting;
      if (seizuresByVomiting[vomiting]) {
        seizuresByVomiting[vomiting]++;
      } else {
        seizuresByVomiting[vomiting] = 1;
      }
    });

    // Prepare data for charts
    const locations = Object.keys(seizuresByLocation);
    const locationsSeizureCounts = Object.values(seizuresByLocation);
    const severityLabels = Object.keys(seizuresBySeverity);
    const severitySeizureCounts = Object.values(seizuresBySeverity);
    const triggerLabels = Object.keys(seizuresByTrigger);
    const triggerSeizureCounts = Object.values(seizuresByTrigger);
    const durationLabels = Object.keys(seizuresByDuration);
    const durationSeizureCounts = Object.values(seizuresByDuration);
    const vomitingLabels = Object.keys(seizuresByVomiting);
    const vomitingSeizureCounts = Object.values(seizuresByVomiting);

    // Generate seizures by location chart
    const ctxLocation = document.getElementById('seizuresByLocationChart').getContext('2d');
    new Chart(ctxLocation, {
      type: 'pie',
      data: {
        labels: locations,
        datasets: [{
          data: locationsSeizureCounts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            // Add more colors if you have more than two locations
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            // Add more colors if you have more than two locations
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Seizures by Location (%)'
          }
        }
      }
    });

    // Generate seizures by severity chart
    const ctxSeverity = document.getElementById('seizuresBySeverityChart').getContext('2d');
    new Chart(ctxSeverity, {
      type: 'pie',
      data: {
        labels: severityLabels,
        datasets: [{
          data: severitySeizureCounts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(54, 162, 114, 0.2)',
            // Add more colors if you have more than two locations
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(54, 100, 235, 1)',
            // Add more colors if you have more than two locations
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Seizures by Severity (%)'
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                const dataset = context.dataset;
                const total = dataset.data.reduce((previousValue, currentValue) => previousValue + currentValue);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${percentage}%`;
              },
            },
          },
        },
      },
    });

    // Generate seizures by trigger chart
    const ctxTrigger = document.getElementById('seizuresByTriggerChart').getContext('2d');
    new Chart(ctxTrigger, {
      type: 'bar',
      data: {
        labels: triggerLabels,
        datasets: [{
          label: 'Seizures',
          data: triggerSeizureCounts,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            precision: 0
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Seizures by Trigger'
          }
        }
      }
    });

    // Generate seizures by duration chart
    const ctxDuration = document.getElementById('seizuresByDurationChart').getContext('2d');
    new Chart(ctxDuration, {
      type: 'bar',
      data: {
        labels: durationLabels,
        datasets: [{
          label: 'Seizures',
          data: durationSeizureCounts,
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            precision: 0
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Seizures by Duration'
          }
        }
      }
    });

    // Generate seizures by vomiting chart
    const ctxVomiting = document.getElementById('seizuresByVomitingChart').getContext('2d');
    new Chart(ctxVomiting, {
      type: 'bar',
      data: {
        labels: vomitingLabels,
        datasets: [{
          label: 'Seizures',
          data: vomitingSeizureCounts,
          backgroundColor: 'rgba(255, 205, 86, 0.2)',
          borderColor: 'rgba(255, 205, 86, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            precision: 0
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Seizures by Vomiting'
          }
        }
      }
    });

    // Rest of your code...
  })
  .catch((error) => {
    console.log('Error fetching data:', error);
  });
