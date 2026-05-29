// Load patients on page load
window.addEventListener('load', loadPatients);

function loadPatients() {
    fetch('/api/patients')
    .then(res => res.json())
    .then(patients => {
        const tbody = document.getElementById('patientsBody');
        if (patients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center">No patients yet</td></tr>';
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
                <td>
                    <button class="btn-edit" onclick="openEdit(${p.id},'${p.fullname}',${p.age},'${p.gender}','${p.phone}','${p.email}')">Edit</button>
                    <button class="btn-delete" onclick="deletePatient(${p.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    });
}

// Add patient
function addPatient() {
    const fullname = document.getElementById('fullname').value.trim();
    const age      = document.getElementById('age').value.trim();
    const gender   = document.getElementById('gender').value;
    const phone    = document.getElementById('phone').value.trim();
    const email    = document.getElementById('email').value.trim();

    // Clear errors
    ['nameError','ageError','genderError','phoneError','emailError']
        .forEach(id => document.getElementById(id).textContent = '');

    let isValid = true;

    if (!fullname) { document.getElementById('nameError').textContent = 'Name is required'; isValid = false; }
    if (!age)      { document.getElementById('ageError').textContent  = 'Age is required';  isValid = false; }
    if (!gender)   { document.getElementById('genderError').textContent = 'Select gender';  isValid = false; }
    if (!phone)    { document.getElementById('phoneError').textContent = 'Phone is required'; isValid = false; }
    if (!email)    { document.getElementById('emailError').textContent = 'Email is required'; isValid = false; }

    if (!isValid) return;

    fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ fullname, age, gender, phone, email })
    })
    .then(res => res.json())
    .then(data => {
        const msg = document.getElementById('patientMsg');
        msg.textContent = data.success ? '✅ ' + data.message : '❌ ' + data.message;
        msg.style.color = data.success ? '#2d6a4f' : '#e63946';
        if (data.success) {
            document.getElementById('fullname').value = '';
            document.getElementById('age').value      = '';
            document.getElementById('gender').value   = '';
            document.getElementById('phone').value    = '';
            document.getElementById('email').value    = '';
            loadPatients();
        }
    });
}

// Open edit modal
function openEdit(id, fullname, age, gender, phone, email) {
    document.getElementById('editId').value       = id;
    document.getElementById('editFullname').value = fullname;
    document.getElementById('editAge').value      = age;
    document.getElementById('editGender').value   = gender;
    document.getElementById('editPhone').value    = phone;
    document.getElementById('editEmail').value    = email;
    document.getElementById('editModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Update patient
function updatePatient() {
    const id       = document.getElementById('editId').value;
    const fullname = document.getElementById('editFullname').value.trim();
    const age      = document.getElementById('editAge').value.trim();
    const gender   = document.getElementById('editGender').value;
    const phone    = document.getElementById('editPhone').value.trim();
    const email    = document.getElementById('editEmail').value.trim();

    fetch(`/api/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname, age, gender, phone, email })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            closeModal();
            loadPatients();
        }
    });
}

// Delete patient
function deletePatient(id) {
    if (!confirm('Are you sure you want to delete this patient?')) return;
    fetch(`/api/patients/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(data => {
        if (data.success) loadPatients();
    });
}