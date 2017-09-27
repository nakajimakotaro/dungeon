export interface TurnInterface{
    turnStart();
    turnUpdate();
    turnWaitTime:number;
    nextTurnTime:number;
}
export class TurnManager{
    private turnObjectQueue:TurnInterface[] = [];
    private isNextTurnStart: boolean = true;
    private nowTurn = 0;
    public update(){
        if(this.turnObjectQueue.length == 0){
            return;
        }
        if(this.isNextTurnStart){
            this.isNextTurnStart = false;
            this.stableSort(this.turnObjectQueue, (a, b)=>a.nextTurnTime - b.nextTurnTime);
            this.turnObjectQueue[0].turnStart();
            this.nowTurn++;
        }
        this.turnObjectQueue[0].turnUpdate();
    }
    public turnNext(){
        const currentTurnObject = this.turnObjectQueue[0];
        currentTurnObject.nextTurnTime = currentTurnObject.turnWaitTime + this.nowTurn;
        this.isNextTurnStart = true;
    }
    public addTurnListener(object:TurnInterface){
        this.turnObjectQueue.push(object);
    }
    public removeTurnListener(object:TurnInterface){
        this.turnObjectQueue = this.turnObjectQueue.filter((e)=>e != object);
    }  
    //挿入ソート
    //chromeのsortが安定ソートでないため
    private stableSort<T>(array:T[], compareFunction: (a:T, b:T)=>number):T[]{
        //返り値はbが入るべきindex値
        function searchFitPos(currentPos:number){
            const current = array[currentPos];
            for(let fitPos = currentPos;fitPos > 0;fitPos--){
                const compare = array[fitPos - 1];
                if(compareFunction(compare, current) < 0){
                    return fitPos;
                }
            }
            return 0;
        }
        function backMove(startPos:number, num:number){
            for(let c = num;c > 0;c--){
                array[startPos + c] = array[startPos + c - 1];
            }
        }
        if(array.length < 2){
            return array;
        }
        for(let c = 1; c < array.length;c++){
            const current = array[c];
            const fitPos = searchFitPos(c);
            backMove(fitPos, c - fitPos);
            array[fitPos] = current;
        }
        return array;
    }
}