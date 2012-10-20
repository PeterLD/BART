function setLocalTime(){
	var currentTime = new Date();
	var currentHours = currentTime.getHours();
	var currentMinutes = currentTime.getMinutes();
	var abbreviation = "";

	// Convert to 12 hour time
	if(currentHours > 12) {
		currentHours -= 12;
		abbreviation = "PM";
	} else {
		abbreviation = "AM";
	}

	// Normalize minute display under 10
	if (currentMinutes < 10) {
		currentMinutes = "0" + currentMinutes;
	};

	// Format and write current time to the <time> element
	$displayTime = $('time');
	$displayTime.empty()
		.attr('datetime', currentTime.getTime())
		.append(currentHours + ":" + currentMinutes + abbreviation);
}

function prepareStations(){
	$.get('http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V', function(data){
		$departureStation = $('#departureStation');
		$departureStation.empty();
		$(data).find('station').each(function(){
			var stationName = $(this).find('name').text();
			$departureStation.append('<option>' + stationName + '</option>');
		});
		
	});
}

setLocalTime();
setInterval(function(){
	setLocalTime();
}, 1000);
prepareStations();