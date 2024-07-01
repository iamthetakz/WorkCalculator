document.addEventListener('DOMContentLoaded', function () {
    createCalendar();
    displaySummary();
});

function createCalendar() {
    const monthSelect = document.getElementById('month');
    const month = parseInt(monthSelect.value);
    const year = 2024;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendar = document.getElementById('calendar');
    
    calendar.innerHTML = ''; // Clear previous calendar

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.innerHTML = `
            <div>${new Date(year, month, day).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</div>
            <label for="start-time-${day}">Start Time</label>
            <input type="time" id="start-time-${day}">
            <label for="end-time-${day}">End Time</label>
            <input type="time" id="end-time-${day}">
        `;
        calendar.appendChild(dayDiv);
    }

    // Load saved data
    loadData();
}

function calculatePay() {
    const wage = parseFloat(document.getElementById('wage').value);
    const month = parseInt(document.getElementById('month').value);
    const year = 2024;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    if (isNaN(wage)) {
        alert('Please enter a valid hourly wage');
        return;
    }

    let totalHours = 0;
    let weeklyHours = 0;
    let weeklyPay = 0;
    let monthlyPay = 0;
    let weeklyPayArr = [];
    const daysInWeek = 7;
    
    for (let day = 1; day <= daysInMonth; day++) {
        const startTime = document.getElementById(`start-time-${day}`).value;
        const endTime = document.getElementById(`end-time-${day}`).value;

        if (startTime && endTime) {
            const start = new Date(`2024-01-01T${startTime}:00`);
            const end = new Date(`2024-01-01T${endTime}:00`);
            const hours = (end - start) / 1000 / 60 / 60;
            totalHours += hours;
        }

        if (day % daysInWeek === 0 || day === daysInMonth) {
            weeklyPayArr.push(totalHours * wage);
            totalHours = 0;
        }
    }

    weeklyPay = weeklyPayArr.reduce((acc, curr) => acc + curr, 0) / weeklyPayArr.length;
    monthlyPay = weeklyPayArr.reduce((acc, curr) => acc + curr, 0);
    
    document.getElementById('dailyPay').innerText = `Daily Pay: $${(wage).toFixed(2)}`;
    document.getElementById('weeklyPay').innerText = `Average Weekly Pay: $${(weeklyPay).toFixed(2)}`;
    document.getElementById('monthlyPay').innerText = `Monthly Pay: $${(monthlyPay).toFixed(2)}`;
}

function saveData() {
    const month = document.getElementById('month').value;
    const year = 2024;
    const daysInMonth = new Date(year, parseInt(month) + 1, 0).getDate();
    const data = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const startTime = document.getElementById(`start-time-${day}`).value;
        const endTime = document.getElementById(`end-time-${day}`).value;
        data.push({ startTime, endTime });
    }

    const wage = document.getElementById('wage').value;
    localStorage.setItem(`workData-${year}-${month}`, JSON.stringify({ wage, data }));

    displaySummary();
}

function loadData() {
    const month = document.getElementById('month').value;
    const year = 2024;
    const savedData = localStorage.getItem(`workData-${year}-${month}`);

    if (savedData) {
        const { wage, data } = JSON.parse(savedData);
        document.getElementById('wage').value = wage;

        data.forEach((dayData, index) => {
            const day = index + 1;
            if (dayData.startTime) {
                document.getElementById(`start-time-${day}`).value = dayData.startTime;
            }
            if (dayData.endTime) {
                document.getElementById(`end-time-${day}`).value = dayData.endTime;
            }
        });
    }
}

function displaySummary() {
    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = '';

    for (let month = 0; month < 12; month++) {
        const year = 2024;
        const savedData = localStorage.getItem(`workData-${year}-${month}`);
        
        if (savedData) {
            const { wage, data } = JSON.parse(savedData);
            const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' });
            
            let totalHours = 0;

            data.forEach(dayData => {
                if (dayData.startTime && dayData.endTime) {
                    const start = new Date(`2024-01-01T${dayData.startTime}:00`);
                    const end = new Date(`2024-01-01T${dayData.endTime}:00`);
                    const hours = (end - start) / 1000 / 60 / 60;
                    totalHours += hours;
                }
            });

            const monthlyPay = totalHours * wage;

            const summaryItem = document.createElement('div');
            summaryItem.className = 'summaryItem';
            summaryItem.innerHTML = `
                <h3>${monthName}</h3>
                <p>Total Hours: ${totalHours}</p>
                <p>Total Pay: $${monthlyPay.toFixed(2)}</p>
            `;
            summaryContent.appendChild(summaryItem);
        }
    }
}
