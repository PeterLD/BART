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

prepareStations();