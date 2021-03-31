"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expect_string = exports.expect_as_promised = exports.expect = void 0;
const chai = require("chai");
const chai_as_promised = require("chai-as-promised");
const chai_string = require("chai-string");
exports.expect = chai.expect;
exports.expect_as_promised = chai.use(chai_as_promised).expect;
exports.expect_string = chai.use(chai_string).expect;
