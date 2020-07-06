import { ReporterlPluginHost } from './reporter-interface';
export declare const nativeWrite: (text: string) => ReporterlPluginHost;
export declare const nativeSetIndent: (val: number) => ReporterlPluginHost;
export declare const nativeNewLine: () => ReporterlPluginHost;
export declare const nativeFormatError: (err: import("./reporter-interface").CallsiteError, prefix: string) => string;
