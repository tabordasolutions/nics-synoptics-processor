const processor = require('./processor');
const secretsPromise = require('serverless-secrets/client').load(); //deployed with serverless.
const moment = require('moment');

let {dbconnectionparams, synopticsparams} = require('./connections'); //default connections.

let handler = function(event, context, callback) {
    console.log('Checking Env Variables.');
    if ( dbconnectionparams.passworddecrypted && synopticsparams.tokendecrypted ) {
        console.log('Calling etl process...');
        processor.etlsynopticsdata(dbconnectionparams,synopticsparams)
            .then(result => processor.prunestaledata(moment(result.timestamp),dbconnectionparams))
            .then(result => console.log(result + '. Done.'))
            .catch(e => {
                console.error('Error during processing:', e);
                callback(e);
            });
    } else {
        console.log('decrypting secrets...');
        secretsPromise.then(() => {
            console.log('decrypted secrets');
            dbconnectionparams.password = process.env.PGPASSWORD;
            dbconnectionparams.passworddecrypted = true;
            synopticsparams.token = process.env.SYNOPTICSTOKEN;
            synopticsparams.tokendecrypted = true;
            console.log('Calling etl process...');
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