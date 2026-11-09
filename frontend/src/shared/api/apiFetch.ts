// автоматически обновляем access-token при ошибке 401 Unauthorized (т.е. по истечении аксесс-токена) и повторяем исходный запрос (т.е. делаем так, чтобы пользователь не вылетал из статуса current user) 

const API_URL =
  import.meta.env.VITE_API_URL;

let refreshPromise:
  | Promise<boolean>
  | null = null;

const refreshAccessToken =
  async (): Promise<boolean> => {
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = fetch(
      `${API_URL}/api/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      },
    )
      .then(
        (response) =>
          response.ok,
      )
      .catch((error) => {
        console.error(
          "Failed to refresh access token:",
          error,
        );

        return false;
      })
      .finally(() => {
        refreshPromise = null;
      });

    return refreshPromise;
  };

export const apiFetch = async (
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> => {
  const response =
    await fetch(input, {
      ...init,
      credentials: "include",
    });

  if (response.status !== 401) {
    return response;
  }

  const refreshed =
    await refreshAccessToken();

  if (!refreshed) {
    return response;
  }

  return fetch(input, {
    ...init,
    credentials: "include",
  });
};