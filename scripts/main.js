function setLocalTime(){
	var currentTime = new Date();
	var currentHours = currentTime.getHours();
	var currentMinutes = currentTime.getMinutes();
	var abbreviation = "";

	// Convert to 12 hour time
	if(currentHours >= 12) {
		currentHours -= 12;
		abbreviation = "PM";
	} else {
		abbreviation = "AM";
	}

	if(currentHours === 0) {
		currentHours = 12;
	}

	// Normalize minute display under 10
	if (currentMinutes < 10) {
		currentMinutes = "0" + currentMinutes;
	};

	// Format and write current time to the <time> element
	$displayTime = $('#localTime');
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
		getBikeFriendliness();
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
		getBikeFriendliness();
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

function getBikeFriendliness() {
	var originAbbr = $('#origin option:selected').attr('data-abbr');
	var destinationAbbr = $('#destination option:selected').attr('data-abbr');
	var query = "http://api.bart.gov/api/sched.aspx?cmd=depart&orig=" + originAbbr + "&dest=" + destinationAbbr + "&date=now&key=MW9S-E7SL-26DU-VV8V&b=0&a=4";

	$.get(query, function(data){
		var departureTime,
			bikeFriendly;

		$(data).find('request trip').each(function(i) {
			var $trip = $(this);
			
			// loops through each leg to make sure they're all bike friendly
			// sets bikeFriendly to false and exits loop if it's not
			$trip.find('leg').each(function() {
				if( $(this).attr('bikeflag') === "1" ) {
					bikeFriendly = true;
					departureTime = $trip.attr('origTimeMin').replace(/\s/g,'');
				} else {
					bikeFriendly = false;
					return false;
				}
			});

			if(bikeFriendly && i === 0) {
				$('#result').empty()
					.append('better mount up rough rider. Next train\'s at <time id="departureTime" datetime="' + Date.parse(departureTime).getTime() + '">' + departureTime + "</time>.");
				return false;
			} else if(bikeFriendly && i > 0) {
				$('#result').empty()
					.append('just hang tight. Next train\'s coming at <time id="departureTime" datetime="' + Date.parse(departureTime).getTime() + '">' + departureTime + "</time>.");
				return false;
			}
		});

		if (!bikeFriendly) {
			$('#result').empty()
				.append("it looks like it's gonna be a while :/");
		}
	});
}

$(function(){
	setLocalTime();
	setInterval(function(){
		setLocalTime();

		// updates to next train if local time passes the train's arrival time
		if(($('#localTime').attr('datetime') - 60001) > $('#departureTime').attr('datetime')) {
			getBikeFriendliness();
		}
	}, 1000);
	prepareOrigin();
	prepareDestination();
});

$('#origin').change(function(){
	disableOriginAsDestination();
	getBikeFriendliness();
});

$('#destination').change(function(){
	getBikeFriendliness();
});