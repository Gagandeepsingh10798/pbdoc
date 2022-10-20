module.exports = [
  ...require("./user-password-settings-api"),
  ...require("./tokenapi"),
  ...require("./change-password-api"),
  ...require("./reset-password-api"),
  ...require("./send-sms-2fa-opt-api"),
  ...require("./ihealth-auth-api")

];
