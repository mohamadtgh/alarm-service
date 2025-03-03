import * as ApiClient from "generated-server";

const config = ApiClient.createConfiguration();
const apiClient = new ApiClient.DefaultApi(config);

apiClient.alarmsGet().then((res) => {
  console.log(res);
});
