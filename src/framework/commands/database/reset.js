const { DatabaseProvider } = require("../../../app/providers/DatabaseProvider");

const settings = DatabaseProvider.settings();

DatabaseProvider.Service().open({database:'postgres'})
    .dropDatabaseIfExists(settings.database)
    .execute()
    .then(() => {
        DatabaseProvider.Service().open({database:'postgres'})
            .createDatabaseIfNotExists(settings.database)
            .execute();
    });


