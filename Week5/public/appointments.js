window.addEventListener('load', () => {
    loadAppointments();
    loadDropdowns();
});

function loadDropdowns() {
    fetch('/api/patients-list')
    .then(res => res.json())
    .then(patients => {
        const select = document.getElementById('patientId');
        select.innerHTML = '<option value="">Select patient</option>';
        patients.forEach(p => {
            select.innerHTML += `<option value="${p.id}">${p.fullname}</option>`;
        });
    });

    fetch('/api/doctors-list')
    .then(res => res.json())
    .then(doctors => {
        const select = document.getElementById('doctorId');
        select.innerHTML = '<option value="">Select doctor</option>';
        doctors.forEach(d => {
            select.innerHTML += `<option value="${d.id}">${d.fullname}</option>`;
        });
    });
}

function loadAppointments() {
    fetch('/api/appointments')
    .then(res => res.json())
    .then(appointments => {
        const tbody = document.getElementById('appointmentsBody');
        if (appointments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center">No appointments yet</td></tr>';
            return;
        }
        tbody.innerHTML = appointments.map((a, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${a.patient_name}</td>
                <td>${a.doctor_name}</td>
                <td>${a.date}</td>
                <td>${a.time}</td>
                <td>${a.reason}</td>
                <td><span class="badge">${a.status}</span></td>
                <td>
                    <button class="btn-delete" onclick="deleteAppointment(${a.id})">Cancel</button>
                </td>
            </tr>
        `).join('');
    });
}

function bookAppointment() {
    const patient_id = document.getElementById('patientId').value;
    const doctor_id  = document.getElementById('doctorId').value;
    const date       = document.getElementById('apptDate').value;
    const time       = document.getElementById('apptTime').value;
    const reason     = document.getElementById('apptReason').value.trim();

    if (!patient_id || !doctor_id || !date || !time || !reason) {
        document.getElementById('apptMsg').textContent = '❌ All fields are required';
        document.getElementById('apptMsg').style.color = '#e63946';
        return;
    }

    fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ patient_id, doctor_id, date, time, reason })
    })
    .then(res => res.json())
    .then(data => {
        const msg = document.getElementById('apptMsg');
        msg.textContent = data.success ? '✅ ' + data.message : '❌ ' + data.message;
        msg.style.color = data.success ? '#2d6a4f' : '#e63946';
        if (data.success) {
            document.getElementById('patientId').value  = '';
            document.getElementById('doctorId').value   = '';
            document.getElementById('apptDate').value   = '';
            document.getElementById('apptTime').value   = '';
            document.getElementById('apptReason').value = '';
            loadAppointments();
            loadDropdowns();
        }
    });
}

function deleteAppointment(id) {
    if (!confirm('Cancel this appointment?')) return;
    fetch(`/api/appointments/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(data => { if (data.success) loadAppointments(); });
}