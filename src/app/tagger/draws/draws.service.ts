import {Attribute, Injectable} from '@angular/core'
import Interactive from '../../../assets/source/elements/interactive';
import { Clase, ActiveShape, ShapeContainer, exportableShape } from './draws-class';
import { ExportToCsv } from 'export-to-csv';
import { ImageAdderService } from '../imagebar/imagebar.service';
import { ImageClass } from '../imagebar/image-class';

@Injectable({
providedIn:'root',
})

export class DrawsService{

    public myInteractive:Interactive;
    public clase= new Clase();
    //storedShapes guarda la ultima informacion de cada forma creada
    //antes de que sea reemplazada en la imagen activa
    public storedShapes=[];
    public clases=[]; 
    public remover:boolean=true; 
    public activesShapes=[];
    public shapeContainer=[];
    public ver=true;
    private id=1;
    public errorMessage:string="";
    private xPoints=[];
    private yPoints=[];
    private totalPoints=0;
    private create=false;
    constructor(public imageService: ImageAdderService){
    }


    

    setPlusId(id){
        this.id=(parseInt(id)+1);
    }
    shapeEvent(){
        if(this.create){
            
            let position=this.uptadeOri(event);
            this.setnCheckPoints(position[0],position[1]);
        }
    }
    uptadeOri(event){
        if(event){
            let doc=document.getElementById("draw_container_id");            
            let x=Math.floor(event.clientX-doc.getBoundingClientRect().left);
            let y=Math.floor(event.clientY-doc.getBoundingClientRect().top);

            const position=[x,y]
            return position;
        }

    }

    toggleClassCreation(){
        this.create=!this.create;
        if(this.imageService.images.length>0){            
            document.getElementById(this.imageService.img.name).click();
        }
    }

    checkClassname(name:string):boolean{
        const regExp=/\s/;
        let bool=true;
        this.clases.forEach(element => {
            if(element.name===name){            
                bool=false; 
                this.errorMessage="El nombre "+name+" ya existe!";           
            }
        });
        if( name.localeCompare("")===0 || name.match(regExp)!==null){
            bool=false;
            this.errorMessage="El nombre no puede estar vacío o contener espacios!";
        }
        return bool;
    }
    crearClase(claseNueva:Clase){
        this.clases.push(claseNueva);
        // this.clase=this.clases[this.clases.length-1];
    
    }

    deleteClase(){
        const index=this.clases.indexOf(this.clase);
        this.clases.splice(index,1); 
    }

    async crearShape(imgName:string){
        if(this.clase.shape.localeCompare("box")===0){
            if(this.xPoints[0]<this.xPoints[1] && this.yPoints[0]<this.yPoints[1]){
                
                this.crearRect(imgName);
            }
            else if(this.xPoints[0]>this.xPoints[1] && this.yPoints[0]>this.yPoints[1]){
                const newx=this.xPoints[0]
                const newy=this.yPoints[0]
                this.xPoints[0]=this.xPoints[1]                
                this.yPoints[0]=this.yPoints[1]                
                this.xPoints[1]=newx;
                this.yPoints[1]=newy;     
                this.crearRect(imgName);           
            }
            else if(this.xPoints[0]>this.xPoints[1] && this.yPoints[0]<this.yPoints[1]){
                const newx=this.xPoints[0]
                this.xPoints[0]=this.xPoints[1]                    
                this.xPoints[1]=newx;
                this.crearRect(imgName);     
            }
            else if(this.xPoints[0]<this.xPoints[1] && this.yPoints[0]>this.yPoints[1]){
                const newy=this.yPoints[0]          
                this.yPoints[0]=this.yPoints[1]      
                this.yPoints[1]=newy;       
                this.crearRect(imgName);  
            }
        }
        else if(this.clase.shape.localeCompare("line")===0){
            this.crearLine(imgName);
        }
        else if(this.clase.shape.localeCompare("arrow")===0){
            this.crearArrow(imgName);
        }
        else if(this.clase.shape.localeCompare("arrowc")===0){
            this.crearArrowc(imgName);
        }
    }
    // Fija la clase activa y
    selectClase(clase:Clase){
        this.clase=clase;
        this.xPoints=[];
        this.yPoints=[];
        if(this.clase.shape.localeCompare("box")===0){
            this.totalPoints=2;
        }
        else if(this.clase.shape.localeCompare("line")===0){
            this.totalPoints=parseInt(this.clase.lines)+1;
        }
        else if(this.clase.shape.localeCompare("arrow")===0){
            this.totalPoints=1;
        }
        else if(this.clase.shape.localeCompare("arrowc")===0){
            this.totalPoints=1;
        }
    }
    // recibe posicion de click y revisa si
    // se dibuja la forma
    setnCheckPoints(x:number,y:number){
        
        this.yPoints.push(y);
        this.xPoints.push(x);
        if(this.yPoints.length===this.totalPoints){
            this.crearShape(this.imageService.img.name).then(()=>{
                this.yPoints=[];
                this.xPoints=[];
            })

        }
    }
    
    // crea una flecha para tipos de subclase
    // lito, geo o alt

