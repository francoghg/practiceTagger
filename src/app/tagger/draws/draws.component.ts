import { Component, OnInit, ViewChild } from '@angular/core';
import Interactive from 'src/assets/source/elements/interactive';
import { DrawsService } from './draws.service';
import { Clase, ActiveShape, Category } from './draws-class';
import { ImageAdderService } from '../imagebar/imagebar.service';
import { sidebarService } from '../sidebar/sidebar.service';
import {Papa} from 'ngx-papaparse'

@Component({
  selector: 'app-draws',
  templateUrl: './draws.component.html',
  styleUrls: ['./draws.component.css']
})
export class DrawsComponent implements OnInit {

  constructor(public draswService:DrawsService,
              public imageService: ImageAdderService,
              private sidebarService:sidebarService,
              private papa:Papa) { }


  // nombre de la variable debe ser 
  // idem al html
  public color:string;
  public width:any;
  public height:any;
  public name:any;
  public message:any;
  public show:boolean=false;
  private temporalShape:ActiveShape;
  private isHidden=false;
  public categories:Category[]=[];

  // Crea una zona interactive
  // por defecto de 1400x300
  ngOnInit(): void {
    this.draswService.myInteractive=new Interactive("my-interactive");
    this.draswService.myInteractive.width=200;
    this.draswService.myInteractive.height=200; 
    let cont=document.getElementById("draw_container_id");
    cont.addEventListener("click",this.draswService.uptadeOri,false);
    this.color="#844444"
    this.name=""; 
    this.draswService.defaulClases()
    .then(c=>{
      this.fillCategories();
    });

      
  }


  // Boton formulario crear clase
  mostrar(id){
    
    let section=document.getElementById(id);
    section.style.display="block";
    document.getElementById("class-creation").style.display="block";
  }

  //Confirmar la creacion de nueva clase
  confirmCreation(id,shapeType:string){
    let check=false;
    let checkField=false;
    let clase:Clase;

    if(shapeType.localeCompare("box")===0){
      this.width=document.getElementById("width");
      this.height=document.getElementById("height");
      this.name=document.getElementById("name");
      
      clase.name=this.name.value;
      clase.width=parseInt(this.width.value);
      clase.height=parseInt(this.height.value);
      clase.color=this.color;
      clase.shape=shapeType;
      clase.view=true;
      let formArea=document.getElementById("atributeForm") as HTMLTextAreaElement;
      let atributeData="";
      const formLength=formArea.children.length;      
      check=this.draswService.checkClassname(clase.name);
      checkField=this.checkFieldNames(formArea,formLength);
      if(checkField&&check){
        for (let index = 0; index < formLength; index+=2) {        
          let formChildren=formArea.firstChild as HTMLTextAreaElement;
          atributeData=atributeData+formChildren.value+":";
          formArea.removeChild(formArea.firstChild);
          formChildren=formArea.firstChild as HTMLTextAreaElement;
          if((index+2)!==formLength){
            atributeData=atributeData+formChildren.value+";"; 
          }
          else{
            atributeData=atributeData+formChildren.value;
          }       
          formArea.removeChild(formArea.firstChild);        
        }
        clase.atribute=atributeData;
      }
    }
    else if(shapeType.localeCompare("line")===0){
      this.name=document.getElementById("linename");
      const lines=document.getElementById("points") as HTMLTextAreaElement;      
      clase.lines=lines.value;
      clase.name=this.name.value;
      clase.color=this.color;
      clase.shape=shapeType;
      clase.view=true;
      let formArea=document.getElementById("atributeFormLine") as HTMLTextAreaElement;
      let atributeData="";       
      const formLength=formArea.children.length;     
      check=this.draswService.checkClassname(clase.name);
      checkField=this.checkFieldNames(formArea,formLength);
      if(checkField&&check){
        for (let index = 0; index < formLength; index+=2) {        
          let formChildren=formArea.firstChild as HTMLTextAreaElement;
          atributeData=atributeData+formChildren.value+":";
          formArea.removeChild(formArea.firstChild);
          formChildren=formArea.firstChild as HTMLTextAreaElement;
          if((index+2)!==formLength){
            atributeData=atributeData+formChildren.value+";"; 
          }
          else{
            atributeData=atributeData+formChildren.value;
          }       
          formArea.removeChild(formArea.firstChild);        
        }     
        clase.atribute=atributeData;
        
        
      }
    }

    // All right, let's reset the template
    if(checkField&&check){
      this.draswService.crearClase(clase);
      this.show1("class-creation","line-creation","boxselector","lineselector");
      this.width=document.getElementById("width");
      this.height=document.getElementById("height");
      this.name=document.getElementById("name");
      this.width.value=50;
      this.height.value=50;
      this.color="#844444";
      this.name.value="";      
      this.name=document.getElementById("linename");
      this.name.value="";
      let section=document.getElementById(id);
      section.style.display="none";      
      document.getElementById("classNameAlertLine").style.display="none";      
      this.show=true;     
      document.getElementById("shape-selector").style.display="none";
      // List variation function
      // this.syncFunction(50).then(v=>{
      //   const header=document.getElementById("classheaderid");
      //   const elements=header.getElementsByClassName("lista");       
      //   for(var i =0;i<elements.length;i++){
      //     elements[i].addEventListener("click",function(){
      //       let current=document.getElementsByClassName("classActive");
      //       if(current.length>0){
      //         current[0].className=current[0].className.replace(" classActive","");
      //       }
      //       this.className+=" classActive";          
      //     })
          
      //   }
      // })

    }
    // Some error
    else{
      if(shapeType.localeCompare("line")===0){
        document.getElementById('classNameAlertLine').style.display="block";
      }
      else{ document.getElementById("classNameAlert").style.display="block";}
    }

  }

