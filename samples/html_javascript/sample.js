'use strict';

//Colours and random function 
window.chartColors = {
	red: 'rgb(210, 0, 0)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(231,233,237)'
};

//Not sure I need this
var randomScalingFactor = function() {
        return Math.round(Math.random() * 100);
    };

//Data used to populate the chart	
var config = {
	type: 'pie',
	data: {
		datasets: [{
			data: [
			],
			backgroundColor: [
				window.chartColors.red, 
				window.chartColors.blue, 
				window.chartColors.green
			],
			label: 'Dataset 1'
		}],
		labels: [
			"Less than 1 hour",
			"Between 1 and 3 hours",
			"More than 3 hours!"
		]
	},
	options: {
		responsive: true,
		legend: {
			position: 'bottom'
		}
	}
};

//This is the function that loads the chart into the window


$(document).ready(function start() {

    getDashboardData();
    
});

function getDashboardData() {
   
    //$.support.cors = true;    
    //Using ajax here, could have used getJSON but the error handling is awful
	$.ajax({
	    url: "http://localhost:3000/data/dashboard",
		dataType: 'json',
        success: processDashboardData
	})
    
}

function processDashboardData(data) {
	//set the config here
	var tempData = [];
	config.data.datasets[0].data.push(data.lessThanHourGames);
	config.data.datasets[0].data.push(data.lessThanThreeHourGames);
	config.data.datasets[0].data.push(data.totalGames - (data.lessThanHourGames + data.lessThanThreeHourGames));
	
	//Make the config show the json response
	//config.data.datasets.data = tempData;
	//config.data.datasets.backgroundColor = [window.chartColors.red, window.chartColors.blue, window.chartColors.green]
	
	var ctx = document.getElementById("chart-area").getContext("2d");
	window.myPie = new Chart(ctx, config);
	
	var text = document.getElementById("currentGames");
	var outputText = "<H3>Current Games</H3></BR>";
	
	data.currentGames.forEach(function (item) { 
		outputText = outputText + item + "</BR>";
	})
	text.innerHTML = outputText;
}

