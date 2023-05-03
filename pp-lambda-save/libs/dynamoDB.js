const AWS = require('aws-sdk');
const clientParams = {
    region: process.env.REGION,
    httpOptions: {
        timeout: 5000
    },
    maxRetries: 3
};

const getLastDriver = async () => {
    console.log('dynamoDB getLastDriver start ');
    const params = {
        TableName: process.env.TABLE_NAME,
        // FilterExpression: '#ts > :today',
        // ExpressionAttributeNames: {
        //     '#ts': 'sc'
        // },
        // ExpressionAttributeValues: {
        //     ':today': getStartTS()
        // },
        ScanIndexForward: false,
        Limit: 1,
    };
    const dynamo = new AWS.DynamoDB.DocumentClient(clientParams);
    let body = await dynamo.scan(params).promise();

    let el = body.Items[0];

    console.log('dynamoDB getLastDriver end ', el.name);

    return el.name;
}

const putNewDriver = async (newDriverName) => {
    console.log('dynamoDB putNewDriver start ', newDriverName);
    let ts = Date.now() / 1000 | 0;
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            'pk': newDriverName.concat('_', ts),
            'sk': ts,
            'name' : newDriverName
        }
    };
    const dynamo = new AWS.DynamoDB.DocumentClient(clientParams);

    await dynamo.put(params).promise();

    console.log('dynamoDB getLastDriver end ', params);

    return params;
}

const getStartTS = () => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const todayStartTimestamp = todayStart.getTime();

    return todayStartTimestamp / 1000 | 0;
}

module.exports = { getLastDriver, putNewDriver }