  // cancelar creacion de clases
  cancelCreation(id){
    this.show1("class-creation","line-creation","boxselector","lineselector")
    this.width=document.getElementById("width");
    this.height=document.getElementById("height");
    this.name=document.getElementById("name");
    this.width.value=50;
    this.height.value=50;
    this.color="#844444";    
    this.name.value="";
    this.name=document.getElementById("linename");
    this.name.value="";
    let section=document.getElementById(id);
    section.style.display="none";
    document.getElementById("classNameAlert").style.display="none";
    document.getElementById("shape-selector").style.display="none";
  }

// obtiene los valores necesarios para 
// crear una forma rectangular

   crearForma():void{
    // this.draswService.crearShape(this.imageService.img.name);
    
  }
  // Funcion que crea una forma segun
  // las especificaciones del usuario

  mostrarDeleteAlert(id){
    document.getElementById(id).style.display="block";
    document.getElementById("shape-selector").style.display="none";
    document.getElementById("class-creation").style.display="none";
  }

  confirmDelete(id){
    this.draswService.deleteClase();
    document.getElementById(id).style.display="none";
  }
  cancelDelete(id){
    document.getElementById(id).style.display="none";
  }

  // Seleccion de clase
  classSelector(name){  
    // Asigna clase activa
    document.getElementById("class_cretion_container").style.display="block";
    document.getElementById("shape-management").style.display="block";
    // document.getElementById("class-edit-container").style.display="none";
    document.getElementById("shape-creator").className="active-button";
    // document.getElementById("shape-editor").className="inactive-button";
    this.draswService.clases.forEach(element => {
      if (element.name===name) {
        this.draswService.selectClase(element);   
      }
    });
    // Actualiza la vista de clase
    if(this.draswService.clase.atribute){ //Si contiene atributos
      let data=this.splitAtributeData(this.draswService.clase.atribute,";");
      let padre=document.getElementById("atribute_window");
        const padreLength=padre.children.length;
        for (let index = 0; index <padreLength; index++) {
          padre.removeChild(padre.firstChild);
          
        }
      data.forEach(element => {
        // Nombre del atributo
        let text=this.splitAtributeData(element,':');
        let namebar=this.createNameLabel(text[0]);
        // Valor del atributo
        let valuebar=this.createValueLabel(text[1]);        
        padre.appendChild(namebar);
        padre.appendChild(valuebar);



      });
    }
    else{ //Si no contiene atributos
      let padre=document.getElementById("atribute_window");
        const padreLength=padre.children.length;
        for (let index = 0; index <padreLength; index++) {
          padre.removeChild(padre.firstChild);
          
        }
    }
  }

  

  // Mostrar/Ocultar las opciones de creacion de formas
  show1(id1,id2,idactive,idinactive){
    document.getElementById(idactive).className="active-button"
    document.getElementById(idinactive).className="inactive-button"
    document.getElementById(id1).style.display="block";
    document.getElementById(id2).style.display="none";
  }

