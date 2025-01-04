import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          "http://localhost:5001/api/refresh",
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (rError) {
        console.error("Token refresh failed:", rError);

        localStorage.removeItem("accessToken");
        window.location.href = "/login";

        return Promise.reject(rError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
