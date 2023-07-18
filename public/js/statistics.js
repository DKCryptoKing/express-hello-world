// Fetch total number of seizures
fetch('/api/data')
  .then((response) => response.json())
  .then((data) => {
    const totalSeizures = data.length;
    const totalSeizuresDiv = document.getElementById('totalSeizures');
    totalSeizuresDiv.textContent = `Total Seizures: ${totalSeizures}`;

    // Fetch seizures by location
    const seizuresByLocation = {};

    // Count seizures for each location
    data.forEach((item) => {
      const location = item.location;
      if (seizuresByLocation[location]) {
        seizuresByLocation[location]++;
      } else {
        seizuresByLocation[location] = 1;
      }
    });

    // Render seizures by location
    const seizuresByLocationDiv = document.getElementById('seizuresByLocation');
    seizuresByLocationDiv.innerHTML = '<h2>Seizures by Location</h2>';
    const ul = document.createElement('ul');
    for (const location in seizuresByLocation) {
      const li = document.createElement('li');
      li.textContent = `${location}: ${seizuresByLocation[location]}`;
      ul.appendChild(li);
    }
    seizuresByLocationDiv.appendChild(ul);

    // Calculate most common duration of seizures
    const durations = {};
    data.forEach((item) => {
      const duration = item.duration;
      if (durations[duration]) {
        durations[duration]++;
      } else {
        durations[duration] = 1;
      }
    });
    const mostCommonDuration = Object.keys(durations).reduce((a, b) => (durations[a] > durations[b] ? a : b));
    const mostCommonDurationDiv = document.getElementById('mostCommonDuration');
    mostCommonDurationDiv.textContent = `Most Common Duration: ${mostCommonDuration}`;

    // Calculate percentage of seizures with vomiting
    const seizuresWithVomiting = data.filter((item) => item.vomiting === 'Yes').length;
    const percentageWithVomiting = (seizuresWithVomiting / totalSeizures) * 100;
    const percentageWithVomitingDiv = document.getElementById('percentageWithVomiting');
    percentageWithVomitingDiv.textContent = `Percentage with Vomiting: ${percentageWithVomiting.toFixed(2)}%`;

    // Fetch most common trigger
    const triggers = {};
    data.forEach((item) => {
      const trigger = item.trigger;
      if (triggers[trigger]) {
        triggers[trigger]++;
      } else {
        triggers[trigger] = 1;
      }
    });
    const mostCommonTrigger = Object.keys(triggers).reduce((a, b) => (triggers[a] > triggers[b] ? a : b));
    const mostCommonTriggerDiv = document.getElementById('mostCommonTrigger');
    mostCommonTriggerDiv.textContent = `Most Common Trigger: ${mostCommonTrigger}`;
  })
  .catch((error) => {
    console.log('Error fetching data:', error);
  });
