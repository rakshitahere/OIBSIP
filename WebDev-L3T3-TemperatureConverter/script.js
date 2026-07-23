/* ============================================
   TEMPERATURE CONVERTER - JAVASCRIPT
   ============================================ */

// DOM Elements
const temperatureInput = document.getElementById('temperatureInput');
const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const swapBtn = document.getElementById('swapBtn');
const convertBtn = document.getElementById('convertBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsSection = document.getElementById('resultsSection');
const errorAlert = document.getElementById('errorAlert');
const alertText = document.getElementById('alertText');
const errorMessage = document.getElementById('errorMessage');
const recentlyConvertedList = document.getElementById('recentlyConvertedList');

const celsiusResult = document.getElementById('celsiusResult');
const fahrenheitResult = document.getElementById('fahrenheitResult');
const kelvinResult = document.getElementById('kelvinResult');
const infoBox = document.getElementById('infoBox');
const pageShell = document.querySelector('.page-shell');

const recentHistory = [];

const ABSOLUTE_ZERO_CELSIUS = -273.15;
const ABSOLUTE_ZERO_FAHRENHEIT = -459.67;
const ABSOLUTE_ZERO_KELVIN = 0;

function formatNumber(value) {
    return Number(value).toFixed(2);
}

function formatUnit(unit) {
    switch (unit) {
        case 'celsius':
            return '°C';
        case 'fahrenheit':
            return '°F';
        case 'kelvin':
            return 'K';
        default:
            return '';
    }
}

function toCelsius(value, unit) {
    switch (unit) {
        case 'celsius':
            return value;
        case 'fahrenheit':
            return (value - 32) * (5 / 9);
        case 'kelvin':
            return value - 273.15;
        default:
            return NaN;
    }
}

function celsiusToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
}

function celsiusToKelvin(celsius) {
    return celsius + 273.15;
}

function validateTemperature(value, unit) {
    if (isNaN(value)) {
        return {
            isValid: false,
            message: 'Please enter a valid number.'
        };
    }

    if (unit === 'celsius' && value < ABSOLUTE_ZERO_CELSIUS) {
        return {
            isValid: false,
            message: `Temperature cannot be below ${ABSOLUTE_ZERO_CELSIUS}°C (absolute zero).`
        };
    }

    if (unit === 'fahrenheit' && value < ABSOLUTE_ZERO_FAHRENHEIT) {
        return {
            isValid: false,
            message: `Temperature cannot be below ${ABSOLUTE_ZERO_FAHRENHEIT}°F (absolute zero).`
        };
    }

    if (unit === 'kelvin' && value < ABSOLUTE_ZERO_KELVIN) {
        return {
            isValid: false,
            message: `Temperature cannot be below ${ABSOLUTE_ZERO_KELVIN}K (absolute zero).`
        };
    }

    return { isValid: true, message: '' };
}

function getInfoMessage(celsius) {
    if (celsius < -50) {
        return 'Extremely cold — danger zone for exposure.';
    }
    if (celsius < 0) {
        return 'Below freezing — watch for ice and snow.';
    }
    if (celsius < 15) {
        return 'Chilly — a jacket is recommended.';
    }
    if (celsius < 25) {
        return 'Comfortable — nice room temperature.';
    }
    if (celsius < 35) {
        return 'Warm — a summer day.';
    }
    return 'Hot — stay hydrated and cool.';
}

function renderRecentHistory() {
    if (recentHistory.length === 0) {
        recentlyConvertedList.innerHTML = '<li>No conversions yet. Try one now.</li>';
        return;
    }

    recentlyConvertedList.innerHTML = recentHistory
        .map(item => `<li>${item}</li>`)
        .join('');
}

function addRecentConversion(entry) {
    recentHistory.unshift(entry);
    if (recentHistory.length > 4) {
        recentHistory.pop();
    }
    renderRecentHistory();
}

function clearError() {
    errorMessage.textContent = '';
    alertText.textContent = '';
    errorAlert.style.display = 'none';
}

function handleInputChange() {
    const rawValue = temperatureInput.value.trim();
    const parsedValue = parseFloat(rawValue);
    const validation = validateTemperature(parsedValue, fromUnitSelect.value);

    if (rawValue === '') {
        errorMessage.textContent = '';
        return;
    }

    errorMessage.textContent = validation.isValid ? '' : validation.message;
}

function convert() {
    const rawValue = temperatureInput.value.trim();
    const inputValue = parseFloat(rawValue);
    const inputUnit = fromUnitSelect.value;
    const outputUnit = toUnitSelect.value;

    clearError();

    const validation = validateTemperature(inputValue, inputUnit);
    if (!validation.isValid) {
        alertText.textContent = validation.message;
        errorAlert.style.display = 'flex';
        resultsSection.style.display = 'none';
        resetBtn.style.display = 'none';
        return;
    }

    const celsius = toCelsius(inputValue, inputUnit);
    const fahrenheit = celsiusToFahrenheit(celsius);
    const kelvin = celsiusToKelvin(celsius);

    updateTheme(celsius);

    celsiusResult.textContent = formatNumber(celsius);
    fahrenheitResult.textContent = formatNumber(fahrenheit);
    kelvinResult.textContent = formatNumber(kelvin);
    infoBox.textContent = getInfoMessage(celsius);

    const convertedValue =
        outputUnit === 'celsius' ? celsius :
        outputUnit === 'fahrenheit' ? fahrenheit :
        kelvin;

    addRecentConversion(`${formatNumber(inputValue)} ${formatUnit(inputUnit)} → ${formatNumber(convertedValue)} ${formatUnit(outputUnit)}`);

    resultsSection.style.display = 'block';
    resetBtn.style.display = 'block';
}

function reset() {
    temperatureInput.value = '';
    fromUnitSelect.value = 'celsius';
    toUnitSelect.value = 'fahrenheit';
    resultsSection.style.display = 'none';
    resetBtn.style.display = 'none';
    clearError();
    pageShell.classList.remove('cold', 'moderate', 'hot');
    temperatureInput.focus();
}

function updateTheme(celsius) {
    pageShell.classList.remove('cold', 'moderate', 'hot');

    if (celsius >= 25) {
        pageShell.classList.add('hot');
        return;
    }

    if (celsius >= 10) {
        pageShell.classList.add('moderate');
        return;
    }

    pageShell.classList.add('cold');
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        convert();
    }
}

swapBtn.addEventListener('click', () => {
    const currentFrom = fromUnitSelect.value;
    fromUnitSelect.value = toUnitSelect.value;
    toUnitSelect.value = currentFrom;
});

convertBtn.addEventListener('click', convert);
resetBtn.addEventListener('click', reset);

temperatureInput.addEventListener('input', handleInputChange);
temperatureInput.addEventListener('keypress', handleKeyPress);
fromUnitSelect.addEventListener('change', handleInputChange);
toUnitSelect.addEventListener('change', handleInputChange);

window.addEventListener('load', () => {
    temperatureInput.focus();
    renderRecentHistory();
});
