let processor = require('./processor');
let {dbconnectionparams, synopticsparams} = require('./connections'); //default connections.
const moment = require('moment');

dbconnectionparams.passworddecrypted = true;
synopticsparams.tokendecrypted = true;

processor.etlsynopticsdata(dbconnectionparams,synopticsparams)
    .then(result => processor.prunestaledata(moment(result.timestamp),dbconnectionparams))
    .then(result => console.log(result + ' Done.'))
    .catch(e => {
        console.error('Error during processing:', e);
        process.exit(1);
    });

