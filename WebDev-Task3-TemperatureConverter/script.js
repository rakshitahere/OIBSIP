/* ============================================
   TEMPERATURE CONVERTER - JAVASCRIPT
   ============================================ */

// DOM Elements
const temperatureInput = document.getElementById('temperatureInput');
const inputUnitRadios = document.querySelectorAll('input[name="inputUnit"]');
const convertBtn = document.getElementById('convertBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsSection = document.getElementById('resultsSection');
const errorAlert = document.getElementById('errorAlert');
const alertText = document.getElementById('alertText');
const errorMessage = document.getElementById('errorMessage');

const celsiusResult = document.getElementById('celsiusResult');
const fahrenheitResult = document.getElementById('fahrenheitResult');
const kelvinResult = document.getElementById('kelvinResult');
const infoBox = document.getElementById('infoBox');

// Constants
const ABSOLUTE_ZERO_CELSIUS = -273.15;
const ABSOLUTE_ZERO_FAHRENHEIT = -459.67;
const ABSOLUTE_ZERO_KELVIN = 0;

// ============================================
// CONVERSION FUNCTIONS
// ============================================

/**
 * Convert any temperature to Celsius
 * @param {number} value - Temperature value
 * @param {string} unit - Unit of input (celsius, fahrenheit, kelvin)
 * @returns {number} Temperature in Celsius
 */
function toCelsius(value, unit) {
    switch (unit) {
        case 'celsius':
            return value;
        case 'fahrenheit':
            return (value - 32) * (5 / 9);
        case 'kelvin':
            return value - 273.15;
        default:
            return 0;
    }
}

/**
 * Convert Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Fahrenheit
 */
function celsiusToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
}

/**
 * Convert Celsius to Kelvin
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Kelvin
 */
function celsiusToKelvin(celsius) {
    return celsius + 273.15;
}

/**
 * Get the input unit from selected radio button
 * @returns {string} The selected unit
 */
function getInputUnit() {
    return document.querySelector('input[name="inputUnit"]:checked').value;
}

/**
 * Validate temperature input for absolute zero violations
 * @param {number} value - Temperature value
 * @param {string} unit - Unit of temperature
 * @returns {object} Validation result with isValid and message
 */
function validateTemperature(value, unit) {
    const result = {
        isValid: true,
        message: ''
    };

    if (isNaN(value)) {
        result.isValid = false;
        result.message = 'Please enter a valid number.';
        return result;
    }

    // Check for absolute zero violations
    switch (unit) {
        case 'celsius':
            if (value < ABSOLUTE_ZERO_CELSIUS) {
                result.isValid = false;
                result.message = `Temperature cannot be below ${ABSOLUTE_ZERO_CELSIUS}°C (absolute zero).`;
            }
            break;
        case 'fahrenheit':
            if (value < ABSOLUTE_ZERO_FAHRENHEIT) {
                result.isValid = false;
                result.message = `Temperature cannot be below ${ABSOLUTE_ZERO_FAHRENHEIT}°F (absolute zero).`;
            }
            break;
        case 'kelvin':
            if (value < ABSOLUTE_ZERO_KELVIN) {
                result.isValid = false;
                result.message = `Temperature cannot be below ${ABSOLUTE_ZERO_KELVIN}K (absolute zero).`;
            }
            break;
    }

    return result;
}

/**
 * Format number to 2 decimal places
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return parseFloat(num).toFixed(2);
}

/**
 * Get informational message based on temperature in Celsius
 * @param {number} celsius - Temperature in Celsius
 * @returns {string} Informational message
 */
function getInfoMessage(celsius) {
    if (celsius < -273.15) {
        return 'Invalid temperature: Below absolute zero.';
    } else if (celsius < -50) {
        return 'Extremely cold - Danger zone for human exposure.';
    } else if (celsius < 0) {
        return 'Below freezing - Ice and snow conditions.';
    } else if (celsius === 0) {
        return 'Freezing point of water at standard pressure.';
    } else if (celsius < 15) {
        return 'Cold - Light jacket weather.';
    } else if (celsius < 25) {
        return 'Mild - Comfortable room temperature.';
    } else if (celsius < 35) {
        return 'Warm - Pleasant outdoor weather.';
    } else if (celsius < 50) {
        return 'Hot - High heat exposure warning.';
    } else {
        return 'Extremely hot - Danger zone for human exposure.';
    }
}

/**
 * Convert and display results
 */
function convert() {
    // Get input value and unit
    const inputValue = parseFloat(temperatureInput.value);
    const inputUnit = getInputUnit();

    // Clear previous messages
    errorMessage.textContent = '';
    errorAlert.style.display = 'none';

    // Validate input
    const validation = validateTemperature(inputValue, inputUnit);
    
    if (!validation.isValid) {
        // Show error alert
        alertText.textContent = validation.message;
        errorAlert.style.display = 'flex';
        resultsSection.style.display = 'none';
        resetBtn.style.display = 'none';
        return;
    }

    // Convert to Celsius first
    const celsius = toCelsius(inputValue, inputUnit);

    // Convert to all units
    const fahrenheit = celsiusToFahrenheit(celsius);
    const kelvin = celsiusToKelvin(celsius);

    // Display results
    celsiusResult.textContent = formatNumber(celsius);
    fahrenheitResult.textContent = formatNumber(fahrenheit);
    kelvinResult.textContent = formatNumber(kelvin);

    // Display info message
    const info = getInfoMessage(celsius);
    infoBox.textContent = info;

    // Show results section
    resultsSection.style.display = 'block';
    resetBtn.style.display = 'block';
    errorAlert.style.display = 'none';
}

/**
 * Reset the converter
 */
function reset() {
    temperatureInput.value = '';
    document.getElementById('celsiusInput').checked = true;
    resultsSection.style.display = 'none';
    resetBtn.style.display = 'none';
    errorAlert.style.display = 'none';
    errorMessage.textContent = '';
    temperatureInput.focus();
}

/**
 * Handle real-time input validation
 */
function handleInputChange() {
    const inputValue = temperatureInput.value;
    const inputUnit = getInputUnit();

    if (inputValue === '') {
        errorMessage.textContent = '';
        return;
    }

    const validation = validateTemperature(parseFloat(inputValue), inputUnit);
    
    if (!validation.isValid) {
        errorMessage.textContent = validation.message;
    } else {
        errorMessage.textContent = '';
    }
}

/**
 * Handle unit change - re-validate if needed
 */
function handleUnitChange() {
    handleInputChange();
}

/**
 * Handle Enter key press
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        convert();
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Convert button
convertBtn.addEventListener('click', convert);

// Reset button
resetBtn.addEventListener('click', reset);

// Input field
temperatureInput.addEventListener('input', handleInputChange);
temperatureInput.addEventListener('keypress', handleKeyPress);

// Unit selection
inputUnitRadios.forEach(radio => {
    radio.addEventListener('change', handleUnitChange);
});

// Focus input field on load
window.addEventListener('load', () => {
    temperatureInput.focus();
});

// ============================================
// UTILITY: Allow keyboard shortcuts
// ============================================

document.addEventListener('keydown', (event) => {
    // Ctrl/Cmd + R to reset
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        reset();
    }
});
