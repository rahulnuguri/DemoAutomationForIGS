import { config as SqlConfig, ConnectionPool } from 'mssql';
import { Environment, EnvironmentProperties } from '../config/environment';
import { CommonUtils } from '../util/common-utils';

type IntakeGroupStatusCode = 10 | 100 | 1000 | 1005 | 101 | 102 | 150 | 200 | 50 | 51;
type ValidationStatusCode = 10 | 20 | 22 | 23 | 25 | 27 | 30;
type VendorGtin = { GTIN_STATUS_CODE: string; GTIN: string };
type GtinStatusCount = number | 'gt0' | 'gt1';

const ENV: Environment = new Environment(CommonUtils.getEnvironment());
const ENV_PROPERTIES: EnvironmentProperties = ENV.getEnvironmentProperties();

export class SqlConnection {
    readonly connPool: ConnectionPool;

    constructor(dbConfig: SqlConfig) {
        this.connPool = new ConnectionPool(dbConfig);
    }

    public async getMaxGtin(): Promise<string> {
        const query = `
          select top 1 GTIN 
          from pi.CURR_GTIN_VENDOR 
          where GTIN like '998%' 
          order by GTIN desc
        `;
        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const gtin: string = result?.recordset[0]?.GTIN;
        await sql.close();
        return gtin;
    }

    public async getIntakeStatusByGtin(gtin: string): Promise<string> {
        const query = `
          SELECT st.intake_group_status_desc 
          FROM PI.intake_group ig 
            JOIN PI.intake_group_status_type st 
            ON ig.INTAKE_GROUP_STATUS_CODE = st.INTAKE_GROUP_STATUS_CODE 
            JOIN PI.CURR_GTIN_VENDOR gv 
            ON ig.intake_group_id = gv.intake_group_id 
          WHERE gv.GTIN = '${gtin}'
        `;
        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const statusDesc: string = result?.recordset[0]?.intake_group_status_desc;
        await sql.close();
        return statusDesc;
    }

    public async getIntakeStatusByProductName(Vendor_product_name: string): Promise<string> {
        const query = `
        SELECT st.intake_group_status_desc 
        FROM PI.intake_group ig 
          JOIN PI.intake_group_status_type st 
          ON ig.INTAKE_GROUP_STATUS_CODE = st.INTAKE_GROUP_STATUS_CODE  
          WHERE ig.VENDOR_PRODUCT_NAME = '${Vendor_product_name}'
      `;
        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const statusDesc: string = result?.recordset[0]?.intake_group_status_desc;
        await sql.close();
        return statusDesc;
    }
    public async getGtinStatusByGtin(gtin: string): Promise<string> {
        const query = `
      select v.GTIN, t.GTIN_VENDOR_STATUS_DESC from pi.APPRV_GTIN_VENDOR v
      join pi.GTIN_VENDOR_STATUS_TYPE t on v.GTIN_VENDOR_STATUS_CODE = t.GTIN_VENDOR_STATUS_CODE
      where v.GTIN = '${gtin}'
      `;
        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const gtinstatusDesc: string = result?.recordset[0]?.GTIN_VENDOR_STATUS_DESC;
        await sql.close();
        return gtinstatusDesc;
    }

    public async getProductAndSknNumberByGtin(gtin: string): Promise<{ PRODUCT_NBR: string; SKN_NBR: string }> {
        const query = `
          SELECT pro.PRODUCT_NBR, skn.LEGACY_SKN_NBR
          from pi.INTAKE_GROUP ig
            inner join pi.APPRV_GTIN_VENDOR agv 
            on agv.INTAKE_GROUP_ID = ig.INTAKE_GROUP_ID 
            inner join pi.APPRV_GTIN_VENDOR_GRP_INST agvgi 
            on agvgi.GTIN = agv.GTIN and agvgi.VENDOR_PARTY_ID = agv.VENDOR_PARTY_ID 
            left outer join pc.product pro 
            on pro.product_item_id = ig.product_item_id 
            left outer join pc.us_legacy_product_skn skn 
            on pro.product_nbr = skn.legacy_product_nbr 
          where agv.GTIN = '${gtin}'
          group by pro.PRODUCT_NBR, skn.LEGACY_SKN_NBR
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const productNumber = result?.recordset[0]?.PRODUCT_NBR;
        const sknNumber: string = result?.recordset[0]?.LEGACY_SKN_NBR;
        await sql.close();
        return { PRODUCT_NBR: productNumber, SKN_NBR: sknNumber };
    }

    public async getBuyingOfficeCode(productName: string): Promise<string> {
        const query = `
          SELECT buying_office_code 
          FROM PI.intake_group ig 
            JOIN pc.buying_office bo 
            ON ig.buying_office_id = bo.buying_office_id 
          WHERE vendor_product_name = '${productName}'
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const buyingOfficeCode: string = result?.recordset[0]?.buying_office_code;
        await sql.close();
        return buyingOfficeCode;
    }

    public async getProductNameByStatusAndRow(statusCode: number, row: number): Promise<string> {
        const query = `
          with Records AS (
            select row_number() over(order by CREATE_DATE_TIME DESC) as 'row',
            * from pi.INTAKE_GROUP 
            where INTAKE_GROUP_STATUS_CODE = '${statusCode.toString()}'
          ) 
          select * from Records
          where row = ${row.toString()}
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const vendorProductName: string = result?.recordset[0]?.VENDOR_PRODUCT_NAME;
        await sql.close();
        return vendorProductName;
    }

    public async getCompletedProductNumber(): Promise<string> {
        const query = `
          select top 1 PRODUCT_NBR 
          from pc.PRODUCT 
          where LAST_UPDATE_PROGRAM = 'PRODUCT_COMPLETE' 
          order by CREATE_DATE_TIME desc
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const productNumber = result?.recordset[0]?.PRODUCT_NBR;
        await sql.close();
        return productNumber;
    }

