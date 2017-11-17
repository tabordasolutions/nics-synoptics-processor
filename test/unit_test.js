'use strict';
const {expect} = require('chai');
const themodule = require('../processor');
const testdata = require('./testdata');
// const fs = require('fs');

describe('All Unit Tests', function() {
    describe('Processor Module', function() {
        describe('RequestJsonData', function() {
            it('Should be a function', function() {
                expect(themodule.requestJsonData).to.be.a('function');
            });
        });
        describe('etlsynopticsdata', function() {
            it('Should be a function', function() {
                expect(themodule.etlsynopticsdata).to.be.a('function');
            });
        });
        describe('prunestaledata', function() {
            it('Should be a function', function() {
                expect(themodule.prunestaledata).to.be.a('function');
            });
        });
        describe('transformfeatures', function() {
            it('Should be a function', function() {
                expect(themodule.transformfeatures).to.be.a('function');
            });
        });
        describe('createQcStatusString', function() {
            it('Should be a function', function() {
                expect(themodule.createQcStatusString).to.be.a('function');
            });
        });
        describe('Transform features', function() {
            it('Should return an array of 128 features with qc_status properties and description', function() {

                let features = themodule.transformfeatures(testdata.valid_response());
                expect(features).to.be.an('array');
                expect(features.length).to.be.equal(1218);
                let validfeatures = features.filter(feature => (feature.properties.qc_status && feature.properties.description));
                expect(validfeatures.length).to.be.equal(1218);
                //fs.writeFileSync('test/data/testfeatures.json', JSON.stringify(validfeatures.filter((f,i) => i < 2)));
            });
        });

    });
});