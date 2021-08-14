import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ImageAdderService } from '../imagebar/imagebar.service';
import { DrawsService } from '../draws/draws.service';
import { sidebarService } from '../sidebar/sidebar.service';
import Interactive from 'src/assets/source/elements/interactive';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  private name;
  constructor(private route: ActivatedRoute,
              public imageService: ImageAdderService,
              public drawsService:DrawsService,  
              public sidebarService:sidebarService,
              
    ) {    
   }

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      this.name = params['name'];     
      
    });

    // Alerta al cerrar pestaña

    // window.onbeforeunload=function(e){
    //   if(e){
    //     e.returnValue="Seguro?"
    //   }
    //   return "desea salir?"
    // }

  }
  crearForma(){
    this.drawsService.crearShape(this.imageService.img.name);
  }

 
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key.localeCompare("Shift")===0){
      document.getElementById("toggle-class").click();
    }
     /*
    else if(event.key.localeCompare("l")===0){
      document.getElementById("toggle-glass").click();
    }    
    else if(event.key.localeCompare("a")===0 && this.imageService.images.length>0){      
      const imageIndex=this.imageService.images.indexOf(this.imageService.img)
      if(imageIndex===0){
        document.getElementById(this.imageService.images[this.imageService.images.length-1].name).click();
        // this.imageSelect(this.imageService.images[this.imageService.images.length-1].name)
      }
      else{
        document.getElementById(this.imageService.images[imageIndex-1].name).click();
        // this.imageSelect(this.imageService.images[imageIndex-1].name)
      }
    }
    
    else if(event.key.localeCompare("d")===0 && this.imageService.images.length>0){      
      const imageIndex=this.imageService.images.indexOf(this.imageService.img)
      if(imageIndex===(this.imageService.images.length-1)){
        document.getElementById(this.imageService.images[0].name).click();
      }
      else{
        document.getElementById(this.imageService.images[imageIndex+1].name).click();
      }
    }
    */
  }





  imageSelect (name){
    this.drawsService.refreshContainer(this.imageService.img.name).then(()=>{
      this.drawsService.myInteractive.remove();
    // Establece a element como imagen activa y actualiza el tamaño del canvas
    this.imageService.images.forEach(element => {
      if (element.name.localeCompare(name)===0) {
        this.imageService.setImage(element);        
        this.syncFunction(50).then(v => {          
          this.sidebarService.removeGlass();
          let img=document.getElementById('image');  
          document.getElementById('image-box').style.marginTop='-'+img.clientHeight.toString()+'px';
          this.drawsService.myInteractive.height=img.clientHeight;      
          this.sidebarService.magniGlass("image");
        });
        
      }
    });
    // Establece a element como imagen compleja activa
    this.imageService.complexImages.forEach(element=>{
      if(element.name.localeCompare(name)===0){
        this.imageService.setComplex(element);
      }
    })
    this.drawsService.myInteractive=new Interactive("my-interactive");
    this.drawsService.myInteractive.width=1400;
    this.drawsService.myInteractive.window=false;
    let img=document.getElementById('image') as HTMLImageElement;  

    document.getElementById('image-box').style.marginTop='-'+img.clientHeight.toString()+'px';
    this.drawsService.myInteractive.height=img.clientHeight;

    // cargar imagenes
    this.drawsService.clearActiveShapes();
    // busco la imagen en el container
    let indexA=0;
    let indexB=0;
    let found=false;
    this.drawsService.shapeContainer.forEach(element => {        
        if (!(element.imgName===name)) {
            indexA++;
        }
        else{
            indexB=indexA;
            found=true;

        }
    });
    //asigno valores a nuevo shape container
    if(found){      
      this.drawsService.shapeContainer[indexB].shapeList.forEach(element => {
        this.drawsService.crearFromData(element);
  
      });
    }
    })
    
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
  

  // showcoordinates(e){
    
  //   let cont=document.getElementById("draw_container_id");
  //   const mouseX=e.clientX-cont.getBoundingClientRect().left;
  //   const mouseY=e.clientY-cont.getBoundingClientRect().top;
  //   this.drawsService.crearShape(this.imageService.img.name,mouseX,mouseY);

  // }

} 
