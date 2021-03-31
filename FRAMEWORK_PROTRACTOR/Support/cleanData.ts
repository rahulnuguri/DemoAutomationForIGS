import { Environment } from '../config/environment';
const sql = require('mssql');

const QA_ENV = new Environment('QA').getEnvironmentProperties();
const QA_CONFIG = {
    server: QA_ENV.server,
    database: QA_ENV.database,
    user: QA_ENV.dbusername,
    password: QA_ENV.dbpassword,
    port: QA_ENV.port,
    options: {
        encrypt: false,
    },
};

const DELETE_BUYER =
    "delete pc.LEGACY_BUYING_OFFICE_SALES_DIV where BUYING_OFFICE_ID in (select BUYING_OFFICE_ID from pc.BUYING_OFFICE where BUYING_OFFICE_CODE in ('T21','T22','T23','T24','T25','T26','T27','T28','014')); delete pc.BUYING_OFFICE_PERSON where BUYING_OFFICE_ID in (select BUYING_OFFICE_ID from pc.BUYING_OFFICE where BUYING_OFFICE_CODE in ('T21','T22','T23','T24','T25','T26','T27','T28','014')); delete pc.BUYING_OFFICE  where BUYING_OFFICE_CODE in ('T21','T22','T23','T24','T25','T26','T27','T28','014')";
const DELETE_DIRECTOR =
    "delete pc.LEGACY_BUYING_OFFICE_SALES_DIV where BUYING_OFFICE_ID in (select BUYING_OFFICE_ID from pc.BUYING_OFFICE where BUYING_OFFICE_CODE in ('0E2','0E3','0E4','0E5','0E6','0E7','0E8','0E9''0E2','0E3','0E4','0E5','0E6','0E7','0E8','0E9','0EA')); delete pc.BUYING_OFFICE_PERSON where BUYING_OFFICE_ID in (select BUYING_OFFICE_ID from pc.BUYING_OFFICE where BUYING_OFFICE_CODE in ('0E2','0E3','0E4','0E5','0E6','0E7','0E8','0E9''0E2','0E3','0E4','0E5','0E6','0E7','0E8','0E9','0EA')); delete from pc.BUYING_OFFICE where BUYING_OFFICE_CODE in ('0E2','0E3','0E4','0E5','0E6','0E7','0E9','0EA')";
const DELETE_VP =
    "delete pc.LEGACY_BUYING_OFFICE_SALES_DIV where BUYING_OFFICE_ID in (select BUYING_OFFICE_ID from pc.BUYING_OFFICE where BUYING_OFFICE_CODE in ('DD6','DD7','DD8','DD9','DE1','DE2','DC7','TD2','MK3','DT1','DE1')); delete pc.BUYING_OFFICE_PERSON where BUYING_OFFICE_ID in (select BUYING_OFFICE_ID from pc.BUYING_OFFICE where BUYING_OFFICE_CODE in ('DD6','DD7','DD8','DD9','DE1','DE2','DC7','TD2','MK3','DT1','DE1')); delete pc.BUYING_OFFICE  where BUYING_OFFICE_CODE in ('DD6','DD7','DD8','DD9','DE1','DE2','TD2','MK3','DT1','DE1')";
const DELETE_MERCH_CLASS = "delete pc.LEGACY_DDC_MERCH_CLASS where CLASS_CODE in ('F1','F2','F3','F4','F5','001','ZB7','123','235','45A','004','001','123')";
const DELETE_SEASON = "delete pc.SEASON_LANGUAGE where SEASON_ID in (Select SEASON_ID from pc.SEASON where SEASON_CODE in ('010','011','012','013','014','015'));delete pc.SEASON where SEASON_CODE in ('010','011','012','013','014','015')";
const DELETE_DDC_DIV = "delete from pc.LEGACY_DDC_DIVISION where DIVISION_CODE in ('A0','A1','A2','A3','A4','A5','A6','A7','A8')";
const DELETE_FCC = "delete pc.LEGACY_FINANCIAL_COMMODITY_CLS where PRIMARY_FCC_CLASS_CODE in ('F1','F3','F4','F5')";
const DELETE_DDC_CLASS = "delete pc.LEGACY_DDC_CLASS where CLASS_CODE in ('ZA4')";
const DELETE_COSIGN = "delete pc.LEGACY_CONSIGNMENT where CONSIGNMENT_CODE in ('0A4','A55','0A6','0A5','0A7')";
const DELETE_DDC_DEPT = "delete pc.LEGACY_DDC_DEPARTMENT where DEPARTMENT_CODE in ('0D1','0D2','0D3','0D4')";
const DELETE_TRAIT_VAL =
    "Delete from pc.TRAIT_VALUE_TEXT where TRAIT_VALUE_ID in (Select TRAIT_VALUE_ID from pc.TRAIT_VALUE where TRAIT_VALUE_CODE in('ZZ0','ZZ1','ZZ2','ZZ3','ZZ4','ZZ5','ZZ6','ZZ7','ZZ8'));Delete from pc.TRAIT_VALUE where TRAIT_VALUE_ID in (Select TRAIT_VALUE_ID from pc.TRAIT_VALUE where TRAIT_VALUE_CODE in('ZZ0','ZZ1','ZZ2','ZZ3','ZZ4','ZZ5','ZZ6','ZZ7','ZZ8'))";
const DELETE_ITEM_TYPE = "DELETE FROM pc.LEGACY_ITEM_TYPE WHERE COMPANY_CODE = '17' AND SKN_TYPE_DESC <> 'Accessories'";

export class DbDataCleaner {
    public static async cleanAllData(env: string): Promise<void> {
        if (env === 'QA') {
            try {
                await sql.connect(QA_CONFIG);
                await sql.query(DELETE_BUYER);
                await sql.query(DELETE_DIRECTOR);
                await sql.query(DELETE_VP);
                await sql.query(DELETE_MERCH_CLASS);
                await sql.query(DELETE_SEASON);
                await sql.query(DELETE_DDC_DIV);
                await sql.query(DELETE_FCC);
                await sql.query(DELETE_DDC_CLASS);
                await sql.query(DELETE_COSIGN);
                await sql.query(DELETE_DDC_DEPT);
                await sql.query(DELETE_TRAIT_VAL);
                await sql.query(DELETE_ITEM_TYPE);
            } catch (err) {
                console.log('Error cleaning test data from database: ' + err);
                process.exit(1);
            }
            await sql.close();
            console.log('Database data has been cleaned...');
        }
    }
}
