const doctors = [
    { doctorName: 'Dr. John Doe', hospitalName: 'City Hospital' },
    { doctorName: 'Dr. Jane Smith', hospitalName: 'Country Hospital' },
    { doctorName: 'Dr. Jim Brown', hospitalName: 'City Hospital' },
    { doctorName: 'Dr. Emily Clark', hospitalName: 'Community Hospital' },
    { doctorName: 'Dr. Michael Johnson', hospitalName: 'General Hospital'},
    { doctorName: 'Dr. James Potter', hospitalName: 'Country Hospital' },
    { doctorName: 'Dr. Emma Watson', hospitalName: 'Community Hospital' },
    { doctorName: 'Dr. Michael Johnson', hospitalName: 'General Hospital' },
    { doctorName: 'Dr. Emily Anderson', hospitalName: 'Community Hospital'},
    { doctorName: 'Dr. Van Joseph', hospitalName: 'Colombia Hospital'},
    { doctorName: 'Dr. Kit Harington', hospitalName: 'Medico Clinic' },
    { doctorName: 'Dr. Daniel Radieclif', hospitalName: 'Clinical care' },
    { doctorName: 'Dr. Rupert Grint', hospitalName: 'General Hospital' },
    { doctorName: 'Dr. Ron Anderson', hospitalName: 'Community Clinic'},
    { doctorName: 'Dr. Christopher Clerk', hospitalName: 'Medico Clinic' },
    { doctorName: 'Dr. Danny Boyel', hospitalName: 'Clinical care' },
    { doctorName: 'Dr. Nancy', hospitalName: 'General Hospital' },
    { doctorName: 'Dr. Rubias', hospitalName: 'Community Clinic'}

];

document.addEventListener('DOMContentLoaded', (event) => {
    displayResults(doctors);
});

function search() {
    const hospitalName = document.getElementById('hospital-name').value.toLowerCase();
    const doctorName = document.getElementById('doctor-name').value.toLowerCase();
    
    const filteredResults = doctors.filter(doctor => {
        return (
            (hospitalName === '' || doctor.hospitalName.toLowerCase().includes(hospitalName)) &&
            (doctorName === '' || doctor.doctorName.toLowerCase().includes(doctorName)) 
        );
    });

    displayResults(filteredResults);
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>No results found</p>';
        return;
    }

    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
            <h3>${result.doctorName}</h3>
            <p>${result.hospitalName}</p>
        `;
        resultsDiv.appendChild(resultItem);
    });
}
