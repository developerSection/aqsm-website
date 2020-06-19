// "field1": "PM 2.5",
// "field2": "PM 10",
// "field3": "O3",
// "field4": "NO2",
// "field5": "SO2",
// "field6": "CO",
// "field7": "Temprature",
// "field8": "Humidity",


// arrays that contains the latest data
const temp_latest_seven = [];
const hum_latest_seven = [];
const pm25_latest_seven = [];
const pm10_latest_seven = [];
const o3_latest_seven = [];
const no2_latest_seven = [];
const so2_latest_seven = [];
const co_latest_seven = [];
const date_latest_seven = [];
const time_latest_seven = [];
const date = [];
const filterhour = [];
var maxval = 0;
var lastupdated = "10:10:10 - 19/04/2020";
// read JSON API
window.onload = function getJSON() {
  setTimeout(() => {
    var api = new XMLHttpRequest();
    api.open(
      "GET",
      // "https://api.thingspeak.com/channels/926509/feeds.json?api_key=EACFH1UX2JMIS7QB",
      "https://api.thingspeak.com/channels/1034797/feeds.json?api_key=XT3ISBE05JRUQFFD",
      true
    );
    api.responseType = "json";
    api.onload = () => {
      var status = api.status;
      var f_dte;
      var getcurrhrs;
      var getprehrs = -1;
      if (status === 200) {
        var i = 0;
        var j = 0;
        var k = 0;
        const temp = [];
        const humidity = [];
        const o3 = [];
        const pm25 = [];
        const pm10 = [];
        const no2 = [];
        const so2 = [];
        const co = [];
        // const date = [];
        var link = api.response.feeds;
        var details = link.map(singleFile => {
          var d = new Date(singleFile.created_at);
          getcurrhrs = d.getUTCHours();
          if(getcurrhrs != getprehrs){
            f_dte =
            convert24hourformat(d.getUTCHours(), d.getMinutes()) +
            " - " +
            d.getDate() +
            "/" +
            (d.getMonth() + 1);
            date.push(f_dte);
            getprehrs = getcurrhrs;
          }
          const utchrs = convert24hourformat(d.getUTCHours(), d.getMinutes());
          const calhrs = f_dte.substring(0,8);
          if (singleFile.field7 === null && utchrs == calhrs) {
            temp.push("0");
          } else if(utchrs == calhrs){
            temp.push(singleFile.field7);
          }
          if (singleFile.field8 === null && utchrs == calhrs) {
            humidity.push('0');
          }
          else if(utchrs == calhrs){
            humidity.push(singleFile.field8);
          }
          if (singleFile.field3 === null && utchrs == calhrs) {
            o3.push('0');
          }
          else if(utchrs == calhrs){
            o3.push(singleFile.field3);
          }
          if (singleFile.field4 === null && utchrs == calhrs) {
            no2.push('0');
          }
          else if(utchrs == calhrs){
            no2.push(singleFile.field4);
          }
          if (singleFile.field6 === null && utchrs == calhrs) {
            co.push('0');
          }
          else if(utchrs == calhrs){
            co.push(singleFile.field6);
          }
          if (singleFile.field5 === null && utchrs == calhrs) {
            so2.push('0');
          }
          else if(utchrs == calhrs){
            so2.push(singleFile.field5);
          }
          if (singleFile.field1 === null && utchrs == calhrs) {
            pm25.push('0');
          }
          else if(utchrs == calhrs){
            pm25.push(singleFile.field1);
          }
          if (singleFile.field2 === null && utchrs == calhrs) {
            pm10.push('0');
          }
          else if(utchrs == calhrs){
            pm10.push(singleFile.field2);
          }
        });
        const date_res = date.reverse();
        const temp_res = temp.reverse();
        const humidity_res = humidity.reverse();
        const ozone_res = o3.reverse();
        const no2_res = no2.reverse();
        const co_res = co.reverse();
        const so2_res = so2.reverse();
        const pm25_res = pm25.reverse();
        const pm10_res = pm10.reverse();

        // get latest updated time
        lastupdated = date_res[0];

        temp_res.map(t => {
          if (i < temp_res.length) {
            temp_latest_seven.push(t);
            i = i + 1;
          }
        });
        date_res.map(d => {
          if (j < 48) {
            date_latest_seven.push(d);
            j = j + 1;
          }
        });
        humidity_res.map(h => {
          if (k < 48) {
            hum_latest_seven.push(h);
            k = k + 1;
          }
        });
        i=0;
        ozone_res.map(o3=>{
          if(i<48){
            o3_latest_seven.push(o3);
            i=i+1;
          }
        });
        i=0;
        no2_res.map(no2=>{
          if(i<48){
            no2_latest_seven.push(no2);
            i=i+1;
          }
        });
        i=0;
        co_res.map(co=>{
          if(i<48){
            co_latest_seven.push(co);
            i=i+1;
          }
        });
        i=0;
        so2_res.map(so2=>{
          if(i<48){
            so2_latest_seven.push(so2);
            i=i+1;
          }
        });
        i=0;
        pm25_res.map(pm25=>{
          if(i<48){
            pm25_latest_seven.push(pm25);
            i=i+1;
          }
        });
        i=0;
        pm10_res.map(pm10=>{
          if(i<48){
            pm10_latest_seven.push(pm10);
            i=i+1;
          }
        });
        temp_chart();
        hum_chart();
        ozone_chart();
        no2_chart();
        co_chart();
        so2_chart();
        pm25_chart();
        pm10_chart();
        this.getlastupdated();
        this.calculateAQI();
        // this.filteringdates();
      } else {
        alert("Something went wrong: " + api.response);
      }
    };
    api.send();
  }, 10);
};

