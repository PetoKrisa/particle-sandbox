export class Cell{
    x;
    y;
    type;
    color;
    ctx;
    main;
    processed;
    temp;

    constructor(main,x,y,type){
        this.ctx = main.ctx;
        this.main = main
        this.x = x;
        this.y = y;
        this.type = type;
        let randomNum = Math.floor(Math.random() * type.colors.length)
        this.color = type.colors[randomNum]
        this.processed = false;
        this.temp = type.temp;
    }
}

export class SandCell extends Cell{
    constructor(ctx,x,y,type){
        super(ctx,x,y,type)
    }
    update(){
        
        let x = this.x;
        let y = this.y;
        let nextX = x;
        let nextY = y;
        try{
            if(this.main.isCellFree([x,y+1], this)){
                nextY = y+1
            } else if(this.main.isCellFree([x-1,y+1], this)){
                nextY = y+1
                nextX = x-1
            } else if(this.main.isCellFree([x+1,y+1], this)){
                nextY = y+1
                nextX = x+1
            }
        } catch{}
        

        this.main.swapCells([x,y], [nextX, nextY])

        this.draw()
    }
    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, 1, 1)
    }
}

export class AirCell extends Cell{
    constructor(ctx,x,y,type){
        super(ctx,x,y,type)
    }
    update(){
        
    }
    draw(){
        
    }
}

export class WaterCell extends Cell{
    constructor(ctx,x,y,type){
        super(ctx,x,y,type)
        this.timeToEvaporate = 20;
        this.hitLeft = false;
    }
    hitLeft = false;
    timeToEvaporate;
    update(){
        
        let x = this.x;
        let y = this.y;
        let nextX = x;
        let nextY = y;
        let freeSides = []
        let freeBelow = false
        
        if(this.main.isCellFree([x,y+1], this)){
            nextY = y+1
        } else if(this.main.isCellFree([x-1,y+1], this)){
            nextY = y+1
            nextX = x-1
        } else if(this.main.isCellFree([x+1,y+1], this)){
            nextY = y+1
            nextX = x+1
        } 
        else if(this.main.isCellFree([x-1, y], this) && !this.hitLeft){
            nextY = y
            nextX = x-1
        }
        else if(this.main.isCellFree([x+1, y], this)){
            nextY = y
            nextX = x+1
        }

        if(!this.main.isCellFree([x-1, y], this)){
            this.hitLeft = true
        }
        if(!this.main.isCellFree([x+1, y], this)){
            this.hitLeft = false
        }

        
        try{
            if(this.main.getCell([x-1,y-1]).temp >= 100 ||
            this.main.getCell([x,y-1]).temp >= 100 ||
            this.main.getCell([x+1,y-1]).temp >= 100 ||
            this.main.getCell([x-1,y]).temp >= 100 ||
            this.main.getCell([x+1,y]).temp >= 100 ||
            this.main.getCell([x,y+1]).temp >= 100 ||
            this.main.getCell([x-1,y+1]).temp >= 100 ||
            this.main.getCell([x+1,y+1]).temp >= 100
            ){
                this.timeToEvaporate--;
            }
        } catch{}
        
        if(this.timeToEvaporate == 0){
            this.main.addCell(x,y, Types.steam)
        }

        this.main.swapCells([x,y], [nextX, nextY])

        this.draw()
    }
    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, 1, 1)
    }
}

export class StoneCell extends Cell{
    constructor(ctx,x,y,type){
        super(ctx,x,y,type)
    }
    update(){
        
        let x = this.x
        let y = this.y
        let neigbours = [
            [x-1,y-1],
            [x,y-1],
            [x+1,y-1],
            [x-1,y],
            [x+1,y],
            [x+1,y+1],
            [x,y+1],
            [x-1,y+1]
        ]
        let tempSum = 0;
        let tempNum = 0;
        for(let i of neigbours){
            try{
                tempSum += this.main.getCell(i).temp
                tempNum ++
            } catch{
                //the particle is outside borders so ignore it
            }
            
        }
        let avgTemp = Math.floor(tempSum/tempNum)

        if(avgTemp>this.temp){
            this.temp += 2;
        } else if (this.type.temp<avgTemp<this.temp){
            this.temp -= 2
        }

        this.draw()
    }
    draw(){
        //this.ctx.fillStyle = this.color;
        if(this.temp < 100){
            this.ctx.fillStyle = this.color;
        } else{
            this.ctx.fillStyle = `rgb(${this.temp},0,0)`
        }
        this.ctx.fillRect(this.x, this.y, 1, 1)
    }
}

