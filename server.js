const { app, db } = require("./app");

db.then(() => {
    console.log("Database connection successful");
}).catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
});

app.listen(3000, () => {
    console.log("Server running. Use our API on port: 3000");
});
