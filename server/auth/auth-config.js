const authConfig = {
    authorityUrl: 'https://login.microsoftonline.com/StatoilSRM.onmicrosoft.com',
    clientID:     'b73ea05f-55ca-41e0-a246-2b26f1a4ce33',
    libraryApiID: '9d1e4a2e-c88e-45a5-aef4-199afe38f1cd',
    clientSecret: process.env.CLIENT_SECRET ? process.env.CLIENT_SECRET : '<client secret>'
};

module.exports = authConfig;