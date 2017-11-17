const fs = require('fs');

const valid_response = () => JSON.parse(fs.readFileSync('test/data/valid_response.json'));
const test_transformed_features = () => JSON.parse(fs.readFileSync('test/data/testfeatures.json'));
module.exports = exports = {
    valid_response: valid_response,
    test_transformed_features: test_transformed_features
};