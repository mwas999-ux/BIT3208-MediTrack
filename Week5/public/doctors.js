window.addEventListener('load', loadDoctors);

function loadDoctors() {
    fetch('/api/doctors')
    .then(res => res.json())
    .then(doctors => {
        const tbody = document.getElementById('doctorsBody');
        if (doctors.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">No doctors yet</td></tr>';
            return;
        }
        tbody.innerHTML = doctors.map((d, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${d.fullname}</td>
                <td>${d.specialization}</td>
                <td>${d.phone}</td>
                <td>${d.email}</td>
                <td>
                    <button class="btn-delete" onclick="deleteDoctor(${d.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    });
}

function addDoctor() {
    const fullname       = document.getElementById('docFullname').value.trim();
    const specialization = document.getElementById('docSpec').value.trim();
    const phone          = document.getElementById('docPhone').value.trim();
    const email          = document.getElementById('docEmail').value.trim();

    if (!fullname || !specialization || !phone || !email) {
        document.getElementById('doctorMsg').textContent = '❌ All fields are required';
        document.getElementById('doctorMsg').style.color = '#e63946';
        return;
    }

    fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ fullname, specialization, phone, email })
    })
    .then(res => res.json())
    .then(data => {
        const msg = document.getElementById('doctorMsg');
        msg.textContent = data.success ? '✅ ' + data.message : '❌ ' + data.message;
        msg.style.color = data.success ? '#2d6a4f' : '#e63946';
        if (data.success) {
            document.getElementById('docFullname').value = '';
            document.getElementById('docSpec').value     = '';
            document.getElementById('docPhone').value    = '';
            document.getElementById('docEmail').value    = '';
            loadDoctors();
        }
    });
}

function deleteDoctor(id) {
    if (!confirm('Delete this doctor?')) return;
    fetch(`/api/doctors/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(data => { if (data.success) loadDoctors(); });
}