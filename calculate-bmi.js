const calculateButton = document.getElementById('calculate-btn');
calculateButton.addEventListener('click', calculateBMI);
const deleteButton = document.querySelector('.delete-button');
deleteButton.addEventListener('click', deleteBMI);
window.onload = drawChart();

// Function that check that localstorage object is available and we have quota for 
// saving things in it (Credits - Mozilla developers website script)
// returns true if localstorage available

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
// everything except Firefox
            e.code === 22 ||
// Firefox
            e.code === 1014 ||
// test name field too, because code might not be present
// everything except Firefox
            e.name === 'QuotaExceededError' ||
// Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
// acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

//Function for populate table data from localstorage 
function populateTable(data) {
    const table = document.querySelector(".bmi-results-table > tbody");
    while (table.firstChild) {
        table.removeChild(table.firstChild);
      }
    for (const [key, value] of Object.entries(data)) {
    let row = table.insertRow();
    let dateCell = row.insertCell();
    let dateText = document.createTextNode(moment(key).format("D MMM YYYY"));
    dateCell.appendChild(dateText);
    let bmiCell = row.insertCell();
    let bmiText = document.createTextNode(value.toFixed(1));
    bmiCell.appendChild(bmiText);
      }
    }


// If localstorage available get previous records and draw a chart 
// or show paragraph that localstorage is empty 
function drawChart() {
        //Getting item from storage
        if(localStorage.getItem('bmi-date')) {
            // Save data from localstorage to variable
            const localStorageObj = JSON.parse(localStorage.getItem('bmi-date'));
            // Disable message that localstorage is empty
            const showMessage = document.querySelector(".noLocalDataMessage");
            showMessage.style.display = "none";
            // Get table element and populate it with data from localstorage 
            populateTable(localStorageObj);
            deleteButton.style.display = "block";
            const legend = document.querySelector(".legend");
            legend.style.display = "block";
            // Get data from localstorage to draw the chart
            let dateArray = [];
            let bmiArray = [];   
            Object.keys(localStorageObj).forEach(function (key) {
                const dateFromObj = moment(key).format("D MMM");
                dateArray.push(dateFromObj);
                bmiArray.push((localStorageObj[key]).toFixed(1));
            })
           
// Draw a chart with given data and options 
            var data = {
                labels: dateArray,
                series: [
                  bmiArray
                ]
            };
            var options = {
                showPoint: true,
                lineSmooth: Chartist.Interpolation.simple({
                    divisor: 2
                  }),
                  fullWidth: true,
                  chartPadding: {
                    right: 20
                  },
                  low: 0,
                axisY: {
                    type: Chartist.FixedScaleAxis,
                    high: 30,
                    low: 5,
                    divisor: 5,
                    showGrid: true
                       },
            };
            
            new Chartist.Line('.ct-chart', data, options);
        } else {
//If localstorage empty - show paragraph with text about it and hide table head
            const showMessage = document.querySelector(".noLocalDataMessage");
            const table = document.querySelector(".bmi-results-table");
            const chart = document.querySelector(".ct-chart");
            table.style.display = "none";
            chart.style.display = "none";
            showMessage.style.display = "inline";

        }
    } 

// Function that saves our W&H values as String array in localstorage(if localstorage available), otherwise show message 
function saveToLocalStorage(date, bmi) {
    if (storageAvailable('localStorage')) {
    let storedObject = {};
    // If localstorage is empty put there date-bmi as key-value string
    if(!localStorage.getItem('bmi-date')) {
        storedObject[date] = bmi;
        localStorage.setItem('bmi-date', JSON.stringify(storedObject));

    // If localstorage already have some values from previous sessions add new values to them
      } else {
        tempStorageObj = JSON.parse(localStorage.getItem('bmi-date'));
        tempStorageObj[date] = bmi;
        localStorage.setItem('bmi-date', JSON.stringify(tempStorageObj)); 
      }
    } else {
        // Localstorage is blocked - show text
        const showMessage = document.querySelector(".noLocalDataMessage");
        showMessage.innerText = "Sorry, you localstorage have no available space or disabled";
        showMessage.style.display = "inline";
    }}


// Add validate to inputs  
function validate(height, weight) {
    if (height.validity.valid && weight.validity.valid) {
        return true
    }
       else {
          return false
        }
}


function calculateBMI() {
    const height = document.getElementById('userHeight');
    const weight = document.getElementById('userWeight'); 
    if (height != "" && weight != "") {
        valid = validate(height, weight);
        if (valid) { 
            let bmi = weight.value / ((height.value/100) ** 2);
            let currentDate = moment(new Date());
            currentDate = currentDate.toJSON();
            saveToLocalStorage(currentDate, bmi);
            drawChart();
        }
    }
 
}

function deleteBMI() {
    localStorage.removeItem('bmi-date');
    deleteButton.style.display = "none";
    drawChart();
 
}