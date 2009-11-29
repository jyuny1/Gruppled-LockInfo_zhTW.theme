callbacks['cx.ath.jakewalk.TodoPlugin'] = updateTODO;

var todoDIV;

if (!string_todo) {
	var string_todo = "To-Do";
}

if(!todoLimit){
	var todoLimit = 5;
}

if (!collapseAllButFirst_todo) {
	var collapseAllButFirst_todo = true;
}

window.addEventListener('load', initTODO, false);

function initTODO() {
	setTimeout( function(){
		var lockinfoDIV = document.getElementById("lockinfo");
		var position = sections.indexOf("TODO");
		var prevElem;
		var nextElem;
		
		if(position == -1) {
			return; // Dont display this section since it is not on the list
		}		

		// string_todo += " POS:" + position;
		
		prevElem = document.getElementById(sections[position - 1]);
		if(!prevElem) {
			nextElem = null;
		} else {
			nextElem = prevElem.nextSibling;
		}	
		
		todoDIV = document.createElement("DIV");
		todoDIV.limit = todoDIV.defaultLimit = todoLimit;
		todoDIV.id = "TODO";
		todoDIV.className = "empty container";
		todoDIV.style.display = hideEmptySections ? "none" : "block";
		todoDIV.update = updateTODO;
		todoDIV.innerHTML = "<div class='header expanded' ontouchstart='catchSwipe(event, toggleSection, [this.parentNode]);'><div class='arrow'></div><img src='images/todoh.png'/> "+string_todo+" (<span id='todoCount'>0</span>)</div><div class='container'><div class='container'></div></div>";
		lockinfoDIV.insertBefore(todoDIV, nextElem);
	},150);
}

function updateTODO(todo) {
	if(!todoDIV){
		return false;
	}
	
	if(!todo){
		if(todoDIV.previous){
			todo = todoDIV.previous;
		} else {
			return false;
		}
	}
	
	var todos = todo.todos;
	var html = "";
	var ids = {};
	
	//DEBUG STUFF
	// hideEmptySections = false;
	// html = todo.preferences.Enabled;
	// document.getElementById("todoCount").innerHTML = todos.length;
	// removeClass(todoDIV, "empty");
	// todoDIV.lastChild.innerHTML = html;
	// return;
	//END DEBUG
	
	
	clearRelativeTimers(todoDIV);	
	if(todoDIV && todos.length && todo.preferences.Enabled){
		todoDIV.previous = todo;
		if(globalHide >= 0){
			todoDIV.style.display = "block";
		}
	
		var relativeTimes = [];
		
		for(i = 0; i < todos.length && i < todoDIV.limit; i++){
			// todos = {due,flags,text}
			
			// flags: 1-due time set, 2-note
			
			var date = new Date(todos[i].due*1000);
			var flags = todos[i].flags;
			
			var flag_time = false;
			var flag_note = false;
			var flag_project = false;
			
			if(flags & 1) {
				flag_note = true;
			}

			if(flags & 2) {
				flag_time = true;
			}

			if(flags & 8) {
				flag_project = true;
			}
		
			var todoID = "todo_"+i;
			ids[todoID] = true;
			if(collapseAllButFirst_todo){
				subsectionCollapsed(todoID, "TODO", !i);
			}
			if(i > 0){
				html += "</div>";
			}
			
			var text = (flag_project ? "Project: " : "" ) + todos[i].text;
			
			// if(flag_note) {
			// 	text = dumpProperties(todos[i]);
			// }
			
			// html += "<div id='"+todoID+"' class='"+todoID+"' class='container' ontouchstart='catchSwipe(event, toggleSection, [this]);'>";
			// html += "	<div class='sub1 header expanded'>";
			// html += "		<div class='arrow'></div>";
			// html += "		<span>"+text+"</span>";
			// html += "	</div>";		
			// html += "	<div class='container'>";
			// html += "		<div class='sub sub1'>";
			// html += " 			<span class='sub2'>Due on: "+date.format(date.isSameDay() ? format_time : format_date_time_short)+ "</span>";
			// if(displayRelativeTimes){
			// 	html += "		(<span id='todo_rt_"+i+"'></span>)";
			// 	relativeTimes.push(["todo_rt_"+i, date]);
			// }
			// html += "		</div>";
			// html += "	</div>";
			// html += "</div>";
			
			html += "<div id='"+todoID+"' class='"+ todoID + "' ontouchstart='catchSwipe(event, toggleSection, [this]);' class='container'><div class='sub1 header expanded'><div class='arrow'></div><span>"+text+"</span></div><div class='container'>";
			html += "<div class='sub sub1'>Due on: ";
			
			if(flag_time) {
				html += "<span class='sub2'>"+date.format(date.isSameDay() ? format_time : format_date_time_short)+ "</span>";
			} else {
				html += "<span class='sub2'>"+ (date.isSameDay() ? "Today" : date.format(format_date_short))+ "</span>";
			}
			if(displayRelativeTimes && (flag_time || !date.isSameDay()) ){
				html += " (<span id='todo_rt_"+i+"'></span>)";
				relativeTimes.push(["todo_rt_"+i, date]);
			}
			
			html += "</div></div>";
		}	
		
		todoDIV.lastChild.innerHTML = html;

		if(displayLoadMore && todos.length > todoDIV.limit){
			addLoadMoreBar(todoDIV);
		}

		for(i = 0; i < relativeTimes.length; i++){
			relativeTime(todoDIV, relativeTimes[i][0], relativeTimes[i][1], false, false, string_justNow.upperFirst());
		}
		
		if(collapsed[todoDIV.id]){
			collapsed[todoDIV.id] = false;
			toggleSection([todoDIV, true]);
		}
		
		for(var id in collapsed){
			if(id.indexOf("todo_") == 0 && collapsed[id] && ids[id]){
				collapsed[id] = false;
				toggleSection([id, true]);
			}
		}

		document.getElementById("todoCount").innerHTML = todos.length;
		removeClass(todoDIV, "empty");
	} else {
		addClass(todoDIV, "empty");
		if(hideEmptySections){
			todoDIV.style.display = "none";
			revertCollapsed(todoDIV.id, "todo_");
		}else{
			todoDIV.lastChild.innerHTML = "";
			document.getElementById("todoCount").innerHTML = "0";
		}
	}
	// html += dumpProperties(todos[0]);
	// 
	// todoDIV.lastChild.innerHTML = html;
	// 
	// removeClass(todoDIV, "empty");
	// document.getElementById("todoCount").innerHTML = "99";
	
	return true;
}