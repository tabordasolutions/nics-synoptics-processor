
module.exports.dbconnectionparams = {
    host: (process.env.PGHOST ? process.env.PGHOST : 'localhost'),
    port: (process.env.PGPORT ? process.env.PGPORT : '5432'),
    user: (process.env.PGUSER ? process.env.PGUSER : process.env.USER),
    password: (process.env.PGPASSWORD ? process.env.PGPASSWORD : process.env.USER),
    database: (process.env.PGDATABASE ? process.env.PGDATABASE : process.env.USER),
    passworddecrypted: false
};

module.exports.synopticsparams = {
    host: (process.env.SYNOPTICSHOST ? process.env.SYNOPTICSHOST : 'https://api.synopticlabs.org/v2/stations/latest'),
    token: (process.env.SYNOPTICSTOKEN ? process.env.SYNOPTICSTOKEN : 'change-me'),
    tokendecrypted: false
};