    public async getProductNumberHavingMultipleGtins(): Promise<string> {
        const query = `
          select top 1 p.PRODUCT_NBR
          from pc.product p
          join pi.INTAKE_GROUP ig on ig.PRODUCT_ITEM_ID = p.PRODUCT_ITEM_ID
          join pi.APPRV_GTIN_VENDOR agv on agv.INTAKE_GROUP_ID = ig.INTAKE_GROUP_ID
          where ig.VALIDATION_STATUS_CODE = 30
          group by p.PRODUCT_NBR, ig.CREATE_DATE_TIME
          having count(agv.gtin) > 1
          order by ig.CREATE_DATE_TIME desc
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const productNumber = result?.recordset[0]?.PRODUCT_NBR;
        await sql.close();
        return productNumber;
    }

    public async getProductNumberWithValidatorStatusInProgress(): Promise<string> {
        const query = `
        select top 1 p.PRODUCT_NBR from pi.INTAKE_GROUP g
        join pi.CURR_GTIN_VENDOR v
        on g.INTAKE_GROUP_ID = v.INTAKE_GROUP_ID
        join pc.PRODUCT p on p.PRODUCT_ITEM_ID = g.PRODUCT_ITEM_ID
        where v.VENDOR_PARTY_ID = 213875 and g.VENDOR_PRODUCT_NAME not like '%multi%' and g.VALIDATION_STATUS_CODE = 20 and g.INTAKE_GROUP_STATUS_CODE = 100 and v.GTIN not in (
            select gtin from pi.CURR_GTIN_VENDOR
            where v.VENDOR_PARTY_ID != 213875
        )
        order by g.CREATE_DATE_TIME DESC;
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const productNumber = result?.recordset[0]?.PRODUCT_NBR;
        await sql.close();
        return productNumber;
    }

    public async getProductNumberWithMsLovOtherAttributeProdInfo(): Promise<string> {
        const query = `
        SELECT
          TOP 1 p.PRODUCT_NBR
        from
          pi.INTAKE_GROUP ig
        join pc.CLASSIFICATION c on
          ig.CTC_CLASSIFICATION_ID = c.CLASSIFICATION_ID
        join pc.PRODUCT p on
          ig.PRODUCT_ITEM_ID = p.PRODUCT_ITEM_ID
        where
          ig.INTAKE_GROUP_STATUS_CODE = '100'
          and ig.VALIDATION_STATUS_CODE = '30'
          and ig.VENDOR_PARTY_ID <> 213875
          and c.CLASSIFICATION_CODE = '6444'
        order by
          ig.CREATE_DATE_TIME asc
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const productNumber = result?.recordset[0]?.PRODUCT_NBR;
        await sql.close();
        return productNumber;
    }

    public async getProductNumberWithSsLovOtherAttributeProdInfo(): Promise<string> {
        const query = `
        SELECT
          TOP 1 p.PRODUCT_NBR
        from
          pi.INTAKE_GROUP ig
        join pc.CLASSIFICATION c on
          ig.CTC_CLASSIFICATION_ID = c.CLASSIFICATION_ID
        join pc.PRODUCT p on
          ig.PRODUCT_ITEM_ID = p.PRODUCT_ITEM_ID
        where
          ig.INTAKE_GROUP_STATUS_CODE = '100'
          and ig.VALIDATION_STATUS_CODE = '30'
          and ig.VENDOR_PARTY_ID <> 213875
          and c.CLASSIFICATION_CODE = '5725'
        order by
          ig.CREATE_DATE_TIME asc
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const productNumber = result?.recordset[0]?.PRODUCT_NBR;
        await sql.close();
        return productNumber;
    }

    public async getProductNumberWithMsLovOtherAttributeBA(): Promise<string> {
        const query = `
        SELECT
          TOP 1 ig.INTAKE_GROUP_ID, ig.VENDOR_PRODUCT_NAME
        from
          pi.INTAKE_GROUP ig
        join pc.CLASSIFICATION c on
          ig.CTC_CLASSIFICATION_ID = c.CLASSIFICATION_ID
        where
          ig.INTAKE_GROUP_STATUS_CODE = '50'
          and ig.VALIDATION_STATUS_CODE = '10'
          and ig.VENDOR_PARTY_ID <> 213875
          and c.CLASSIFICATION_CODE = '6444'
        order by
          ig.CREATE_DATE_TIME desc
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const productName = result?.recordset[0]?.VENDOR_PRODUCT_NAME;
        await sql.close();
        return productName;
    }

    public async getProductNumberWithSsLovOtherAttributeBA(): Promise<string> {
        const query = `
        SELECT
          TOP 1 ig.INTAKE_GROUP_ID, ig.VENDOR_PRODUCT_NAME
        from
          pi.INTAKE_GROUP ig
        join pc.CLASSIFICATION c on
          ig.CTC_CLASSIFICATION_ID = c.CLASSIFICATION_ID
        where
          ig.INTAKE_GROUP_STATUS_CODE = '50'
          and ig.VALIDATION_STATUS_CODE = '10'
          and ig.VENDOR_PARTY_ID <> 213875
          and c.CLASSIFICATION_CODE = '5725'
          and ig.VENDOR_PRODUCT_NAME like '%Other Text Edit SS%'
        order by
          ig.CREATE_DATE_TIME desc
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const productName = result?.recordset[0]?.VENDOR_PRODUCT_NAME;
        await sql.close();
        return productName;
    }

    public async getProductNumberAssignedToSomeoneElse(): Promise<string> {
        const query = `
          select top 1 p.PRODUCT_NBR
          from pi.INTAKE_GROUP ig 
          join pc.PRODUCT p on p.PRODUCT_ITEM_ID = ig.PRODUCT_ITEM_ID
          where ig.VALIDATOR_PERSON_PARTY_ID <> '30019'
            and ig.VENDOR_PRODUCT_NAME not like 'AUT_%'
            and ig.VALIDATOR_PERSON_PARTY_ID is not null
            and ig.VALIDATION_STATUS_CODE = 20
          order by ig.LAST_UPDATE_DATE_TIME desc
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const productNumber = result?.recordset[0]?.PRODUCT_NBR;
        await sql.close();
        return productNumber;
    }

    public async getGtinVendorStatusDesc(gtins: string[]): Promise<string> {
        const query = `
          SELECT i.gtin, g.gtin_vendor_status_desc 
          FROM pi.APPRV_GTIN_VENDOR i 
            INNER JOIN pi.GTIN_VENDOR_STATUS_TYPE g 
            ON i.gtin_vendor_status_code = g.gtin_vendor_status_code 
          WHERE GTIN IN (${SqlConnection.arrayToQuotedList(gtins)})
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const statusDesc: string = result?.recordset[0]?.gtin_vendor_status_desc;
        await sql.close();
        return statusDesc;
    }

