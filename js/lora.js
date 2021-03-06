//********************************************
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
//********************************************
var firebaseConfig = {
  apiKey: "AIzaSyBOy8UXXXy2IUmXgeeaLgI0bsfgucQObu8",
  authDomain: "lora-105ec.firebaseapp.com",
  databaseURL: "https://lora-105ec-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lora-105ec",
  storageBucket: "lora-105ec.appspot.com",
  messagingSenderId: "47038179866",
  appId: "1:47038179866:web:e33f0408d9fde0172f3fa3",
  measurementId: "G-BT8KW4H7ZG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//********************************************
// declare global value
//********************************************
var dataTableArr = [];
var temperatureArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var humidityArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var airQualityArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var dustDensityArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var timeArr = ['00:00:00', '00:00:00', '00:00:00','00:00:00', '00:00:00', '00:00:00', '00:00:00', '00:00:00','00:00:00', '00:00:00'];

//********************************************
//handle logic of LORA web table
//********************************************

var addTable = (colNum) =>{
    let trElement = document.createElement('tr');
    for (let t=0; t<colNum; t++){
        trElement.appendChild(document.createElement('td'))
    }

    let tdBody = document.querySelector('tbody');
    tdBody.appendChild(trElement)
}

var convertTimeShort = (raw) => {
    dateRaw = new Date(raw);
    return dateRaw.getHours() + ':' + dateRaw.getMinutes() + ':' + dateRaw.getSeconds();
}
var convertTimeStandard = (raw) => {
  dateRaw = new Date(raw);
  return dateRaw.toString().replace("GMT+0700 (Indochina Time)", "");
}

// var checkServer = (time) => {
//   let serverTime = new date(time);
//   let now = new date();
//   alert(now);
// }

var test = document.getElementById('lora');
var dbref = firebase.database().ref().child('lora');
var convertData = (deviceData) => {
    let id = deviceData.counter;
    let temperature = deviceData.payload_fields.temperature;
    let humidity = deviceData.payload_fields.humidity;
    let airQuality = deviceData.payload_fields.airQuality;
    let dustDensity = deviceData.payload_fields.dustDensity;
    let samplingTime = deviceData.metadata.time;
    //checkServer(samplingTime);

    temperatureArr.unshift(temperature);
    temperatureArr.pop();
    humidityArr.unshift(humidity);
    humidityArr.pop();
    airQualityArr.unshift(airQuality);
    airQualityArr.pop();
    dustDensityArr.unshift(dustDensity);
    dustDensityArr.pop();
    timeArr.unshift(convertTimeShort(samplingTime));
    timeArr.pop();

    if (dataTableArr.length > 0)
      createChart();

    //format date for table
    samplingTime = convertTimeStandard(new Date (samplingTime));
    dataTableArr.unshift({id, temperature, humidity, airQuality, dustDensity, samplingTime});
    if(dataTableArr.length > 5) dataTableArr.pop();

    let tdBody = document.querySelector('tbody');
    for (let i = 0; i < dataTableArr.length; i++ ){
        if(dataTableArr.length > 5) dataTableArr.pop();
        if (tdBody.childElementCount < dataTableArr.length) addTable(6);
        tdBody.rows[i].cells[0].innerHTML = (dataTableArr[i].id != null)? dataTableArr[i].id : "";
        tdBody.rows[i].cells[1].innerHTML = (dataTableArr[i].temperature != null)? dataTableArr[i].temperature : "";
        tdBody.rows[i].cells[2].innerHTML = (dataTableArr[i].humidity != null)? dataTableArr[i].humidity : "";
        tdBody.rows[i].cells[3].innerHTML = (dataTableArr[i].airQuality != null)? dataTableArr[i].airQuality : "";
        tdBody.rows[i].cells[4].innerHTML = (dataTableArr[i].dustDensity != null)? dataTableArr[i].dustDensity : "";
        tdBody.rows[i].cells[5].innerHTML = (dataTableArr[i].samplingTime != null)? dataTableArr[i].samplingTime : "";
    }
}

dbref.on('value', deviceObj => convertData(deviceObj.val()));


//********************************************
//handle logic of LORA web chart
//********************************************
// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

var ctxT = document.getElementById("myAreaChartTemperatue");
var ctxH = document.getElementById("myAreaChartHumidity");
var ctxA = document.getElementById("myAreaChartAirQuality");
var ctxD = document.getElementById("myAreaChartDustDensity");

var createChart = () => {
  //Temperature
  new Chart(ctxT, {
    type: 'line',
    data: {
      labels: timeArr,
      datasets: [{
        label: "Nhi???t ?????:",
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: temperatureArr,
      }],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: 'date'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 10
          }
        }],
        yAxes: [{
          ticks: {
            maxTicksLimit: 7,
            padding: 10,
            callback: function (value, index, values) {
              return value + ' ??C';
            }
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: 'index',
        caretPadding: 10,
        callbacks: {
          label: function (tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ': ' + tooltipItem.yLabel + ' ??C';
          }
        }
      }
    }
  });
  //Humidity
  new Chart(ctxH, {
    type: 'line',
    data: {
      labels: timeArr,
      datasets: [{
        label: "????? ???m:",
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: humidityArr,
      }],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: 'date'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 10
          }
        }],
        yAxes: [{
          ticks: {
            maxTicksLimit: 7,
            padding: 10,
            callback: function (value, index, values) {
              return value + ' %';
            }
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: 'index',
        caretPadding: 10,
        callbacks: {
          label: function (tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ': ' + tooltipItem.yLabel + ' %';
          }
        }
      }
    }
  });
  //AirQuality
  new Chart(ctxA, {
    type: 'line',
    data: {
      labels: timeArr,
      datasets: [{
        label: "M???c kh?? gas:",
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: airQualityArr,
      }],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: 'date'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 10
          }
        }],
        yAxes: [{
          ticks: {
            maxTicksLimit: 7,
            padding: 10,
            callback: function (value, index, values) {
              return value + ' ppm';
            }
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: 'index',
        caretPadding: 10,
        callbacks: {
          label: function (tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ': ' + tooltipItem.yLabel + ' ppm';
          }
        }
      }
    }
  });
  //DustDensity
  new Chart(ctxD, {
    type: 'line',
    data: {
      labels: timeArr,
      datasets: [{
        label: "M???t ????? b???i:",
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: dustDensityArr,
      }],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: 'date'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 10
          }
        }],
        yAxes: [{
          ticks: {
            maxTicksLimit: 7,
            padding: 10,
            callback: function (value, index, values) {
              return value + ' mg/m3';
            }
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: 'index',
        caretPadding: 10,
        callbacks: {
          label: function (tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ': ' + tooltipItem.yLabel + ' mg/m3';
          }
        }
      }
    }
  });
}
createChart ();