    crearArrow(imgName:string){
        let temporal= new ActiveShape();
        temporal.imgName=imgName;
        temporal.activo=true;
        temporal.shapeLine=[];
        temporal.color=this.clase.color;
        temporal.atribute=this.getAtributeData();  
        temporal.shapeLine.push(this.myInteractive.line( 0,  26.4, 0,  -26.4));
        temporal.shapeLine.push(this.myInteractive.line( 0.4,  25, 26.3,  -1.3));
        temporal.shapeLine.push(this.myInteractive.line( 0.4,  -25, 26.3, 1.3));
        //temporal.shapeLine.push(this.myInteractive.line( 0,  0,  75,  0));
        //temporal.shapeLine.push(this.myInteractive.line( 75, 0,  50, -25));
        //temporal.shapeLine.push(this.myInteractive.line( 75, 0,  50,  25));
        let c1=this.myInteractive.control(this.xPoints[0],this.yPoints[0]);
        temporal.shape=this.myInteractive.rectangle(c1.x,c1.y,0,0);
        temporal.shape.update=function(){
            this.x+=c1.dx;
            this.y+=c1.dy;
        }
        c1.constrainWithinBox(2,2,1398,this.myInteractive.height-2);
        for (let index = 0; index < temporal.shapeLine.length; index++) {
            temporal.shapeLine[index].style.strokeWidth="4px";
            temporal.shapeLine[index].style.stroke=this.clase.color;
            temporal.shapeLine[index].update=function(){
                this.x1+=c1.dx;
                this.x2+=c1.dx;
                this.y1+=c1.dy;
                this.y2+=c1.dy;
                if(c1.x===2 || c1.y===2){
                    this.remove();
                    c1.remove();
                    temporal.activo=false;
                    temporal.shape.remove();
                }
            }  
            temporal.shapeLine[index].x1+=this.xPoints[0];
            temporal.shapeLine[index].x2+=this.xPoints[0];
            temporal.shapeLine[index].y1+=this.yPoints[0];
            temporal.shapeLine[index].y2+=this.yPoints[0];
            temporal.shapeLine[index].addDependency(c1);     
            temporal.shapeLine[index].update();      
            
        }
        
        temporal.shapeType=this.clase.shape;
        temporal.clase=this.clase.name;
        this.activesShapes.push(temporal);
        if(this.create){
            c1.remove();            
        }

        // Mostrar datos de atributos
        const textData=this.splitAtributeDataService(temporal.atribute,";");
        for (let index = 0; index < textData.length; index++) {
            let text=this.myInteractive.text(0,0,(textData[index]));
            text.style.fill="white";
            text.style.fontSize="medium";

            text.update=function(){
                this.x=c1.x+3;
                this.y=c1.y-25+(15*(index+1));            
            }

            text.addDependency(c1);        
            text.update();
            
        }


    }


        // crea una flecha para tipos de subclase
    // lito, geo o alt

    crearArrowc(imgName:string){
        let temporal= new ActiveShape();
        temporal.imgName=imgName;
        temporal.activo=true;
        temporal.shapeLine=[];
        temporal.color=this.clase.color;
        temporal.atribute=this.getAtributeData();  
        temporal.shapeLine.push(this.myInteractive.line(  0,  26.4,  0,  -26.4));
        temporal.shapeLine.push(this.myInteractive.line( -25.9,  -1.3, 0, 25));
        temporal.shapeLine.push(this.myInteractive.line( -25.9,  1.3, 0, -25));
        //temporal.shapeLine.push(this.myInteractive.line( 0,  26.4, 0,  -26.4));
        //temporal.shapeLine.push(this.myInteractive.line( 0.4,  25, 26.3,  -1.3));
        //temporal.shapeLine.push(this.myInteractive.line( 0.4,  -25, 26.3, 1.3));
        let c1=this.myInteractive.control(this.xPoints[0],this.yPoints[0]);
        temporal.shape=this.myInteractive.rectangle(c1.x,c1.y,0,0);
        temporal.shape.update=function(){
            this.x+=c1.dx;
            this.y+=c1.dy;
        }
        c1.constrainWithinBox(2,2,1398,this.myInteractive.height-2);
        for (let index = 0; index < temporal.shapeLine.length; index++) {
            temporal.shapeLine[index].style.strokeWidth="4px";
            temporal.shapeLine[index].style.stroke=this.clase.color;
            temporal.shapeLine[index].update=function(){
                this.x1+=c1.dx;
                this.x2+=c1.dx;
                this.y1+=c1.dy;
                this.y2+=c1.dy;
                if(c1.x===2 || c1.y===2){
                    this.remove();
                    c1.remove();
                    temporal.activo=false;
                    temporal.shape.remove();
                }
            }  
            temporal.shapeLine[index].x1+=this.xPoints[0];
            temporal.shapeLine[index].x2+=this.xPoints[0];
            temporal.shapeLine[index].y1+=this.yPoints[0];
            temporal.shapeLine[index].y2+=this.yPoints[0];
            temporal.shapeLine[index].addDependency(c1);     
            temporal.shapeLine[index].update();      
            
        }
        
        temporal.shapeType=this.clase.shape;
        temporal.clase=this.clase.name;
        this.activesShapes.push(temporal);
        if(this.create){
            c1.remove();            
        }

        // Mostrar datos de atributos
        const textData=this.splitAtributeDataService(temporal.atribute,";");
        for (let index = 0; index < textData.length; index++) {
            let text=this.myInteractive.text(0,0,(textData[index]));
            text.style.fill="white";
            text.style.fontSize="medium";

            text.update=function(){
                this.x=c1.x+3;
                this.y=c1.y-25+(15*(index+1));            
            }

            text.addDependency(c1);        
            text.update();
            
        }


    }