    public async getValidatedProductNumberWithNewGtin(): Promise<string> {
        const query = `
        select p.PRODUCT_NBR
        from pi.INTAKE_GROUP ig 
          inner join pc.PRODUCT p on  p.PRODUCT_ITEM_ID = ig.PRODUCT_ITEM_ID 
          inner join (
              select inner_cgv.INTAKE_GROUP_ID from pi.INTAKE_GROUP inner_ig
              inner join pi.curr_gtin_vendor inner_cgv on inner_cgv.INTAKE_GROUP_ID = inner_ig.INTAKE_GROUP_ID
              inner join pi.GTIN_VENDOR_STATUS_TYPE status on status.GTIN_VENDOR_STATUS_CODE = inner_cgv.GTIN_VENDOR_STATUS_CODE
              where status.GTIN_VENDOR_STATUS_DESC= 'Completed' ) 
              inner_select on inner_select.INTAKE_GROUP_ID = ig.INTAKE_GROUP_ID
          inner join pi.intake_group_status_type i_status on i_status.INTAKE_GROUP_STATUS_CODE =ig.INTAKE_GROUP_STATUS_CODE
          inner join pi.VALIDATION_STATUS_TYPE v_status on v_status.VALIDATION_STATUS_CODE = ig.VALIDATION_STATUS_CODE
        WHERE v_status.VALIDATION_STATUS_DESC in ('In-Progress','Rejected' , 'Resubmitted to Validator')
        and i_status.INTAKE_GROUP_STATUS_DESC in ('Buyer Approved')
        group by p.PRODUCT_NBR
      `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const productNumber = result?.recordset[0]?.PRODUCT_NBR;
        await sql.close();
        return productNumber;
    }

    /**
     * Gets a product with one GTIN from the database and returns the product name and GTIN
     *
     * @param row the index of the product to get (i.e. 5 would return the 5th GTIN), defaults to 1
     */

    public async getProductWithOneGtinSubmittedForBuyerApproval(vendorPartyId: string, row?: number): Promise<{ PRODUCT_NAME: string; GTIN: string }> {
        let index = 1;
        if (row && row > 0) index = row;

        const query = `
        SELECT TOP ${index} c.GTIN, g.VENDOR_PRODUCT_NAME
        FROM pi.intake_group g
        JOIN pi.intake_group_status_type t 
        ON g.intake_group_status_code = t.intake_group_status_code
        JOIN pi.curr_gtin_vendor c 
        ON c.intake_group_id = g.intake_group_id
        WHERE t.intake_group_status_desc = 'Submitted for Buyer Approval'
        AND g.group_accepted_ind = 'Y'
        AND g.vendor_party_id = '${vendorPartyId}'
        AND c.INTAKE_GROUP_ID in (
        select INTAKE_GROUP_ID from pi.CURR_GTIN_VENDOR
        group by INTAKE_GROUP_ID
        having COUNT(GTIN) = 1
        )
        ORDER BY g.create_date_time DESC
      `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const productName: string = result?.recordset[index - 1]?.VENDOR_PRODUCT_NAME;
        const gtin: string = result?.recordset[index - 1]?.GTIN;
        await sql.close();
        return { PRODUCT_NAME: productName, GTIN: gtin };
    }

    public async getProductNameByVendorAndStatus(vendorPartyId: string, intakeGroupStatus: string, validationStatus: string | undefined, row?: number): Promise<string> {
        let index = 1;
        if (row && row > 0) index = row;

        let query = `
        SELECT TOP ${index} g.VENDOR_PRODUCT_NAME
        FROM pi.intake_group g
        WHERE g.intake_group_status_code = '${intakeGroupStatus}'`;

        if (validationStatus) {
            query += ` AND g.validation_status_code = '${validationStatus}' `;
        }

        query += `
        AND g.group_accepted_ind = 'Y'
        AND g.vendor_party_id = '${vendorPartyId}'
        ORDER BY g.create_date_time DESC
      `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const productName: string = result?.recordset[index - 1]?.VENDOR_PRODUCT_NAME;
        await sql.close();
        return productName;
    }
    public async getProductSubmittedForBuyerApproval(vendorPartyId: string, row?: number): Promise<string> {
        return this.getProductNameByVendorAndStatus(vendorPartyId, '50', '10', row);
    }

    public async getProductWithnewlyaddedGtinSubmittedForBuyerApproval(vendorPartyId: string, row?: number): Promise<string> {
        const query = `
          SELECT TOP 5
            ig.VENDOR_PRODUCT_NAME
          from
            pi.INTAKE_GROUP ig
          join pi.APPRV_GTIN_VENDOR agv on
            ig.INTAKE_GROUP_ID = agv.INTAKE_GROUP_ID
          join pi.GTIN_VENDOR_STATUS_TYPE gvst on
            gvst.GTIN_VENDOR_STATUS_CODE = agv.GTIN_VENDOR_STATUS_CODE
          where
            ig.INTAKE_GROUP_STATUS_CODE IN ('50', '51')
            and ig.VENDOR_PARTY_ID = ${vendorPartyId}
            and ig.INTAKE_GROUP_ID in (
            SELECT
              INTAKE_GROUP_ID
            from
              pi.APPRV_GTIN_VENDOR
            where
              GTIN_VENDOR_STATUS_CODE = '40'
            group by
              INTAKE_GROUP_ID)
          order by ig.CREATE_DATE_TIME DESC;
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const productName: string = result?.recordset[0]?.VENDOR_PRODUCT_NAME;
        await sql.close();
        return productName;
    }

    public async getBuyerApprovedProductName(): Promise<string> {
        const query = `
          select p.PRODUCT_NBR, 
          ig.VENDOR_PRODUCT_NAME 
          from pi.INTAKE_GROUP ig 
            join pc.PRODUCT p 
            on p.PRODUCT_ITEM_ID = ig.PRODUCT_ITEM_ID 
          where ig.INTAKE_GROUP_STATUS_CODE = 100 
          order by p.CREATE_DATE_TIME DESC
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const productName: string = result?.recordset[1]?.VENDOR_PRODUCT_NAME;
        await sql.close();
        return productName;
    }
    public async getProductGtinsPiA(vendorProductName: string): Promise<VendorGtin[]> {
        const query = `
          select GTIN,GTIN_VENDOR_STATUS_CODE from pi.APPRV_GTIN_VENDOR 
          where INTAKE_GROUP_ID in (
          select INTAKE_GROUP_ID 
          from pi.INTAKE_GROUP
          where VENDOR_PRODUCT_NAME = '${vendorProductName}' 
          and VENDOR_PARTY_ID = ${ENV_PROPERTIES.vendorPartyID})
      `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        let gtins: VendorGtin[] = [];
        for (let i = 0; i < result.recordset.length; i++) {
            gtins.push({ GTIN: result?.recordset[i]?.GTIN, GTIN_STATUS_CODE: result?.recordset[i]?.GTIN_VENDOR_STATUS_CODE });
        }
        await sql.close();
        return gtins;
    }