export class SmokeCell extends Cell{
    life;
    constructor(ctx,x,y,type){
        super(ctx,x,y,type)
        this.life = Math.random() * (180 - 120) + 120;
    }


    update(){
        if(this.life<1){
            this.main.addCell(this.x, this.y, Types.air)
        }

        let x = this.x;
        let y = this.y;
        let freeCells = [];
        if(this.main.isCellFree([x,y-1], this)){
            freeCells.push([x,y-1])
        }
        if(this.main.isCellFree([x-1,y-1], this )){
            freeCells.push([x-1,y-1])
        } 
        if(this.main.isCellFree([x+1,y-1], this)){
            freeCells.push([x+1,y-1])
        }
        if(this.main.isCellFree([x+1,y], this)){
            freeCells.push([x+1,y])
        }
        if(this.main.isCellFree([x-1,y], this)){
            freeCells.push([x-1,y])
        }
        let randomNumber = Math.floor(Math.random() * (freeCells.length))
        let nextFreeCell = freeCells[randomNumber]
        try{
            this.main.swapCells([x,y], [nextFreeCell[0], nextFreeCell[1]])
        } catch{
        }

        this.life--;
        this.draw()
    }
    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, 1, 1)
    }
}

export class FireCell extends Cell{
    life;
    constructor(ctx,x,y,type){
        super(ctx,x,y,type)
        this.life = 15;
    }


    update(){
        if(this.life<1){
            this.main.addCell(this.x, this.y, Types.smoke)
        }

        let x = this.x;
        let y = this.y;
        let freeCells = [];
        if(this.main.isCellFree([x-1,y-1], this )){
            freeCells.push([x-1,y-1])
        } if(this.main.isCellFree([x+1,y-1], this)){
            freeCells.push([x+1,y-1])
        }

        if(freeCells.length == 0){
            if(this.main.isCellFree([x-1,y], this)){
                freeCells.push([x-1,y])
            }
            if(this.main.isCellFree([x+1,y], this)){
                freeCells.push([x+1,y])
            }
        }

        if(this.main.isCellFree([x,y-1], this)){
            freeCells = [[x,y-1]]
        }

        try{
            if(this.main.getCell([x-1,y-1]).type == Types.water ||
            this.main.getCell([x,y-1]).type == Types.water ||
            this.main.getCell([x+1,y-1]).type == Types.water ||
            this.main.getCell([x-1,y]).type == Types.water ||
            this.main.getCell([x+1,y]).type == Types.water ||
            this.main.getCell([x,y+1]).type == Types.water ||
            this.main.getCell([x-1,y+1]).type == Types.water ||
            this.main.getCell([x+1,y+1]).type == Types.water
            ){
                this.main.addCell(x,y,Types.air)
                return
            }
        } catch{
            
        }
        
        
        let randomNumber = Math.floor(Math.random() * freeCells.length)
        let nextFreeCell = freeCells[randomNumber]
        try{
            this.main.swapCells([x,y], [nextFreeCell[0], nextFreeCell[1]])
        } catch{
        }

        

        this.life--;
        this.draw()
    }
    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, 1, 1)
    }
}

export class SmokelessFireCell extends Cell{
    life;
    constructor(ctx,x,y,type){
        super(ctx,x,y,type)
        this.life = 15;
    }


    update(){
        if(this.life<1){
            this.main.addCell(this.x, this.y, Types.air)
        }

        let x = this.x;
        let y = this.y;
        let freeCells = [];
        if(this.main.isCellFree([x-1,y-1], this )){
            freeCells.push([x-1,y-1])
        } if(this.main.isCellFree([x+1,y-1], this)){
            freeCells.push([x+1,y-1])
        }

        if(freeCells.length == 0){
            if(this.main.isCellFree([x-1,y], this)){
                freeCells.push([x-1,y])
            }
            if(this.main.isCellFree([x+1,y], this)){
                freeCells.push([x+1,y])
            }
        }

        if(this.main.isCellFree([x,y-1], this)){
            freeCells = [[x,y-1]]
        }

        try{
            if(this.main.getCell([x-1,y-1]).type == Types.water ||
            this.main.getCell([x,y-1]).type == Types.water ||
            this.main.getCell([x+1,y-1]).type == Types.water ||
            this.main.getCell([x-1,y]).type == Types.water ||
            this.main.getCell([x+1,y]).type == Types.water ||
            this.main.getCell([x,y+1]).type == Types.water ||
            this.main.getCell([x-1,y+1]).type == Types.water ||
            this.main.getCell([x+1,y+1]).type == Types.water
            ){
                this.main.addCell(x,y,Types.air)
                return
            }
        } catch{
            
        }
        
        
        let randomNumber = Math.floor(Math.random() * freeCells.length)
        let nextFreeCell = freeCells[randomNumber]
        try{
            this.main.swapCells([x,y], [nextFreeCell[0], nextFreeCell[1]])
        } catch{
        }

        

        this.life--;
        this.draw()
    }
    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, 1, 1)
    }
}

