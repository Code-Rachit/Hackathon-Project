// INITIALIZATION 
document.addEventListener('DOMContentLoaded', () => {
    // Proper event listener for the enter button
    document.getElementById('enterButton').addEventListener('click', startCalculator);
    
    // Initialize calculator features
    updateConverter();
    
    // Attach real-time calculation listeners
    document.getElementById('num1').addEventListener('input', calculateBasic);
    document.getElementById('num2').addEventListener('input', calculateBasic);
    document.getElementById('basicOp').addEventListener('change', calculateBasic);
    document.getElementById('bmiHeight').addEventListener('input', calculateBMI);
    document.getElementById('bmiWeight').addEventListener('input', calculateBMI);
    document.getElementById('percentageBase').addEventListener('input', calculatePercentage);
    document.getElementById('percentageValue').addEventListener('input', calculatePercentage);
    document.getElementById('converterInput').addEventListener('input', convertUnits);
    document.getElementById('converterFrom').addEventListener('change', convertUnits);
    document.getElementById('converterTo').addEventListener('change', convertUnits);
    
    // Initialize background
    document.getElementById('paneBackground').style.background = modeBackgrounds.basic;
});

// THEME MANAGEMENT 
function changeTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
}

// ANIMATED BACKGROUNDS 
const modeBackgrounds = {
    basic: 'linear-gradient(135deg, #8e9eab, #eef2f3)',
    bmi: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
    percentage: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    converter: 'linear-gradient(135deg, #43e97b, #38f9d7)'
};

// TAB MANAGEMENT 
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const mode = this.dataset.mode;
        
        // Removed active classes
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.calculator-pane').forEach(p => p.classList.remove('active'));
        
        // active states
        this.classList.add('active');
        document.getElementById(mode).classList.add('active');
        
        // Animated background
        document.getElementById('paneBackground').style.background = modeBackgrounds[mode];
    });
});

// START FUNCTION 
function startCalculator() {
    const welcomeScreen = document.querySelector('.welcome-screen');
    const calculator = document.getElementById('mainCalculator');
    
    if (!welcomeScreen || !calculator) {
        console.error('Critical elements missing! Check element IDs');
        return;
    }
    
    welcomeScreen.style.opacity = '0';
    welcomeScreen.style.pointerEvents = 'none';
    
    calculator.style.display = 'block';
    setTimeout(() => {
        calculator.style.opacity = '1';
    }, 50);
    
    // Activated first tab
    document.querySelector('.tab.active').click();
}

// BASIC CALCULATOR 
function calculateBasic() {
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    const op = document.getElementById('basicOp').value;
    let result = '';
    
    if (!isNaN(num1) && !isNaN(num2)) {
        const operations = {
            '+': num1 + num2,
            '-': num1 - num2,
            '*': num1 * num2,
            '/': num2 !== 0 ? num1 / num2 : 'Error: Div by 0'
        };
        result = operations[op] || '';
    }
    document.getElementById('basicResult').textContent = result !== '' ? `Result: ${result}` : '';
}

// BMI CALCULATOR 
let bmiUnits = 'metric';
function toggleBMIUnits(unit) {
    bmiUnits = unit;
    document.getElementById('bmiHeight').placeholder = unit === 'metric' ? 'Height (cm)' : 'Height (inches)';
    document.getElementById('bmiWeight').placeholder = unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)';
    calculateBMI();
}

function calculateBMI() {
    let height = parseFloat(document.getElementById('bmiHeight').value);
    let weight = parseFloat(document.getElementById('bmiWeight').value);
    
    if (isNaN(height) || isNaN(weight) || height === 0) {
        document.getElementById('bmiResult').textContent = '';
        return;
    }
    
    if(bmiUnits === 'imperial') {
        height *= 2.54; // inches to cm
        weight *= 0.453592; // lbs to kg
    }
    
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    let category = '';
    
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';
    
    document.getElementById('bmiResult').textContent = `BMI: ${bmi.toFixed(1)} (${category})`;
}

// PERCENTAGE CALCULATOR 
function calculatePercentage() {
    const base = parseFloat(document.getElementById('percentageBase').value);
    const percentage = parseFloat(document.getElementById('percentageValue').value);
    
    if (!isNaN(base) && !isNaN(percentage)) {
        const result = (base * percentage) / 100;
        document.getElementById('percentageResult').textContent = `Result: ${result.toFixed(2)}`;
    } else {
        document.getElementById('percentageResult').textContent = '';
    }
}

// UNIT CONVERTER 
const units = {
    Length: ['inches', 'cm'],
    Temperature: ['°C', '°F'],
    Time: ['days', 'hours', 'minutes']
};

function updateConverter() {
    const type = document.getElementById('converterType').value;
    const fromSelect = document.getElementById('converterFrom');
    const toSelect = document.getElementById('converterTo');
    
    // Clear existing options
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    
    // Add new options
    units[type].forEach(unit => {
        fromSelect.innerHTML += `<option>${unit}</option>`;
        toSelect.innerHTML += `<option>${unit}</option>`;
    });
    
    // Set default "to" unit
    toSelect.selectedIndex = 1;
    convertUnits();
}

function convertUnits() {
    const type = document.getElementById('converterType').value;
    const value = parseFloat(document.getElementById('converterInput').value);
    const from = document.getElementById('converterFrom').value;
    const to = document.getElementById('converterTo').value;
    
    if (isNaN(value)) {
        document.getElementById('converterResult').textContent = '';
        return;
    }

    let result = value; // Default value

    // Length Conversions
    if (type === 'Length') {
        if (from === 'inches' && to === 'cm') result = value * 2.54;
        else if (from === 'cm' && to === 'inches') result = value / 2.54;
    }
    
    // Temperature Conversions
    else if (type === 'Temperature') {
        if (from === '°C' && to === '°F') result = (value * 9/5) + 32;
        else if (from === '°F' && to === '°C') result = (value - 32) * 5/9;
    }
    
    // Time Conversions
    else if (type === 'Time') {
        if (from === 'days' && to === 'hours') result = value * 24;
        else if (from === 'days' && to === 'minutes') result = value * 1440;
        else if (from === 'hours' && to === 'days') result = value / 24;
        else if (from === 'hours' && to === 'minutes') result = value * 60;
        else if (from === 'minutes' && to === 'days') result = value / 1440;
        else if (from === 'minutes' && to === 'hours') result = value / 60;
    }

    document.getElementById('converterResult').textContent = 
        `Result: ${result.toFixed(2)} ${to}`;
}

// Initialize converter on type change
document.getElementById('converterType').addEventListener('change', () => {
    updateConverter();
    convertUnits();
});

