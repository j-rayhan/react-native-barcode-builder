/// <reference types="react" />
declare type props = {
    value: string;
    format: string;
    width: number;
    height: number;
    text?: string;
    textColor: string;
    lineColor: string;
    background: string;
    getId?: (c: any) => any;
    getRef?: (c: any) => any;
    onError?: (error: Error) => any;
};
declare const Barcode: ({ value, format, width, height, text, textColor, lineColor, background, getId, getRef, onError, }: props) => JSX.Element;
export default Barcode;
