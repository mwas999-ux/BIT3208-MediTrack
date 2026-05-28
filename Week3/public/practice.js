// ── MediTrack Node.js Syntax Practice ──────────────────────────

// 1. Variables & Data Types
const clinicName = "MediTrack Clinic";
let totalPatients = 5;
const isOpen = true;

console.log("Clinic:", clinicName);
console.log("Total Patients:", totalPatients);
console.log("Clinic Open:", isOpen);
console.log("Type of totalPatients:", typeof totalPatients);
console.log("Type of clinicName:", typeof clinicName);

// 2. Object — single patient
const patient = {
    id: 1,
    fullname: "Alice Wanjiku",
    age: 28,
    gender: "Female",
    phone: "0712345678",
    email: "alice@email.com"
};

console.log("\n--- Patient Record ---");
console.log("Name:", patient.fullname);
console.log("Age:", patient.age);
console.log("Gender:", patient.gender);
console.log("Phone:", patient.phone);

// 3. Array of patients
const patients = [
    { id: 1, fullname: "Alice Wanjiku",  age: 28, gender: "Female" },
    { id: 2, fullname: "Brian Otieno",   age: 35, gender: "Male"   },
    { id: 3, fullname: "Carol Muthoni",  age: 22, gender: "Female" },
    { id: 4, fullname: "David Kamau",    age: 45, gender: "Male"   },
    { id: 5, fullname: "Eve Njeri",      age: 30, gender: "Female" },
];

// 4. Loop — list all patients
console.log("\n--- All Patients ---");
patients.forEach((p, i) => {
    console.log(`${i + 1}. ${p.fullname} | Age: ${p.age} | ${p.gender}`);
});

// 5. Conditional — check age group
console.log("\n--- Age Groups ---");
patients.forEach(p => {
    let group;
    if (p.age < 18) {
        group = "Minor";
    } else if (p.age <= 35) {
        group = "Young Adult";
    } else {
        group = "Senior";
    }
    console.log(`${p.fullname} → ${group}`);
});

// 6. Function — register a new patient
function registerPatient(fullname, age, gender, phone, email) {
    if (!fullname || !age || !gender || !phone || !email) {
        return "Registration failed: all fields are required.";
    }
    return `Patient "${fullname}" registered successfully.`;
}

console.log("\n--- Register Patients ---");
console.log(registerPatient("Frank Mwangi", 40, "Male", "0798765432", "frank@email.com"));
console.log(registerPatient("", 25, "Female", "0711111111", "grace@email.com"));

// 7. Function — validate Kenyan phone number
function validatePhone(phone) {
    const regex = /^07\d{8}$/;
    return regex.test(phone) ? `${phone} is valid` : `${phone} is invalid`;
}

console.log("\n--- Phone Validation ---");
console.log(validatePhone("0712345678"));
console.log(validatePhone("0612345678"));
console.log(validatePhone("123"));

// 8. Filter — get only female patients
const femalePatients = patients.filter(p => p.gender === "Female");
console.log("\n--- Female Patients ---");
femalePatients.forEach(p => console.log(p.fullname));

// 9. Count patients by gender
const maleCount   = patients.filter(p => p.gender === "Male").length;
const femaleCount = patients.filter(p => p.gender === "Female").length;
console.log("\n--- Gender Summary ---");
console.log("Male Patients:", maleCount);
console.log("Female Patients:", femaleCount);
console.log("Total:", patients.length);