function temp_chart() {
  const ctx = document.getElementById("temp-chart").getContext("2d");
  var bar_colors = [];
  var border_colors = [];
  for (var i = 0; i < temp_latest_seven.length; i++) {
    var bar_color;
    var border_color;
    if (temp_latest_seven[i] < 30) {
      bar_color = "rgba(10, 255, 10, 0.6)";
      border_color = "rgba(10, 255, 10, 1)"
    }
    else if (temp_latest_seven[i] >= 30) {
      bar_color = "rgba(194, 0, 0, 0.6)"
      border_color = "rgba(194, 0, 0, 1)"
    }
    bar_colors[i] = bar_color;
    border_colors[i] = border_color;
  }
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: date_latest_seven,
      datasets: [
        {
          label: `Temperature`,
          data: temp_latest_seven,
          backgroundColor: bar_colors,
          borderColor: border_colors,
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}

function hum_chart() {
  const ctx = document.getElementById("humidity-chart").getContext("2d");
  var bar_colors = [];
  var border_colors = [];
  for (var i = 0; i < hum_latest_seven.length; i++) {
    var bar_color;
    var border_color;
    if (hum_latest_seven[i] < 30) {
      bar_color = "rgba(10, 121, 223, 0.6)";
      border_color = "rgba(10, 121, 223, 1)"
    }
    else if (hum_latest_seven[i] >= 30) {
      bar_color = "rgba(194, 0, 0, 0.6)"
      border_color = "rgba(194, 0, 0, 1)"
    }
    bar_colors[i] = bar_color;
    border_colors[i] = border_color;
  }
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: date_latest_seven,
      datasets: [
        {
          label: "Humidity",
          data: hum_latest_seven,
          backgroundColor: bar_colors,
          borderColor: border_colors,
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}

function ozone_chart() {
  const ctx = document.getElementById("ozone-chart").getContext("2d");
  var bar_colors = [];
  var border_colors = [];
  for (var i = 0; i < o3_latest_seven.length; i++) {
    var bar_color;
    var border_color;
    if (o3_latest_seven[i] <= 50) {
      bar_color = "#01E401";
      border_color = "#01E401"
    }
    else if (o3_latest_seven[i]  >50 && o3_latest_seven[i] <=100) {
      bar_color = "#FFFF01"
      border_color = "#FFFF01"
    }
    else if(o3_latest_seven[i]  >100 && o3_latest_seven[i] <=150){
      bar_color = "#FF7E00"
      border_color = "#FF7E00"
    }
    else if(o3_latest_seven[i]  >150 && o3_latest_seven[i] <=200){
      bar_color = "#FE0000"
      border_color = "#FE0000"
    }
    else if(o3_latest_seven[i]  >200 && o3_latest_seven[i] <=300){
      bar_color = "#98004B"
      border_color = "#98004B"
    }
    else if(o3_latest_seven[i]  >300){
      bar_color = "#7E0123"
      border_color = "#7E0123"
    }
    bar_colors[i] = bar_color;
    border_colors[i] = border_color;
  }
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: date_latest_seven,
      datasets: [
        {
          label: `OZONE`,
          data: o3_latest_seven,
          backgroundColor: bar_colors,
          borderColor: border_colors,
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}

function no2_chart() {
  const ctx = document.getElementById("no2-chart").getContext("2d");
  var bar_colors = [];
  var border_colors = [];
  for (var i = 0; i < no2_latest_seven.length; i++) {
    var bar_color;
    var border_color;
    if (no2_latest_seven[i] <= 50) {
      bar_color = "#01E401";
      border_color = "#01E401"
    }
    else if (no2_latest_seven[i]  >50 && no2_latest_seven[i] <=100) {
      bar_color = "#FFFF01"
      border_color = "#FFFF01"
    }
    else if(no2_latest_seven[i]  >100 && no2_latest_seven[i] <=150){
      bar_color = "#FF7E00"
      border_color = "#FF7E00"
    }
    else if(no2_latest_seven[i]  >150 && no2_latest_seven[i] <=200){
      bar_color = "#FE0000"
      border_color = "#FE0000"
    }
    else if(no2_latest_seven[i]  >200 && no2_latest_seven[i] <=300){
      bar_color = "#98004B"
      border_color = "#98004B"
    }
    else if(no2_latest_seven[i]  >300){
      bar_color = "#7E0123"
      border_color = "#7E0123"
    }
    bar_colors[i] = bar_color;
    border_colors[i] = border_color;
  }
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: date_latest_seven,
      datasets: [
        {
          label: "NO2",
          data: no2_latest_seven,
          backgroundColor: bar_colors,
          borderColor: border_colors,
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}

function co_chart() {
  const ctx = document.getElementById("co-chart").getContext("2d");
  var bar_colors = [];
  var border_colors = [];
  for (var i = 0; i < co_latest_seven.length; i++) {
    var bar_color;
    var border_color;
    if (co_latest_seven[i] <= 50) {
      bar_color = "#01E401";
      border_color = "#01E401"
    }
    else if (co_latest_seven[i]  >50 && co_latest_seven[i] <=100) {
      bar_color = "#FFFF01"
      border_color = "#FFFF01"
    }
    else if(co_latest_seven[i]  >100 && co_latest_seven[i] <=150){
      bar_color = "#FF7E00"
      border_color = "#FF7E00"
    }
    else if(co_latest_seven[i]  >150 && co_latest_seven[i] <=200){
      bar_color = "#FE0000"
      border_color = "#FE0000"
    }
    else if(co_latest_seven[i]  >200 && co_latest_seven[i] <=300){
      bar_color = "#98004B"
      border_color = "#98004B"
    }
    else if(co_latest_seven[i]  >300){
      bar_color = "#7E0123"
      border_color = "#7E0123"
    }
    bar_colors[i] = bar_color;
    border_colors[i] = border_color;
  }
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: date_latest_seven,
      datasets: [
        {
          label: `CO`,
          data: co_latest_seven,
          backgroundColor: bar_colors,
          borderColor: border_colors,
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}

function so2_chart() {
  const ctx = document.getElementById("so2-chart").getContext("2d");
  var bar_colors = [];
  var border_colors = [];
  for (var i = 0; i < so2_latest_seven.length; i++) {
    var bar_color;
    var border_color;
    if (so2_latest_seven[i] <= 50) {
      bar_color = "#01E401";
      border_color = "#01E401"
    }
    else if (so2_latest_seven[i]  >50 && so2_latest_seven[i] <=100) {
      bar_color = "#FFFF01"
      border_color = "#FFFF01"
    }
    else if(so2_latest_seven[i]  >100 && so2_latest_seven[i] <=150){
      bar_color = "#FF7E00"
      border_color = "#FF7E00"
    }
    else if(so2_latest_seven[i]  >150 && so2_latest_seven[i] <=200){
      bar_color = "#FE0000"
      border_color = "#FE0000"
    }
    else if(so2_latest_seven[i]  >200 && so2_latest_seven[i] <=300){
      bar_color = "#98004B"
      border_color = "#98004B"
    }
    else if(so2_latest_seven[i]  >300){
      bar_color = "#7E0123"
      border_color = "#7E0123"
    }
    bar_colors[i] = bar_color;
    border_colors[i] = border_color;
  }
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: date_latest_seven,
      datasets: [
        {
          label: `SO2`,
          data: so2_latest_seven,
          backgroundColor: bar_colors,
          borderColor: border_colors,
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}

function pm25_chart() {
  const ctx = document.getElementById("pm25-chart").getContext("2d");
  var bar_colors = [];
  var border_colors = [];
  for (var i = 0; i < pm25_latest_seven.length; i++) {
    var bar_color;
    var border_color;
    if (pm25_latest_seven[i] <= 50) {
      bar_color = "#01E401";
      border_color = "#01E401"
    }
    else if (pm25_latest_seven[i]  >50 && pm25_latest_seven[i] <=100) {
      bar_color = "#FFFF01"
      border_color = "#FFFF01"
    }
    else if(pm25_latest_seven[i]  >100 && pm25_latest_seven[i] <=150){
      bar_color = "#FF7E00"
      border_color = "#FF7E00"
    }
    else if(pm25_latest_seven[i]  >150 && pm25_latest_seven[i] <=200){
      bar_color = "#FE0000"
      border_color = "#FE0000"
    }
    else if(pm25_latest_seven[i]  >200 && pm25_latest_seven[i] <=300){
      bar_color = "#98004B"
      border_color = "#98004B"
    }
    else if(pm25_latest_seven[i]  >300){
      bar_color = "#7E0123"
      border_color = "#7E0123"
    }
    bar_colors[i] = bar_color;
    border_colors[i] = border_color;
  }
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: date_latest_seven,
      datasets: [
        {
          label: `PM 2.5`,
          data: pm25_latest_seven,
          backgroundColor: bar_colors,
          borderColor: border_colors,
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}


function pm10_chart() {
  const ctx = document.getElementById("pm10-chart").getContext("2d");
  var bar_colors = [];
  var border_colors = [];
  for (var i = 0; i < pm10_latest_seven.length; i++) {
    var bar_color;
    var border_color;
    if (pm10_latest_seven[i] <= 50) {
      bar_color = "#01E401";
      border_color = "#01E401"
    }
    else if (pm10_latest_seven[i]  >50 && pm10_latest_seven[i] <=100) {
      bar_color = "#FFFF01"
      border_color = "#FFFF01"
    }
    else if(pm10_latest_seven[i]  >100 && pm10_latest_seven[i] <=150){
      bar_color = "#FF7E00"
      border_color = "#FF7E00"
    }
    else if(pm10_latest_seven[i]  >150 && pm10_latest_seven[i] <=200){
      bar_color = "#FE0000"
      border_color = "#FE0000"
    }
    else if(pm10_latest_seven[i]  >200 && pm10_latest_seven[i] <=300){
      bar_color = "#98004B"
      border_color = "#98004B"
    }
    else if(pm10_latest_seven[i]  >300){
      bar_color = "#7E0123"
      border_color = "#7E0123"
    }
    bar_colors[i] = bar_color;
    border_colors[i] = border_color;
  }
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: date_latest_seven,
      datasets: [
        {
          label: `PM 10`,
          data: pm10_latest_seven,
          backgroundColor: bar_colors,
          borderColor: border_colors,
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}


function getlastupdated() {
  this.document.getElementById("lastupdated1").innerHTML = lastupdated;
  this.document.getElementById("lastupdated2").innerHTML = lastupdated;

}



function convert24hourformat(hours, minutes){
  hours = hours + 5;
  if(hours == 0){
    if(minutes<10){
      return `12:${('0' + minutes).slice(-2)} AM`;
    }
    else{
      return `12:${minutes} AM`;
    }
  }
  else if(hours > 0 && hours <13){
    if(minutes<10){
      return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)} AM`;
    }
    else if(hours< 10 && minutes < 10){
      return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)} AM`;
    }
    else if(hours < 10){
      return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)} AM`;
    }
    else{
      return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)} AM`;
    }
  }
  else if(hours >= 13){
    hr = hours-12;
    if(minutes<10){
      return `${('0' + hr).slice(-2)}:${('0' + minutes).slice(-2)} PM`;
    }
    else if(hours< 10 && minutes < 10){
      return `${('0' + hr).slice(-2)}:${('0' + minutes).slice(-2)} PM`;
    }
    else if(hours < 10){
      return `${('0' + hr).slice(-2)}:${('0' + minutes).slice(-2)} PM`;
    }
    else{
      return `${('0' + hr).slice(-2)}:${('0' + minutes).slice(-2)} PM`;
    }
  }
}


function calculateAQI(){
  // get last 24 hour data gasses o3, no2, so2, co, pm2.5, pm10
  o3_24hr_data = [];
  no2_24hr_data = [];
  so2_24hr_data = [];
  co_24hr_data = [];
  pm25_24hr_data = [];
  pm10_24hr_data = [];
  var loopvalue = 24;
  var o3_avg = 0;
  var no2_avg = 0;
  var so2_avg = 0;
  var co_avg = 0;
  var pm25_avg = 0;
  var pm10_avg = 0;
  if(date_latest_seven.lenght>24){
    loopvalue = 24
  }
  else{
    loopvalue = date_latest_seven.length
  }
  for(var i=0;i<loopvalue;i++){
    o3_24hr_data.push(o3_latest_seven[i]);
    no2_24hr_data.push(no2_latest_seven[i]);
    so2_24hr_data.push(so2_latest_seven[i]);
    co_24hr_data.push(co_latest_seven[i]);
    pm25_24hr_data.push(pm25_latest_seven[i]);
    pm10_24hr_data.push(pm10_latest_seven[i]);
  }
  // calculate avgs
  for(var i=0;i<loopvalue;i++){
    pm10_avg = pm10_avg + parseInt(pm10_24hr_data[i]);
    pm25_avg = pm25_avg + parseInt(pm25_24hr_data[i]);
    o3_avg = o3_avg + parseInt(o3_24hr_data[i]);
    no2_avg = no2_avg + parseInt(no2_24hr_data[i]);
    so2_avg = so2_avg + parseInt(so2_24hr_data[i]);
    co_avg = co_avg + parseInt(co_24hr_data[i]);
  }
  pm10_avg = (pm10_avg /loopvalue).toFixed(0);
  pm25_avg = (pm25_avg /loopvalue).toFixed(0);
  o3_avg = (o3_avg /loopvalue).toFixed(0);
  no2_avg = (no2_avg /loopvalue).toFixed(0);
  so2_avg = (so2_avg /loopvalue).toFixed(0);
  co_avg = (co_avg /loopvalue).toFixed(0);

  // find max value from all 6 gasses
  const valarr = [pm10_avg, pm25_avg, o3_avg, no2_avg, so2_avg, co_avg];
  for(var i=0;i<valarr.length;i++){
    var tempval = parseInt(valarr[i]);
    if(tempval > maxval){
      maxval = tempval;
    }
  }

  // display max value as AQI in "aqiwgt"
  document.getElementById("aqiwgt").innerHTML = maxval;
  if(maxval<=50){
    document.getElementById("aqiwgt").style.backgroundColor = "#01E401";
  }
  else if(maxval > 50 && maxval <=100){
    document.getElementById("aqiwgt").style.backgroundColor = "#FFFF01";

  }
  else if(maxval > 100 && maxval <=150){
    document.getElementById("aqiwgt").style.backgroundColor = "#FE0000";

  }
  else if(maxval > 150 && maxval <=200){
    document.getElementById("aqiwgt").style.backgroundColor = "#FE0000";

  }
  else if(maxval > 200 && maxval <=300){
    document.getElementById("aqiwgt").style.backgroundColor = "#98004B";

  }
  else if(maxval > 300){
    document.getElementById("aqiwgt").style.backgroundColor = "#7E0123";

  }


}

