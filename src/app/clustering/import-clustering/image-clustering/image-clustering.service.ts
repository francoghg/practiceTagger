import {Injectable} from '@angular/core'

import { ImageClass} from './image-clustering-class';

@Injectable({
providedIn:'root',
})

export class ImageClusteringService{
    
public img= new ImageClass();
public images=[];
public complexImg= new ImageClass();
public complexImages=[];

public blank= new ImageClass();
// message:String="no hay mano compadre";
// imageChange:Subject<String>=new Subject();

constructor(){
}

addImage(image:ImageClass):void{
    this.images.push(image);
    this.img=this.images[this.images.length-1];
}
addSingleImage(image:ImageClass):void{
    this.images.push(image);
}
addComplex(image:ImageClass){
    this.complexImages.push(image);
    this.complexImg=this.complexImages[this.complexImages.length-1]    
}

getImage():ImageClass{
    return this.img;
}

getImages():ImageClass[]{
    return this.images;
}

removeImage(i:number):void{
    this.images.splice(i,1);
}
removeComplex(i:number):void{
    this.complexImages.splice(i,1);
}

clearImages():void{
this.images=[];
}

setImage(image:ImageClass):void{
    this.img=image;
}
setComplex(image:ImageClass):void{
    this.complexImg=image;
}

setBlank(){
    this.img=this.blank;
}

}