    public async getValidationStatusCodeByProductNumber(productNumber: string): Promise<string> {
        const query = `
          select ig.VALIDATION_STATUS_CODE
          from pi.INTAKE_GROUP ig 
            join pc.PRODUCT p on p.PRODUCT_ITEM_ID = ig.PRODUCT_ITEM_ID 
          where p.PRODUCT_NBR = '${productNumber}'
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const validationStatusCode: string = result?.recordset[0]?.VALIDATION_STATUS_CODE;
        await sql.close();
        return validationStatusCode;
    }

    public async getValidationStatusCodesByProductNumbers(productNumbers: string[]): Promise<string[]> {
        const query = `
          select ig.VALIDATION_STATUS_CODE
          from pi.INTAKE_GROUP ig 
            join pc.PRODUCT p on p.PRODUCT_ITEM_ID = ig.PRODUCT_ITEM_ID 
          where p.PRODUCT_NBR in (${SqlConnection.arrayToQuotedList(productNumbers)})
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        let validationStatusCodes: string[] = [];
        for (let i = 0; i < result?.recordset.length; i++) {
            validationStatusCodes.push(result?.recordset[i]?.VALIDATION_STATUS_CODE);
        }
        await sql.close();
        return validationStatusCodes;
    }

    public async getItemStatusDescByProductNumber(productNumber: string): Promise<string> {
        const query = `
          select p.PRODUCT_NBR, t.ITEM_STATUS_DESC 
          from pc.PRODUCT p 
            join pc.ITEM i on i.ITEM_ID = p.PRODUCT_ITEM_ID 
            join pc.ITEM_STATUS_TYPE t on i.ITEM_STATUS_CODE = t.ITEM_STATUS_CODE 
          where p.PRODUCT_NBR = '${productNumber}'
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const status = result?.recordset[0]?.ITEM_STATUS_DESC;
        await sql.close();
        return status;
    }

    public async getDDCClass(classCode: string): Promise<{ DESC: string; ACTIVE_IND: string }> {
        const query = `
        select CLASS_TEXT, ACTIVE_IND 
        from pc.LEGACY_DDC_CLASS 
        where CLASS_CODE = '${classCode}'
      `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const classDesc = result?.recordset[0]?.CLASS_TEXT;
        const activeInd = result?.recordset[0]?.ACTIVE_IND;
        await sql.close();
        return { DESC: classDesc, ACTIVE_IND: activeInd };
    }

    public async getLatestDDCClass(): Promise<{ CODE: string; DESC: string; ACTIVE_IND: string }> {
        const query = `
          select CLASS_CODE, CLASS_TEXT, ACTIVE_IND 
          from pc.LEGACY_DDC_CLASS 
          where CLASS_CODE = (select max(CLASS_CODE) from pc.LEGACY_DDC_CLASS)
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const classCode = result?.recordset[0]?.CLASS_CODE;
        const classDesc = result?.recordset[0]?.CLASS_TEXT;
        const activeInd = result?.recordset[0]?.ACTIVE_IND;
        await sql.close();
        return { CODE: classCode, DESC: classDesc, ACTIVE_IND: activeInd };
    }

    public async getDDCDepartment(deptCode: string): Promise<{ DESC: string; WAREHOUSE_NUMBER: string; ACTIVE_IND: string }> {
        const query = `
          SELECT DEPARTMENT_TEXT, DEPARTMENT_OVERRIDE_WHSE_NBR, ACTIVE_IND 
          FROM pc.LEGACY_DDC_DEPARTMENT 
          WHERE DEPARTMENT_CODE = '${deptCode}'
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const deptDesc = result?.recordset[0]?.DEPARTMENT_TEXT;
        const warehouseNum = result?.recordset[0]?.DEPARTMENT_OVERRIDE_WHSE_NBR;
        const activeInd = result?.recordset[0]?.ACTIVE_IND;
        await sql.close();
        return { DESC: deptDesc, WAREHOUSE_NUMBER: warehouseNum, ACTIVE_IND: activeInd };
    }

    public async getDDCDivision(divisionCode: string): Promise<{ DESC: string; ACTIVE_IND: string }> {
        const query = `
          select DIVISION_TEXT, ACTIVE_IND 
          from pc.LEGACY_DDC_DIVISION 
          where DIVISION_CODE = '${divisionCode}'
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const divDesc = result?.recordset[0]?.DIVISION_TEXT;
        const activeInd = result?.recordset[0]?.ACTIVE_IND;
        await sql.close();
        return { DESC: divDesc, ACTIVE_IND: activeInd };
    }

