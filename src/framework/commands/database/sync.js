const { DatabaseProvider } = require("../../../app/providers/DatabaseProvider");
const { ModelsProvider } = require("../../../app/providers/ModelsProvider");



DatabaseProvider.sync(ModelsProvider,{});