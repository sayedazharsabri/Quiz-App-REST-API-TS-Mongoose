interface ReturnResponse {
  status: "success" | "error";
  message: String;
  data: {} | [];
}

export { ReturnResponse };
