import { Tag } from './cucumber-json-interfaces';
export declare const tagsFromDescription: (description: string) => Tag[];
export declare const isNoisyTag: (tag: string, unwantedTags: string[]) => boolean;
export declare const distinct: (items: string[]) => string[];
