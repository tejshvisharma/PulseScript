import asyncHandler from '../utils/AsyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

const healthcheckController = asyncHandler(async (req, res) => {
    const response = new ApiResponse(200, null, "API is healthy ✅");
    return res.status(response.statuscode).json(response);
});

export default healthcheckController;