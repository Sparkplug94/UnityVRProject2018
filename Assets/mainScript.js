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
var numberOfCubes : int;

//this is a C# style "array", use "Count" instead of "Length" and 
//you can't access an array element until you've created it 


function Start(){

	//set the parameters
	rows = 8;
	cols = 8;
	numberOfCubes = rows*cols;
	mineFreq = 0.5;

	//make the cubes
	for (var ii = 0; ii < rows; ii++){
		for (var jj = 0; jj < cols; jj++){
			cubes.Add(Instantiate(Resources.Load("FlagCube")));
			cubes[ii*rows+jj].transform.position = Vector3(2*ii,0,2*jj);
			var textObject = cubes[ii*rows+jj].transform.GetChild(0);
			var poleObject = cubes[ii*rows+jj].transform.GetChild(1);
			var flagObject = poleObject.transform.GetChild(0);
			//set texts to index
			textObject.GetComponent(TextMesh).text = ii.ToString()+","+jj.ToString();
			flagObject.GetComponent(MeshRenderer).enabled = false;
			poleObject.GetComponent(MeshRenderer).enabled = false;
		}
	}

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
	




	//make the mines - make this into a function - 1 indicates that this box holds a mine
	var mineGrid = new int[rows, cols];
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++){
			var seed = Random.Range(0.0f, 1.0f);
			if (seed < mineFreq) {
				mineGrid[i,j] = 1;
			} 
			else {
				mineGrid[i,j] = 0;
			}
		}
	}


	//Do the nearest neighbor search - make this into a function - these are the displayed numbers on the boxes
	var numGrid = new int[rows, cols];
	for (var m = 0; m < rows; m++) {
		for (var n = 0; n < cols; n++){
			var gridSum = 0;
			// figure out how to check if an element exists and make this a function. 
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

			numGrid[m,n] = gridSum;
		}
	}


	//make the flag grid - 1 indicates that box is flagged
	var flagGrid = new int[rows, cols];
	//zeros for now

	


}

function Update(){
	//some object blah blah.GetComponent(Rigidbody).velocity = Vector3(1,0,0);
	
}