    // crea forma a partir de una clase
    crearLine(imgName:string){
        let temporal= new ActiveShape();
        temporal.imgName=imgName;
        temporal.activo=true;
        temporal.shapeLine=[];
        let controllers=[];
        let textcontainer=[];
        let linenumber= parseInt(this.clase.lines);
        temporal.lines=this.clase.lines;        
        temporal.atribute=this.getAtributeData();
        // Create element for future management
        for (let index = 0; index < linenumber; index++) {       
            temporal.shapeLine.push(this.myInteractive.line(0,0,0,0)); 
            controllers.push(this.myInteractive.control(this.xPoints[index],this.yPoints[index]));
            if(index===(linenumber-1)){
                controllers.push(this.myInteractive.control(this.xPoints[index+1],this.yPoints[index+1]));
            }
            
        }
        for (let index = 0; index < controllers.length; index++) {
            controllers[index].constrainWithinBox(2,2,1398,this.myInteractive.height-2);
            
        }
        // Mostrar atributos e id        
        const textData=this.splitAtributeDataService(temporal.atribute,";");  
        for (let index = 0; index < textData.length; index++) {
            // if(index===0){
            //     let id=this.id;
            //     textcontainer.push(this.myInteractive.text(0,0,"id:"+id.toString()));
            //     textcontainer[index].style.fill="white";
            //     textcontainer[index].style.fontSize="medium";

            //     textcontainer[index].update=function(){
            //         this.x=controllers[0].x+3;
            //         this.y=controllers[0].y+(15*(index+1));  
            //     }        
            //     textcontainer[index].addDependency(controllers[0]); 
            //     textcontainer[index].update();
            // }
            textcontainer.push(this.myInteractive.text(0,0,(textData[index])));
            textcontainer[index].style.fill="white";
            textcontainer[index].style.fontSize="medium";

            textcontainer[index].update=function(){
                this.x=controllers[0].x+3;
                this.y=controllers[0].y+(15*(index+1));  
            }

            textcontainer[index].addDependency(controllers[0]);
            textcontainer[index].update();
            
        }
        // Assign the elements with their siblings
        for (let index = 0; index < linenumber; index++) {   
            temporal.shapeLine[index].style.stroke=this.clase.color;
            temporal.shapeLine[index].style.strokeWidth="3px";
            temporal.shapeLine[index].update=function(){
                this.x1=controllers[index].x;
                this.x2=controllers[index+1].x;
                this.y1=controllers[index].y;
                this.y2=controllers[index+1].y;
                if(Math.abs(controllers[index].x-controllers[index+1].x)<5&&Math.abs(controllers[index].y-controllers[index+1].y)<5){
                    for (let index = 0; index < (linenumber+1); index++) {
                        controllers[index].remove();
                        
                    }
                    for (let index = 0; index < linenumber; index++) {                    
                        temporal.shapeLine[index].remove();                    
                    }
                    for (let index = 0; index < textcontainer.length; index++) {
                        textcontainer[index].remove();
                        
                    }

                    temporal.activo=false;
                }
            }
            temporal.shapeLine[index].addDependency(controllers[index]);
            temporal.shapeLine[index].addDependency(controllers[index+1]);
            temporal.shapeLine[index].update();

        }


        temporal.shapeType=this.clase.shape;
        temporal.color=this.clase.color;
        temporal.clase=this.clase.name;
        this.id+=1;
        this.activesShapes.push(temporal);
        //  Si esta en modo editar, se eliminan los controladores
        if(this.create){
            for (let index = 0; index < controllers.length; index++) {
                controllers[index].remove();
                
            }
        }


    }

    crearRect(imgName:string):void{

        let temporal= new ActiveShape();
        // let fixWidth:number=this.oriX+this.clase.width;
        // let fixHeight:number=this.oriY+this.clase.height;
        temporal.imgName=imgName;
        temporal.activo=true;   
        temporal.shape = this.myInteractive.rectangle(0, 0, 0, (this.yPoints[1]-this.yPoints[0])); 
        temporal.shape.classList.add('default');
        temporal.shape.style.fill=this.clase.color;
        temporal.shape.style.stroke=this.clase.color;
        temporal.color=this.clase.color;
        temporal.shape.style.strokeWidth="2px";
        temporal.shape.style.fillOpacity="0.4";
        temporal.shapeType=this.clase.shape;
        let c1 = this.myInteractive.control(this.xPoints[0], this.yPoints[0]);
        let c2 = this.myInteractive.control(this.xPoints[1], this.yPoints[1]);
        
        c1.constrainWithinBox(2,2,1398,this.myInteractive.height-2);
        
        c2.constrainWithinBox(2,2,1398,this.myInteractive.height-2);
        // let rect = this.myInteractive.rectangle(0,0,0,0)
        // rect.style.fill=this.clase.color;
        // rect.style.stroke=this.clase.color;
        // rect.style.fillOpacity="0.7";
        // rect.style.strokeWidth="2px";

        c2.update = function () {
            this.x += c1.dx;
            this.y += c1.dy;            
        };
        temporal.atribute=this.getAtributeData();  
        // Mostrar datos de atributos  
        const textData=this.splitAtributeDataService(temporal.atribute,";");        
        for (let index = 0; index < textData.length; index++) {
            let text=this.myInteractive.text(0,0,(textData[index]));
            text.style.fill="white";
            text.style.fontSize="medium";

            text.update=function(){
                this.x=c1.x+3;
                this.y=c1.y+(15*(index+1));            
                if(c2.x<c1.x || c2.y<c1.y){
                    this.remove();
                } 
            }

            text.addDependency(c1);        
            text.addDependency(c2);
            text.update();
            
        }

        c2.addDependency(c1);
        temporal.shape.update = function () {
            this.x = c1.x;
            this.y = c1.y;
            this.width = c2.x - c1.x;
            this.height = c2.y - c1.y;
            if(this.width<0 || this.height<0){
                c1.remove();
                c2.remove();                     
                this.remove();
                temporal.activo=false;
            }

                
        };    
        temporal.shape.update();
        temporal.shape.addDependency(c1);
        temporal.shape.addDependency(c2);
        temporal.clase=this.clase.name;   
        this.id+=1;
        this.activesShapes.push(temporal);
        if(this.create){
            c1.remove();
            c2.remove();
        }

    }

