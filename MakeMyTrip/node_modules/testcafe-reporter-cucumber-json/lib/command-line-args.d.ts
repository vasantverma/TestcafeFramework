import { ParsedArgs } from 'minimist';
export declare const cliArgs: CliArgs;
export interface CliArgs extends ParsedArgs {
    appName: string;
    appVersion: string;
    reportFolder: string;
    rawCommandLine: string;
}
