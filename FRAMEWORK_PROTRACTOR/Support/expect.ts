import * as chai from 'chai';
import * as chai_as_promised from 'chai-as-promised';
import * as chai_string from 'chai-string';

export const expect = chai.expect;
export const expect_as_promised = chai.use(chai_as_promised).expect;
export const expect_string = chai.use(chai_string).expect;