    getAtributeData(){
        let padre=document.getElementById("atribute_window");
        let atributeData="";
        const padreLength=padre.children.length;
        for (let index = 0; index < padreLength; index+=2) {
            let nombreatrib=padre.children[index];
            let valoratrib=padre.children[index+1] as HTMLTextAreaElement;
            if((index+2)!==padreLength){
                atributeData=atributeData+nombreatrib.textContent+valoratrib.value+";";
            }
            else{
                atributeData=atributeData+nombreatrib.textContent+valoratrib.value;
            }
            
        }
        return atributeData;
    }

    crearFromData(shape:ActiveShape){
        let displayShape="block";
        this.clases.forEach(element=>{
            if(element.name.localeCompare(shape.clase)===0){
                if(!element.view){
                    displayShape="none";
                }
                
                if(shape.shapeType.localeCompare("box")===0){
                    this.crearRectFromData(shape.imgName,
                        shape.shape.width,
                        shape.shape.height,
                        shape.shape.x,
                        shape.shape.y,
                        shape.color,
                        shape.clase,
                        shape.shapeType,
                        shape.atribute,
                        displayShape);
                }
                else if(shape.shapeType.localeCompare("line")===0){
                    
                    this.crearLineFromData(shape.imgName,
                        shape.shapeLine,
                        shape.lines,
                        shape.color,
                        shape.clase,
                        shape.shapeType,
                        shape.atribute,
                        displayShape)
                }
                else if(shape.shapeType.localeCompare("arrow")===0){
                    this.crearArrowFromData(shape.imgName,                        
                        shape.shapeLine,
                        shape.color,
                        shape.clase,
                        shape.shapeType,
                        shape.atribute,
                        displayShape,
                        shape.shape.x,
                        shape.shape.y);
                }

                else if(shape.shapeType.localeCompare("arrowc")===0){
                    this.crearArrowcFromData(shape.imgName,                        
                        shape.shapeLine,
                        shape.color,
                        shape.clase,
                        shape.shapeType,
                        shape.atribute,
                        displayShape,
                        shape.shape.x,
                        shape.shape.y);
                }

            }
        })
        

    }

