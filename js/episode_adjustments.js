function convertXmlRssToJson(response, $scope) {
		var x2js = new X2JS();
		var xml = response.data;
		$scope.rssJson = x2js.xml_str2json(xml);
		$scope.episodes = $scope.rssJson.rss.channel.item;
		$scope.recentEpisodes = [];
		$scope.numOfEpisdoes = 0;		
	}

	function applyEpisodeAdjustments($scope) {
		
		$scope.episodeMap = {};
		
		for (i = $scope.episodes.length - 1; i >= 0; i--) {
			
			//Most recent are at top of array
			index = $scope.episodes.length - i - 1;
			episode = $scope.episodes[index]
			$scope.numOfEpisdoes++;
			
			applyEpisodeNumberAdjustment(episode);			 
			addRecentEpisodesAdjustment($scope, episode, i, $scope.episodes.length);
			stripBoilerPlateAdjustment(episode);
			fixReleaseDateAdjustment(episode);
			addEpisdesToHosts($scope, episode);
			fixMissingImage(episode);
			$scope.episodeMap[episode.number] = episode;
		}

	}
	
	function addFavorites($scope){
		$scope.favoriteEpisodes = [];
		TOP_EPISODES.forEach(function(episodeNum){
			var ep = $scope.episodeMap[episodeNum];
			$scope.favoriteEpisodes.push(ep);
		});
	}

	function addRecentEpisodesAdjustment($scope, episode, episodeNumber, numberOfEpisodes) {
		if ($scope.episodes.length - episodeNumber <= NUMBER_OF_EPISODES_IN_RECENT) {
			$scope.recentEpisodes.push(episode);
		}
	}

	function applyEpisodeNumberAdjustment(episode) {
		var titleSplit = episode.title.trim('-');
		episode.number = titleSplit[0].replace('DHE #','').trim();
		episode.title = titleSplit[1].trim() + titleSplit[2].trim();
	}
	
	function stripBoilerPlateAdjustment(episode){
		episode.description = episode.description.split("itunes.apple")[0];
		var n = episode.description.lastIndexOf('<p><a href');
		episode.description = episode.description.substring(0, n);
	}
	
	function fixReleaseDateAdjustment(episode){
		episode.releaseDate = new Date(episode.pubDate);
		
	}
	
	function addEpisdesToHosts($scope, episode){
		episode.subtitle = episode.subtitle.toString().replace('With', '')
		episode.subtitle = episode.subtitle.toString().replace('and', '')
		hosts = episode.subtitle.split(',');
		hosts.forEach(function(host){
			if(host.trim() in $scope.hosts){
				$scope.hosts[host.trim()].episodes.push(episode);
			}
		});
	}
	
	function fixMissingImage(episode){
		if(episode.pic==null){
			episode.pic = 'https://ssl-static.libsyn.com/p/assets/f/a/3/e/fa3e1cd4261b080c/podcastIcon.png';
		}
	}
	