    public async getDDCMerchClass(
        classCode: string,
        deptCode: string,
        divisionCode: string
    ): Promise<{
        MERCH_OVERRIDE_IND: string;
        EMPLOYEE_DISCOUNT_PCT_AMT: string;
        MLSH_CODE: string;
        TAX_CODE: string;
        PRIMARY_FCC_CLASS_CODE: string;
        SUB_FCC_CLASS_CODE: string;
        ACTIVE_IND: string;
    }> {
        const query = `
          select MERCH_OVERRIDE_IND, 
                 EMPLOYEE_DISCOUNT_PCT_AMT, 
                 MLSH_CODE, 
                 TAX_CODE,
                 PRIMARY_FCC_CLASS_CODE,
                 SUB_FCC_CLASS_CODE,
                 ACTIVE_IND 
          from pc.LEGACY_DDC_MERCH_CLASS 
          where CLASS_CODE = '${classCode}'
            and DEPARTMENT_CODE = '${deptCode}' 
            and DIVISION_CODE = '${divisionCode}'
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const merchOverrideInd = result?.recordset[0]?.MERCH_OVERRIDE_IND;
        const employeeDiscountPctAmt = result?.recordset[0]?.EMPLOYEE_DISCOUNT_PCT_AMT;
        const mlshCode = result?.recordset[0]?.MLSH_CODE;
        const taxCode = result?.recordset[0]?.TAX_CODE;
        const primaryFccClassCode = result?.recordset[0]?.PRIMARY_FCC_CLASS_CODE;
        const subFccClassCode = result?.recordset[0]?.SUB_FCC_CLASS_CODE;
        const activeInd = result?.recordset[0]?.ACTIVE_IND;
        await sql.close();
        return {
            MERCH_OVERRIDE_IND: merchOverrideInd,
            EMPLOYEE_DISCOUNT_PCT_AMT: employeeDiscountPctAmt,
            MLSH_CODE: mlshCode,
            TAX_CODE: taxCode,
            PRIMARY_FCC_CLASS_CODE: primaryFccClassCode,
            SUB_FCC_CLASS_CODE: subFccClassCode,
            ACTIVE_IND: activeInd
        };
    }

    public async getFccClass(primaryFccCode: string, subFccCode: string): Promise<{ PRIMARY_FCC_CLASS_DESC: string; SUB_FCC_CLASS_DESC: string; ACTIVE_IND: string }> {
        const query = `
          select PRIMARY_FCC_CLASS_DESC,
                 SUB_FCC_CLASS_DESC,
                 ACTIVE_IND 
          from pc.LEGACY_FINANCIAL_COMMODITY_CLS 
          where PRIMARY_FCC_CLASS_CODE = '${primaryFccCode}' 
            and SUB_FCC_CLASS_CODE = '${subFccCode}'
        `;
        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        var primaryFccDesc = result?.recordset[0]?.PRIMARY_FCC_CLASS_DESC;
        var subFccDesc = result?.recordset[0]?.SUB_FCC_CLASS_DESC;
        var activeInd = result?.recordset[0]?.ACTIVE_IND;
        await sql.close();
        return { PRIMARY_FCC_CLASS_DESC: primaryFccDesc, SUB_FCC_CLASS_DESC: subFccDesc, ACTIVE_IND: activeInd };
    }

    public async getCompanyInfo(companyCode: string): Promise<{ DESC: string; ACTIVE_IND: string }> {
        const query = `
          select CONSIGNMENT_DESC, ACTIVE_IND 
          from pc.LEGACY_CONSIGNMENT 
          where CONSIGNMENT_CODE = '${companyCode}'
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const desc = result?.recordset[0]?.CONSIGNMENT_DESC;
        const activeInd = result?.recordset[0]?.ACTIVE_IND;
        await sql.close();
        return { DESC: desc, ACTIVE_IND: activeInd };
    }

    public async getItemTypeInfo(
        companyCode: string,
        merchAccountingCode: string,
        firstCharSknCode: string
    ): Promise<{
        SKN_TYPE_CODE: string;
        SKN_TYPE_DESC: string;
        SKN_SIZE_REQUIRED_IND: string;
    }> {
        const query = `
          select SKN_TYPE_CODE,
                 SKN_TYPE_DESC,
                 SKN_SIZE_REQUIRED_IND 
          from pc.LEGACY_ITEM_TYPE 
          where COMPANY_CODE = '${companyCode}'
            and MERCH_ACCOUNTING_CODE = '${merchAccountingCode}'
		        and FIRST_CHARACTER_SKN_CODE = '${firstCharSknCode}'
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const sknTypeCode = result?.recordset[0]?.SKN_TYPE_CODE;
        const sknTypeDesc = result?.recordset[0]?.SKN_TYPE_DESC;
        const requiredInd = result?.recordset[0]?.SKN_SIZE_REQUIRED_IND;
        await sql.close();
        return {
            SKN_TYPE_CODE: sknTypeCode,
            SKN_TYPE_DESC: sknTypeDesc,
            SKN_SIZE_REQUIRED_IND: requiredInd
        };
    }

    public async getBuyingOffice(
        buyingOfficeCode: string
    ): Promise<{
        BUYING_OFFICE_ID: string;
        PARENT_BUYING_OFFICE_ID: string;
        BUYING_OFFICE_DESC: string;
        BUYING_OFFICE_LEVEL_CODE: string;
        ACTIVE_IND: string;
        LCD_APPROVER_IND: string;
        SALES_DIV_CODE: string;
    }> {
        const query = `
          select bo.BUYING_OFFICE_ID,
                 bo.PARENT_BUYING_OFFICE_ID,
                 bo.BUYING_OFFICE_DESC,
                 bo.BUYING_OFFICE_LEVEL_CODE,
                 bo.ACTIVE_IND,
                 bo.LCD_APPROVER_IND,
                 sd.SALES_DIV_CODE
          from pc.BUYING_OFFICE bo
            left join pc.LEGACY_BUYING_OFFICE_SALES_DIV sd 
                      on sd.BUYING_OFFICE_ID = bo.BUYING_OFFICE_ID
          where bo.BUYING_OFFICE_CODE = '${buyingOfficeCode}'
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const buyingOfficeId = result?.recordset[0]?.BUYING_OFFICE_ID;
        const buyingOfficeDesc = result?.recordset[0]?.BUYING_OFFICE_DESC;
        const buyingOfficeLevel = result?.recordset[0]?.BUYING_OFFICE_LEVEL_CODE;
        const activeInd = result?.recordset[0]?.ACTIVE_IND;
        const salesDivCode = result?.recordset[0]?.SALES_DIV_CODE;
        const parentId = result?.recordset[0]?.PARENT_BUYING_OFFICE_ID;
        const lcdInd = result?.recordset[0]?.LCD_APPROVER_IND;
        await sql.close();
        return {
            BUYING_OFFICE_ID: buyingOfficeId,
            BUYING_OFFICE_DESC: buyingOfficeDesc,
            BUYING_OFFICE_LEVEL_CODE: buyingOfficeLevel,
            ACTIVE_IND: activeInd,
            SALES_DIV_CODE: salesDivCode,
            PARENT_BUYING_OFFICE_ID: parentId,
            LCD_APPROVER_IND: lcdInd
        };
    }

