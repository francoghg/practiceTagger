//import Rectangle from '../../../assets/source/elements/svg/rectangle';
//import Control from '../../../assets/source/elements/input/control';
//import Line from '../../../assets/source/elements/svg/line';

export class Clase{
    lines:string;
    name:string;
    tag:string;
    color:string;
    shape:string;
    width:number;
    height:number; 
    atribute:string; 
    view:boolean;
    showName:string;
    icon:string;
    upClass:string;
}


export class altLine{
    x1:number;
    x2:number;
    y1:number;
    y2:number;
}

export class exportableShape{
    id:number;
    lines:string;
    imgName:string;
    imgWidth:string;
    imgHeight:string;
    clase:string;    
    shapetype:string;
    color:string;
    oriX:string;
    oriY:string;
    width:string;
    height:string;
    atribute:string;  
}

export class Category{
    id:string;
    nombre:string;
    upClass:string;
}