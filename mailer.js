/*
----------THIS MODULE IS NOT WORKING----------
---------------PLEASE DO NOT USE--------------


const nodemailer = require("nodemailer");

var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;
// # Instantiate the client\
var apiKey = defaultClient.authentications[process.env.BREVO_API];
apiKey.apiKey = process.env.BREVO_API;
var apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
var emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();

// # Make the call to the client\
apiInstance.createEmailCampaign(emailCampaigns).then(function (data) {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});


// # Make the call to the client\
apiInstance.createEmailCampaign(emailCampaigns).then(function (data) {
    console.log('API called successfully. Returned data: ' + data);
}, function (error) {
    console.error(error);
});


const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: "ahmadtripleA@outlook.com",
        pass: "xsmtpsib-e29df02938ef27bd5acac7bf730d1065360b716f15f14c740f6f96a8c291fc54-0PFNwXapcBh1EIOV",
    },
    connectionTimeout: 1000,
});

// async..await is not allowed in global scope, must use a wrapper
async function sendRandomShit() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: 'ahmadtriplea@outlook.com', // sender address
        to: "ahmadala2akta3@gmail.com.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
}

module.exports = {
    sendRandomShit
}


// sendRandomShit().catch(console.error);

*/