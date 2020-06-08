// Check that localstorage object is available and we have quota for saving things in it (mozilla developers script)

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


// If localstorage available - save our W&H values, otherwise show dialog 
export default function saveToLocalStorage(bmi, date) {
    if (storageAvailable('localStorage')) {
    // Check if localstorage already have some values from previous sessions
    if(!localStorage.getItem('bmi-date')) {
        let storeBmiAndDate = [];
        storeBmiAndDate.push([bmi, date]);    
        localStorage.setItem('bmi-date', JSON.stringify(storeBmiAndDate));

      } else {
        let tempStorageArray = JSON.parse(localStorage.getItem('bmi-date'));
        tempStorageArray.push([bmi, date]);
        localStorage.setItem('bmi-date', JSON.stringify(tempStorageArray)); 
        let storagep = document.querySelector('.localstorage');
        storagep.innerHTML = tempStorageArray[0];

        var ctx = document.getElementById('bmiChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
        
            // The data for our dataset
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'My First dataset',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: [0, 10, 5, 2, 20, 30, 45]
                }]
            },
        
            // Configuration options go here
            options: {}
        });

      }
    }
  else {
    // Too bad, no localStorage for us
    console.log('You have no space in localstorage')

  }
}
