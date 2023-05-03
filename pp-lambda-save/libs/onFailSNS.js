const AWS = require('aws-sdk');

const publishOnFailure = async (error) => {
    console.log('onFailSNS publishOnFailure start ', error);
    const sns = new AWS.SNS({region: process.env.REGION});
    const params = {
        Message: "PeakoParking_Lambda_Save: ".concat(error),
        TopicArn: process.env.SNS_FAIL_TOPIC
    };
    const result = await sns.publish(params).promise();
    console.log('onFailSNS publishOnFailure end ', result);
}

module.exports = { publishOnFailure }