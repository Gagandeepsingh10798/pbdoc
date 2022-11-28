module.exports = {
    createAdmin: {
        "password": 0,
        "deviceType": 0,
        "deviceToken": 0,
        "isDeleted": 0,
        "__v": 0
    },
    createAdminWithPassword: {
        "deviceType": 0,
        "deviceToken": 0,
        "isDeleted": 0,
        "__v": 0
    },
    createClient: {
        "isDeleted": 0,
        "__v": 0,
        "createdAt": 0,
        "updatedAt": 0
    }, createModule: {
        "isDeleted": 0,
        "__v": 0,
        "createdAt": 0,
        "updatedAt": 0
    },
    createLogs: {
        "isDeleted": 0,
        "__v": 0,
    },
    createVis: {
        "__v": 0
    },
    getClients: {
        "_id": "$userId._id",
        "userName": "$userId.userName",
        "email": "$userId.email",
        "phone": "$userId.phone",
        "countryCode": "$userId.countryCode",
        "type": "CLIENT",
        "description": 1,
        "logo": 1,
        "domain": 1,
        "name": 1,
        "createdAt": "$userId.createdAt",
        "updatedAt": "$userId.updatedAt",
    }

};