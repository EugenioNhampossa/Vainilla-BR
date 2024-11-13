import { contract } from "@repo/api-contract";
import { initQueryClient } from "@ts-rest/react-query";

const apiClient = initQueryClient(contract, {
  baseHeaders: {},
  baseUrl: "",
});

export default apiClient;
