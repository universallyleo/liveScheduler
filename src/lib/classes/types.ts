export interface Show {
    name: string;
    startTime: string;
    endTime: string;
    performers?: Array<string>;
}

export interface Venue {
    name: string;
    display?: string;
    location?: string;
    link?: string;
    capacity?: number;
}

export interface StageOption {
    open?: string;
}
export interface RawStage {
    venue: Venue;
    shows: Array<Show>;
    color: string;
    opt: StageOption;
}

export interface FesOption {
    open?: string;
    link?: string;
    remark?: string;
}

export interface RawFes {
    stages: Array<RawStage>;
    date: string;
    opt: FesOption;
}

export interface SNS {
    web?: string;
    youtube?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    bluesky?: string;
}

export interface Name {
    display: string; //japanese display name
    hiragana: string;
    katakana: string;
    romanji: string;
    nickname?: string;
    short?: string;
}

export interface Artist {
    name: Name;
    sns?: SNS;
    remark?: string;
}

export interface Group {
    name: Name;
    sns?: SNS;
    schedule?: string;
    remark?: string;
}
