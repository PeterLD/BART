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

function prepareOrigin(){
	$.get('http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V', function(data){
		$origin = $('#origin');
		$origin.empty();
		$(data).find('station').each(function(){
			var stationName = $(this).find('name').text();
			var stationAbbr = $(this).find('abbr').text();
			$origin.append('<option data-abbr="' + stationAbbr + '">' + stationName + '</option>');
		});
		disableOriginAsDestination();
	});
}

function prepareDestination(){
	$.get('http://api.bart.gov/api/stn.aspx?cmd=stns&key=MW9S-E7SL-26DU-VV8V', function(data){
		$destination = $('#destination');
		$destination.empty();
		$(data).find('station').each(function(){
			var stationName = $(this).find('name').text();
			var stationAbbr = $(this).find('abbr').text();
			$destination.append('<option data-abbr="' + stationAbbr + '">' + stationName + '</option>');
		});
		disableOriginAsDestination();
	});
}

function disableOriginAsDestination() {
	var $destination = $('#destination option:selected');
	var originAbbr = $('#origin option:selected').attr('data-abbr');
	var destinationAbbr = $destination.attr('data-abbr');

	$('#destination option').each(function(){
		var $option = $(this);

		if($option.attr('disabled')) {
			$option.removeAttr('disabled');
		}

		if($option.attr('data-abbr') === originAbbr) {
			$option.attr('disabled', 'true');
		}
	});

	// shift destination if it's the same as the origin
	if(originAbbr === destinationAbbr){

		if($destination.not(':last-child')) {
			$destination.removeAttr('selected')
				.next('option').attr('selected', 'selected');
		} else {
			$destination.removeAttr('selected');
			$('#origin:first-child').attr('selected', 'selected');
		}
	}
}

$(function(){
	setLocalTime();
	setInterval(function(){
		setLocalTime();
	}, 1000);
	prepareOrigin();
	prepareDestination();
});

$('#origin').change(function(){
	disableOriginAsDestination();
});