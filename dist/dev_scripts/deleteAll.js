"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../src/managers/DB");
const userModel_1 = require("../src/models/userModel");
(0, DB_1.default)();
const deleteData = async (Model) => {
    try {
        await Model.deleteMany();
        console.log('All data deleted Successfully');
        process.exit();
    }
    catch (err) {
        console.log(err);
        process.exit();
    }
};
if (process.argv[2] === '--users')
    deleteData(userModel_1.default);
//# sourceMappingURL=deleteAll.js.map