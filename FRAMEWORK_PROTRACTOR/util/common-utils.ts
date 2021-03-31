import * as fs from 'fs';

export class CommonUtils {
  private static readonly ENCODING = 'utf8';

  private static processArgs = CommonUtils.getProcessArgs();

  static getDataForFeature<T>(featureName: string, environment: string): T {
    return JSON.parse(fs.readFileSync(`./data/${environment}/${featureName}.json`, CommonUtils.ENCODING));
  }

  public static readFullFileSync(fileName: any) {
    const rawData = fs.readFileSync(fileName);
    const data = JSON.parse(rawData.toString());
    console.log(data);
    fs.closeSync(fileName);
    return data;
  }

  public static readValueSync(fileName: string, key: string) {
    const rawData = fs.readFileSync(fileName);
    const data = JSON.parse(rawData.toString());
    const value = data[key];
    console.log('Key: ' + key + ', Value:' + value);
    return value;
  }

  public static readValueAsync(fileName: string, key: string) {
    const totalContent = require(fileName);
    const value = totalContent[key];
    console.log('Key: ' + key + ', Value:' + value);
    return value;
  }

  public static writeFileSync(fileName: string, sampleData: Map<string, string>) {
    const data = JSON.stringify(sampleData, null, 3);
    fs.writeFileSync(fileName, data);
  }

  public static getEnvironment(): string {
    return CommonUtils.processArgs.get('--env');
  }

  public static getRunMode(): string {
    return CommonUtils.processArgs.get('--run-mode');
  }

  public static getUseGridOption(): boolean {
    return CommonUtils.processArgs.get('--use-grid') === 'true';
  }

  public static isRegressionBuild(): boolean {
    return process.env.REGRESSION_BUILD === 'true';
  }

  private static getProcessArgs(): Map<string, string> {
    const argsMap = new Map<string, string>();
    return process.argv.slice(2).reduce(function (container: Map<string, string>, content: string) {
      const [key, value] = content.split('=');
      if (!container.get(key)) {
        container.set(key, value);
      }
      return container;
    }, argsMap);
  }
}
