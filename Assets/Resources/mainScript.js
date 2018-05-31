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
var rows : int;
var cols : int;
var mineFreq : float;
var scale : float;
var numberOfCubes : int;

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


	//get children of things in cubes array
	//var flagtextobject = cubes[0].transform.GetChild(0);
	//get the meshrenderer component of the first child of cubes[0]
	//var mr = flagtextobject.GetComponent(MeshRenderer);
	//enable or disable the renderer (hide and show text)
	//mr.enabled = true;
	//get the textmesh component of first child of cubes[0] which happens to be the "Text" object
	//var flagtext = flagtextobject.GetComponent(TextMesh);
	//change the text property of TextMesh to "byebye"
	//flagtext.text = "byebye";
	

	//init the mines - 1 indicates that this box holds a mine
	var mineGrid = initMineGrid(rows,cols,mineFreq);

	//Do the nearest neighbor search - init this into a function - these are the displayed numbers on the boxes
	var numGrid = initNumGrid(rows,cols,mineGrid);

	//init the flag grid - 1 indicates that box is flagged
	var flagGrid = new int[rows, cols]; //zeros for now

	
}

function Update(){
	//some object blah blah.GetComponent(Rigidbody).velocity = Vector3(1,0,0);
	
	var ray : Ray = Camera.main.ScreenPointToRay(Input.mousePosition);
 	var hit : RaycastHit;

 	if(Physics.Raycast(ray, hit)){

      	var selectedObject = GameObject.Find(hit.transform.name);

      	if(Input.GetMouseButtonDown(0)){

 			Debug.Log(hit.transform.name+" Left Click");

		}

		else if(Input.GetMouseButtonDown(1)){

 			Debug.Log(hit.transform.name+" Right Click");
 			try{
 				
 				var pole = selectedObject.transform.GetChild(1).GetComponent(MeshRenderer);
 				var flag = selectedObject.transform.GetChild(1).GetChild(0).GetComponent(MeshRenderer);
 				
 				if(pole.enabled == false){
 					pole.enabled = true;
 					flag.enabled = true;
 				}
 				else if(pole.enabled == true){
 					pole.enabled = false;
 					flag.enabled = false;
 				}
 				else{

 				}
 			}
 			catch(err){
 				Debug.Log("Not a Cube"+err);
 			}

		}
		else{

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
			cubes[index].transform.name = "Cube"+index.ToString();
			//should probably init these an array...
			var textObject = cubes[index].transform.GetChild(0);
			var poleObject = cubes[index].transform.GetChild(1);
			var flagObject = poleObject.transform.GetChild(0);
			//set texts to index
			textObject.GetComponent(TextMesh).text = ii.ToString()+","+jj.ToString();
			flagObject.GetComponent(MeshRenderer).enabled = false;
			poleObject.GetComponent(MeshRenderer).enabled = false;
		}
	}
}




