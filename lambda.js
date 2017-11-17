const processor = require('./processor');
const secretsPromise = require('serverless-secrets/client').load(); //deployed with serverless.
const moment = require('moment');

let {dbconnectionparams, synopticsparams} = require('./connections'); //default connections.

let handler = function(event, context, callback) {
    if ( dbconnectionparams.passworddecrypted && synopticsparams.tokendecrypted ) {
        processor.etlsynopticsdata(dbconnectionparams,synopticsparams)
            .then(result => processor.prunestaledata(moment(result.timestamp),dbconnectionparams))
            .then(result => console.log(result + '. Done.'))
            .catch(e => {
                console.error('Error during processing:', e);
                callback(e);
            });
    } else {
        secretsPromise.then(() => {
            dbconnectionparams.password = process.env.PGPASSWORD;
            dbconnectionparams.passworddecrypted = true;
            synopticsparams.token = process.env.SYNOPTICSTOKEN;
            synopticsparams.tokendecrypted = true;
            processor.etlsynopticsdata(dbconnectionparams, synopticsparams)
                .then(result => processor.prunestaledata(moment(result.timestamp),dbconnectionparams))
                .then(result => console.log(result + '. Done.'))
                .catch(e => {
                    console.error('Error during processing:', e);
                    callback(e);
                });
        }).catch(err => {
            callback(err);
        });
    }
};

module.exports = exports = {
    handler: handler
};