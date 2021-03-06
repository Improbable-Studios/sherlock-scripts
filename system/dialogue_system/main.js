﻿#pragma strict

/* main code for dialogue system
Author: Xiayun Sun (xiayunsun@gmail.com)

TODO: 
* word wrap
* different character_id rendering

*/

public var name_plate: GUIText;
public var dialogue_plate: GUIText;
public var text_file : TextAsset;

public var plate_offset_x : float;
public var name_plate_offset_y : float;
public var dialogue_plate_offset_y: float;

private var scene: Scene;
private var fileparser: parser;
private var guienviron : GUIEnviron;

function Start () {	
	guienviron = GUIEnviron(name_plate, dialogue_plate);
	fileparser = GetComponent(parser);
	
	// setup GUIText positioning
	var window_renderer = GetComponent(Renderer);
	var window_width = window_renderer.bounds.max.x - window_renderer.bounds.min.x;
	var window_height = window_renderer.bounds.max.y - window_renderer.bounds.min.y;
	// topleft corner in worldspace
	var window_x = window_renderer.bounds.min.x;
	var window_y = window_renderer.bounds.max.y;
	
	var name_plate_x = window_x + plate_offset_x * window_height;
	var name_plate_y = window_y - name_plate_offset_y * window_height;
	var name_plate_screenpos = Camera.main.WorldToScreenPoint(Vector3(name_plate_x, name_plate_y));
	name_plate.transform.position.x = name_plate_screenpos.x / Camera.main.pixelWidth;
	name_plate.transform.position.y = name_plate_screenpos.y / Camera.main.pixelHeight;
	
	var dialog_plate_x = window_x + plate_offset_x * window_height;
	var dialog_plate_y = window_y - dialogue_plate_offset_y * window_height;
	var dialogue_plate_screenpos = Camera.main.WorldToScreenPoint(Vector3(dialog_plate_x, dialog_plate_y));
	dialogue_plate.transform.position.x = dialogue_plate_screenpos.x / Camera.main.pixelWidth;
	dialogue_plate.transform.position.y = dialogue_plate_screenpos.y / Camera.main.pixelHeight;
	
	// set up scene
	scene = fileparser.parse(text_file);
	scene.display(guienviron);
}

function Update () {
	if(Input.GetKeyDown(KeyCode.Return)){
		scene.display(guienviron);
	}
}


public class GUIEnviron{
	// wrapper class to include all GUI elements to be updated
	public var name_plate:GUIText;
	public var dialogue_plate:GUIText;
	
	public function GUIEnviron(nameplate:GUIText, dialogueplate:GUIText){
		name_plate = nameplate;
		dialogue_plate = dialogueplate;
	}
}

public class Dialogue{
	public var character_id: String;
	public var line: Line;
	
	// constructor
	public function Dialogue(cid:String, ln:Line){
		character_id = cid;
		line = ln;
	}
		
	public function show(env:GUIEnviron){
		// render differently on special character_id like INFO, CENTERED, EXTEND, ???, NO-NAME, CHOICE
		line.word_wrap();
		line.parse_tags();
		
		if(character_id == 'INFO'){
		
		}
		else if(character_id == 'CENTERED'){
			env.name_plate.text = "";
			env.dialogue_plate.alignment = TextAlignment.Center;
		}
		else{
			env.dialogue_plate.alignment = TextAlignment.Left;
			env.name_plate.text = character_id;
		}
		env.dialogue_plate.text = line.text;
	}
}

public class Line{
	// utility functions to construct the text line
	public var text : String;
	public var length : int = 85;
	
	public function Line(s:String){
		text = s;
	}	
	
	public function word_wrap(){
		// insert /n to break too-long lines
		// ignore tags
		var text_array = text.Split(" "[0]);
		var acc_length = 0;
		var acc_string : String = "";
		
		for (var i = 0; i < text_array.Length; i++){
			// ignore tags
			var j = text_array[i].LastIndexOf("{/");
			var l = text_array[i].Length;
			if (j == -1){
				acc_length += l;
			}else{
				acc_length += l - 2*(l-j);
			}
			if(acc_length > length){
				acc_string += "\n" + " " + text_array[i];
				acc_length = 0;
			}
			else{
				acc_string += " " + text_array[i];
			}
		}
		text = acc_string;	
	}
	
	public function parse_tags(){
		/* replace tags in s by html markups for richtext 
			{t}: <color=blue>
			{stat}: <color=green>
			{info}:<color=orange>
			{i}: <i>
			{b}: <b>
			{u}: <u>
			{a}
			{s}
		*/
		var s_t = text.Replace("{t}", "<color=blue>").Replace("{/t}", "</color>");
		var s_stat = s_t.Replace("{stat}", "<color=green>").Replace("{/stat}", "</color>");
		var s_info = s_stat.Replace("{info}", "<color=orange>").Replace("{/info}", "</color>");
		var s_i = s_info.Replace("{i}", "<i>").Replace("{/i}", "</i>");
		var s_b = s_i.Replace("{b}", "<b>").Replace("{/b}", "</b>");
		var s_u = s_b.Replace("{u}", "<u>").Replace("{/u}", "</u>");
		text = s_u;
	}
}

public class Scene{
	public var dialogues:Dialogue[];
	public var current_index : int;
	
	// constructor
	public function Scene(dgs:Dialogue[]){
		dialogues = dgs;
		current_index = 0;
	}
	
	public function display(env:GUIEnviron){
		// display current dialogue
		if (current_index < dialogues.length){
			dialogues[current_index].show(env);
			current_index += 1;
		}
	}
}