    public async getBuyingOfficeParent(
        buyingOfficeCode: string
    ): Promise<{
        BUYING_OFFICE_ID: string;
        BUYING_OFFICE_CODE: string;
        PARENT_BUYING_OFFICE_ID: string;
        BUYING_OFFICE_DESC: string;
        BUYING_OFFICE_LEVEL_CODE: string;
        ACTIVE_IND: string;
        LCD_APPROVER_IND: string;
        SALES_DIV_CODE: string;
    }> {
        const query = `
          select bo.BUYING_OFFICE_ID,
                 bo.PARENT_BUYING_OFFICE_ID,
                 bo.BUYING_OFFICE_CODE,
                 bo.BUYING_OFFICE_DESC,
                 bo.BUYING_OFFICE_LEVEL_CODE,
                 bo.ACTIVE_IND,
                 bo.LCD_APPROVER_IND,
                 sd.SALES_DIV_CODE
          from pc.BUYING_OFFICE bo
            left join pc.LEGACY_BUYING_OFFICE_SALES_DIV sd 
                      on sd.BUYING_OFFICE_ID = bo.BUYING_OFFICE_ID
          where bo.BUYING_OFFICE_ID in (
            select PARENT_BUYING_OFFICE_ID 
            from pc.BUYING_OFFICE 
            where BUYING_OFFICE_CODE = '${buyingOfficeCode}'
          )
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const buyingOfficeId = result?.recordset[0]?.BUYING_OFFICE_ID;
        const parentBuyingOfficeCode = result?.recordset[0]?.BUYING_OFFICE_CODE;
        const buyingOfficeDesc = result?.recordset[0]?.BUYING_OFFICE_DESC;
        const buyingOfficeLevel = result?.recordset[0]?.BUYING_OFFICE_LEVEL_CODE;
        const activeInd = result?.recordset[0]?.ACTIVE_IND;
        const salesDivCode = result?.recordset[0]?.SALES_DIV_CODE;
        const parentId = result?.recordset[0]?.PARENT_BUYING_OFFICE_ID;
        const lcdInd = result?.recordset[0]?.LCD_APPROVER_IND;
        await sql.close();
        return {
            BUYING_OFFICE_ID: buyingOfficeId,
            BUYING_OFFICE_CODE: parentBuyingOfficeCode,
            BUYING_OFFICE_DESC: buyingOfficeDesc,
            BUYING_OFFICE_LEVEL_CODE: buyingOfficeLevel,
            ACTIVE_IND: activeInd,
            SALES_DIV_CODE: salesDivCode,
            PARENT_BUYING_OFFICE_ID: parentId,
            LCD_APPROVER_IND: lcdInd
        };
    }

    public async getSeason(seasonCode: string): Promise<{ YEAR_NBR: string; ACTIVE_IND: string; SEASON_TEXT: string }> {
        const query = `
          select s.YEAR_NBR,
                 s.ACTIVE_IND,
	               sl.SEASON_TEXT
          from pc.SEASON s
            join pc.SEASON_LANGUAGE sl on s.SEASON_ID = sl.SEASON_ID
          where s.SEASON_CODE = '${seasonCode}'
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const seasonYear = result?.recordset[0]?.YEAR_NBR;
        const activeInd = result?.recordset[0]?.ACTIVE_IND;
        const seasonText = result?.recordset[0]?.SEASON_TEXT;
        await sql.close();
        return { YEAR_NBR: seasonYear, ACTIVE_IND: activeInd, SEASON_TEXT: seasonText };
    }

    public async getTraitValue(
        traitCode: string
    ): Promise<{
        LEGACY_SHORT_TRAIT_VALUE_TEXT: string;
        TRAIT_VALUE_TEXT: string;
        TRAIT_GROUP_TYPE_CODE: string;
        TRAIT_TYPE_TEXT: string;
        ACTIVE_IND: string;
        OPERATIONAL_COUNTRY_CODE: string;
        AUX_IND: string;
        LEGACY_IND: string;
    }> {
        const query = `  
          select tvt.LEGACY_SHORT_TRAIT_VALUE_TEXT,
                 tvt.TRAIT_VALUE_TEXT,
                 tt.TRAIT_GROUP_TYPE_CODE,
                 ttt.TRAIT_TYPE_TEXT,
                 tv.ACTIVE_IND,
                 tt.OPERATIONAL_COUNTRY_CODE,
                 tv.AUX_IND,
                 tt.LEGACY_IND
          from pc.TRAIT_VALUE_TEXT tvt
          join pc.TRAIT_VALUE tv on tvt.TRAIT_VALUE_ID = tv.TRAIT_VALUE_ID
          join pc.TRAIT_TYPE tt on tt.TRAIT_TYPE_ID = tv.TRAIT_TYPE_ID
          join pc.TRAIT_TYPE_TEXT ttt on tt.TRAIT_TYPE_ID = ttt.TRAIT_TYPE_ID
          where tv.TRAIT_VALUE_CODE = '${traitCode}'
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const traitLegacyShortText = result?.recordset[0]?.LEGACY_SHORT_TRAIT_VALUE_TEXT;
        const traitValueText = result?.recordset[0]?.TRAIT_VALUE_TEXT;
        const traitGroupTypeCode = result?.recordset[0]?.TRAIT_GROUP_TYPE_CODE;
        const traitTypeText = result?.recordset[0]?.TRAIT_TYPE_TEXT;
        const activeInd = result?.recordset[0]?.ACTIVE_IND;
        const operationalCountryCode = result?.recordset[0]?.OPERATIONAL_COUNTRY_CODE;
        const auxInd = result?.recordset[0]?.AUX_IND;
        const legacyInd = result?.recordset[0]?.LEGACY_IND;
        await sql.close();
        return {
            LEGACY_SHORT_TRAIT_VALUE_TEXT: traitLegacyShortText,
            TRAIT_VALUE_TEXT: traitValueText,
            TRAIT_GROUP_TYPE_CODE: traitGroupTypeCode,
            TRAIT_TYPE_TEXT: traitTypeText,
            ACTIVE_IND: activeInd,
            OPERATIONAL_COUNTRY_CODE: operationalCountryCode,
            AUX_IND: auxInd,
            LEGACY_IND: legacyInd
        };
    }

    public async getProductAttributes(productNumber: string, attributes: string[]): Promise<Map<string, string>> {
        const query = `
          select sa.ATTRIBUTE_TECHNICAL_NAME, 
                 sa.ATTRIBUTE_VALUE_TEXT 
          from pc.PRODUCT p 
          join pc.ITEM_RELATIONSHIP ir on p.PRODUCT_ITEM_ID = ir.PARENT_ITEM_ID 
          join pc.SKU sku on sku.SKU_ITEM_ID = ir.CHILD_ITEM_ID 
          join pc.SKU_VENDOR sv on sv.SKU_ITEM_ID = sku.SKU_ITEM_ID 
          join pc.SKU_VENDOR_GRP_INST si on si.SKU_ITEM_ID = sv.SKU_ITEM_ID 
          join pc.SKU_VENDOR_ATTRIBUTE sa on sa.ATTRIBUTE_GROUP_INSTANCE_ID = si.ATTRIBUTE_GROUP_INSTANCE_ID 
          where p.PRODUCT_NBR = '${productNumber}' 
          and sa.ATTRIBUTE_TECHNICAL_NAME in (${SqlConnection.arrayToQuotedList(attributes)})
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        let attributeMap = new Map<string, string>();
        for (let i = 0; i < result?.recordset.length; i++) {
            const techName: string = result?.recordset[i]?.ATTRIBUTE_TECHNICAL_NAME;
            const value: string = result?.recordset[i]?.ATTRIBUTE_VALUE_TEXT;
            if (attributeMap.has(techName)) {
                attributeMap.set(techName, `${attributeMap.get(techName)}, ${value}`);
            } else {
                attributeMap.set(techName, value);
            }
        }
        await sql.close();
        return attributeMap;
    }

