const AWS = require('aws-sdk');

const pushSQSOnSuccess = async (newDriverName) => {
    console.log('onSuccessSQS pushSQSOnSuccess start ', newDriverName);
    // Set the parameters
    const params = {
        DelaySeconds: 10,
        MessageAttributes: {
            "NewDriver": {
                DataType: "String",
                StringValue: newDriverName,
            },
        },
        MessageBody: "New Driver has been changed!",
        QueueUrl: "".concat(process.env.SQS_QUEUE_URL)
    };
    console.log('onSuccessSQS pushSQSOnSuccess params ', params);

    const data = await new AWS.SQS({region: process.env.REGION}).sendMessage(params).promise();
    console.log("onSuccessSQS pushSQSOnSuccess end. MessageID:", data.MessageId);
}

module.exports = { pushSQSOnSuccess };