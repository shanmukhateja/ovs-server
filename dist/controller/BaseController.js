"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleError(err, response) {
    console.error(err);
    response.send({
        status: 'FAIL'
    });
}
exports.handleError = handleError;
//# sourceMappingURL=BaseController.js.map