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
        describe('createDescription', function() {
            it('Should be a function', function() {
                expect(themodule.createDescription).to.be.a('function');
            });
            it('Should create a correct description when values are zero', function() {
                const testfeaturezero = {
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            -111.33333,
                            34.23333
                        ]
                    },
                    "type": "Feature",
                    "properties": {
                        "qc_flagged": false,
                        "wind_direction": 0,
                        "timezone": "America/Phoenix",
                        "id": "0",
                        "restricted": false,
                        "stid": "Test",
                        "station_info": "http://mesowest.utah.edu/cgi-bin/droman/station_total.cgi?stn=TEST",
                        "elev_dem": "0",
                        "state": "AZ",
                        "latitude": "34.23333",
                        "status": "ACTIVE",
                        "elevation": "0",
                        "date_time": "1999-01-30T19:55:00-0700",
                        "more_observations": "http://mesowest.utah.edu/cgi-bin/droman/meso_base_dyn.cgi?stn=TEST",
                        "air_temp": 0,
                        "dew_point_temperature_d": 0,
                        "wind_speed": 0,
                        "mnet_id": "1",
                        "wind_gust": 0,
                        "name": "Payson",
                        "longitude": "-111.33333",
                        "relative_humidity": 0,
                        "qc_status": "OK"
                    },
                    "id": "TEST"
                };

                let description = themodule.createDescription(testfeaturezero);
                expect(description).to.be.equal('<b>Payson </b>Test ACTIVE<br/><b>1/30/1999 6:55:00 PM PST </b> <br/><b>Wind: </b> 0 MPH<br/><b>Peak Gust: </b>0 MPH<br/><b>Temperature: </b>0 F<br/><b>Dew Point: </b>0 F<br/><b>Humidity: </b>0 &#37;<br/><b><a href="http://mesowest.utah.edu/cgi-bin/droman/meso_base_dyn.cgi?stn=TEST">More Information</a> </b> <br/>');
            });
            it('Should create a correct description when values are NOT zero', function() {
                const testfeaturenonzero = {
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            -111.33333,
                            34.23333
                        ]
                    },
                    "type": "Feature",
                    "properties": {
                        "qc_flagged": false,
                        "wind_direction": 5,
                        "timezone": "America/Phoenix",
                        "id": "5",
                        "restricted": false,
                        "stid": "Test",
                        "station_info": "http://mesowest.utah.edu/cgi-bin/droman/station_total.cgi?stn=TEST",
                        "elev_dem": "5",
                        "state": "AZ",
                        "latitude": "34.23333",
                        "status": "ACTIVE",
                        "elevation": "5",
                        "date_time": "1999-01-30T19:55:00-0700",
                        "more_observations": "http://mesowest.utah.edu/cgi-bin/droman/meso_base_dyn.cgi?stn=TEST",
                        "air_temp": 5,
                        "dew_point_temperature_d": 5,
                        "wind_speed": 5,
                        "mnet_id": "1",
                        "wind_gust": 5,
                        "name": "Payson",
                        "longitude": "-111.33333",
                        "relative_humidity": 5,
                        "qc_status": "OK"
                    },
                    "id": "TEST"
                };

                let description = themodule.createDescription(testfeaturenonzero);
                expect(description).to.be.equal('<b>Payson </b>Test ACTIVE<br/><b>1/30/1999 6:55:00 PM PST </b> <br/><b>Wind: </b>N 5 MPH<br/><b>Peak Gust: </b>5 MPH<br/><b>Temperature: </b>5 F<br/><b>Dew Point: </b>5 F<br/><b>Humidity: </b>5 &#37;<br/><b><a href="http://mesowest.utah.edu/cgi-bin/droman/meso_base_dyn.cgi?stn=TEST">More Information</a> </b> <br/>');
            });
            it('Should create a correct description when values are undefined', function() {
                const testfeatureundefined = {
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            -111.33333,
                            34.23333
                        ]
                    },
                    "type": "Feature",
                    "properties": {
                        "qc_flagged": false,
                        "wind_direction": undefined,
                        "timezone": "America/Phoenix",
                        "id": "5",
                        "restricted": false,
                        "stid": "Test",
                        "station_info": "http://mesowest.utah.edu/cgi-bin/droman/station_total.cgi?stn=TEST",
                        "elev_dem": undefined,
                        "state": "AZ",
                        "latitude": "34.23333",
                        "status": "ACTIVE",
                        "elevation": undefined,
                        "date_time": "1999-01-30T19:55:00-0700",
                        "more_observations": "http://mesowest.utah.edu/cgi-bin/droman/meso_base_dyn.cgi?stn=TEST",
                        "air_temp": undefined,
                        "dew_point_temperature_d": undefined,
                        "wind_speed": undefined,
                        "mnet_id": "1",
                        "wind_gust": undefined,
                        "name": "Payson",
                        "longitude": "-111.33333",
                        "relative_humidity": undefined,
                        "qc_status": "OK"
                    },
                    "id": "TEST"
                };

                let description = themodule.createDescription(testfeatureundefined);
                expect(description).to.be.equal('<b>Payson </b>Test ACTIVE<br/><b>1/30/1999 6:55:00 PM PST </b> <br/><b>Wind: </b> N/A<br/><b>Peak Gust: </b>N/A<br/><b>Temperature: </b>N/A<br/><b>Dew Point: </b>N/A<br/><b>Humidity: </b>N/A<br/><b><a href="http://mesowest.utah.edu/cgi-bin/droman/meso_base_dyn.cgi?stn=TEST">More Information</a> </b> <br/>');
            });
        });

    });
});