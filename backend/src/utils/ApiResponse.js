class ApiResponse {
  constructor(statuscode, data, message = "success") {
    this.statuscode = statuscode;
    this.message = message;
    this.success = statuscode < 400;
    this.data = data;
  }
}

export default ApiResponse;
