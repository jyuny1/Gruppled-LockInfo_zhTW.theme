function dumpProperties(obj) {
	var props = "Properties<br>";
	for (var name in obj) {
	  if (obj.hasOwnProperty(name)) {
		props += "-" + name + "<br>";
	  }
	}
	return props;
}

function addDebug(str) {
	return;
	document.getElementById("debug").innerHTML += str + " <br>";
}