//********************************************
//handle logic of LORA web button
//********************************************

var checkFan = () => {
  if ($('#fanText').text() == 'On')
    return 1;
  return 0;
}

var checkLight = () => {
  if ($('#lightText').text() == 'On')
    return 1;
  return 0;
}

var dataFan = (status) => {
  return {
    "dev_id": "b06b01e6e2e0",
    "port": 1,
    "confirmed": false,
    "payload_fields": {
      "fan": status,
      "light": checkLight()
    }
  }
}

var dataLight = (status) => {
  return {
    "dev_id": "b06b01e6e2e0",
    "port": 1,
    "confirmed": false,
    "payload_fields": {
      "fan": checkFan(),
      "light": status
    }
  }
}

//var turnOnFan



$("#fanBtn").bind( "click", () => {
  if($('#fanText').text() == 'On'){
    $('#fanText').text('Off');
    $("#fanBtn").removeClass('btn-primary').addClass('btn-danger');
    sendDownlink(dataFan(0));
  }else {
    $('#fanText').text('On');
    $("#fanBtn").removeClass('btn-danger').addClass('btn-primary');
    sendDownlink(dataFan(1));
  }
});

$( "#lightBtn" ).bind( "click", function() {
  if($('#lightText').text() == 'On'){
    $('#lightText').text('Off');
    $("#lightBtn").removeClass('btn-primary').addClass('btn-danger');
  }else {
    $('#lightText').text('On');
    $("#lightBtn").removeClass('btn-danger').addClass('btn-primary');
  }
});

var sendDownlink = (data) => {
  fetch("https://integrations.thethingsnetwork.org/ttn-asia-se/api/v2/down/esp32iotlora/lora?key=ttn-account-v2.NVbk-rHNOrWv6VW-KNrH8u2r4ymoAk8RI1nCBByEQg4", {
    method: "POST",
    body: JSON.stringify(data)
  }).then(res => {
    console.log("Request complete! response:", res);
  });
}