    crearLineFromData(imgName:string,shapes:any,lines:string,color:string,clase:string,shapeType:string,atribute:string,displayShape:string){
        // Shapes se usa para obtener coordenadas en x,y con
        // las que se crean los controladores
        let temporal= new ActiveShape();
        temporal.imgName=imgName;
        temporal.activo=true;
        temporal.shapeLine=[];
        temporal.lines=lines;
        let controllers=[];        
        let textcontainer=[];
        let linenumber= parseInt(lines);
        // Create element for future management
        for (let index = 0; index < linenumber; index++) {       
            temporal.shapeLine.push(this.myInteractive.line(0,0,0,0)); 
            controllers.push(this.myInteractive.control(shapes[index].x1,shapes[index].y1));
            controllers[index].style.display=displayShape;
            if(index===(linenumber-1)){
                controllers.push(this.myInteractive.control(shapes[index].x2,shapes[index].y2));
                controllers[index+1].style.display=displayShape;
            }        
        }

        for (let index = 0; index < controllers.length; index++) {
            controllers[index].constrainWithinBox(2,2,1398,this.myInteractive.height-2);
            
        }

        // Mostrar datos atributos
        
        temporal.atribute=atribute;
        const textData=this.splitAtributeDataService(temporal.atribute,";");  
        for (let index = 0; index < textData.length; index++) {
            textcontainer.push(this.myInteractive.text(0,0,(textData[index])));
            textcontainer[index].style.fill="white";
            textcontainer[index].style.fontSize="medium";            
            textcontainer[index].style.display=displayShape;

            textcontainer[index].update=function(){
                this.x=controllers[0].x+3;
                this.y=controllers[0].y+(15*(index+1));  
            }

            textcontainer[index].addDependency(controllers[0]);
            textcontainer[index].update();
            
        }

        // Assing the elements with their siblings
        for (let index = 0; index < linenumber; index++) {   
            temporal.shapeLine[index].style.stroke=color;
            temporal.shapeLine[index].style.strokeWidth="3px";
            temporal.shapeLine[index].style.display=displayShape;
            temporal.shapeLine[index].update=function(){
                this.x1=controllers[index].x;
                this.x2=controllers[index+1].x;
                this.y1=controllers[index].y;
                this.y2=controllers[index+1].y;
                // Condicion para eliminar la figura
                if(Math.abs(controllers[index].x-controllers[index+1].x)<5&&Math.abs(controllers[index].y-controllers[index+1].y)<5){
                    for (let index = 0; index < (linenumber+1); index++) {
                        controllers[index].remove();
                        
                    }
                    for (let index = 0; index < linenumber; index++) {                    
                        temporal.shapeLine[index].remove();                    
                    }
                    for (let index = 0; index < textcontainer.length; index++) {
                        textcontainer[index].remove();
                        
                    }

                    temporal.activo=false;
                }
            }
            temporal.shapeLine[index].addDependency(controllers[index]);
            temporal.shapeLine[index].addDependency(controllers[index+1]);
            temporal.shapeLine[index].update();

        }


        temporal.shapeType=shapeType;
        temporal.color=color;
        temporal.clase=clase;
        this.activesShapes.push(temporal);
        if(this.create){
            for (let index = 0; index < controllers.length; index++) {
                controllers[index].remove();
                
            }
        }
    }
    // crea una forma a partir de informacion almacenada
    crearRectFromData(imgName:string,width:number,height:number,x:number,y:number,color:string,clase:string,shapeType:string,atribute:string,displayShape:string):void{
        let temporal= new ActiveShape();
        let fixWidth=x+width;
        let fixHeight=y+height;
        temporal.imgName=imgName;
        temporal.activo=true;
        temporal.shape = this.myInteractive.rectangle(0, 0, 0, 0);    
        temporal.shape.classList.add('default');
        temporal.shape.style.fill=color;
        temporal.shape.style.stroke=color;
        temporal.color=color;
        temporal.shape.style.strokeWidth="2px";
        temporal.shape.style.fillOpacity="0.4";
        temporal.shape.style.display=displayShape;
        temporal.shapeType=shapeType;
        let c1 = this.myInteractive.control(x,y);
        let c2 = this.myInteractive.control(fixWidth, fixHeight);
        c1.constrainWithinBox(2,2,1398,this.myInteractive.height-2);
        c2.constrainWithinBox(2,2,1398,this.myInteractive.height-2);
        c1.style.display=displayShape;
        c2.style.display=displayShape;
        c2.update = function () {
            this.x += c1.dx;
            this.y += c1.dy;
        }; 
        // Mostrar datos de atributos
        temporal.atribute=atribute;
        const textData=this.splitAtributeDataService(temporal.atribute,";");
        for (let index = 0; index < textData.length; index++) {
            let text=this.myInteractive.text(0,0,(textData[index]));
            text.style.fill="white";
            text.style.fontSize="medium";
            text.style.display=displayShape;
            text.update=function(){
                this.x=c1.x+3;
                this.y=c1.y+(15*(index+1));            
                if(c2.x<c1.x || c2.y<c1.y){
                    this.remove();
                } 
            }        
            text.addDependency(c1);        
            text.addDependency(c2);
            text.update();
            
        }    
        c2.addDependency(c1);
        temporal.shape.update = function () {
            this.x = c1.x;
            this.y = c1.y;
            this.width = c2.x - c1.x;
            this.height = c2.y - c1.y;
            if(this.width<0 || this.height<0){
                c1.remove();
                c2.remove();                        
                this.remove();
                temporal.activo=false;
            }
                
        };
        temporal.shape.update();
        temporal.shape.addDependency(c1);
        temporal.shape.addDependency(c2);    
        temporal.clase=clase;
        this.activesShapes.push(temporal);
        if(this.create){
            c1.remove();
            c2.remove();
        }

    }

    crearArrowFromData(imgName:string,shapes:any,color:string,clase:string,shapeType:string,atribute:string,displayShape:string,x:number,y:number){
        let temporal= new ActiveShape();
        temporal.imgName=imgName;
        temporal.activo=true;
        temporal.shapeLine=[];
        temporal.shapeType=shapeType;
        temporal.atribute=atribute;
        temporal.shapeLine.push(this.myInteractive.line( 0,  26.4, 0,  -26.4));
        temporal.shapeLine.push(this.myInteractive.line( 0.4,  25, 26.3,  -1.3));
        temporal.shapeLine.push(this.myInteractive.line( 0.4,  -25, 26.3, 1.3));
        //temporal.shapeLine.push(this.myInteractive.line( 0,  0,  75,  0));
        //temporal.shapeLine.push(this.myInteractive.line( 75, 0,  50, -25));
        //temporal.shapeLine.push(this.myInteractive.line( 75, 0,  50,  25));
        let c1=this.myInteractive.control(x,y);
        temporal.shape=this.myInteractive.rectangle(x,y,0,0);
        temporal.shape.update=function(){
            this.x+=c1.dx;
            this.y+=c1.dy;
        }
        temporal.shape.addDependency(c1);
        temporal.shape.update();
        c1.constrainWithinBox(2,2,1398,this.myInteractive.height-2);
        for (let index = 0; index < temporal.shapeLine.length; index++) {
            temporal.shapeLine[index].style.strokeWidth="4px";
            temporal.shapeLine[index].style.stroke=color;
            temporal.shapeLine[index].update=function(){
                this.x1+=c1.dx;
                this.x2+=c1.dx;
                this.y1+=c1.dy;
                this.y2+=c1.dy;
                if(c1.x===2 || c1.y===2){
                    this.remove();
                    c1.remove();
                    temporal.activo=false;
                    temporal.shape.remove();
                }
            }
            temporal.shapeLine[index].x1+=x;
            temporal.shapeLine[index].x2+=x;
            temporal.shapeLine[index].y1+=y;
            temporal.shapeLine[index].y2+=y;
            temporal.shapeLine[index].addDependency(c1);     
            temporal.shapeLine[index].update();  
            temporal.shapeLine[index].style.display=displayShape;    
            
        }
        
        temporal.color=color;
        c1.style.display=displayShape;
        temporal.clase=clase;
        this.activesShapes.push(temporal);
        if(this.create){
            c1.remove();            
        }

        // Mostrar datos de atributos
        const textData=this.splitAtributeDataService(temporal.atribute,";");
        for (let index = 0; index < textData.length; index++) {
            let text=this.myInteractive.text(0,0,(textData[index]));
            text.style.fill="white";
            text.style.fontSize="medium";

            text.update=function(){
                this.x=c1.x+3;
                this.y=c1.y-25+(15*(index+1));            
            }

            text.addDependency(c1);        
            text.update();
            
        }

    }

