#pragma strict

/*
format: 
character_id|line
*/

function parse(text_asset:TextAsset):Scene{
	// parse an external file into a Scene()
	var lines_str = text_asset.text;
	var lines = lines_str.Split('\n'[0]);
	
	var dgs = new Dialogue[lines.Length];
	
	for (var i = 0; i < lines.Length; i++){
		var line_components = lines[i].Split('|'[0]);
		var char_id = line_components[0];
		var line = Line(line_components[1]);
		dgs[i] = Dialogue(char_id, line);
	}
	
	var scene = Scene(dgs);
	return scene;
	
}