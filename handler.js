'use strict';
const DynamoDB = require('aws-sdk/clients/dynamodb');
const dynamoDb = new DynamoDB.DocumentClient({
    region: "us-east-1"
});

const TABLE_NAME = process.env.DYNAMODB_TABLE;

module.exports.createTodo = async (event) => {
    const data = JSON.parse(event.body);

    try {
        const params = {
            TableName: TABLE_NAME,
            Item: {
                taskId: data.taskId,
                task: data.task
            }
        }

        await dynamoDb.put(params).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: 'Task created successfully!'
            })
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: error.message
        };
    }
};

module.exports.updateTodo = async (event) => {
    const taskId = event.pathParameters.id;
    const data = JSON.parse(event.body);

    try {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                taskId
            },
            UpdateExpression: "set #task = :task",
            ExpressionAttributeNames: {
                "#task": "task"
            },
            ExpressionAttributeValues: {
                ":task": data.task
            },
            ConditionalExpression: "attribute_exists(taskId)"
        }

        await dynamoDb.update(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Task updated successfully!'
            })
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: error.message
        };
    }
};

module.exports.deleteTodo = async (event) => {
    const taskId = event.pathParameters.id;
    try {
        const params = {
            TableName: TABLE_NAME,
            Key: {
                taskId
            },
            ConditionalExpression: "attribute_exists(taskId)"
        }

        await dynamoDb.delete(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Note deleted successfully!'
            })
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: error.message
        }
    }
};

module.exports.getAllTodos = async (event) => {
    try {
        const params = {
            TableName: TABLE_NAME
        }

        const result = await dynamoDb.scan(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items)
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: error.message
        }
    }
};
