// register.js
document.getElementById('registerForm').addEventListener('submit', (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const registerData = Object.fromEntries(formData);
  
    fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Record registered successfully!');
        // Optionally, redirect the user to another page or update the UI as needed
        // Example: window.location.href = '/statistics';
      })
      .catch((error) => {
        console.log('Error registering record:', error);
      });
  });
  