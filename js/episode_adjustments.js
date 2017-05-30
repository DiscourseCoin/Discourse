function convertXmlRssToJson(response, $scope) {
		var x2js = new X2JS();
		var xml = response.data;
		$scope.rssJson = x2js.xml_str2json(xml);
		$scope.episodes = $scope.rssJson.rss.channel.item;
		$scope.recentEpisodes = [];
		$scope.hosts = {
		'Zach' : {
			name: 'Zach',
			episodes : []
		},
		'Nick' : {
			name: 'Nick',
			episodes : []
		},
		'Chloe' : {
			name: 'Chloe',
			episodes : []
		},
		'Cody' : {
			name: 'Cody',
			episodes : []
		},
		'Kara' : {
			name: 'Kara',
			episodes : []
		},
		'Harry' : {
			name: 'Harry',
			episodes : []
		},
		'Cory' : {
			name: 'Cory',
			episodes : []
		}
	};
	}

	function applyEpisodeAdjustments($scope) {

		for (i = $scope.episodes.length - 1; i >= 0; i--) {
			
			//Most recent are at top of array
			index = $scope.episodes.length - i - 1;
			episode = $scope.episodes[index]
			
			applyEpisodeNumberAdjustment(episode);			 
			addRecentEpisodesAdjustment($scope, episode, i, $scope.episodes.length);
			stripBoilerPlateAdjustment(episode);
			fixReleaseDateAdjustment(episode);
			setupHosts($scope, episode);
		}

	}

	function addRecentEpisodesAdjustment($scope, episode, episodeNumber, numberOfEpisodes) {
		if ($scope.episodes.length - episodeNumber <= NUMBER_OF_EPISODES_IN_RECENT) {
			$scope.recentEpisodes.push(episode);
		}
	}

	function applyEpisodeNumberAdjustment(episode) {
		var titleSplit = episode.title.split('-');
		episode.number = titleSplit[0].replace('DHE #','').trim();
		episode.title = titleSplit[1].trim();
	}
	
	function stripBoilerPlateAdjustment(episode){
		episode.description = episode.description.split("itunes.apple")[0];
		var n = episode.description.lastIndexOf('<p><a href');
		episode.description = episode.description.substring(0, n);
	}
	
	function fixReleaseDateAdjustment(episode){
		episode.releaseDate = new Date(episode.pubDate);
		
	}
	
	function setupHosts($scope, episode){
		episode.subtitle = episode.subtitle.toString().replace('With', '')
		episode.subtitle = episode.subtitle.toString().replace('and', '')
		hosts = episode.subtitle.split(',');
		hosts.forEach(function(host){
			if(host.trim() in $scope.hosts){
				$scope.hosts[host.trim()].episodes.push(episode);
			}
		});
	}