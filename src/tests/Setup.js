
const { AppProvider } = require("../app/providers/AppProvider");


module.exports = async () => {

    const app = await AppProvider.testFactory();
    process.testSetup = {
        app
    }

}



