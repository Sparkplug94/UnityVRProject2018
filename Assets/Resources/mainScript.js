#pragma strict
import System.IO;
import System.IO.Directory;
import System.Text.RegularExpressions; //.Net library necessary to do regular expressions
import System.Collections.Generic;
//import System.Diagnostics;
import System.Diagnostics.Process;
import System.String;
var process : System.Diagnostics.Process;



var cubes = new List.<GameObject>();
var explosionCubes = new List.<GameObject>();
var rows : int;
var cols : int;
var mineFreq : float;
var scale : float;
var numberOfCubes : int;
var mineGrid : int[,];
var numGrid : int[,];
var flagGrid : int[,];

//this is a C# style "array", use "Count" instead of "Length" and 
//you can't access an array element until you've created it 


function Start(){

	//set the parameters
	rows = 8;
	cols = 8;
	numberOfCubes = rows*cols;
	scale = 3.0;
	mineFreq = 0.2;

	//init the cubes
	initCubes(rows, cols, scale);
	

	//init the mines - 1 indicates that this box holds a mine
	mineGrid = initMineGrid(rows,cols,mineFreq);

	//Do the nearest neighbor search - init this into a function - these are the displayed numbers on the boxes
	numGrid = initNumGrid(rows,cols,mineGrid);

	//init the flag grid - 1 indicates that box is flagged
	flagGrid = new int[rows, cols]; //zeros for now

	
}

function Update(){
	//some object blah blah.GetComponent(Rigidbody).velocity = Vector3(1,0,0);
	
	isSolved(rows, cols, mineGrid, flagGrid);

	var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
 	var hit : RaycastHit;
 	var index : int;
 	var ipos : int;
 	var jpos : int;
 	var selectedObject : GameObject;

 	

 	if(Physics.Raycast(ray, hit)){

      	selectedObject = GameObject.Find(hit.transform.name);

      	//check to see if the raycast hits a cube or not
      	if(selectedObject.transform.name == "Plane"){
      		//Debug.Log("plane");
      		index = -1;
      		ipos = -1;
      		jpos = -1;
      	}
      	//regex match names of objects that are integers only
      	else if(Regex.IsMatch(selectedObject.transform.name,"^[-+]?\\d+$"))
      	{
      		//Debug.Log("name is an integer of some kind");
      		index =  System.Convert.ToInt16(hit.transform.name);
      		jpos = index % rows;
      		ipos = (index - jpos)/rows;
      	}
      	else{
      		//Debug.Log("not an object we care about");
      		index = -1;
      		ipos = -1;
      		jpos = -1;
      	}
      	

      	if(Input.GetMouseButtonDown(0)){
      		if(index != -1){
      			//if it's a mine
      			if(mineGrid[ipos,jpos] == 1){
	 				Debug.Log("Kaboom");
	 				//explosion
	 				//Debug.Log(selectedObject.transform.position);
	 				//destroy the cube
	 				Destroy(selectedObject);
	 				//create a bunch of mini cubes at that position
	 				for (var f = 0; f < 75; f++) {
	 					explosionCubes.Add(Instantiate(Resources.Load("ExplosionCube")));
	 					explosionCubes[f].transform.position = selectedObject.transform.position;
	 				}
	 			}
	 			else{
	 				//display the appropriate number frmo the numGrid
	 				cubes[index].transform.GetChild(0).GetComponent(TextMesh).text = numGrid[ipos,jpos].ToString();
	 			}
      		}
      	}
      	if(Input.GetMouseButtonDown(1)){
      		if(index != -1){
      			var pole = selectedObject.transform.GetChild(1).GetComponent(MeshRenderer);
	 			var flag = selectedObject.transform.GetChild(1).GetChild(0).GetComponent(MeshRenderer);
	 			if(pole.enabled == false){
	 					pole.enabled = true;
	 					flag.enabled = true;
	 					flagGrid[ipos,jpos] = 1;
	 					
	 			}
	 			else if(pole.enabled == true){
	 					pole.enabled = false;
	 					flag.enabled = false;
	 					flagGrid[ipos,jpos] = 0;
	 			}
	 			else{

 				}
      		}
      	}
	}
}



function initMineGrid(numRows : int, numCols : int, mineFrequency : float){
	var grid = new int[numRows, numCols];

	for (var i = 0; i < numRows; i++) {
		for (var j = 0; j < numCols; j++){
			var seed = Random.Range(0.0f, 1.0f);
			if (seed < mineFrequency) {
				grid[i,j] = 1;
				//Debug.Log(i.ToString()+","+j.ToString()+" mined");
			} 
			else {
				grid[i,j] = 0;
				//Debug.Log(i.ToString()+","+j.ToString()+" not mined");
			}
		}
	}

	return grid;

}

function initNumGrid(numRows : int, numCols : int, mineGrid : int[,]){
	var grid = new int[numRows, numCols];
	for (var m = 0; m < numRows; m++) {
		for (var n = 0; n < numCols; n++){
			var gridSum = 0;
			// figure out how to check if an element exists and init this a function. 
			try{
				gridSum += mineGrid[m+1,n+1];
			}
			catch(err){

			}
			try{
				gridSum += mineGrid[m+1,n];
			}
			catch(err){

			}
			try{
				gridSum += mineGrid[m+1,n-1];
			}
			catch(err){

			}
			try{
				gridSum += mineGrid[m,n+1];
			}
			catch(err){

			}
			try{
				gridSum += mineGrid[m,n-1];
			}
			catch(err){

			}
			try{
				gridSum += mineGrid[m-1,n+1];
			}
			catch(err){

			}
			try{
				gridSum += mineGrid[m-1,n];
			}
			catch(err){

			}
			try{
				gridSum += mineGrid[m-1,n-1];
			}
			catch(err){

			}

			grid[m,n] = gridSum;

		}
	}

	return grid;
}

function initCubes(numRows : int, numCols : int, scale : float){
	for (var ii = 0; ii < numRows; ii++){
		for (var jj = 0; jj < numCols; jj++){
			cubes.Add(Instantiate(Resources.Load("FlagCube")));
			var index : int = ii*rows+jj;
			cubes[index].transform.position = Vector3(scale*ii,0,scale*jj);
			//set the name of the cube to its index
			cubes[index].transform.name = index.ToString();
			//should probably init these an array...
			var textObject = cubes[index].transform.GetChild(0);
			var poleObject = cubes[index].transform.GetChild(1);
			var flagObject = poleObject.transform.GetChild(0);
			//set texts to index
			textObject.GetComponent(TextMesh).text = "";
			flagObject.GetComponent(MeshRenderer).enabled = false;
			poleObject.GetComponent(MeshRenderer).enabled = false;
		}
	}
}

function isSolved(numRows : int, numCols : int, mines : int[,], flags : int[,]){

	for (var i = 0; i < numRows; i++){
		for (var j = 0; j < numRows; j++){
			if(mines[i,j] != flags [i,j]){
				return false;
			} 
		}
	}
	Debug.Log("You win!");
	return true;
}




