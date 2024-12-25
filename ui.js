import { main } from "./main.js";
import { Types } from "./Cell.js";

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width; 
    const scaleY = canvas.height / rect.height;  

    const x = Math.floor((event.clientX - rect.left) * scaleX); 
    const y = Math.floor((event.clientY - rect.top) * scaleY);
    console.log(x,y)
    return [x,y]
}
var typeName = "sand"

var mouse = false
var mousePosition = [0,0]

function drawEventHandler(e){
    if(e.buttons == 1){
        mouse = true
        mousePosition = getCursorPosition(canvas, e)
    }
}
main.canvas.onmousedown = drawEventHandler 
main.canvas.addEventListener('mouseup', (e)=>{
    mouse=false} )
main.canvas.onmousemove = drawEventHandler
main.canvas.onmouseup = drawEventHandler


document.getElementById("sandBtn").onclick = ()=>{typeName="sand"}
document.getElementById("waterBtn").onclick = ()=>{typeName="water"}
document.getElementById("stoneBtn").onclick = ()=>{typeName="stone"}
document.getElementById("airBtn").onclick = ()=>{typeName="air"}
document.getElementById("smokeBtn").onclick = ()=>{typeName="smoke"}
document.getElementById("fireBtn").onclick = ()=>{typeName="fire"}
document.getElementById("steamBtn").onclick = ()=>{typeName="steam"}

setInterval(()=>{        
    if(mouse){
        try{
            main.addCell(mousePosition[0], mousePosition[1], Types[typeName])
            main.addCell(mousePosition[0]-1, mousePosition[1], Types[typeName])
            main.addCell(mousePosition[0]+1, mousePosition[1], Types[typeName])
            main.addCell(mousePosition[0], mousePosition[1]-1, Types[typeName])
            main.addCell(mousePosition[0], mousePosition[1]+1, Types[typeName])
        } catch{

        }
        
    }
}, 1)