  // Crea elementos para recibir datos extra
  // durante la creacion de clase
  addAtribute(id){
    let namebar=this.createValueLabel("");
    let valuebar=this.createValueLabel("");
    let form=document.getElementById(id);
    form.appendChild(namebar);
    form.appendChild(valuebar);

  }

  removeAtribute(id){
    let doc=document.getElementById(id);
    if(doc.lastChild){
      doc.removeChild(doc.lastChild);
      doc.removeChild(doc.lastChild);
    }
  }
  checkFieldNames(formArea:HTMLTextAreaElement,formLength){
    let bool=true;
    const regExp=/\s/;
    for (let index = 0; index < formLength; index+=2) {        
      let formChildren=formArea.children[index] as HTMLTextAreaElement;
      if( formChildren.value.localeCompare("")===0 || formChildren.value.match(regExp)!==null){
        bool=false;
        this.draswService.errorMessage="El nombre del atributo no puede estar vacío o tener espacios.";
    }
                
    }  
    
    return bool;
  }

  async syncFunction(x) {
    const a = await this.resolveAfter2Seconds(20);
    const b = await this.resolveAfter2Seconds(30);
    return x + a + b;
  }
  resolveAfter2Seconds(x) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(x);
      }, 1);
    });
  }

  
  splitAtributeData(dataString:string,separator:string){
    let data=dataString.split(separator);
    return data;
  }

  showEditForm(item:ActiveShape){    
    if(item.atribute){
      let data=this.splitAtributeData(item.atribute,";");
      let padre=document.getElementById("shape-edit-container");
      const padreLength=padre.children.length;
      for(let index=0;index<padreLength;index++){
        padre.removeChild(padre.firstChild);
      }
      data.forEach(element=>{
        let text=this.splitAtributeData(element,":");
        let namebar=this.createNameLabel(text[0]);
        let valuebar=this.createValueLabel(text[1]);
        padre.appendChild(namebar);
        padre.appendChild(valuebar);
      })

      document.getElementById("uptade-btn").style.display="block";
      this.temporalShape=item;
    }
    else {
      let padre=document.getElementById("shape-edit-container");
      const padreLength=padre.children.length;
      for(let index=0;index<padreLength;index++){
        padre.removeChild(padre.firstChild);
      }
      document.getElementById("uptade-btn").style.display="none";
    };
    
  }

  updateShape(container:string){
    let data="";
    let source=document.getElementById(container);
    const sourcelength=source.children.length;
    for (let index = 0; index < sourcelength; index+=2) {
      let nombreatrib=source.children[index];
      let valoratrib=source.children[index+1] as HTMLTextAreaElement;
      if((index+2)!==sourcelength){
        data=data+nombreatrib.textContent+valoratrib.value+";";
    }
        else{
          data=data+nombreatrib.textContent+valoratrib.value;
    }
    }
    this.temporalShape.atribute=data;    
  }

  createValueLabel(text: string) {
    let valuebar=document.createElement("textarea");
        valuebar.className="atributebox";
        valuebar.style.border="none"
        valuebar.style.resize= "none";
        valuebar.style.marginLeft="1em";
        valuebar.style.marginBottom= "10px";
        valuebar.style.width= "5em";
        valuebar.style.height= "2.5em";
        valuebar.style.boxSizing= "border-box";
        valuebar.style.borderBottom="solid var(--lightgreen)"
        valuebar.style.backgroundColor="var(--darkgray)"
        valuebar.style.color="var(--white)"
        valuebar.style.fontSize= "small";
        valuebar.style.transition= "all 500ms linear";
        valuebar.style.display="inline-block";
        valuebar.placeholder="Valor...";
        valuebar.value=text;
        return valuebar;
  }

  createNameLabel(text: string) {
        let namebar=document.createElement("p");
        namebar.className="namebox";
        namebar.style.color="var(--white)"
        namebar.style.marginLeft="0.5em";
        namebar.style.paddingTop= "1em";
        namebar.style.width= "4em";
        namebar.style.height= "2.5em";
        namebar.style.fontSize= "smal";
        namebar.style.resize= "none";
        namebar.style.overflow="hidden";
        namebar.style.display="inline-block";
        namebar.title=text;
        namebar.style.textAlign="right"
        namebar.textContent=text+":";
        return namebar;
  }

  toggleClassView(className:string){
    this.toggleValues(className).then(()=>{
      this.refreshView(this.imageService.img.name);
    })
  }

  async toggleValues(className:string){
    this.draswService.clases.forEach(element=>{
      if(className.localeCompare(element.name)===0){
        
        if(element.view){
          element.view=false;
        }
        else{
          element.view=true;
        }
      }
    });
    return;
  }


  refreshView(name:string){
    console.log("refresque tags");
    this.draswService.refreshContainer(name).then(()=>{
      this.draswService.myInteractive.remove();
      // Establece a element como imagen activa y actualiza el tamaño del canvas
      this.imageService.images.forEach(element => {
        if(element.name.localeCompare(name)===0) {
          this.imageService.setImage(element);        
          this.syncFunction(50).then(v => {          
            this.sidebarService.removeGlass();
            let img=document.getElementById('image');  
            document.getElementById('image-box').style.marginTop='-'+img.clientHeight.toString()+'px';
            this.draswService.myInteractive.height=img.clientHeight;      
            this.sidebarService.magniGlass("image");
          });
          
        }
      });
      // Establece a element como imagen compleja activa
      
      this.imageService.complexImages.forEach(element=>{
        if(element.name===name){
          this.imageService.setComplex(element);
        }
      })
      this.draswService.myInteractive=new Interactive("my-interactive");
      this.draswService.myInteractive.width=1400;
      let img=document.getElementById('image') as HTMLImageElement;  
  
      document.getElementById('image-box').style.marginTop='-'+img.clientHeight.toString()+'px';
      this.draswService.myInteractive.height=img.clientHeight;
  
      // cargar imagenes
      this.draswService.clearActiveShapes();
      // busco la imagen en el container
      let indexA=0;
      let indexB=0;
      let found=false;
      this.draswService.shapeContainer.forEach(element => {            
          if (!(element.imgName===name)) {
              indexA++;
          }
          else{
              indexB=indexA;
              found=true;
  
          }
      });
      //Se crean las formas que estn en el cotenedor
      // y que tienen activa su clase
      if(found){
        this.draswService.shapeContainer[indexB].shapeList.forEach(element => {        
          this.draswService.crearFromData(element);  
        });
      }
    });    
  }

  // Load clases
  loadCsvClass(files){
    if(files.length===0){
      return;
    }
    const type=files[0].type;
    if(type.localeCompare("application/vnd.ms-excel")!=0){
      return;
    }   
     
    this.importData(files).then(csvData=>{
      this.syncFunction(50).then(v=>{
        csvData.forEach(element=>{
          let clase= new Clase();
          clase.name=element[0];
          clase.shape=element[1];
          clase.atribute=element[3];
          clase.color=element[6];
          clase.showName=element[7];
          clase.view=true;
          if(clase.shape.localeCompare("box")===0){
            clase.width=parseInt(element[4]);
            clase.height=parseInt(element[5]);              
          }
          else if(clase.shape.localeCompare("line")===0){
            clase.lines=element[2];
          }
          this.draswService.crearClase(clase);
       })
     
      }); 
    })

    


  }

   async importData(files){     
    let csvData=[];
    let counter=0;
    await this.papa.parse(files[0], {
      // header true->ignora el header del archivo
      header: false, 
      step:function (results) {
        if(counter!=0){
          if(results.data!=""){
            csvData.push(results.data);
          }
        }
        else counter++;        
      }
    });
    return csvData;
  }

  toggleCreate(){
    this.draswService.toggleClassCreation();
  }

  changeActiveUpClass(id){
    const active=document.getElementById(id);
    const padre = active.parentElement;
    const abuelo = padre.parentElement;
    const hijos=abuelo.getElementsByTagName('div');
    const state=active.style.display;
    for (let index = 0; index < hijos.length; index++) { 
      if(hijos[index].className==='simpleContainer'){
        hijos[index].style.display='none';   
      }      
    }
    if(state==="block"){
      active.style.display="none";
    }
    else{
      active.style.display="block";
    }
    
    

  }

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
  fillCategories(){
    const id=["idBase","idGeo"];
    const nombre=["Base","Geotecnia"];
    const upClass=["base","geo"];
    //const id=["idBase","idGeo","idLito","idAlt","idMnz"];
    //const nombre=["BaseLine","Geotecnia","Litología","Alteración","Mineralización"];
    //const upClass=["base","geo","lito","alt","mnz"];
    for (let index = 0; index < id.length; index++) {
      const categoria=new Category();
      categoria.id=id[index];
      categoria.nombre=nombre[index];
      categoria.upClass=upClass[index];
      this.categories.push(categoria);
      
    }
  }



  }