    public async getGtinAttributes(gtin: string, attributes: string[]): Promise<Map<string, string>> {
        const query = `
        select ATTRIBUTE_TECHNICAL_NAME,
               ATTRIBUTE_VALUE_TEXT
        from pi.APPRV_GTIN_VENDOR_ATTRIBUTE agva
        join pi.APPRV_GTIN_VENDOR_GRP_INST agvgi on agvgi.ATTRIBUTE_GROUP_INSTANCE_ID = agva.ATTRIBUTE_GROUP_INSTANCE_ID
        where ATTRIBUTE_TECHNICAL_NAME in (${SqlConnection.arrayToQuotedList(attributes)})
          and agvgi.GTIN = '${gtin}'
      `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        let attributeMap = new Map<string, string>();
        for (let i = 0; i < result?.recordset.length; i++) {
            const techName: string = result?.recordset[i]?.ATTRIBUTE_TECHNICAL_NAME;
            const value: string = result?.recordset[i]?.ATTRIBUTE_VALUE_TEXT;
            attributeMap.set(techName, value);
        }
        await sql.close();
        return attributeMap;
    }

    public async getLongDescription(productNumber: string): Promise<string> {
        const query = `
          select DESCRIPTION_TEXT
          from pc.ITEM_DESCRIPTION_LANG idl
          join pc.PRODUCT p on idl.ITEM_ID = p.PRODUCT_ITEM_ID
          where p.PRODUCT_NBR = '${productNumber}'
          and idl.ITEM_DESCRIPTION_TYPE_CODE = 'LDAI'
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const longDesc = result?.recordset[0]?.DESCRIPTION_TEXT;
        await sql.close();
        return longDesc;
    }

    public async getShortDescription(productNumber: string): Promise<string> {
        const query = `
          select DESCRIPTION_TEXT
          from pc.ITEM_DESCRIPTION_LANG idl
          join pc.PRODUCT p on idl.ITEM_ID = p.PRODUCT_ITEM_ID
          where p.PRODUCT_NBR = '${productNumber}'
          and idl.ITEM_DESCRIPTION_TYPE_CODE = 'SDSC'
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const shortDesc = result?.recordset[0]?.DESCRIPTION_TEXT;
        await sql.close();
        return shortDesc;
    }

    public async getProductItemStatus(productNumber: string): Promise<string> {
        const query = `
          select ips.PROCESS_STATUS_CODE 
          from pc.ITEM_PROCESS_STATUS ips
          join pc.PRODUCT p on p.PRODUCT_ITEM_ID = ips.ITEM_ID
          where p.PRODUCT_NBR = '${productNumber}'
        `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const status = result?.recordset[0]?.PROCESS_STATUS_CODE;
        await sql.close();
        return status;
    }

    public async unassignValidator(intakeGroupId: string): Promise<void> {
        const query = `
          update pi.INTAKE_GROUP 
          set VALIDATOR_PERSON_PARTY_ID = NULL 
          where INTAKE_GROUP_ID = '${intakeGroupId}
        `;
        const sql = await this.connPool.connect();
        await sql.query(query);
        await sql.close();
    }

    public async getSubmittedForBuyerApprovalProduct(ctcClassifications?: string[]): Promise<string> {
        return await this.getProductByGtinStatuses(0, 0, 'gt0', 0, 0, 0, 50, 10, ctcClassifications);
    }

    public async getValidationCompletedProductWithNewGtins(): Promise<string> {
        return await this.getProductByGtinStatuses(0, 0, 'gt0', 0, 0, 'gt0', 50, 10);
    }
    public async getNewProduct(ctcClassifications?: string[]): Promise<string> {
        return await this.getProductByGtinStatuses(0, 0, 'gt0', 0, 0, 0, 10, 10, ctcClassifications);
    }

    public async getNewProductWithOneGtin(): Promise<string> {
        return await this.getProductByGtinStatuses(0, 0, 1, 0, 0, 0, 10, 10);
    }

    public async getBuyerRejectedProduct(): Promise<string> {
        return await this.getProductByGtinStatuses(0, 0, 0, 0, 'gt0', 0, 102, 10);
    }

    public async getBuyerResubmittedProduct(): Promise<string> {
        return await this.getProductByGtinStatuses(0, 0, 0, 0, 'gt0', 0, 51, 10);
    }

    public async getBuyerApprovedProduct(): Promise<string> {
        return await this.getProductByGtinStatuses(0, 0, 0, 'gt0', 0, 0, 100, 10);
    }

    public async getReclassificationProcessingProduct(): Promise<string> {
        return await this.getProductByGtinStatuses(0, 0, 0, 'gt0', 0, 0, 1000);
    }

    public async getReclassificationFailedProduct(): Promise<string> {
        return await this.getProductByGtinStatuses(0, 0, 0, 'gt0', 0, 0, 1005);
    }