export class SteamCell extends Cell{
    life;
    constructor(ctx,x,y,type){
        super(ctx,x,y,type)
        this.life = Math.random() * (180 - 120) + 120;;
    }


    update(){
        if(this.life<1){
            this.main.addCell(this.x, this.y, Types.water)
        }

        let x = this.x;
        let y = this.y;
        let freeCells = [];
        if(this.main.isCellFree([x,y-1], this)){
            freeCells.push([x,y-1])
        } 
        if(this.main.isCellFree([x-1,y-1], this )){
            freeCells.push([x-1,y-1])
        } 
        if(this.main.isCellFree([x+1,y-1], this)){
            freeCells.push([x+1,y-1])
        }
        if(this.main.isCellFree([x+1,y], this)){
            freeCells.push([x+1,y])
        }
        if(this.main.isCellFree([x-1,y], this)){
            freeCells.push([x-1,y])
        }
        
        
        let randomNumber = Math.floor(Math.random() * (freeCells.length))
        let nextFreeCell = freeCells[randomNumber]
        try{
            this.main.swapCells([x,y], [nextFreeCell[0], nextFreeCell[1]])
        } catch{
        }

        this.life--;
        this.draw()
    }
    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, 1, 1)
    }
}
export class WoodCell extends Cell{
    constructor(ctx,x,y,type){
        super(ctx,x,y,type)
        this.timeToIgnite = 49;
        this.life = 180;
        this.onFire == false;
    }
    timeToIgnite;
    onFire;
    life;
    update(){
        
        let x = this.x
        let y = this.y
        let neigbours = [
            [x-1,y-1],
            [x,y-1],
            [x+1,y-1],
            [x-1,y],
            [x+1,y],
            [x+1,y+1],
            [x,y+1],
            [x-1,y+1]
        ]
        let tempSum = 0;
        let tempNum = 0;
        for(let i of neigbours){
            tempSum += this.main.getCell(i).temp
            tempNum ++
        }
        let avgTemp = Math.floor(tempSum/tempNum)

        if(avgTemp>130 && this.timeToIgnite > 0){
            this.timeToIgnite --;
        } else if(this.timeToIgnite==0){
            this.onFire = true;
        }

        if(this.onFire == true){
            this.life --;
            try{
                this.main.addCell(this.x, this.y-1, Types.fire)
                this.main.addCell(this.x-1, this.y, Types.fire)
                this.main.addCell(this.x+1, this.y, Types.fire)
            }catch{

            }
        }

        if(this.life == 0){
            this.main.addCell(this.x, this.y, Types.ash)
        }

        this.draw()
    }
    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, 1, 1)
    }
}

export class AshCell extends Cell{
    constructor(ctx,x,y,type){
        super(ctx,x,y,type)
    }
    update(){
        
        let x = this.x;
        let y = this.y;
        let nextX = x;
        let nextY = y;
        try{
            if(this.main.isCellFree([x,y+1], this)){
                nextY = y+1
            } else if(this.main.isCellFree([x-1,y+1], this)){
                nextY = y+1
                nextX = x-1
            } else if(this.main.isCellFree([x+1,y+1], this)){
                nextY = y+1
                nextX = x+1
            }
        } catch{}
        

        this.main.swapCells([x,y], [nextX, nextY])

        this.draw()
    }
    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, 1, 1)
    }
}

