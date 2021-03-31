"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlConnection = void 0;
const mssql_1 = require("mssql");
const environment_1 = require("../config/environment");
const common_utils_1 = require("../util/common-utils");
const ENV = new environment_1.Environment(common_utils_1.CommonUtils.getEnvironment());
const ENV_PROPERTIES = ENV.getEnvironmentProperties();
class SqlConnection {
    constructor(dbConfig) {
        this.connPool = new mssql_1.ConnectionPool(dbConfig);
    }
    getMaxGtin() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          select top 1 GTIN 
          from pi.CURR_GTIN_VENDOR 
          where GTIN like '998%' 
          order by GTIN desc
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const gtin = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.GTIN;
            yield sql.close();
            return gtin;
        });
    }
    getIntakeStatusByGtin(gtin) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          SELECT st.intake_group_status_desc 
          FROM PI.intake_group ig 
            JOIN PI.intake_group_status_type st 
            ON ig.INTAKE_GROUP_STATUS_CODE = st.INTAKE_GROUP_STATUS_CODE 
            JOIN PI.CURR_GTIN_VENDOR gv 
            ON ig.intake_group_id = gv.intake_group_id 
          WHERE gv.GTIN = '${gtin}'
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const statusDesc = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.intake_group_status_desc;
            yield sql.close();
            return statusDesc;
        });
    }
    getIntakeStatusByProductName(Vendor_product_name) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        SELECT st.intake_group_status_desc 
        FROM PI.intake_group ig 
          JOIN PI.intake_group_status_type st 
          ON ig.INTAKE_GROUP_STATUS_CODE = st.INTAKE_GROUP_STATUS_CODE  
          WHERE ig.VENDOR_PRODUCT_NAME = '${Vendor_product_name}'
      `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const statusDesc = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.intake_group_status_desc;
            yield sql.close();
            return statusDesc;
        });
    }
    getGtinStatusByGtin(gtin) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      select v.GTIN, t.GTIN_VENDOR_STATUS_DESC from pi.APPRV_GTIN_VENDOR v
      join pi.GTIN_VENDOR_STATUS_TYPE t on v.GTIN_VENDOR_STATUS_CODE = t.GTIN_VENDOR_STATUS_CODE
      where v.GTIN = '${gtin}'
      `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const gtinstatusDesc = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.GTIN_VENDOR_STATUS_DESC;
            yield sql.close();
            return gtinstatusDesc;
        });
    }
    getProductAndSknNumberByGtin(gtin) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const productNumber = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.PRODUCT_NBR;
            const sknNumber = (_b = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _b === void 0 ? void 0 : _b.LEGACY_SKN_NBR;
            yield sql.close();
            return { PRODUCT_NBR: productNumber, SKN_NBR: sknNumber };
        });
    }
    getBuyingOfficeCode(productName) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          SELECT buying_office_code 
          FROM PI.intake_group ig 
            JOIN pc.buying_office bo 
            ON ig.buying_office_id = bo.buying_office_id 
          WHERE vendor_product_name = '${productName}'
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const buyingOfficeCode = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.buying_office_code;
            yield sql.close();
            return buyingOfficeCode;
        });
    }
    getProductNameByStatusAndRow(statusCode, row) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          with Records AS (
            select row_number() over(order by CREATE_DATE_TIME DESC) as 'row',
            * from pi.INTAKE_GROUP 
            where INTAKE_GROUP_STATUS_CODE = '${statusCode.toString()}'
          ) 
          select * from Records
          where row = ${row.toString()}
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const vendorProductName = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.VENDOR_PRODUCT_NAME;
            yield sql.close();
            return vendorProductName;
        });
    }
    getCompletedProductNumber() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          select top 1 PRODUCT_NBR 
          from pc.PRODUCT 
          where LAST_UPDATE_PROGRAM = 'PRODUCT_COMPLETE' 
          order by CREATE_DATE_TIME desc
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const productNumber = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.PRODUCT_NBR;
            yield sql.close();
            return productNumber;
        });
    }
    getProductNumberHavingMultipleGtins() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const productNumber = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.PRODUCT_NBR;
            yield sql.close();
            return productNumber;
        });
    }
    getProductNumberWithValidatorStatusInProgress() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const productNumber = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.PRODUCT_NBR;
            yield sql.close();
            return productNumber;
        });
    }
    getProductNumberWithMsLovOtherAttributeProdInfo() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const productNumber = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.PRODUCT_NBR;
            yield sql.close();
            return productNumber;
        });
    }
    getProductNumberWithSsLovOtherAttributeProdInfo() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const productNumber = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.PRODUCT_NBR;
            yield sql.close();
            return productNumber;
        });
    }
    getProductNumberWithMsLovOtherAttributeBA() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const productName = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.VENDOR_PRODUCT_NAME;
            yield sql.close();
            return productName;
        });
    }
    getProductNumberWithSsLovOtherAttributeBA() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const productName = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.VENDOR_PRODUCT_NAME;
            yield sql.close();
            return productName;
        });
    }
    getProductNumberAssignedToSomeoneElse() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const productNumber = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.PRODUCT_NBR;
            yield sql.close();
            return productNumber;
        });
    }
    getGtinVendorStatusDesc(gtins) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          SELECT i.gtin, g.gtin_vendor_status_desc 
          FROM pi.APPRV_GTIN_VENDOR i 
            INNER JOIN pi.GTIN_VENDOR_STATUS_TYPE g 
            ON i.gtin_vendor_status_code = g.gtin_vendor_status_code 
          WHERE GTIN IN (${SqlConnection.arrayToQuotedList(gtins)})
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const statusDesc = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.gtin_vendor_status_desc;
            yield sql.close();
            return statusDesc;
        });
    }
    getValidatedProductNumberWithNewGtin() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const productNumber = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.PRODUCT_NBR;
            yield sql.close();
            return productNumber;
        });
    }
    /**
     * Gets a product with one GTIN from the database and returns the product name and GTIN
     *
     * @param row the index of the product to get (i.e. 5 would return the 5th GTIN), defaults to 1
     */
    getProductWithOneGtinSubmittedForBuyerApproval(vendorPartyId, row) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let index = 1;
            if (row && row > 0)
                index = row;
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const productName = (_a = result === null || result === void 0 ? void 0 : result.recordset[index - 1]) === null || _a === void 0 ? void 0 : _a.VENDOR_PRODUCT_NAME;
            const gtin = (_b = result === null || result === void 0 ? void 0 : result.recordset[index - 1]) === null || _b === void 0 ? void 0 : _b.GTIN;
            yield sql.close();
            return { PRODUCT_NAME: productName, GTIN: gtin };
        });
    }
    getProductNameByVendorAndStatus(vendorPartyId, intakeGroupStatus, validationStatus, row) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let index = 1;
            if (row && row > 0)
                index = row;
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const productName = (_a = result === null || result === void 0 ? void 0 : result.recordset[index - 1]) === null || _a === void 0 ? void 0 : _a.VENDOR_PRODUCT_NAME;
            yield sql.close();
            return productName;
        });
    }
    getProductSubmittedForBuyerApproval(vendorPartyId, row) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getProductNameByVendorAndStatus(vendorPartyId, '50', '10', row);
        });
    }
    getProductWithnewlyaddedGtinSubmittedForBuyerApproval(vendorPartyId, row) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const productName = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.VENDOR_PRODUCT_NAME;
            yield sql.close();
            return productName;
        });
    }
    getBuyerApprovedProductName() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          select p.PRODUCT_NBR, 
          ig.VENDOR_PRODUCT_NAME 
          from pi.INTAKE_GROUP ig 
            join pc.PRODUCT p 
            on p.PRODUCT_ITEM_ID = ig.PRODUCT_ITEM_ID 
          where ig.INTAKE_GROUP_STATUS_CODE = 100 
          order by p.CREATE_DATE_TIME DESC
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const productName = (_a = result === null || result === void 0 ? void 0 : result.recordset[1]) === null || _a === void 0 ? void 0 : _a.VENDOR_PRODUCT_NAME;
            yield sql.close();
            return productName;
        });
    }
    getProductGtinsPiA(vendorProductName) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          select GTIN,GTIN_VENDOR_STATUS_CODE from pi.APPRV_GTIN_VENDOR 
          where INTAKE_GROUP_ID in (
          select INTAKE_GROUP_ID 
          from pi.INTAKE_GROUP
          where VENDOR_PRODUCT_NAME = '${vendorProductName}' 
          and VENDOR_PARTY_ID = ${ENV_PROPERTIES.vendorPartyID})
      `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            let gtins = [];
            for (let i = 0; i < result.recordset.length; i++) {
                gtins.push({ GTIN: (_a = result === null || result === void 0 ? void 0 : result.recordset[i]) === null || _a === void 0 ? void 0 : _a.GTIN, GTIN_STATUS_CODE: (_b = result === null || result === void 0 ? void 0 : result.recordset[i]) === null || _b === void 0 ? void 0 : _b.GTIN_VENDOR_STATUS_CODE });
            }
            yield sql.close();
            return gtins;
        });
    }
    getValidationStatusCodeByProductNumber(productNumber) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          select ig.VALIDATION_STATUS_CODE
          from pi.INTAKE_GROUP ig 
            join pc.PRODUCT p on p.PRODUCT_ITEM_ID = ig.PRODUCT_ITEM_ID 
          where p.PRODUCT_NBR = '${productNumber}'
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const validationStatusCode = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.VALIDATION_STATUS_CODE;
            yield sql.close();
            return validationStatusCode;
        });
    }
    getValidationStatusCodesByProductNumbers(productNumbers) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          select ig.VALIDATION_STATUS_CODE
          from pi.INTAKE_GROUP ig 
            join pc.PRODUCT p on p.PRODUCT_ITEM_ID = ig.PRODUCT_ITEM_ID 
          where p.PRODUCT_NBR in (${SqlConnection.arrayToQuotedList(productNumbers)})
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            let validationStatusCodes = [];
            for (let i = 0; i < (result === null || result === void 0 ? void 0 : result.recordset.length); i++) {
                validationStatusCodes.push((_a = result === null || result === void 0 ? void 0 : result.recordset[i]) === null || _a === void 0 ? void 0 : _a.VALIDATION_STATUS_CODE);
            }
            yield sql.close();
            return validationStatusCodes;
        });
    }
    getItemStatusDescByProductNumber(productNumber) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          select p.PRODUCT_NBR, t.ITEM_STATUS_DESC 
          from pc.PRODUCT p 
            join pc.ITEM i on i.ITEM_ID = p.PRODUCT_ITEM_ID 
            join pc.ITEM_STATUS_TYPE t on i.ITEM_STATUS_CODE = t.ITEM_STATUS_CODE 
          where p.PRODUCT_NBR = '${productNumber}'
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const status = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.ITEM_STATUS_DESC;
            yield sql.close();
            return status;
        });
    }
    getDDCClass(classCode) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        select CLASS_TEXT, ACTIVE_IND 
        from pc.LEGACY_DDC_CLASS 
        where CLASS_CODE = '${classCode}'
      `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const classDesc = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.CLASS_TEXT;
            const activeInd = (_b = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _b === void 0 ? void 0 : _b.ACTIVE_IND;
            yield sql.close();
            return { DESC: classDesc, ACTIVE_IND: activeInd };
        });
    }
    getLatestDDCClass() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          select CLASS_CODE, CLASS_TEXT, ACTIVE_IND 
          from pc.LEGACY_DDC_CLASS 
          where CLASS_CODE = (select max(CLASS_CODE) from pc.LEGACY_DDC_CLASS)
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const classCode = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.CLASS_CODE;
            const classDesc = (_b = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _b === void 0 ? void 0 : _b.CLASS_TEXT;
            const activeInd = (_c = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _c === void 0 ? void 0 : _c.ACTIVE_IND;
            yield sql.close();
            return { CODE: classCode, DESC: classDesc, ACTIVE_IND: activeInd };
        });
    }
    getDDCDepartment(deptCode) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          SELECT DEPARTMENT_TEXT, DEPARTMENT_OVERRIDE_WHSE_NBR, ACTIVE_IND 
          FROM pc.LEGACY_DDC_DEPARTMENT 
          WHERE DEPARTMENT_CODE = '${deptCode}'
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const deptDesc = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.DEPARTMENT_TEXT;
            const warehouseNum = (_b = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _b === void 0 ? void 0 : _b.DEPARTMENT_OVERRIDE_WHSE_NBR;
            const activeInd = (_c = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _c === void 0 ? void 0 : _c.ACTIVE_IND;
            yield sql.close();
            return { DESC: deptDesc, WAREHOUSE_NUMBER: warehouseNum, ACTIVE_IND: activeInd };
        });
    }
    getDDCDivision(divisionCode) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          select DIVISION_TEXT, ACTIVE_IND 
          from pc.LEGACY_DDC_DIVISION 
          where DIVISION_CODE = '${divisionCode}'
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const divDesc = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.DIVISION_TEXT;
            const activeInd = (_b = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _b === void 0 ? void 0 : _b.ACTIVE_IND;
            yield sql.close();
            return { DESC: divDesc, ACTIVE_IND: activeInd };
        });
    }
    getDDCMerchClass(classCode, deptCode, divisionCode) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const merchOverrideInd = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.MERCH_OVERRIDE_IND;
            const employeeDiscountPctAmt = (_b = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _b === void 0 ? void 0 : _b.EMPLOYEE_DISCOUNT_PCT_AMT;
            const mlshCode = (_c = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _c === void 0 ? void 0 : _c.MLSH_CODE;
            const taxCode = (_d = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _d === void 0 ? void 0 : _d.TAX_CODE;
            const primaryFccClassCode = (_e = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _e === void 0 ? void 0 : _e.PRIMARY_FCC_CLASS_CODE;
            const subFccClassCode = (_f = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _f === void 0 ? void 0 : _f.SUB_FCC_CLASS_CODE;
            const activeInd = (_g = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _g === void 0 ? void 0 : _g.ACTIVE_IND;
            yield sql.close();
            return {
                MERCH_OVERRIDE_IND: merchOverrideInd,
                EMPLOYEE_DISCOUNT_PCT_AMT: employeeDiscountPctAmt,
                MLSH_CODE: mlshCode,
                TAX_CODE: taxCode,
                PRIMARY_FCC_CLASS_CODE: primaryFccClassCode,
                SUB_FCC_CLASS_CODE: subFccClassCode,
                ACTIVE_IND: activeInd
            };
        });
    }
    getFccClass(primaryFccCode, subFccCode) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          select PRIMARY_FCC_CLASS_DESC,
                 SUB_FCC_CLASS_DESC,
                 ACTIVE_IND 
          from pc.LEGACY_FINANCIAL_COMMODITY_CLS 
          where PRIMARY_FCC_CLASS_CODE = '${primaryFccCode}' 
            and SUB_FCC_CLASS_CODE = '${subFccCode}'
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            var primaryFccDesc = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.PRIMARY_FCC_CLASS_DESC;
            var subFccDesc = (_b = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _b === void 0 ? void 0 : _b.SUB_FCC_CLASS_DESC;
            var activeInd = (_c = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _c === void 0 ? void 0 : _c.ACTIVE_IND;
            yield sql.close();
            return { PRIMARY_FCC_CLASS_DESC: primaryFccDesc, SUB_FCC_CLASS_DESC: subFccDesc, ACTIVE_IND: activeInd };
        });
    }
    getCompanyInfo(companyCode) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          select CONSIGNMENT_DESC, ACTIVE_IND 
          from pc.LEGACY_CONSIGNMENT 
          where CONSIGNMENT_CODE = '${companyCode}'
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const desc = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.CONSIGNMENT_DESC;
            const activeInd = (_b = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _b === void 0 ? void 0 : _b.ACTIVE_IND;
            yield sql.close();
            return { DESC: desc, ACTIVE_IND: activeInd };
        });
    }
    getItemTypeInfo(companyCode, merchAccountingCode, firstCharSknCode) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          select SKN_TYPE_CODE,
                 SKN_TYPE_DESC,
                 SKN_SIZE_REQUIRED_IND 
          from pc.LEGACY_ITEM_TYPE 
          where COMPANY_CODE = '${companyCode}'
            and MERCH_ACCOUNTING_CODE = '${merchAccountingCode}'
		        and FIRST_CHARACTER_SKN_CODE = '${firstCharSknCode}'
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const sknTypeCode = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.SKN_TYPE_CODE;
            const sknTypeDesc = (_b = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _b === void 0 ? void 0 : _b.SKN_TYPE_DESC;
            const requiredInd = (_c = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _c === void 0 ? void 0 : _c.SKN_SIZE_REQUIRED_IND;
            yield sql.close();
            return {
                SKN_TYPE_CODE: sknTypeCode,
                SKN_TYPE_DESC: sknTypeDesc,
                SKN_SIZE_REQUIRED_IND: requiredInd
            };
        });
    }
    getBuyingOffice(buyingOfficeCode) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const buyingOfficeId = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.BUYING_OFFICE_ID;
            const buyingOfficeDesc = (_b = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _b === void 0 ? void 0 : _b.BUYING_OFFICE_DESC;
            const buyingOfficeLevel = (_c = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _c === void 0 ? void 0 : _c.BUYING_OFFICE_LEVEL_CODE;
            const activeInd = (_d = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _d === void 0 ? void 0 : _d.ACTIVE_IND;
            const salesDivCode = (_e = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _e === void 0 ? void 0 : _e.SALES_DIV_CODE;
            const parentId = (_f = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _f === void 0 ? void 0 : _f.PARENT_BUYING_OFFICE_ID;
            const lcdInd = (_g = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _g === void 0 ? void 0 : _g.LCD_APPROVER_IND;
            yield sql.close();
            return {
                BUYING_OFFICE_ID: buyingOfficeId,
                BUYING_OFFICE_DESC: buyingOfficeDesc,
                BUYING_OFFICE_LEVEL_CODE: buyingOfficeLevel,
                ACTIVE_IND: activeInd,
                SALES_DIV_CODE: salesDivCode,
                PARENT_BUYING_OFFICE_ID: parentId,
                LCD_APPROVER_IND: lcdInd
            };
        });
    }
    getBuyingOfficeParent(buyingOfficeCode) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const buyingOfficeId = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.BUYING_OFFICE_ID;
            const parentBuyingOfficeCode = (_b = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _b === void 0 ? void 0 : _b.BUYING_OFFICE_CODE;
            const buyingOfficeDesc = (_c = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _c === void 0 ? void 0 : _c.BUYING_OFFICE_DESC;
            const buyingOfficeLevel = (_d = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _d === void 0 ? void 0 : _d.BUYING_OFFICE_LEVEL_CODE;
            const activeInd = (_e = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _e === void 0 ? void 0 : _e.ACTIVE_IND;
            const salesDivCode = (_f = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _f === void 0 ? void 0 : _f.SALES_DIV_CODE;
            const parentId = (_g = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _g === void 0 ? void 0 : _g.PARENT_BUYING_OFFICE_ID;
            const lcdInd = (_h = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _h === void 0 ? void 0 : _h.LCD_APPROVER_IND;
            yield sql.close();
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
        });
    }
    getSeason(seasonCode) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          select s.YEAR_NBR,
                 s.ACTIVE_IND,
	               sl.SEASON_TEXT
          from pc.SEASON s
            join pc.SEASON_LANGUAGE sl on s.SEASON_ID = sl.SEASON_ID
          where s.SEASON_CODE = '${seasonCode}'
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const seasonYear = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.YEAR_NBR;
            const activeInd = (_b = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _b === void 0 ? void 0 : _b.ACTIVE_IND;
            const seasonText = (_c = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _c === void 0 ? void 0 : _c.SEASON_TEXT;
            yield sql.close();
            return { YEAR_NBR: seasonYear, ACTIVE_IND: activeInd, SEASON_TEXT: seasonText };
        });
    }
    getTraitValue(traitCode) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const traitLegacyShortText = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.LEGACY_SHORT_TRAIT_VALUE_TEXT;
            const traitValueText = (_b = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _b === void 0 ? void 0 : _b.TRAIT_VALUE_TEXT;
            const traitGroupTypeCode = (_c = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _c === void 0 ? void 0 : _c.TRAIT_GROUP_TYPE_CODE;
            const traitTypeText = (_d = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _d === void 0 ? void 0 : _d.TRAIT_TYPE_TEXT;
            const activeInd = (_e = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _e === void 0 ? void 0 : _e.ACTIVE_IND;
            const operationalCountryCode = (_f = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _f === void 0 ? void 0 : _f.OPERATIONAL_COUNTRY_CODE;
            const auxInd = (_g = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _g === void 0 ? void 0 : _g.AUX_IND;
            const legacyInd = (_h = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _h === void 0 ? void 0 : _h.LEGACY_IND;
            yield sql.close();
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
        });
    }
    getProductAttributes(productNumber, attributes) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            let attributeMap = new Map();
            for (let i = 0; i < (result === null || result === void 0 ? void 0 : result.recordset.length); i++) {
                const techName = (_a = result === null || result === void 0 ? void 0 : result.recordset[i]) === null || _a === void 0 ? void 0 : _a.ATTRIBUTE_TECHNICAL_NAME;
                const value = (_b = result === null || result === void 0 ? void 0 : result.recordset[i]) === null || _b === void 0 ? void 0 : _b.ATTRIBUTE_VALUE_TEXT;
                if (attributeMap.has(techName)) {
                    attributeMap.set(techName, `${attributeMap.get(techName)}, ${value}`);
                }
                else {
                    attributeMap.set(techName, value);
                }
            }
            yield sql.close();
            return attributeMap;
        });
    }
    getGtinAttributes(gtin, attributes) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        select ATTRIBUTE_TECHNICAL_NAME,
               ATTRIBUTE_VALUE_TEXT
        from pi.APPRV_GTIN_VENDOR_ATTRIBUTE agva
        join pi.APPRV_GTIN_VENDOR_GRP_INST agvgi on agvgi.ATTRIBUTE_GROUP_INSTANCE_ID = agva.ATTRIBUTE_GROUP_INSTANCE_ID
        where ATTRIBUTE_TECHNICAL_NAME in (${SqlConnection.arrayToQuotedList(attributes)})
          and agvgi.GTIN = '${gtin}'
      `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            let attributeMap = new Map();
            for (let i = 0; i < (result === null || result === void 0 ? void 0 : result.recordset.length); i++) {
                const techName = (_a = result === null || result === void 0 ? void 0 : result.recordset[i]) === null || _a === void 0 ? void 0 : _a.ATTRIBUTE_TECHNICAL_NAME;
                const value = (_b = result === null || result === void 0 ? void 0 : result.recordset[i]) === null || _b === void 0 ? void 0 : _b.ATTRIBUTE_VALUE_TEXT;
                attributeMap.set(techName, value);
            }
            yield sql.close();
            return attributeMap;
        });
    }
    getLongDescription(productNumber) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          select DESCRIPTION_TEXT
          from pc.ITEM_DESCRIPTION_LANG idl
          join pc.PRODUCT p on idl.ITEM_ID = p.PRODUCT_ITEM_ID
          where p.PRODUCT_NBR = '${productNumber}'
          and idl.ITEM_DESCRIPTION_TYPE_CODE = 'LDAI'
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const longDesc = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.DESCRIPTION_TEXT;
            yield sql.close();
            return longDesc;
        });
    }
    getShortDescription(productNumber) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          select DESCRIPTION_TEXT
          from pc.ITEM_DESCRIPTION_LANG idl
          join pc.PRODUCT p on idl.ITEM_ID = p.PRODUCT_ITEM_ID
          where p.PRODUCT_NBR = '${productNumber}'
          and idl.ITEM_DESCRIPTION_TYPE_CODE = 'SDSC'
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const shortDesc = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.DESCRIPTION_TEXT;
            yield sql.close();
            return shortDesc;
        });
    }
    getProductItemStatus(productNumber) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          select ips.PROCESS_STATUS_CODE 
          from pc.ITEM_PROCESS_STATUS ips
          join pc.PRODUCT p on p.PRODUCT_ITEM_ID = ips.ITEM_ID
          where p.PRODUCT_NBR = '${productNumber}'
        `;
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const status = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.PROCESS_STATUS_CODE;
            yield sql.close();
            return status;
        });
    }
    unassignValidator(intakeGroupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
          update pi.INTAKE_GROUP 
          set VALIDATOR_PERSON_PARTY_ID = NULL 
          where INTAKE_GROUP_ID = '${intakeGroupId}
        `;
            const sql = yield this.connPool.connect();
            yield sql.query(query);
            yield sql.close();
        });
    }
    getSubmittedForBuyerApprovalProduct(ctcClassifications) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProductByGtinStatuses(0, 0, 'gt0', 0, 0, 0, 50, 10, ctcClassifications);
        });
    }
    getValidationCompletedProductWithNewGtins() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProductByGtinStatuses(0, 0, 'gt0', 0, 0, 'gt0', 50, 10);
        });
    }
    getNewProduct(ctcClassifications) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProductByGtinStatuses(0, 0, 'gt0', 0, 0, 0, 10, 10, ctcClassifications);
        });
    }
    getNewProductWithOneGtin() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProductByGtinStatuses(0, 0, 1, 0, 0, 0, 10, 10);
        });
    }
    getBuyerRejectedProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProductByGtinStatuses(0, 0, 0, 0, 'gt0', 0, 102, 10);
        });
    }
    getBuyerResubmittedProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProductByGtinStatuses(0, 0, 0, 0, 'gt0', 0, 51, 10);
        });
    }
    getBuyerApprovedProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProductByGtinStatuses(0, 0, 0, 'gt0', 0, 0, 100, 10);
        });
    }
    getReclassificationProcessingProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProductByGtinStatuses(0, 0, 0, 'gt0', 0, 0, 1000);
        });
    }
    getReclassificationFailedProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProductByGtinStatuses(0, 0, 0, 'gt0', 0, 0, 1005);
        });
    }
    getValidationInProgressProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProductByGtinStatuses(0, 0, 0, 'gt0', 0, 0, 100, 20);
        });
    }
    getClassificationRejectedProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProductByGtinStatuses(0, 0, 0, 'gt0', 0, 0, 100, 22);
        });
    }
    getValidationRejectedProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProductByGtinStatuses(0, 0, 0, 'gt0', 0, 0, 100, 25);
        });
    }
    getValidationResubmittedProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProductByGtinStatuses(0, 0, 0, 'gt0', 0, 0, 100, 27);
        });
    }
    getValidationCompletedProduct() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProductByGtinStatuses(0, 0, 0, 0, 0, 'gt0', 100, 30);
        });
    }
    getNewProductWithNewGtins() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProductByGtinStatuses(0, 0, 'gt0', 0, 0, 'gt0', 10, 10);
        });
    }
    getBuyerRejectedProductWithNewGtins() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProductByGtinStatuses(0, 0, 0, 0, 'gt0', 'gt0', 102, 10);
        });
    }
    getValidationRejectedProductWithNewGtins() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getProductByGtinStatuses(0, 0, 0, 'gt0', 0, 'gt0', 100, 25);
        });
    }
    getProductByGtinStatuses(processingGtinCount, failedGtinCount, newGtinCount, acceptedGtinCount, rejectedGtinCount, completedGtinCount, intakeGroupStatusCode, validationStatusCode, ctcClassifications) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
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
            const sql = yield this.connPool.connect();
            const result = yield sql.query(query);
            const vendorProductName = (_a = result === null || result === void 0 ? void 0 : result.recordset[0]) === null || _a === void 0 ? void 0 : _a.VENDOR_PRODUCT_NAME;
            yield sql.close();
            return vendorProductName;
        });
    }
    convertGtinStatusCountToSql(count) {
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
    static arrayToQuotedList(array) {
        return "'" + array.join("','") + "'";
    }
}
exports.SqlConnection = SqlConnection;
