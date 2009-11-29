callbacks['com.ashman.lockinfo.TwitterPlugin'] = updateTwitter;

var twitterDIV;

if (!string_twitter) {
	var string_twitter = "Twitter";
}

if(!twitterLimit){
	var twitterLimit = 5;
}

if (!collapseAllButFirst_twitter) {
	var collapseAllButFirst_twitter = true;
}

if (defaultCollapsed) {
	defaultCollapsed["Twitter"] = true;
}

window.addEventListener('load', initTwitter, false);

function initTwitter() {
	setTimeout( function(){
		var lockinfoDIV = document.getElementById("lockinfo");
		var position = sections.indexOf("Twitter");
		var prevElem;
		var nextElem;
		
			
		if(position == -1) {
			return; // Dont display this section since it is not on the list
		}
		
		// string_twitter += " POS:" + position
		
		prevElem = document.getElementById(sections[position - 1]);
		if(!prevElem) {
			nextElem = null;
		} else {
			nextElem = prevElem.nextSibling;
		}	
	
		twitterDIV = document.createElement("DIV");
		twitterDIV.limit = twitterDIV.defaultLimit = twitterLimit;
		twitterDIV.id = "Twitter";
		twitterDIV.className = "empty container";
		twitterDIV.style.display = hideEmptySections ? "none" : "block";
		twitterDIV.update = updateTwitter;
		twitterDIV.innerHTML = "<div class='header expanded' ontouchstart='catchSwipe(event, toggleSection, [this.parentNode]);'><div class='arrow'></div><img src='images/twitterh.png'/> "+string_twitter+" (<span id='twitterCount'>0</span>)</div><div class='container'><div class='container'></div></div>";
		lockinfoDIV.insertBefore(twitterDIV, nextElem);
	},150);
}

function updateTwitter(twitter){
	if(!twitterDIV){
		return false;
	}
	
	// return true;
	
	if(!twitter){
		if(twitterDIV.previous){
			twitter = twitterDIV.previous;
		} else {
			return false;
		}
	}
	
	var tweets = twitter.tweets;
	var html = "";
	var ids = {};
	
	//DEBUG STUFF
	// html = dumpProperties(twitter);
	// document.getElementById("twitterCount").innerHTML = "99";
	// removeClass(twitterDIV, "empty");
	// twitterDIV.lastChild.innerHTML = html;
	// return true;
	//END DEBUG

	clearRelativeTimers(twitterDIV);	
	if(twitterDIV && tweets.length && twitter.preferences.Enabled){
		twitterDIV.previous = twitter;
		if(globalHide >= 0){
			twitterDIV.style.display = "block";
		}
		
		var relativeTimes = [];
		
		for(i = 0; i < tweets.length && i < twitterDIV.limit; i++){
			addDebug("--Tweet: " + dumpProperties(tweets[i]));
			var date = new Date(tweets[i].date*1000);
			// tweet = {name,date, tweet}
		
			// html += "<div id='twitter_'>";
			// html += "<div class 'sub sub1'>";
			// html += dumpProperties(tweets[i]);
			// html += "</div></div>";
			var tweetID = "twitter_"+i;
			ids[tweetID] = true;
			if(collapseAllButFirst_twitter){
				subsectionCollapsed(tweetID, "Twitter", !i);
			}
			if(i > 0){
				html += "</div>";
			}
			
			var tweet = tweets[i].tweet; // + "<a href='http://www.cnn.com/'>CNN</a>";
			var name = tweets[i].name;
			var imageCSS = "";
			var imageIMG = "";
			
			if(tweets[i].screenName) {
				name += " - " + tweets[i].screenName;
			}
			
			if(tweets[i].image){
				addDebug("--Tweet: " + tweets[i].image);
				imageCSS = "style='background-image:none'";
				imageIMG = "<img src='" + tweets[i].image + "' width='18' height='18' />";
			}
			
			html += "<div id='"+tweetID+"' class='twitter_"+tweets[i].name+"' ontouchstart='catchSwipe(event, toggleSection, [this]);' class='container'><div class='sub1 header expanded'><div class='arrow'></div>";
			html += "<span "+imageCSS+">"+imageIMG+name+"</span></div><div class='container'>";
			html += "<div class='sub sub1'>"+tweet;
			html += "<span class='sub2'> &ndash; "+date.format(date.isSameDay() ? format_time : format_date_time_short);
			if(displayRelativeTimes){
				html += " (<span id='tweet_"+i+"'></span>)"; //"("+tweets[i].date+")";
				relativeTimes.push(["tweet_"+i, date]);
			}
			
			html += "</div></div>";
		}

		twitterDIV.lastChild.innerHTML = html + "</div>";

		if(displayLoadMore && tweets.length > twitterDIV.limit){
			addLoadMoreBar(twitterDIV);
		}

		for(i = 0; i < relativeTimes.length; i++){
			relativeTime(twitterDIV, relativeTimes[i][0], relativeTimes[i][1], false, false, string_justNow.upperFirst());
		}
		
		if(collapsed[twitterDIV.id]){
			collapsed[twitterDIV.id] = false;
			toggleSection([twitterDIV, true]);
		}
		
		for(var id in collapsed){
			if(id.indexOf("twitter_") == 0 && collapsed[id] && ids[id]){
				collapsed[id] = false;
				toggleSection([id, true]);
			}
		}

		document.getElementById("twitterCount").innerHTML = tweets.length;
		removeClass(twitterDIV, "empty");
	} else {
		addClass(twitterDIV, "empty");
		if(hideEmptySections){
			twitterDIV.style.display = "none";
			revertCollapsed(twitterDIV.id, "twitter_");
		}else{
			twitterDIV.lastChild.innerHTML = "";
			document.getElementById("twitterCount").innerHTML = "0";
		}
	}
	return true;
}