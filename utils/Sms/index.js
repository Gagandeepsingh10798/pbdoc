var request = require('request');

const smsNotification = async (phone, smsData) => {
    request.get(
        encodeURI(`https://uapi.inforu.co.il/inforufrontend/WebInterface/SendMessageByNumber.aspx?UserName=tals012&Password=9effeniahqc2wml723mw95i7s&SenderCellNumber=BIGUARD&CellNumber=${phone}&MessageString=${smsData}`),
        function (error, response, body) {
            return body;
        }
    );
};

module.exports = {
    smsNotification,
};
