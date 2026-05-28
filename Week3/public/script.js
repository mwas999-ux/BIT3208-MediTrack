
function showAlert() {
    alert('Hello from MediTrack! This is a JavaScript alert.');
}

function changeText() {
    const textEl = document.getElementById('demo-text');
    textEl.textContent = '✅ Text changed dynamically using JavaScript DOM manipulation!';
    textEl.style.color = '#052659';
    textEl.style.fontWeight = '600';
}


function toggleBox() {
    const box = document.getElementById('toggle-box');
    if (box.style.display === 'none') {
        box.style.display = 'block';
    } else {
        box.style.display = 'none';
    }
}



document.getElementById('patientForm').addEventListener('submit', function(e) {
    e.preventDefault();

    
    document.getElementById('nameError').textContent   = '';
    document.getElementById('ageError').textContent    = '';
    document.getElementById('genderError').textContent = '';
    document.getElementById('phoneError').textContent  = '';
    document.getElementById('emailError').textContent  = '';
    document.getElementById('successMsg').textContent  = '';

    const fullname = document.getElementById('fullname').value.trim();
    const age      = document.getElementById('age').value.trim();
    const gender   = document.getElementById('gender').value;
    const phone    = document.getElementById('phone').value.trim();
    const email    = document.getElementById('email').value.trim();

    let isValid = true;

    
    if (fullname === '') {
        document.getElementById('nameError').textContent = 'Full name is required';
        isValid = false;
    } else if (fullname.length < 3) {
        document.getElementById('nameError').textContent = 'Name must be at least 3 characters';
        isValid = false;
    }

    
    if (age === '') {
        document.getElementById('ageError').textContent = 'Age is required';
        isValid = false;
    } else if (age < 1 || age > 120) {
        document.getElementById('ageError').textContent = 'Enter a valid age (1-120)';
        isValid = false;
    }

    
    if (gender === '') {
        document.getElementById('genderError').textContent = 'Please select a gender';
        isValid = false;
    }

    
    const phoneRegex = /^07\d{8}$/;
    if (phone === '') {
        document.getElementById('phoneError').textContent = 'Phone number is required';
        isValid = false;
    } else if (!phoneRegex.test(phone)) {
        document.getElementById('phoneError').textContent = 'Enter valid Kenyan number e.g 07XXXXXXXX';
        isValid = false;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        document.getElementById('emailError').textContent = 'Email is required';
        isValid = false;
    } else if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Enter a valid email address';
        isValid = false;
    }

    
    if (isValid) {
        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ fullname, age, gender, phone, email })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                document.getElementById('successMsg').textContent = ' ' + data.message;
                document.getElementById('patientForm').reset();
                loadPatients();
            } else {
                document.getElementById('successMsg').textContent = ' ' + data.message;
            }
        });
    }
});



function loadPatients() {
    fetch('/patients')
    .then(res => res.json())
    .then(patients => {
        const tbody = document.getElementById('patientsBody');
        if (patients.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">No patients registered yet</td></tr>';
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