    crearArrowcFromData(imgName:string,shapes:any,color:string,clase:string,shapeType:string,atribute:string,displayShape:string,x:number,y:number){
        let temporal= new ActiveShape();
        temporal.imgName=imgName;
        temporal.activo=true;
        temporal.shapeLine=[];
        temporal.shapeType=shapeType;
        temporal.atribute=atribute;
        temporal.shapeLine.push(this.myInteractive.line(  0,  26.4,  0,  -26.4));
        temporal.shapeLine.push(this.myInteractive.line( -25.9,  -1.3, 0, 25));
        temporal.shapeLine.push(this.myInteractive.line( -25.9,  1.3, 0, -25));
        //temporal.shapeLine.push(this.myInteractive.line( 0,  26.4, 0,  -26.4));
        //temporal.shapeLine.push(this.myInteractive.line( 0.4,  25, 26.3,  -1.3));
        //temporal.shapeLine.push(this.myInteractive.line( 0.4,  -25, 26.3, 1.3));
        let c1=this.myInteractive.control(x,y);
        temporal.shape=this.myInteractive.rectangle(x,y,0,0);
        temporal.shape.update=function(){
            this.x+=c1.dx;
            this.y+=c1.dy;
        }
        temporal.shape.addDependency(c1);
        temporal.shape.update();
        c1.constrainWithinBox(2,2,1398,this.myInteractive.height-2);
        for (let index = 0; index < temporal.shapeLine.length; index++) {
            temporal.shapeLine[index].style.strokeWidth="4px";
            temporal.shapeLine[index].style.stroke=color;
            temporal.shapeLine[index].update=function(){
                this.x1+=c1.dx;
                this.x2+=c1.dx;
                this.y1+=c1.dy;
                this.y2+=c1.dy;
                if(c1.x===2 || c1.y===2){
                    this.remove();
                    c1.remove();
                    temporal.activo=false;
                    temporal.shape.remove();
                }
            }
            temporal.shapeLine[index].x1+=x;
            temporal.shapeLine[index].x2+=x;
            temporal.shapeLine[index].y1+=y;
            temporal.shapeLine[index].y2+=y;
            temporal.shapeLine[index].addDependency(c1);     
            temporal.shapeLine[index].update();  
            temporal.shapeLine[index].style.display=displayShape;    
            
        }
        
        temporal.color=color;
        c1.style.display=displayShape;
        temporal.clase=clase;
        this.activesShapes.push(temporal);
        if(this.create){
            c1.remove();            
        }

        // Mostrar datos de atributos
        const textData=this.splitAtributeDataService(temporal.atribute,";");
        for (let index = 0; index < textData.length; index++) {
            let text=this.myInteractive.text(0,0,(textData[index]));
            text.style.fill="white";
            text.style.fontSize="medium";

            text.update=function(){
                this.x=c1.x+3;
                this.y=c1.y-25+(15*(index+1));            
            }

            text.addDependency(c1);        
            text.update();
            
        }

    }

    removeImage(imgName:string){
        let indexA=0;
        let indexB=0;
        let remove=false;
        this.shapeContainer.forEach(element => {    
                    
            if (!(element.imgName===imgName)) {
                indexA++;

            }
            else{
                indexB=indexA;
                remove=true;
            }
        });
        if(remove){
            // console.log(this.shapeContainer[indexB]);
            this.shapeContainer.splice(indexB,1);
        } 
        this.activesShapes=[];
    }

    // Almacena los elementos de figuras de la imagen activa
    async refreshContainer(imgName:string){
        if(this.shapeContainer.length>0){
            
            let indexA=0;
            let indexB=0;
            let remove=false;
            this.shapeContainer.forEach(element => {    
                        
                if (!(element.imgName===imgName)) {
                    indexA++;

                }
                else{
                    indexB=indexA;
                    remove=true;
                }
            });
            if(remove){
                // console.log(this.shapeContainer[indexB]);
                this.shapeContainer.splice(indexB,1);
            }  
        }    
        
        this.saveShapes(imgName,this.activesShapes).then(value=>{
            this.shapeContainer.push(value);
        })      
    }


    async createContainers(image:ImageClass){
        let container= new ShapeContainer();
        container.imgName=image.name;
        container.height=image.height;
        container.width=image.width;
        container.shapeList=[];
        this.shapeContainer.push(container);
    }

