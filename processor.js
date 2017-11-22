let db = require('./db');
let {dbconnectionparams, synopticsparams} = require('./connections'); //default connections.
let requestp = require('request-promise-native'); //Adding native ES6 promises to request.

const moment = require('moment');
const feedname = 'synoptics';

let etlsynopticsdata = (dboptions = dbconnectionparams, synopticsoptions = synopticsparams) => new Promise((resolves,rejects) => {

    const token = synopticsoptions.token;
    let requestparams = `?token=${token}&network=1,2&recent=60&output=geojson&state=CA,NV,AZ,OR&units=temp|f,speed|mph&vars=air_temp,wind_speed,wind_direction,wind_gust,dew_point_temperature,relative_humidity&obtimezone=local&qc_flags=on&qc_remove_data=off`;
    console.log('Requesting weather station data from: ', synopticsoptions.host);

    requestJsonData(synopticsoptions.host + requestparams)
        .then(result => {
            return processresult(result,dboptions);
        })
        .then(result => resolves(result))
        .catch(e => rejects(e))

});

let requestJsonData = (url) => new Promise((resolves, rejects) => {

    if (!url)
        rejects(new Error('Url parameter must contain a value.'));
    requestp(url)
        .then((result) => {
            let json = JSON.parse(result);
            resolves(json);
        })
        .catch((error) => rejects(error));
});

let processresult = (result, dboptions) => {

    let transformedFeatures = transformfeatures(result);
    return db.upsertdb(feedname,transformedFeatures,dboptions);
};

let prunestaledata = (olderthan = moment().subtract(30,'days'), dboptions = dbconnectionparams) => {
    return db.deleteRecordsBefore(olderthan,feedname,dboptions)
};

let transformfeatures = (svcresponsejson) => {

    let features = svcresponsejson.features || [];
    let qcshortnames = ((svcresponsejson.QC_SUMMARY || {}).QC_SHORTNAMES) || {};

    return features.filter(feature => (feature.properties && feature.geometry.type === 'Point' && feature.properties.stid))
        .map(feature => {
            let fcopy = JSON.parse(JSON.stringify(feature)); //low frills copy since node6 spread operator doesn't work on objects.
            fcopy.properties.qc_status = createQcStatusString(fcopy,qcshortnames);
            fcopy.id = feature.properties.stid;
            fcopy.properties.air_temp = Math.round(feature.properties.air_temp);
            fcopy.properties.description = createDescription(fcopy);
            return fcopy;
        })

};

let createQcStatusString = (feature, qcnameslookup) => {
    if (!feature || !qcnameslookup)
        throw new Error('Missing required parameters');
    let retVal = "OK";
    if (feature.properties) {
        if (feature.properties.qc_flagged === true && feature.properties.qc) {
            retVal = "WARNING";
            for (let key in feature.properties.qc) {
                if (feature.properties.qc[key].filter(qcstatid => qcnameslookup[qcstatid] === "sl_range_check").length > 0)
                    retVal = "ERROR";
            }
        }
    }
    return retVal;
};

let createDescription = (feature) => {
    let createEntry = (title, val) => `<b>${title}</b> ${val || 'N/A'}<br/>`;
    return createEntry(feature.properties.name, `${feature.properties.stid} ${feature.properties.status}`) +
        createEntry(feature.properties.date_time, ' ') +
        createEntry('Wind:', `${createFriendlyWindDirection(feature.properties.wind_direction)} ${feature.properties.wind_speed} MPH`) +
        createEntry('Gust:', feature.properties.wind_gust || 'N/A' + ' MPH') +
        createEntry('Temperature:', feature.properties.air_temp || 'N/A' + ' F') +
        createEntry('Humidity:', feature.properties.relative_humidity || 'N/A' + ' &#37;') +
        createEntry('Dew Point:', feature.properties.dew_point_temperature_d || 'N/A' + ' F') +
        createEntry(`<a href="${feature.properties.more_observations}">More Information</a>`,' ');


};

let createFriendlyWindDirection = (degrees) => {
    const COMPASS_DIRECTIONS = ["N","NNE", "NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","N"];
    const DEGREES_PER_COMPASS_DIRECTION = 22.5;
    const TOTAL_DEGREES = 360;
    if (degrees) {
        let normalizedDirectionInDegrees = degrees % TOTAL_DEGREES;
        let compassDirectionIndex = Math.round(normalizedDirectionInDegrees/DEGREES_PER_COMPASS_DIRECTION);
        return COMPASS_DIRECTIONS[compassDirectionIndex];
    }
    else
        return "";
};

module.exports = {
    etlsynopticsdata: etlsynopticsdata,
    prunestaledata : prunestaledata,
    transformfeatures: transformfeatures,
    createQcStatusString: createQcStatusString,
    requestJsonData: requestJsonData

};