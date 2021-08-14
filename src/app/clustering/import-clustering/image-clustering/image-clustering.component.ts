import { Component, OnInit } from '@angular/core';
import { ImageClass } from './image-clustering-class';
import { ImageClusteringService } from './image-clustering.service';
import {Papa} from 'ngx-papaparse'

@Component({
  selector: 'app-image-clustering',
  templateUrl: './image-clustering.component.html',
  styleUrls: ['./image-clustering.component.css']
})
export class ImageClusteringComponent implements OnInit {

  constructor(
    public imageClusteringService: ImageClusteringService, 
    private papa:Papa) { }

  ngOnInit(): void {
  }

  public message: String;  
  public imgget= new ImageClass();

  
  // Funcion para cargar una imagen desde
  // los archivos locales
  preview(files) {

    if (files.length === 0){
      return;
    }
    //this.drawsService.refreshContainer(this.imageService.img.name);
    //this.drawsService.myInteractive.remove();
    //this.drawsService.myInteractive=new Interactive("my-interactive");    
    //this.drawsService.myInteractive.width=1400;    
    //this.drawsService.clearActiveShapes();
    
    
    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    // single image
    if(files.length===1){     
      this.loadFile(files[0]).then(()=>{
        this.syncFunction(80*files.length).then(()=>{
          this.sortList("imageheaderid").then(()=>{
            //this.createImageContainer();
            this.imageClusteringService.setBlank();
            this.sortShort().then(() => {
            })
          })
        })
      })          
     
    }
    // Multiple images
    else if (files.length>1) {      
      this.loadFiles(files).then(()=>{
        this.syncFunction(80*files.length).then(()=>{
          this.sortList("imageheaderid").then(()=>{
            //this.createImageContainer();
            this.imageClusteringService.setBlank();
            this.sortShort().then(() => {
              let first=document.getElementById("imageheaderid").firstChild as HTMLElement
              first.click()
            })
          })
        })
      })  

     }
  }

  //async createImageContainer(){  
    //this.imageService.images.forEach(element=>{
      //let  create=true;
      //this.drawsService.shapeContainer.forEach(container=>{
        //if(element.name.localeCompare(container.imgName)===0){
          //create=false;
        //}
      //});
      //if(create){
        //this.drawsService.createContainers(element);
      //}    
    //})
  //}


  async loadFiles(files){
    for (let index = 0; index < files.length; index++) {
      await this.loadFile(files[index]);      
    }
  }

  async loadFile(file){

    if(this.checkImageName(file.name)){
      let imgCapture = new ImageClass();
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload=event=>{
        imgCapture.name=file.name;
        imgCapture.imgURL=reader.result;
        this.imageClusteringService.addImage(imgCapture);
        this.syncFunction(50).then(v=>{
          
          //this.sidebarService.removeGlass();
          let img=document.getElementById('image') as HTMLImageElement;
          imgCapture.height=img.naturalHeight.toString();
          imgCapture.width=img.naturalWidth.toString();
          this.imageClusteringService.addComplex(imgCapture);
          document.getElementById('image-box').style.marginTop='-'+img.clientHeight.toString()+'px'; 
          //this.drawsService.myInteractive.height=img.clientHeight;
          //this.sidebarService.magniGlass("image");

          // Destacar imagen activa
          const header=document.getElementById("imageheaderid")
          const elements=header.getElementsByClassName("list");
          this.syncFunction(50).then(v=>{        
            for(var i =0;i<elements.length;i++){
              elements[i].addEventListener("click",function(){
                let current=document.getElementsByClassName("imageActive");
                if(current.length>0){
                  current[0].className=current[0].className.replace(" imageActive","");
                }
                this.className+=" imageActive";          
              });
  
            }
          });
        });
      }
    }
  }

  async sortShort(){
    var i, switching, shouldSwitch;
    switching=true;
    while(switching){
      switching=false;
      for (i = 0; i < this.imageClusteringService.images.length-1; i++) {
        shouldSwitch=false;
        let a=this.imageClusteringService.images[i].name;
        let b=this.imageClusteringService.images[i+1].name;
        let comp=a.localeCompare(b);
        if(comp===1){
          shouldSwitch=true;
          break;
        }
      }
      if(shouldSwitch){
        let a=this.imageClusteringService.images[i];
        this.imageClusteringService.images[i]=this.imageClusteringService.images[i+1];
        this.imageClusteringService.images[i+1]=a;
        switching=true;
      }
    }
  }