    async saveShapes(imgName,shapes){
        let container= new ShapeContainer();
        container.imgName=imgName;
        container.shapeList=[];
        container.width=this.imageService.complexImg.width;
        container.height=this.imageService.complexImg.height;
        
        this.activesShapes.forEach(element=>{
            if(element.activo){
                container.shapeList.push(element);
            }            
        });

        return container;
    }

    clearActiveShapes(){
        this.activesShapes=[];
    }

    // Genera csv de salida de marcas
    exportData(imgName:string){
        // Organizar datos
        this.refreshContainer(imgName).then(()=>{
            let data=[];
            this.shapeContainer.forEach(element=>{
            element.shapeList.forEach(elementoLista => {  

                let list= new exportableShape();
                let factor=1400/parseInt(element.width); 
                list.imgName=elementoLista.imgName;
                list.imgHeight=element.height;
                list.imgWidth=element.width;
                list.clase=elementoLista.clase;
                list.shapetype=elementoLista.shapeType; 
                let atributeFormated="";
                console.log("intento separar");
                console.log(elementoLista.atribute);
                let temporalData=this.splitAtributeDataService(elementoLista.atribute,";")
                console.log("logrado");
                for (let index = 0; index < temporalData.length; index++) {
                    let rawData=this.splitAtributeDataService(temporalData[index],":")
                    if(rawData.length>1){
                        atributeFormated=atributeFormated+"\""+rawData[0]+"\":\""+rawData[1]+"\""
                    
                    if(index<temporalData.length-1){
                        atributeFormated=atributeFormated+";";
                    }
                    }    
                    
                }
                list.atribute="{"+atributeFormated+"}";
                list.id=Math.random();                                    

                if(elementoLista.shapeType.localeCompare("box")===0){                    
                    list.oriX=Math.floor(parseInt(elementoLista.shape.x)/factor).toString();
                    list.oriY=Math.floor(parseInt(elementoLista.shape.y)/factor).toString();
                    list.width=Math.floor(parseInt(elementoLista.shape.width)/factor).toString();
                    list.height=Math.floor(parseInt(elementoLista.shape.height)/factor).toString();
                    list.color=elementoLista.color;                
                    data.push(list);
                }
                else if(elementoLista.shapeType.localeCompare("line")===0){ 
                    const linenum=parseInt(elementoLista.lines);
                    list.oriX="";
                    list.oriY="";
                    for (let index = 0; index < linenum; index++) {
                        let x1=Math.floor(parseInt(elementoLista.shapeLine[index].x1)/factor).toString();                    
                        let y1=Math.floor(parseInt(elementoLista.shapeLine[index].y1)/factor).toString();                    
                        let x2=Math.floor(parseInt(elementoLista.shapeLine[index].x2)/factor).toString();                    
                        let y2=Math.floor(parseInt(elementoLista.shapeLine[index].y2)/factor).toString();

                        if(index===(linenum-1)){
                            list.oriX=list.oriX+x1+","+x2;
                            list.oriY=list.oriY+y1+","+y2;
                        }
                        else{
                            list.oriX=list.oriX+x1+","+x2+",";
                            list.oriY=list.oriY+y1+","+y2+",";

                        }
                        
                    }
                    list.oriX="\""+list.oriX+"\"";                    
                    list.oriY="\""+list.oriY+"\"";
                    


                    list.width="";
                    list.height="";
                    list.color=elementoLista.color;                
                    data.push(list);
                }
                else if(elementoLista.shapeType.localeCompare("arrow")===0){
                    list.oriX=Math.floor(parseInt(elementoLista.shape.x)/factor).toString();
                    list.oriY=Math.floor(parseInt(elementoLista.shape.y)/factor).toString();
                    list.width="0";
                    list.height="0";
                    list.color=elementoLista.color;                
                    data.push(list);
                }
                else if(elementoLista.shapeType.localeCompare("arrowc")===0){
                    list.oriX=Math.floor(parseInt(elementoLista.shape.x)/factor).toString();
                    list.oriY=Math.floor(parseInt(elementoLista.shape.y)/factor).toString();
                    list.width="0";
                    list.height="0";
                    list.color=elementoLista.color;                
                    data.push(list);
                }
            });
        })
        //Exportar datos

        let exportoptions={
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '',
            showLabels: true,
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true,
        };
        const csvExport= new ExportToCsv(exportoptions);
        csvExport.generateCsv(data);
        });
        
    }

    // Separa string segun separador
    splitAtributeDataService(dataString:string,separator:string){
        let data=dataString.split(separator);
        return data;
    }

