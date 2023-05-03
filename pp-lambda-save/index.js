const { getLastDriver, putNewDriver } = require("./libs/dynamoDB");
const { pushSQSOnSuccess } = require("./libs/onSuccessSQS");
const { publishOnFailure } = require("./libs/onFailSNS");

exports.handler = async (event, context, callback) => {
    // console.log('Received event:', JSON.stringify(event, null, 2));

    context.callbackWaitsForEmptyEventLoop = false;
    try {
        let changeDriverTo = event.queryStringParameters.driver;
        console.log('changeDriverTo ', changeDriverTo);
        let driver = await getLastDriver();
        console.log('Current driver', driver);
        if (driver === changeDriverTo) {
            let msg = 'The current driver is equel to what you want to set';
            await publishOnFailure(msg);
            callback(new Error(msg), 'Destination Function Error Thrown');
        } else {
            await putNewDriver(changeDriverTo);
            await pushSQSOnSuccess(changeDriverTo);
        }
    } catch (err) {
        await publishOnFailure(err.message);
        callback(new Error(err.message), 'Destination Function Error Thrown');
    }

    callback(null);
};