  async sortList(id){

    var list, i, switching, shouldSwitch;
    list = document.getElementById(id); 
    
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
      let b = list.getElementsByTagName("li") as HTMLCollection;
      while (switching) {
      // start by saying: no switching is done:
        switching = false;
      // Loop through all list-items:
        for (i = 0; i < (b.length - 1); i++) {
          // start by saying there should be no switching:
          shouldSwitch = false;
          /* check if the next item should
          switch place with the current item: */
          let str1=b[i].innerHTML.toLowerCase();
          let str2=b[i+1].innerHTML.toLowerCase();
          let comp=str1.localeCompare(str2);
          if (comp===1) {
            /* if next item is alphabetically
            lower than current item, mark as a switch
            and break the loop: */            
            shouldSwitch = true;
            break;
          }
        }
        if (shouldSwitch) {
          /* If a switch has been marked, make the switch
          and mark the switch as done: */
          b[i].parentNode.insertBefore(b[i + 1], b[i]);
  
          switching = true;
        }
      
    }

  
  }

checkImageName(imgName:string):boolean{
  let result=true;
  this.imageClusteringService.images.forEach(element=>{
    if(imgName.localeCompare(element.name)===0){
      result= false;
    }
  })
  return result;
}

  resolveAfter2Seconds(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, x);
    });
  }
    
  async syncFunction(x) {
    const a = await this.resolveAfter2Seconds(x);
    const b = await this.resolveAfter2Seconds(x);
    return x + a + b;
  }

  //  Funcion para actualizar el valor actual de 
  // la imagen que se muestra por pantalla
  imageSelect (name){
    //this.drawsService.refreshContainer(this.imageService.img.name).then(()=>{
      //this.drawsService.myInteractive.remove();
    // Establece a element como imagen activa y actualiza el tamaño del canvas
    this.imageClusteringService.images.forEach(element => {
      if (element.name.localeCompare(name)===0) {
        this.imageClusteringService.setImage(element);        
        this.syncFunction(50).then(v => {          
          //this.sidebarService.removeGlass();
          let img=document.getElementById('image');  
          document.getElementById('image-box').style.marginTop='-'+img.clientHeight.toString()+'px';
          //this.drawsService.myInteractive.height=img.clientHeight;      
          //this.sidebarService.magniGlass("image");
        });
        
      }
    });
    // Establece a element como imagen compleja activa
    this.imageClusteringService.complexImages.forEach(element=>{
      if(element.name.localeCompare(name)===0){
        this.imageClusteringService.setComplex(element);
      }
    })
    //this.drawsService.myInteractive=new Interactive("my-interactive");
    //this.drawsService.myInteractive.width=1400;
    //this.drawsService.myInteractive.window=false;
    let img=document.getElementById('image') as HTMLImageElement;  

    document.getElementById('image-box').style.marginTop='-'+img.clientHeight.toString()+'px';
    //this.drawsService.myInteractive.height=img.clientHeight;

    // cargar imagenes
    //this.drawsService.clearActiveShapes();
    // busco la imagen en el container
    let indexA=0;
    let indexB=0;
    let found=false;
    //this.drawsService.shapeContainer.forEach(element => {        
        //if (!(element.imgName===name)) {
            //indexA++;
        //}
        //else{
            //indexB=indexA;
            //found=true;

        //}
    //});
    //asigno valores a nuevo shape container
    //if(found){      
      //this.drawsService.shapeContainer[indexB].shapeList.forEach(element => {
        //this.drawsService.crearFromData(element);
  
      //});
    //}
    //})
    
  }



  // Funcion para alternar la vista del recuadro de eliminar imagen
  changeDisplay(id1):void{
    if(document.getElementById(id1).style.display=="none"){      
      document.getElementById(id1).style.display="block";
    }
    else{
      document.getElementById(id1).style.display="none";    
    }  
  }

  // Funcion para eliminar una imagen seleccionada
  eliminar(){
    const indexA=this.imageClusteringService.images.indexOf(this.imageClusteringService.img);
    const indexB=this.imageClusteringService.complexImages.indexOf(this.imageClusteringService.complexImg);
    
    //this.drawsService.removeImage(this.imageService.img.name)
    this.imageClusteringService.setBlank();
    this.imageClusteringService.removeImage(indexA);
    this.imageClusteringService.removeComplex(indexB);
    //this.drawsService.myInteractive.remove();
    this.changeDisplay('alert1');
  }

  hideShowSection(id):void{
    if(document.getElementById(id).style.display=="none"){
      document.getElementById(id).style.display="block"
    }
    else{
    document.getElementById(id).style.display="none"}
  
  }

}