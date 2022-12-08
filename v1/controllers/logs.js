const { LogsDataManagement } = require('../data-management');
const universal = require('../../utils');
const { CODES, MESSAGES } = require('../../constants');
module.exports = {
    /* Client APIs */
    getAllLogs: async (req, res, next) => {
        try {
            let LogsModel = new LogsDataManagement();
            if(req.query && req.query.id){
                let log = await LogsModel.getLogById(req.query.id);
                await universal.response(res, CODES.OK, MESSAGES.admin.DATA_FETCHED_SUCCESSFULLY, log);
                return;
            }
            let logs = await LogsModel.getLogs();
            await universal.response(res, CODES.OK, MESSAGES.admin.DATA_FETCHED_SUCCESSFULLY, logs);
        }
        catch (error) {
            next(error);
        }
    },
};