    public async getValidationInProgressProduct(): Promise<string> {
        return await this.getProductByGtinStatuses(0, 0, 0, 'gt0', 0, 0, 100, 20);
    }

    public async getClassificationRejectedProduct(): Promise<string> {
        return await this.getProductByGtinStatuses(0, 0, 0, 'gt0', 0, 0, 100, 22);
    }

    public async getValidationRejectedProduct(): Promise<string> {
        return await this.getProductByGtinStatuses(0, 0, 0, 'gt0', 0, 0, 100, 25);
    }

    public async getValidationResubmittedProduct(): Promise<string> {
        return await this.getProductByGtinStatuses(0, 0, 0, 'gt0', 0, 0, 100, 27);
    }

    public async getValidationCompletedProduct(): Promise<string> {
        return await this.getProductByGtinStatuses(0, 0, 0, 0, 0, 'gt0', 100, 30);
    }

    public async getNewProductWithNewGtins(): Promise<string> {
        return await this.getProductByGtinStatuses(0, 0, 'gt0', 0, 0, 'gt0', 10, 10);
    }

    public async getBuyerRejectedProductWithNewGtins(): Promise<string> {
        return await this.getProductByGtinStatuses(0, 0, 0, 0, 'gt0', 'gt0', 102, 10);
    }

    public async getValidationRejectedProductWithNewGtins(): Promise<string> {
        return await this.getProductByGtinStatuses(0, 0, 0, 'gt0', 0, 'gt0', 100, 25);
    }

    public async getProductByGtinStatuses(
        processingGtinCount: GtinStatusCount,
        failedGtinCount: GtinStatusCount,
        newGtinCount: GtinStatusCount,
        acceptedGtinCount: GtinStatusCount,
        rejectedGtinCount: GtinStatusCount,
        completedGtinCount: GtinStatusCount,
        intakeGroupStatusCode?: IntakeGroupStatusCode,
        validationStatusCode?: ValidationStatusCode,
        ctcClassifications?: string[]
    ): Promise<string> {
        const query = `
          select
              INTAKE_GROUP_ID,
              CREATE_DATE_TIME,
              VENDOR_PRODUCT_NAME,
              PROCESSING_GTIN_COUNT,
              FAILED_GTIN_COUNT,
              NEW_GTIN_COUNT,
              ACCEPTED_GTIN_COUNT,
              REJECTED_GTIN_COUNT,
              COMPLETED_GTIN_COUNT
          from 
              (
              select 
                  ig.INTAKE_GROUP_ID,
                  ig.VENDOR_PRODUCT_NAME,
                  ig.CREATE_DATE_TIME,
                  sum(
                      case when cgv.GTIN_VENDOR_STATUS_CODE = '05' then 1 else 0 end
                  ) PROCESSING_GTIN_COUNT,
                  sum(
                      case when cgv.GTIN_VENDOR_STATUS_CODE = '07' then 1 else 0 end
                  ) FAILED_GTIN_COUNT ,
                  sum(
                      case when cgv.GTIN_VENDOR_STATUS_CODE = '10' then 1 else 0 end
                  ) NEW_GTIN_COUNT,
                  sum(
                      case when cgv.GTIN_VENDOR_STATUS_CODE = '20' then 1 else 0 end
                  ) ACCEPTED_GTIN_COUNT,
                  sum(
                      case when cgv.GTIN_VENDOR_STATUS_CODE = '30' then 1 else 0 end
                  ) REJECTED_GTIN_COUNT,
                  sum(
                      case when cgv.GTIN_VENDOR_STATUS_CODE = '40' then 1 else 0 end
                  ) COMPLETED_GTIN_COUNT
              FROM 
                  pi.INTAKE_GROUP ig 
                  join pi.CURR_GTIN_VENDOR cgv on ig.INTAKE_GROUP_ID = cgv.INTAKE_GROUP_ID 
                  join pc.CLASSIFICATION_LANGUAGE cl on cl.CLASSIFICATION_ID = ig.CTC_CLASSIFICATION_ID
              where 
                  ig.VENDOR_PARTY_ID = ${ENV_PROPERTIES.vendorPartyID}
                  ${intakeGroupStatusCode ? 'and ig.INTAKE_GROUP_STATUS_CODE = ' + intakeGroupStatusCode : ''}
                  ${validationStatusCode ? 'and ig.VALIDATION_STATUS_CODE = ' + validationStatusCode : ''}
                  ${ctcClassifications && ctcClassifications.length > 0 ? 'and cl.CLASSIFICATION_NAME  in (' + SqlConnection.arrayToQuotedList(ctcClassifications) + ')' : ''}
                  ${acceptedGtinCount === 0 && completedGtinCount === 0 ? 'and ig.PRODUCT_ITEM_ID is NULL' : ''}
              group by 
                  ig.INTAKE_GROUP_ID, ig.VENDOR_PRODUCT_NAME, ig.CREATE_DATE_TIME
              ) as t 
          where 
              PROCESSING_GTIN_COUNT ${this.convertGtinStatusCountToSql(processingGtinCount)} AND
              FAILED_GTIN_COUNT ${this.convertGtinStatusCountToSql(failedGtinCount)} AND
              NEW_GTIN_COUNT ${this.convertGtinStatusCountToSql(newGtinCount)} AND
              ACCEPTED_GTIN_COUNT ${this.convertGtinStatusCountToSql(acceptedGtinCount)} AND
              REJECTED_GTIN_COUNT ${this.convertGtinStatusCountToSql(rejectedGtinCount)} AND
              COMPLETED_GTIN_COUNT ${this.convertGtinStatusCountToSql(completedGtinCount)} 
              order by CREATE_DATE_TIME desc
      `;

        const sql = await this.connPool.connect();
        const result = await sql.query(query);
        const vendorProductName = result?.recordset[0]?.VENDOR_PRODUCT_NAME;
        await sql.close();
        return vendorProductName;
    }

    private convertGtinStatusCountToSql(count: GtinStatusCount): string {
        switch (count) {
            case 'gt0':
                return '> 0';
            case 'gt1':
                return '> 1';
            default:
                return `= ${count}`;
        }
    }

    /**
     * Converts an array of any element type to a comma-separated list of
     * the array elements with single quotes around each element
     * e.g. [1, "hello", true] -> '1','hello','true'
     */
    private static arrayToQuotedList(array: any[]): string {
        return "'" + array.join("','") + "'";
    }
}
