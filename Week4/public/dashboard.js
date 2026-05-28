
window.addEventListener('load', () => {
    loadDashboardData();
    loadPatients();
});

function loadDashboardData() {
    fetch('/api/dashboard')
    .then(res => res.json())
    .then(data => {
        document.getElementById('adminName').textContent = '👤 ' + data.admin;
        document.getElementById('totalPatients').textContent = data.totalPatients;
    });
}

function loadPatients() {
    fetch('/api/patients')
    .then(res => res.json())
    .then(patients => {
        const tbody = document.getElementById('patientsBody');
        if (patients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">No patients yet</td></tr>';
            return;
        }
        tbody.innerHTML = patients.map((p, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${p.fullname}</td>
                <td>${p.age}</td>
                <td>${p.gender}</td>
                <td>${p.phone}</td>
                <td>${p.email}</td>
            </tr>
        `).join('');
    });
}