export class SteelCell extends Cell{
    constructor(ctx,x,y,type){
        super(ctx,x,y,type)
    }
    update(){
        
        let x = this.x
        let y = this.y
        let neigbours = [
            [x-1,y-1],
            [x,y-1],
            [x+1,y-1],
            [x-1,y],
            [x+1,y],
            [x+1,y+1],
            [x,y+1],
            [x,y+1],
            [x-1,y+1],
            
        ]
        let tempSum = 0;
        let tempNum = 0;
        for(let i of neigbours){
            tempSum += this.main.getCell(i).temp
            tempNum ++
        }
        let avgTemp = Math.floor(tempSum/tempNum)

        if(avgTemp>this.temp && avgTemp>this.type.temp){
            this.temp += 4
        } else if (this.type.temp<avgTemp<this.temp){
            this.temp -= 1
        }

        this.draw()
    }
    draw(){
        //this.ctx.fillStyle = this.color;
        if(this.temp < 100){
            this.ctx.fillStyle = this.color;
        } else{
            this.ctx.fillStyle = `rgb(${this.temp},0,0)`
        }
        this.ctx.fillRect(this.x, this.y, 1, 1)
    }
}

export class FuseCell extends Cell{
    constructor(ctx,x,y,type){
        super(ctx,x,y,type)
        this.timeToIgnite = 2;
        this.life = 55;
        this.onFire == false;
    }
    timeToIgnite;
    onFire;
    life;
    update(){
        
        let x = this.x
        let y = this.y
        let neigbours = [
            [x-1,y-1],
            [x,y-1],
            [x+1,y-1],
            [x-1,y],
            [x+1,y],
            [x+1,y+1],
            [x,y+1],
            [x-1,y+1]
        ]
        let tempSum = 0;
        let tempNum = 0;
        for(let i of neigbours){
            tempSum += this.main.getCell(i).temp
            tempNum ++
        }
        let avgTemp = Math.floor(tempSum/tempNum)

        if(avgTemp>130 && this.timeToIgnite > 0){
            this.timeToIgnite --;
        } else if(this.timeToIgnite==0){
            this.onFire = true;
        }

        if(this.onFire == true){
            this.life --;
            try{
                this.main.addCell(this.x, this.y-1, Types.smokelessFire)
                this.main.addCell(this.x-1, this.y, Types.smokelessFire)
                this.main.addCell(this.x+1, this.y, Types.smokelessFire)
                this.main.addCell(this.x, this.y+1, Types.smokelessFire)
                this.main.addCell(this.x-1, this.y+1, Types.smokelessFire)
                this.main.addCell(this.x+1, this.y+1, Types.smokelessFire)
            }catch{

            }
        }

        if(this.life == 0){
            this.main.addCell(this.x, this.y, Types.air)
        }

        this.draw()
    }
    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, 1, 1)
    }
}

export const Types = {
    "sand": {
        name: "sand",
        colors: ["#cfbb4a", "#eddc87", "#ede395", "#f2e15c"],
        density: 10,
        temp: 24,
        constructor: SandCell
        //colors: ["red"]
    },
    "air": {
        name: "air",
        colors: ["black"],
        density: 1,
        temp: 24,
        constructor: AirCell,
    },
    "water": {
        name: "water",
        colors: ["lightblue"],
        density: 5,
        temp: 24,
        constructor: WaterCell,
    },
    "stone": {
        name: "stone",
        colors: ["#a1a7b3", "#999da3", "#b3b4b5", "#7c7d80"],
        density: 10,
        temp: 24,
        constructor: StoneCell,
    },
    "smoke": {
        name: "smoke",
        colors: ["#6a6a6a", "#888888"],
        density: 9,
        temp: 100,
        constructor:  SmokeCell
    },
    "fire": {
        name: "fire",
        colors: ["#ff4f1f", "#ed5205", "#f22c2c"],
        density: 10,
        temp: 600,
        constructor:  FireCell
    },
    "smokelessFire": {
        name: "smokelessFire",
        colors: ["#ff4f1f", "#ed5205", "#f22c2c"],
        density: 10,
        temp: 2000,
        constructor:  SmokelessFireCell
    },
    "steam": {
        name: "steam",
        colors: ["#c2cacf", "#d3e4ed", "#cdd0d1"],
        density: 9,
        temp: 99,
        constructor:  SteamCell
    },
    "wood": {
        name: "wood",
        colors: ["#6b4606", "#57401a", "#4f370d"],
        density: 20,
        temp: 24,
        constructor:  WoodCell
    },
    "ash": {
        name: "ash",
        colors: ["#9c9a9a", "#787777", "#b5b5b5"],
        density: 4,
        temp: 24,
        constructor: AshCell
    },
    "steel": {
        name: "steel",
        colors: ["lightgray"],
        density: 20,
        temp: 24,
        constructor:  SteelCell
    },
    "fuse": {
        name: "fuse",
        colors: ["gray"],
        density: 20,
        temp: 24,
        constructor:  FuseCell
    }
}