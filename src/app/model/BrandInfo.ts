
export enum ResourceType {
    PUBLIC_FIGURE,
    ARTIST,
    MUSICIAN,
    ACTOR,
    POLITICIAN,
    MEDIA_OUTLET,
    STUDIO,
    SHOW,
    REGION,
    INSTITUTION,
    SCHOOL,
    COLLEGE,
    ORGANIZATION,
    CONCEPT,
    LITERATURE,
    BOOK,
    FILM,
    TAXONOMY,
    ART,
    BRAND,
    DRAWING,
    PAINTING,
    SCULPTURE,
    SONG,
    SPECIES,
    ANIMAL,
    PLANT,
    FOOD,
    CONTINENT,
    COUNTRY,
    BIOME,
    DEVICE,
    MACHINE,
    LANGUAGE,
    RESTAURANT,
    GAME,
    BOARD_GAME,
    SPORT,
    CARD_GAME,
    VIDEO_GAME,
    APP
}


export interface BrandInfo
{ 
    id: string;
    resourceTypePrimary: ResourceType;
    resourceTypeSecondary: ResourceType | undefined;
    resourceTypeTertiary: ResourceType | undefined;
    name: string;
    defaultLanguage: string;
    brandId: string | undefined;
    
    reviewStage:string; 
}

export class BrandInfoImg {
    brandInfo: BrandInfo;
    imgData: string | undefined;
    constructor(brandInfo: BrandInfo){
        this.brandInfo = brandInfo;
    }
}

export interface ObjectMap {
    [key: string]: string;
}

export class ResourceMetadata {
    profileBase64: string | undefined;
    profileDesc: string | undefined;
    metadata: ObjectMap = {};
}

export class BrandInfoEntry {
    primaryType: string | undefined;
    secondaryType: string | undefined;
    tertiaryType: string | undefined;
    metaData: ResourceMetadata = new ResourceMetadata();
    name: string = "";
    contents: string = "";

    entry: BrandInfo | undefined;
}

export class ReviewEntry {
    id: string;
    approve: boolean;
    comment: string;

    constructor(id: string, approve: boolean, comment: string){
        this.approve = approve;
        this.comment = comment;
        this.id = id;
    }
}

export const BRAND_RESOURCE_TYPE = {
    PUBLIC_FIGURE: "PUBLIC_FIGURE",
    ARTIST: "ARTIST",
    MUSICIAN: "MUSICIAN",
    ACTOR: "ACTOR",
    POLITICIAN: "POLITICIAN",
    MEDIA_OUTLET: "MEDIA_OUTLET",
    STUDIO: "STUDIO",
    SHOW: "SHOW",
    REGION: "REGION",
    INSTITUTION: "INSTITUTION",
    SCHOOL: "SCHOOL",
    COLLEGE: "COLLEGE",
    ORGANIZATION: "ORGANIZATION",
    CONCEPT: "CONCEPT",
    LITERATURE: "LITERATURE",
    BOOK: "BOOK",
    FILM: "FILM",
    TAXONOMY: "TAXONOMY",
    ART: "ART",
    BRAND: "BRAND",
    DRAWING: "DRAWING",
    PAINTING: "PAINTING",
    SCULPTURE: "SCULPTURE",
    SONG: "SONG",
    SPECIES: "SPECIES",
    ANIMAL: "ANIMAL",
    PLANT: "PLANT",
    FOOD: "FOOD",
    CONTINENT: "CONTINENT",
    COUNTRY: "COUNTRY",
    BIOME: "BIOME",
    DEVICE: "DEVICE",
    MACHINE: "MACHINE",
    LANGUAGE: "LANGUAGE",
    RESTAURANT: "RESTAURANT",
    GAME: "GAME",
    BOARD_GAME: "BOARD_GAME",
    SPORT: "SPORT",
    CARD_GAME: "CARD_GAME",
    VIDEO_GAME: "VIDEO_GAME",
    APP: "APP"
  }