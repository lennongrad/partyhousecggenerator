export enum CardResource{
    Generic,
    Food,
    Wood,
    Gemstones,
}

export interface UnitStats{
    pop: number,
    cash: number,
    trouble: number,
    star: number
}

export interface AbilityData{
    name: string,
    reminder?: string,
    overrideReminder?: boolean
}

export interface CardData{
    abilities: Array<AbilityData>,
    text: string,
    name: string,
    imageURL: string,
    vp?: number,
    unitStats?: UnitStats,
    textSizeModifier: number
}