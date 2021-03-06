import { Injectable } from "@angular/core";
import { Tile } from './../tile';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject'

@Injectable()
export class GridService {
    public tiles: Tile[];
    public size: number = 4;
    private static animationCounter: number = 0;
    public static waitForAnimations: Promise<any>;

    constructor() {
        this.tiles = [];
        this.buildEmptyBoard();
        console.log(this.tiles);
    }

    public static getAnimationCounter(): number{
        return this.animationCounter;
    }
    public static incrementAnimationCounter(): void{
        this.animationCounter++;
        //console.log('increment done', this.animationCounter)
    }

    public static decrementAnimationCounter(): void{
        this.animationCounter--;
        //console.log('decrement done',  this.animationCounter)
    }

    public static applyNewPromise(): void{
        this.waitForAnimations = new Promise(function (r) {

        setInterval(function () {
            if (GridService.animationCounter == 0) {
                r('done with animations')
            }
            // else {
            //     console.log(GridService.animationCounter)
            // }


        }, 150)

    })
    }

    public buildEmptyBoard(): void {
        this.tiles = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.tiles.push(new Tile(i, j, 0));
            }
        }
    }

    public updateTiles(newFromPos: number, newToPos: number, newVal: number): void {
        console.log('pretiles', this.tiles)
        let mTiles = this.tiles.filter( t =>  t.newFromPos != undefined && t.newToPos != undefined );
        console.log('the mTiles',  mTiles);
        mTiles.forEach((tile) => {
            console.log("Set tile at " + tile.newFromPos + tile.newVal);
            //this.tiles[newFromPos].setVal(0);
            this.tiles[newToPos].setVal(tile.newVal);
        });
    }

    public getEmptyCells(): Tile[] {
        return this.tiles.filter(t => t.val == 0);
    }

    private setTileAt(x: number, y: number, newVal: number): void {
        this.tiles[x * this.size + y].setVal(newVal);
    }

    public setValue(tilePos: number, tileVal: number){
         this.tiles[tilePos].setVal(tileVal);
    }

    public initBoard(): void {
        let randPosX: number = Math.floor(Math.random() * 16);
        let randPosY: number = Math.floor(Math.random() * 16);
        while (randPosY == randPosX) {
            randPosY = Math.floor(Math.random() * 16);
        }
        this.tiles[randPosX].setVal((Math.floor(Math.random() * 2) + 1) * 2);
        this.tiles[randPosY].setVal((Math.floor(Math.random() * 2) + 1) * 2);
    }

    public fillRandom(): void {
        const emptyList = this.getEmptyCells();
        const len = emptyList.length;
        const randPos = Math.floor(Math.random() * len);
        console.log(len);
        this.setTileAt(emptyList[randPos].x, emptyList[randPos].y, 2);
    }

    public moveDown(): number {
        let score = 0;
        for (let i = 0; i < 4; i++) {
            let top = i;
            let bottom = i + 12;
            let merge = bottom;
            while (top < bottom && bottom >= i) {
                while (bottom >= i && !this.tiles[bottom].val) {
                    bottom -= 4;
                }
                if (bottom == i) {
                    const tmpVal = this.tiles[bottom].val;
                    this.tiles[bottom].setVal(0);
                    this.tiles[merge].setVal(tmpVal);
                    break;
                }
                top = bottom - 4;
                while (top >= i && !this.tiles[top].val) {
                    top -= 4;
                }
                if (top < i) {
                    if (bottom >= i) {
                        const tmpVal = this.tiles[bottom].val;
                        this.tiles[bottom].setVal(0);
                        this.tiles[merge].setVal(tmpVal);
                    }
                    break;
                }
                const topVal = this.tiles[top].val;
                const botVal = this.tiles[bottom].val;
                if (topVal == botVal) {
                    this.tiles[top].setVal(0);
                    this.tiles[bottom].setVal(0);
                    this.tiles[merge].setVal(2 * botVal);
                    score += botVal * 2;
                    merge -= 4;
                    bottom = top - 4;
                    top = bottom - 4;
                } else {
                    this.tiles[bottom].setVal(0);
                    this.tiles[merge].setVal(botVal);
                    bottom = top;
                    top = bottom - 4;
                    merge -= 4;
                }
            }
        }
        return score;
    }

    public moveUp(): number {
        /** 
         *  [1 ,2 ,3 , 4 ,
         *   5, 6, 7, 8, 
         *   9, 10, 11, 12, 
         *   13, 14 , 15, 16 ]
         */
        let score = 0;
        for (let i = 0; i < 4; i++) {
            let top = i;
            let bottom = i + 12;
            let merge = top;
            while (top < bottom && top <= i + 12) {
                while (top <= i + 12 && !this.tiles[top].val) {
                    top += 4;
                }
                if (top == i + 12) {
                    const tmp = this.tiles[top].val;
                    this.tiles[top].setVal(0);
                    this.tiles[merge].setVal(tmp);
                    break;
                }
                bottom = top + 4;
                while (bottom <= i + 12 && !this.tiles[bottom].val) {
                    bottom += 4;
                }
                if (bottom > i + 12) {
                    if (top <= i + 12) {
                        const tmp = this.tiles[top].val;
                        this.tiles[top].setVal(0);
                        this.tiles[merge].setVal(tmp);

                    }
                    break;
                }
                const topVal = this.tiles[top].val;
                const botVal = this.tiles[bottom].val;
                if (topVal == botVal) {
                    this.tiles[top].setVal(0);
                    this.tiles[bottom].setVal(0);
                    this.tiles[merge].setVal(topVal * 2);
                    top = bottom + 4;
                    bottom = top + 4;
                    score += topVal * 2;
                    merge += 4;
                } else {
                    this.tiles[top].setVal(0);
                    this.tiles[merge].setVal(topVal);
                    top = bottom;
                    bottom = top + 4;
                    merge += 4;
                }

            }
        }
        return score;
    }


    public moveRight(): number {
        let score = 0;
        for (let i = 0; i < 4; i++) {
            const base = i * 4;
            let right = base + 3;
            let left = right - 1;
            let merge = right;
            while (left < right) {
                while (right >= base && !this.tiles[right].val) {
                    right--;
                }
                if (right == base) {
                    const tmp = this.tiles[right].val;
                    this.tiles[right].setVal(0);
                    this.tiles[merge].setVal(tmp);
                    break;
                }

                left = right - 1;
                console.log(left, right, base);
                while (left >= base && !this.tiles[left].val) {
                    left--;
                }
                if (left < base) {
                    if (right > base) {
                        const tmp = this.tiles[right].val;
                        this.tiles[right].setVal(0);
                        this.tiles[merge].setVal(tmp);
                    }
                    break;
                }
                const leftVal = this.tiles[left].val;
                const rightVal = this.tiles[right].val;
                if (leftVal == rightVal) {
                    this.tiles[left].setVal(0);
                    this.tiles[right].setVal(0);
                    this.tiles[merge].setVal(2 * leftVal);
                    score += leftVal * 2;
                    right = left - 1;
                    left = right - 1;
                    merge--;
                } else {
                    this.tiles[right].setVal(0);
                    this.tiles[merge].setVal(rightVal);
                    right = left;
                    left = right - 1;
                    merge--;
                }
            }

        }
        return score;
    }
    public moveLeft(): number {
        //Iterate rows
        let score = 0;
        for (let i = 0; i < 4; i++) {
            // Iterate columns
            const base = i * 4;
            let left = base;
            let right = base + 1;
            let merge = left;
            while (left < right) {
                while (left < base + 4 && !this.tiles[left].val) {
                    left++;
                }
                if (left == base + 3) {
                    const tmp = this.tiles[left].val;
                    console.log('in left: ', left, right, merge, tmp, base);
                    
                    if(left != merge){
                        this.tiles[left].setAnimation(left, merge)
                            .setNewVal(tmp);
                    }
                    else{
                        this.tiles[left].setVal(0);
                        this.tiles[merge].setVal(tmp);
                    }
                    break;
                }

                right = left + 1;
                while (right < base + 4 && !this.tiles[right].val) {
                    right++;
                }
                if (right >= base + 4) {
                    if (left < base + 4) {

                        const tmp = this.tiles[left].val;
                        
                        console.log('in right: ', left, right, merge, tmp, base);
                        if(left != merge){
                            this.tiles[left].setAnimation(left, merge)
                            .setNewVal(tmp);
                        }
                        else{
                            this.tiles[left].setVal(0);
                            this.tiles[merge].setVal(tmp);
                        }
                    }
                    break;
                }
                const leftVal = this.tiles[left].val;
                const rightVal = this.tiles[right].val;

                if (leftVal == rightVal) {
                    //this.tiles[left].setVal(0);
                    //this.tiles[right].setVal(0);
                    //console.log('in last left: ', left, right, merge, leftVal, base);
                    //if(right != merge){
                        this.tiles[right].setAnimation(right, merge)
                            .setNewVal(2 * leftVal);
                    // }
                    // else{
                    //     this.tiles[left].setVal(0);
                    //     this.tiles[merge].setVal(2 * leftVal);
                    // } 
                    score += leftVal * 2;
                    left = right + 1;
                    right = left + 1;
                    merge++;
                } else {
                    this.tiles[left].setVal(0);
                    //this is a piece that always lines the left side of the grid, no animation required.
                    //this.tiles[merge].setAnimation(left, merge);
                    this.tiles[merge].setVal(leftVal);
                    left = right;
                    right = left + 1;
                    merge++;
                }
            }
        }
        return score;
    }



}