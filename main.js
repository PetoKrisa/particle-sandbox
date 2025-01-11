import { Cell } from "./Cell.js";
import { Types } from "./Cell.js";
import { shuffle } from "./shuffle.js";
class Main{
    ctx;
    canvas;
    cells = []
    width;
    height;
    constructor(canvasId){
        let canvas = document.getElementById(canvasId);
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
        this.width = canvas.width;
        this.height = canvas.height;

        for(let y = 0; y < this.height; y++){
            this.cells.push([])
            for(let x = 0; x < this.width; x++){
                this.cells[y][x] = new Types.air.constructor(this, x, y, Types.air);
            }
        }

    }

    isCellFree(coordinates, currentCell = null){
        let free = false
        if(coordinates[0]<0 
            || coordinates[0]>this.width-1
            || coordinates[1]<0
            || coordinates[1]>this.height-1
        ){return false}

        if(this.cells[coordinates[1]][coordinates[0]] == undefined 
            || this.cells[coordinates[1]][coordinates[0]].type == Types.air
        ){
            free = true
        } 

        if(currentCell != null
            && currentCell.type.density > this.cells[coordinates[1]][coordinates[0]].type.density
        ){  
            free = true
        } else if(
            currentCell != null
            && currentCell.type.density < this.cells[coordinates[1]][coordinates[0]].type.density
        ) {
            free = false
        }

        return free
    }

    addCell(x,y,type){
        try{
            if(0<=x<this.width && 0<=y<this.height){
                this.cells[y][x] = new type.constructor(this, x, y, type)
            }
        } catch(e){

        }
       
        
    }

    swapCells(coordinatesFrom, coordinatesTo){
        let cellInQuestion = this.cells[coordinatesFrom[1]][coordinatesFrom[0]]
        let nextCell = this.cells[coordinatesTo[1]][coordinatesTo[0]]
        nextCell.x = coordinatesFrom[0]
        nextCell.y = coordinatesFrom[1]
        this.cells[coordinatesFrom[1]][coordinatesFrom[0]] = nextCell
        cellInQuestion.x = coordinatesTo[0]
        cellInQuestion.y = coordinatesTo[1]
        this.cells[coordinatesTo[1]][coordinatesTo[0]] = cellInQuestion
    }

    getCell(coordinates){
        if(0<=coordinates[0]<this.width && 0<=coordinates[1]<this.height){
            try{
                return this.cells[coordinates[1]][coordinates[0]]
            } catch{
                //cell is outside border
            }
        }
        
    }

    update(){
        this.ctx.clearRect(0,0,this.width, this.height)
        this.ctx.imageSmoothingEnabled = false;
        let cellLinearList = [] 
        for(let y = this.height-1; y >= 0; y--){
            for(let x = this.width-1; x >= 0; x--){
                let cellInQuestion = this.cells[y][x]
                cellInQuestion.processed = false;
                cellLinearList.push(cellInQuestion)
            }
        } 
        cellLinearList = shuffle(cellLinearList)
        //for(let y = this.height-1; y > 0; y--){
        //    for(let x = this.width-1; x > 0; x--){
        //        let cellInQuestion = this.cells[y][x]
        //        if(!cellInQuestion.processed){
        //            cellInQuestion.update()
        //            cellInQuestion.processed = true;
        //        }
        //    }
        //}
        for(let i of cellLinearList){
            if(!i.processed){
                i.update()
                i.processed = true;
            }
        }
    }
    
}

export const main = new Main("canvas")

var filterStrength = 10;
var frameTime = 0, lastLoop = new Date, thisLoop;

setInterval(()=>{
    main.update()
    var thisFrameTime = (thisLoop=new Date) - lastLoop;
    frameTime+= (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
    document.getElementById("fps").innerText = Math.floor((1000/frameTime)) + " fps";
}, 10)


