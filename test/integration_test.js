'use strict';
const {expect} = require('chai');
const themodule = require('../processor');
const moment = require('moment');
const testdata = require('./testdata');
const db = require('../db');

let {dbconnectionparams, synopticsparams} = require('../connections'); //default connections.


describe('All Integration Tests', function() {
    describe('Synoptics Module', function() {
        describe('Request synoptics Json Data', function() {
            it('Should return a result', function() {
                let requestparams = `?token=${synopticsparams.token}&network=1,2&output=geojson&state=CA,NV,AZ,OR&units=temp|f,speed|mph&vars=air_temp,wind_speed,wind_direction,wind_gust,dew_point_temperature,relative_humidity&obtimezone=local&qc_flags=on&qc_remove_data=off`;

                return themodule.requestJsonData(synopticsparams.host + requestparams)
                    .then((result) => expect(result).to.be.an('object', 'result should be an object.'))
            })

        });
        describe('Bad url tests', function() {
            it('Should fail with a bad url', function() {
                return themodule.requestJsonData(synopticsparams.host)
                    .then((result) => expect(result).to.be.null)
                    .catch((err) => expect(err).to.be.an('object', 'Error should be an object.'))
            })
        });


    });
    describe('Db Integration', function() {
        describe('Upsert data test records.', function() {
            it('Should succeed with 2 records', function() {
                let data = testdata.test_transformed_features();
                return db.upsertdb('test-synoptics', data, dbconnectionparams)
                    .then((result) => {
                        expect(result).to.be.an('object').that.has.property('timestamp');
                    })
            })
        });
        describe('Remove data tests', function() {
            it('Should successfully remove test records', function() {
                return db.deleteRecordsBefore(moment(),'test-synoptics', dbconnectionparams)
                    .then( result => expect(result).to.be.a('string'));
            })
        });
    });
});