#pragma strict

// TODO: 
// 1. auto positioning of GUITexts
// 2. word wrap
// 3. read from external text file

public var name_plate: GUIText;
public var dialogue_plate: GUIText;

private var dgs_lesson1 : Dialogue[];
private var scene_lesson1: Scene;
private var guienviron : GUIEnviron;
private var window_transform:Transform;

function Start () {	
	guienviron = GUIEnviron(name_plate, dialogue_plate);
	window_transform = GetComponent(Transform);
	
	// setup GUIText positioning
	
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

