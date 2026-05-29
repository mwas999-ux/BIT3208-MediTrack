window.addEventListener('load', () => {
    fetch('/api/dashboard')
    .then(res => res.json())
    .then(data => {
        document.getElementById('adminName').textContent        = '👤 ' + data.admin;
        document.getElementById('totalPatients').textContent    = data.patients;
        document.getElementById('totalDoctors').textContent     = data.doctors;
        document.getElementById('totalAppointments').textContent = data.appointments;
    });
});