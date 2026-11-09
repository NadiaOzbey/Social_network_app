import type { CookieOptions, Response } from "express";

export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";

const isProd = process.env.NODE_ENV === "production";

const base: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "strict" : "lax", // в production защищаемся более строгой политикой, а в development используем более мягкую настройку для удобства разработки
};

const ACCESS_MAX_AGE = 15 * 60 * 1000;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  res.cookie(ACCESS_COOKIE, accessToken, { //Встроенный метод Express: "сохрани accessToken в cookie с именем ACCESS_COOKIE и такими настройками". Синтаксис: res.cookie(ИМЯ, ЗНАЧЕНИЕ, НАСТРОЙКИ)
    ...base, // все поля, уже прописанные в base выше
    path: "/", // эта cookie отправляется браузером на все пути этого домена
    maxAge: ACCESS_MAX_AGE,
  });

  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...base, 
    path: "/api/auth",
    maxAge: REFRESH_MAX_AGE,
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_COOKIE, {
    ...base,
    path: "/",
  });

  res.clearCookie(REFRESH_COOKIE, {
    ...base,
    path: "/api/auth",
  });
}