// ── Password visibility toggle ──────────────────────────────────
document.getElementById('togglePassword').addEventListener('click', function () {
    const input = document.getElementById('password');
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    this.textContent = isHidden ? '🙈' : '👁';
});

// ── Password strength checker ───────────────────────────────────
document.getElementById('password').addEventListener('input', function () {
    const password = this.value;
    const fill     = document.getElementById('strengthFill');
    const text     = document.getElementById('strengthText');

    let strength = 0;
    if (password.length >= 6)            strength++;
    if (password.match(/[A-Z]/))         strength++;
    if (password.match(/[0-9]/))         strength++;
    if (password.match(/[^A-Za-z0-9]/))  strength++;

    const levels = [
        { width: '0%',   color: '#e0e0e0', label: '' },
        { width: '25%',  color: '#e63946', label: 'Weak' },
        { width: '50%',  color: '#f4a261', label: 'Fair' },
        { width: '75%',  color: '#2a9d8f', label: 'Good' },
        { width: '100%', color: '#2d6a4f', label: 'Strong' },
    ];

    fill.style.width      = levels[strength].width;
    fill.style.background = levels[strength].color;
    text.textContent      = levels[strength].label;
    text.style.color      = levels[strength].color;
});

// ── Form submit & validation ────────────────────────────────────
document.getElementById('patientForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Clear previous errors
    ['nameError','ageError','genderError','phoneError','emailError','passwordError'].forEach(id => {
        document.getElementById(id).textContent = '';
    });
    const successMsg = document.getElementById('successMsg');
    successMsg.textContent = '';
    successMsg.className = 'success-msg';

    const fullname = document.getElementById('fullname').value.trim();
    const age      = document.getElementById('age').value.trim();
    const gender   = document.getElementById('gender').value;
    const phone    = document.getElementById('phone').value.trim();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    let isValid = true;

    if (!fullname) {
        document.getElementById('nameError').textContent = 'Full name is required';
        isValid = false;
    } else if (fullname.length < 3) {
        document.getElementById('nameError').textContent = 'Name must be at least 3 characters';
        isValid = false;
    }

    if (!age) {
        document.getElementById('ageError').textContent = 'Age is required';
        isValid = false;
    } else if (age < 1 || age > 120) {
        document.getElementById('ageError').textContent = 'Enter a valid age (1–120)';
        isValid = false;
    }

    if (!gender) {
        document.getElementById('genderError').textContent = 'Please select a gender';
        isValid = false;
    }

    const phoneRegex = /^07\d{8}$/;
    if (!phone) {
        document.getElementById('phoneError').textContent = 'Phone number is required';
        isValid = false;
    } else if (!phoneRegex.test(phone)) {
        document.getElementById('phoneError').textContent = 'Enter valid Kenyan number e.g 07XXXXXXXX';
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        document.getElementById('emailError').textContent = 'Email is required';
        isValid = false;
    } else if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Enter a valid email address';
        isValid = false;
    }

    if (!password) {
        document.getElementById('passwordError').textContent = 'Password is required';
        isValid = false;
    } else if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
        isValid = false;
    }

    if (!isValid) return;

    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname, age, gender, phone, email, password })
    })
    .then(res => res.json())
    .then(data => {
        successMsg.textContent = data.success ? '✅ ' + data.message : '❌ ' + data.message;
        successMsg.style.color = data.success ? '#2d6a4f' : '#e63946';
        if (data.success) {
            document.getElementById('patientForm').reset();
            document.getElementById('strengthFill').style.width = '0%';
            document.getElementById('strengthText').textContent = '';
            loadPatients();
        }
    })
    .catch(() => {
        successMsg.textContent = '❌ Network error. Please try again.';
        successMsg.style.color = '#e63946';
    });
});

// ── Load patients table ─────────────────────────────────────────
function loadPatients() {
    const tbody = document.getElementById('patientsBody');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">Loading...</td></tr>';

    fetch('/patients')
    .then(res => res.json())
    .then(patients => {
        if (!patients.length) {
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
    })
    .catch(() => {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:red">Failed to load patients</td></tr>';
    });
}