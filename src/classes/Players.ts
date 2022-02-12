import { Player } from './Player';

export class Players extends Array<Player> {

    constructor() {
        super()
    }
    
    add(player: Player) {
        this.push(player);
    }
    get(id: string){
        return this.find(p=>p.id==id);
    }
    has(id: string){
        return !!this.find(p=>p.id==id)
    }
    toString() {
        return this.map(p => `${p}`).join(', ');
    }
    get size(){
        return this.length
    }
    first() {
        return this[0]
    }
    rotate(rigth: boolean){
        if(rigth) this.push(this.shift()!);
        else this.unshift(this.pop()!)
    }
} 