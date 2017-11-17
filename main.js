let processor = require('./processor');
let {dbconnectionparams, synopticsparams} = require('./connections'); //default connections.
const moment = require('moment');

let dbparams = {
    ...dbconnectionparams,
    passworddecrypted:true
};

let svcparams = {
    ...synopticsparams,
    tokendecrypted: true
};

processor.etlsynopticsdata(dbparams,svcparams)
    .then(result => processor.prunestaledata(moment(result.timestamp),dbparams))
    .then(result => console.log(result + ' Done.'))
    .catch(e => {
        console.error('Error during processing:', e);
        process.exit(1);
    });

