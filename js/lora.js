// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyBToQZ5JQL2v_GViIxEzs04B1MsZfAvLWQ",
    authDomain: "lora-d5195.firebaseapp.com",
    databaseURL: "https://lora-d5195-default-rtdb.firebaseio.com",
    projectId: "lora-d5195",
    storageBucket: "lora-d5195.appspot.com",
    messagingSenderId: "62705741169",
    appId: "1:62705741169:web:e9a4b57628eb165bd55ad0",
    measurementId: "G-LBMM8PVT68"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//********************************************
//handle logic of LORA web table
//********************************************

var dataTableArr = [];

var addTable = (colNum) =>{
    let trElement = document.createElement('tr');
    for (let t=0; t<colNum; t++){
        trElement.appendChild(document.createElement('td'))
    }

    let tdBody = document.querySelector('tbody');
    tdBody.appendChild(trElement)
}

var i =0;

var test = document.getElementById('test');
var dbref = firebase.database().ref().child('test');
var convertData = (deviceData) => {
    let id = i++;
    let temperature = deviceData.payload_fields.temperature;
    let humidity = deviceData.payload_fields.humidity;
    let gasLevel = 188;
    let dustDensity = 1.3;
    let samplingTime = deviceData.metadata.time;

    dataTableArr.unshift({id, temperature, humidity, gasLevel, dustDensity, samplingTime});
    if(dataTableArr.length > 5) dataTableArr.pop();

    let tdBody = document.querySelector('tbody');
    for (let i = 0; i < dataTableArr.length; i++ ){
        if(dataTableArr.length > 5) dataTableArr.pop();
        if (tdBody.childElementCount < dataTableArr.length) addTable(6);
        tdBody.rows[i].cells[0].innerHTML = (dataTableArr[i].id != null)? dataTableArr[i].id : "";
        tdBody.rows[i].cells[1].innerHTML = (dataTableArr[i].temperature != null)? dataTableArr[i].temperature : "";
        tdBody.rows[i].cells[2].innerHTML = (dataTableArr[i].humidity != null)? dataTableArr[i].humidity : "";
        tdBody.rows[i].cells[3].innerHTML = (dataTableArr[i].gasLevel != null)? dataTableArr[i].gasLevel : "";
        tdBody.rows[i].cells[4].innerHTML = (dataTableArr[i].dustDensity != null)? dataTableArr[i].dustDensity : "";
        tdBody.rows[i].cells[5].innerHTML = (dataTableArr[i].samplingTime != null)? new Date (dataTableArr[i].samplingTime) : "";
    }
    // if(dataTableArr.length == 5){
    //     autoChart();
    // }
}

dbref.on('value', deviceObj => convertData(deviceObj.val()));


//********************************************
//handle logic of LORA web chart
//********************************************
// Set new default font family and font color to mimic Bootstrap's default styling
// Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
// Chart.defaults.global.defaultFontColor = '#858796';



// // Area Chart Example

// const labels = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
// ];
// const data = {
//     labels: labels,
//     datasets: [{
//         label: 'Temprature',
//         backgroundColor: 'rgb(255, 99, 132)',
//         borderColor: 'rgb(255, 99, 132)',
//         data: [0, 10, 5, 20, 10, 5, 15],
//     }]
// };


// const config = {
//     type: 'line',
//     data,
//     options: {}
// };

// var myChart = new Chart(
//     document.getElementById('myAreaChart'),
//     config
// );
