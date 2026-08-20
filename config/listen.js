const listen = async (app) => {
    try {
        const port = process.env.PORT;
        if (!app) {
            console.log("Express app is missing");
            return;
        }
        if (!port) {
            console.log("port is missing");
            return;
        }
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.log("Error in the server connected failed");
    }
};
module.exports = listen;