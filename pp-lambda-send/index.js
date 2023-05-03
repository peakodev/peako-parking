// import AWS from 'aws-sdk/client-sns';
// import AWS from '/var/runtime/node_modules/aws-sdk/lib/aws.js';
// import { SNSClient, AddPermissionCommand } from "@aws-sdk/client-sns";
const AWS = require('aws-sdk');

const snsTopic = process.env.SNS_CHAT_TOPIC_ARN;
const region = process.env.REGION;

exports.handler = async(event) => {
// export const handler = async(event) => {
    for (const record of event.Records) {

        const { messageAttributes } = record;
        const driverName = messageAttributes.NewDriver.StringValue;

        console.log("Driver name", driverName);

        const sns = new AWS.SNS({region: region});
        // const sns = new SNSClient({ region: region });

        const message = {
            message: driverName.concat(" зайняв місце на паркінгу.")
        };

        const params = {
            Message: JSON.stringify(message),
            TopicArn: snsTopic
        };

        try {
            const result = await sns.publish(params).promise();
            console.log('Message sent:', result.MessageId);
        } catch (err) {
            console.error('Error sending message:', err);
            throw err;
        }
    }
    return {};
};
