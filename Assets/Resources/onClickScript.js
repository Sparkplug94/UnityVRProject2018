function Update ()
{
     if ( Input.GetMouseButtonDown(0))
     {
         var hit : RaycastHit;
         var ray : Ray = Camera.main.ScreenPointToRay (Input.mousePosition);

         if (Physics.Raycast (ray, hit, 100.0))
         {
             Debug.Log("Clicked Box");
         }
     }
 }