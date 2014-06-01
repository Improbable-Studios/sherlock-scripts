#pragma strict

// TODO: 
// * word wrap
// * read from external text file & parser

public var name_plate: GUIText;
public var dialogue_plate: GUIText;

public var plate_offset_x : float;
public var name_plate_offset_y : float;
public var dialogue_plate_offset_y: float;

private var dgs_lesson1 : Dialogue[];
private var scene_lesson1: Scene;
private var guienviron : GUIEnviron;
private var window_transform:Transform;

function Start () {	
	guienviron = GUIEnviron(name_plate, dialogue_plate);
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
	dgs_lesson1 = new Dialogue[2];
	dgs_lesson1[0] = Dialogue("John", "I don't know... This looks really complicated.");
	dgs_lesson1[1] = Dialogue("Sherlock", "You're working with a visual medium now. You can't just rely on descriptive text anymore. ");
	
	scene_lesson1 = Scene(dgs_lesson1);
	scene_lesson1.display(guienviron);
}

function Update () {
	if(Input.GetKeyDown(KeyCode.Return)){
		scene_lesson1.display(guienviron);
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
	public var line: String;
	
	// constructor
	public function Dialogue(cid:String, ln:String){
		character_id = cid;
		line = ln;
	}
	
	public function show(env:GUIEnviron){
		// render differently on special character_id like INFO, CENTERED, EXTEND, ???, NO-NAME, CHOICE
		if(character_id == 'INFO'){
		
		}
		else{
			env.name_plate.text = character_id;
			env.dialogue_plate.text = line;
		}
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

