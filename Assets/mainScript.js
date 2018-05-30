#pragma strict
import System.IO;
import System.IO.Directory;
import System.Text.RegularExpressions; //.Net library necessary to do regular expressions
import System.Collections.Generic;
//import System.Diagnostics;
import System.Diagnostics.Process;
import System.String;
var process : System.Diagnostics.Process;



var objects = new List.<GameObject>();
var rows : int;
var cols : int;
var mineFreq : float;
var numberOfCubes : int = 3;

//this is a C# style "array", use "Count" instead of "Length" and 
//you can't access an array element until you've created it 


function Start(){
	//add flagcubes to objects array
	makeCubes();
	//get children of things in objects array
	var flagtextobject = objects[0].transform.GetChild(0);
	//get the meshrenderer component of the first child of objects[0]
	var mr = flagtextobject.GetComponent(MeshRenderer);
	//enable or disable the renderer (hide and show text)
	mr.enabled = true;
	//get the textmesh component of first child of objects[0] which happens to be the "Text" object
	var flagtext = flagtextobject.GetComponent(TextMesh);
	//change the text property of TextMesh to "byebye"
	flagtext.text = "byebye";


	//make the mines - make this into a function
	rows = 8;
	cols = 8;
	mineFreq = 0.5;
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


	//Do the nearest neighbor search - make this into a function
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


//now we have mine grids and a number grid


}

function Update(){
	//some object blah blah.GetComponent(Rigidbody).velocity = Vector3(1,0,0);
	
}

function makeCubes(){
	for (var i = 0; i < numberOfCubes; i++){
		objects.Add(Instantiate(Resources.Load("FlagCube")));
	}
}




