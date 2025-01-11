import { main } from "./main.js";
import { Types } from "./Cell.js";

var brush = 4;

function setBrushSize(event){
    brush = parseInt(event.target.value)
    document.getElementById("brush-out").innerText = `Brush size: ${brush}`
}

document.getElementById("brush").oninput = setBrushSize

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width; 
    const scaleY = canvas.height / rect.height;  

    const x = Math.floor((event.clientX - rect.left) * scaleX); 
    const y = Math.floor((event.clientY - rect.top) * scaleY);
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

main.canvas.ontouchstart = (e)=>{
    e.preventDefault()
    e.stopPropagation()
    mousePosition = getCursorPosition(canvas, e.touches[0])
    mouse=true
}
main.canvas.ontouchend = (e)=>{
    mouse=false
}
main.canvas.ontouchmove = (e)=>{
    e.preventDefault()
    e.stopPropagation()
    mousePosition = getCursorPosition(canvas, e.touches[0])
    mouse = true
}


document.getElementById("sandBtn").onclick = ()=>{typeName="sand"}
document.getElementById("waterBtn").onclick = ()=>{typeName="water"}
document.getElementById("stoneBtn").onclick = ()=>{typeName="stone"}
document.getElementById("airBtn").onclick = ()=>{typeName="air"}
document.getElementById("smokeBtn").onclick = ()=>{typeName="smoke"}
document.getElementById("fireBtn").onclick = ()=>{typeName="fire"}
document.getElementById("steamBtn").onclick = ()=>{typeName="steam"}
document.getElementById("woodBtn").onclick = ()=>{typeName="wood"}
document.getElementById("steelBtn").onclick = ()=>{typeName="steel"}



//record mouse position
setInterval(()=>{        
    if(mouse){
        try{
            //main.addCell(mousePosition[0], mousePosition[1], Types[typeName])
            //main.addCell(mousePosition[0]-1, mousePosition[1], Types[typeName])
            //main.addCell(mousePosition[0]+1, mousePosition[1], Types[typeName])
            //main.addCell(mousePosition[0], mousePosition[1]-1, Types[typeName])
            //main.addCell(mousePosition[0], mousePosition[1]+1, Types[typeName])

            
    }
         catch{

        }

        let halfSize = Math.floor(brush / 2);

        for (let i = -halfSize; i <= halfSize; i++) {
            for (let j = -halfSize; j <= halfSize; j++) {
                if (i * i + j * j <= halfSize * halfSize) {
                    main.addCell(mousePosition[0]+i, mousePosition[1]+j, Types[typeName])
                }
            }
        }
        
    }
}, 1)