    /*
    // Carga clases por defecto
    async defaulClases(){
        this.clases=[];
        const names=['L','LF','A','AF','MNZ','MNZF','OBS','OBSF','CAN','ROC','T','T2','C','M','MG','MM','MF','J','J3','V','V3']
        const showNames=['Litología','Litología (Fin)','Alteración','Alteración (Fin)','Mineralización','Mineralización (Fin)','Observación','Observación (Fin)','Escala','Eje Sondaje', 'Taco','Taco Falso','Canaleta Vacía','Molido','Molido Grueso','Molido Medio','Molido Fino','Fractura','Fractura (3 ptos.)','Vetilla','Vetilla (3 ptos.)']
        const tipes=['arrow','arrowc', 'arrow','arrowc', 'arrow','arrowc','arrow','arrowc','line','line', 'box','box','box','box','box','box','box','box','line','box','line']
        const lines=[0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,2,0,2]
        const colors=['#FF0000','#FF0000','#FF8000','#FF8000','#FFFF00','#FFFF00','#FFFFFF','#FFFFFF','#FFFFFF','#000000','#000000','#C0C0C0','#FFFFFF','#0000FF','#800080','#FF00FF','#FFC0CB','#00FF00','#00FF00','#008000','#008000']
        const icons=["litologia.png","litologiaFin.png","alteracion.png","alteracionFin.png","mineralizacion.png","mineralizacionFin.png","observacion.png","observacionFin.png","escala.png","eje.png","taco.png","tacoFalso.png","canaletaVacia.png","molido.png","molidoGrueso.png","molidoMedio.png","molidoFino.png","fractura.png","fractura3ptos.png","vetilla.png","vetilla3ptos.png"]
        const upClas=['geologia', 'geologia', "geologia",'geologia', 'geologia', "geologia","geologia","geologia","base","base", "base","base","base","geo","geo","geo","geo","geo","geo","geo","geo"]
        for (let index = 0; index < names.length; index++) {
            let tempClass = new Clase();
            tempClass.showName=showNames[index];
            tempClass.name=names[index];
            tempClass.shape=tipes[index];
            tempClass.lines=lines[index].toString();
            tempClass.color=colors[index];
            tempClass.view=true;
            tempClass.icon=icons[index];
            tempClass.upClass=upClas[index]
            
            if(names[index]==="T" || names[index]==="L" || names[index]==="A" || names[index]==="MNZ" || names[index]==="OBS"){
                tempClass.atribute='p1:';
            }
            
            if(names[index]==="CAN"){
                tempClass.atribute='dist:';
            }
            if(names[index]==="T"){
                tempClass.atribute='prof:';
            }
            if(names[index]==="L"){
                tempClass.atribute='lit:';
            }
            if(names[index]==="A"){
                tempClass.atribute='alt:';
            }
            if(names[index]==="MNZ"){
                tempClass.atribute='min:';
            }
            if(names[index]==="OBS"){
                tempClass.atribute='obs:';
            }
            
            this.clases.push(tempClass)     
        }
    }
    */

        // Carga clases por defecto
        async defaulClases(){
            this.clases=[];
            //const names=['L','LF','A','AF','MNZ','MNZF','OBS','OBSF','CAN','ROC','T','T2','C','M','MG','MM','MF','J','J3','V','V3']
            const names=['CAN','ROC','J3','V3','M','MTV']
            //const showNames=['Litología','Litología (Fin)','Alteración','Alteración (Fin)','Mineralización','Mineralización (Fin)','Observación','Observación (Fin)','Escala','Eje Sondaje', 'Taco','Taco Falso','Canaleta Vacía','Molido','Molido Grueso','Molido Medio','Molido Fino','Fractura','Fractura (3 ptos.)','Vetilla','Vetilla (3 ptos.)']
            const showNames=['Escala','Eje Sondaje','Fractura','Vetilla','Molido','Molido (TV)']
            //const tipes=['arrow','arrowc', 'arrow','arrowc', 'arrow','arrowc','arrow','arrowc','line','line', 'box','box','box','box','box','box','box','box','line','box','line']
            const tipes=['line','line','line','line','box','box']
            //const lines=[0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,2,0,2]
            const lines=[1,1,2,2,0,0]
            //const colors=['#FF0000','#FF0000','#FF8000','#FF8000','#FFFF00','#FFFF00','#FFFFFF','#FFFFFF','#FFFFFF','#000000','#000000','#C0C0C0','#FFFFFF','#0000FF','#800080','#FF00FF','#FFC0CB','#00FF00','#00FF00','#008000','#008000']
            const colors=['#FFFFFF','#000000','#00FF00','FF8000','0000FF','FF0000']
            //const icons=["litologia.png","litologiaFin.png","alteracion.png","alteracionFin.png","mineralizacion.png","mineralizacionFin.png","observacion.png","observacionFin.png","escala.png","eje.png","taco.png","tacoFalso.png","canaletaVacia.png","molido.png","molidoGrueso.png","molidoMedio.png","molidoFino.png","fractura.png","fractura3ptos.png","vetilla.png","vetilla3ptos.png"]
            const icons=["escala.png","eje.png","fractura3ptos.png","vetilla3ptos.png","molido.png","molidoTV.png"]
            //const upClas=['geologia', 'geologia', "geologia",'geologia', 'geologia', "geologia","geologia","geologia","base","base", "base","base","base","geo","geo","geo","geo","geo","geo","geo","geo"]
            const upClas=["base","base","geo","geo","geo","geo"]
            for (let index = 0; index < names.length; index++) {
                let tempClass = new Clase();
                tempClass.showName=showNames[index];
                tempClass.name=names[index];
                tempClass.shape=tipes[index];
                tempClass.lines=lines[index].toString();
                tempClass.color=colors[index];
                tempClass.view=true;
                tempClass.icon=icons[index];
                tempClass.upClass=upClas[index]
                 
                if(names[index]==="CAN"){
                    tempClass.atribute='dist:';
                }
                if(names[index]==="J3" || names[index]==="V3"){
                    tempClass.atribute='alfa:;beta:';
                }
                if(names[index]==="M"){
                    tempClass.atribute='id:';
                }
                if(names[index]==="MTV"){
                    tempClass.atribute='id:;frac:;obs:';
                }
                
                this.clases.push(tempClass)     
            }
        }



}