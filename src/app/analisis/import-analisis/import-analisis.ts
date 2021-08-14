
export class DataProcess{
    nombre:string;
    estado:string;
}

export class DataObject{
    data:Object;
    nombre:string;
}

export interface GeneralData{
    core:string;
    start:string;
    end:string;
    size:string;
    rec:string;
    ff:string;
    frac:string;
    esp:string;
    rqd:string;
    lenS:string;
    m:string;
    mf:string;
    mm:string;
    mg:string;
    segs:string;  
}

export interface MolidoData{
    core:string;
    from:string;
    to:string;
    class:string;
}

export interface FracturaData{
    core:string;
    depth:string;
    alpha:string;
    beta:string;
}

export interface LitoData{
    core:string;
    from:string;
    to:string;
    lito:string;
}

export interface AlterData{
    core:string;
    from:string;
    to:string;
    alt:string;
}

export interface MinerData{
    core:string;
    from:string;
    to:string;
    min:string;
}

export interface VetillaData{
    core:string;
    depth:string;
    alpha:string;
    beta:string;
}

export interface ObsData{
    core:string;
    from:string;
    to:string;
    obs:string;
}

export interface ReviewData {
    clas:string;
    note:string;
}