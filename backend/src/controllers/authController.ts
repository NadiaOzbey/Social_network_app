import { Request, Response } from "express";

import bcrypt from "bcrypt";

import {
  randomUUID,
  randomBytes,
  createHash,
} from "crypto";

import { User } from "../models/User.js";

import { RefreshSession } from "../models/RefreshSession.js";

import { PasswordResetToken } from "../models/PasswordResetToken.js";

import { sendPasswordResetEmail } from "../services/emailService.js";

import {
  REFRESH_COOKIE,
  setAuthCookies,
  clearAuthCookies,
} from "../utils/cookies.js";

import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

const REFRESH_SESSION_TTL_MS =
  7 * 24 * 60 * 60 * 1000;

const PASSWORD_RESET_TTL_MS =
  30 * 60 * 1000;

// ======================================================
// REGISTER
// ======================================================

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      email,
      fullName,
      username,
      password,
    } = req.body;

    // Проверяем наличие и тип
    // всех обязательных полей
    if (
      typeof email !== "string" ||
      typeof fullName !== "string" ||
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Нормализуем данные
    const normalizedEmail =
      email.trim().toLowerCase();

    const normalizedFullName =
      fullName.trim();

    const normalizedUsername =
      username.trim().toLowerCase();

    // Проверяем, что обязательные поля
    // не пустые
    if (
      normalizedEmail === "" ||
      normalizedFullName === "" ||
      normalizedUsername === "" ||
      password === ""
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Проверка email
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Проверка Full Name
    if (normalizedFullName.length < 2) {
      return res.status(400).json({
        message:
          "Full name must contain at least 2 characters",
      });
    }

    // Проверка username
    if (
      normalizedUsername.length < 3 ||
      normalizedUsername.length > 30
    ) {
      return res.status(400).json({
        message:
          "Username must be between 3 and 30 characters",
      });
    }

    const usernameRegex =
      /^[a-zA-Z0-9._]+$/;

    if (!usernameRegex.test(normalizedUsername)) {
      return res.status(400).json({
        message:
          "Username can contain only letters, numbers, dots and underscores",
      });
    }

    // Проверка пароля
    if (password.length < 8) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters",
      });
    }

    // Проверяем email отдельно
    const existingEmail =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingEmail) {
      return res.status(409).json({
        message: "This email is already taken",
      });
    }

    // Проверяем username отдельно
    const existingUsername =
      await User.findOne({
        username: normalizedUsername,
      });

    if (existingUsername) {
      return res.status(409).json({
        message:
          "This username is already taken",
      });
    }

    // Хешируем пароль
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Создаём пользователя
    const user = await User.create({
      email: normalizedEmail,
      fullName: normalizedFullName,
      username: normalizedUsername,
      password: hashedPassword,
    });

    // Возвращаем пользователя
    // в той же структуре, что и login
    return res.status(201).json({
      message: "User successfully registered",

      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        bio: user.bio,
        image: user.image,
        externalLink: user.externalLink,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);

    // MongoDB duplicate key error.
    //
    // Это дополнительная защита от race condition:
    // два запроса могли одновременно пройти
    // предварительную проверку выше.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      const duplicateKeyError =
        error as {
          code: number;
          keyPattern?: Record<
            string,
            unknown
          >;
        };

      if (
        duplicateKeyError.keyPattern?.email
      ) {
        return res.status(409).json({
          message:
            "This email is already taken",
        });
      }

      if (
        duplicateKeyError.keyPattern?.username
      ) {
        return res.status(409).json({
          message:
            "This username is already taken",
        });
      }

      return res.status(409).json({
        message:
          "This email/username is already taken",
      });
    }

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ======================================================
// LOGIN
// ======================================================

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      usernameOrEmail,
      password,
    } = req.body;

    // Проверяем наличие и тип данных
    if (
      typeof usernameOrEmail !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message:
          "Username/email and password are required",
      });
    }

    // Убираем пробелы по краям
    // и приводим к lowercase
    const normalizedUsernameOrEmail =
      usernameOrEmail.trim().toLowerCase();

    // Проверяем, что поля не пустые
    if (
      normalizedUsernameOrEmail === "" ||
      password === ""
    ) {
      return res.status(400).json({
        message:
          "Username/email and password are required",
      });
    }

    // Ищем пользователя по email
    // ИЛИ username
    const user = await User.findOne({
      $or: [
        {
          email:
            normalizedUsernameOrEmail,
        },
        {
          username:
            normalizedUsernameOrEmail,
        },
      ],
    });

    // Не сообщаем, существует ли
    // такой пользователь
    if (!user) {
      return res.status(401).json({
        message:
          "Invalid username/email or password",
      });
    }

    // Проверяем пароль
    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message:
          "Invalid username/email or password",
      });
    }

    // Данные для JWT
    const payload = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    // Создаём access token
    const accessToken =
      signAccessToken(payload);

    // Создаём уникальный ID
    // refresh token
    const jti = randomUUID();

    // Создаём refresh token
    const refreshToken =
      signRefreshToken(
        payload,
        jti
      );

    // Сохраняем refresh-сессию
    // в MongoDB
    await RefreshSession.create({
      userId: user._id,
      jti,
      expiresAt: new Date(
        Date.now() +
          REFRESH_SESSION_TTL_MS
      ),
    });

    // Сохраняем токены
    // в HttpOnly cookies
    setAuthCookies(
      res,
      accessToken,
      refreshToken
    );

    return res.json({
      message: "Login successful",

      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
        bio: user.bio,
        image: user.image,
        externalLink:
          user.externalLink,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ======================================================
// REFRESH
// ======================================================

export const refresh = async (
  req: Request,
  res: Response
) => {
  try {
    // Получаем refresh token
    // из cookie
    const refreshToken =
      req.cookies[REFRESH_COOKIE];

    if (!refreshToken) {
      return res.status(401).json({
        message:
          "No refresh token provided",
      });
    }

    // Проверяем подпись,
    // срок действия и payload JWT
    const payload =
      verifyRefreshToken(
        refreshToken
      );

    // Проверяем, существует ли такая
    // refresh-сессия, и удаляем её
    const session =
      await RefreshSession.findOneAndDelete(
        {
          jti: payload.jti,
          userId: payload.id,
        }
      );

    if (!session) {
      return res.status(401).json({
        message:
          "Refresh token has been revoked or already used",
      });
    }

    // Проверяем, существует ли пользователь
    const user = await User.findById(
      payload.id
    );

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Создаём актуальный payload
    const newPayload = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    // Создаём новый access token
    const newAccessToken =
      signAccessToken(newPayload);

    // Создаём новый уникальный ID
    const newJti = randomUUID();

    // Создаём новый refresh token
    const newRefreshToken =
      signRefreshToken(
        newPayload,
        newJti
      );

    // Регистрируем новую refresh-сессию
    await RefreshSession.create({
      userId: user._id,
      jti: newJti,
      expiresAt: new Date(
        Date.now() +
          REFRESH_SESSION_TTL_MS
      ),
    });

    // Заменяем старые cookies
    // новыми
    setAuthCookies(
      res,
      newAccessToken,
      newRefreshToken
    );

    return res.json({
      message:
        "Token refreshed successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message:
        "Invalid or expired refresh token",
    });
  }
};

// ======================================================
// LOGOUT
// ======================================================

export const logout = async (
  req: Request,
  res: Response
) => {
  try {
    const refreshToken =
      req.cookies[REFRESH_COOKIE];

    if (refreshToken) {
      try {
        // Проверяем refresh token,
        // чтобы получить его jti
        const payload =
          verifyRefreshToken(
            refreshToken
          );

        // Отзываем refresh-сессию
        await RefreshSession.deleteOne({
          jti: payload.jti,
          userId: payload.id,
        });
      } catch {
        // Даже если refresh token уже
        // просрочен или недействителен,
        // всё равно очищаем cookies
      }
    }

    // Удаляем cookies
    clearAuthCookies(res);

    return res.json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ======================================================
// REQUEST PASSWORD RESET
// ======================================================

export const requestPasswordReset =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const { identifier } = req.body;

      // Проверяем тип
      if (
        typeof identifier !== "string"
      ) {
        return res.status(400).json({
          message:
            "Please enter your email or username",
        });
      }

      // Нормализуем identifier
      const normalizedIdentifier =
        identifier.trim().toLowerCase();

      // Проверяем, что поле не пустое
      if (
        normalizedIdentifier === ""
      ) {
        return res.status(400).json({
          message:
            "Please enter your email or username",
        });
      }

      // Ищем пользователя
      // по email ИЛИ username
      const user = await User.findOne({
        $or: [
          {
            email:
              normalizedIdentifier,
          },
          {
            username:
              normalizedIdentifier,
          },
        ],
      });

      /*
       * ВАЖНО:
       *
       * Мы НЕ сообщаем пользователю,
       * существует ли такой аккаунт.
       *
       * Это защищает от user enumeration.
       */

      if (!user) {
        return res.status(200).json({
          message:
            "If an account exists with this email or username, we've sent instructions to reset your password.",
        });
      }

      // Удаляем старые reset-токены
      // этого пользователя
      await PasswordResetToken.deleteMany(
        {
          userId: user._id,
        }
      );

      // Создаём случайный token
      const resetToken =
        randomBytes(32).toString("hex");

      // Сохраняем в БД только hash token
      const tokenHash = createHash(
        "sha256"
      )
        .update(resetToken)
        .digest("hex");

      // Token действителен 30 минут
      const expiresAt = new Date(
        Date.now() +
          PASSWORD_RESET_TTL_MS
      );

      // Создаём reset token
      await PasswordResetToken.create({
        userId: user._id,
        tokenHash,
        expiresAt,
      });

      // URL frontend
      const frontendUrl =
        process.env.FRONTEND_URL ||
        "http://localhost:5173";

      // Ссылка из email
      const resetLink =
        `${frontendUrl}/reset-password?token=${resetToken}`;

      // Отправляем email
      await sendPasswordResetEmail({
        email: user.email,
        resetLink,
      });

      // Всегда одинаковый ответ
      return res.status(200).json({
        message:
          "If an account exists with this email or username, we've sent instructions to reset your password.",
      });
    } catch (error) {
      console.error(
        "Password reset request error:",
        error
      );

      return res.status(500).json({
        message: "Server error",
      });
    }
  };

// ======================================================
// RESET PASSWORD
// ======================================================

export const resetPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      token,
      password,
    } = req.body;

    // Проверяем тип данных
    if (
      typeof token !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message:
          "Invalid password reset request",
      });
    }

    // Проверяем token
    if (token.trim() === "") {
      return res.status(400).json({
        message:
          "Invalid or expired reset link",
      });
    }

    // Проверяем пароль
    if (password === "") {
      return res.status(400).json({
        message:
          "Please enter your new password",
      });
    }

    // Проверяем минимальную длину
    if (password.length < 8) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters",
      });
    }

    // Hash token из URL
    const tokenHash = createHash(
      "sha256"
    )
      .update(token)
      .digest("hex");

    // Ищем действующий reset token
    const resetToken =
      await PasswordResetToken.findOne({
        tokenHash,
        expiresAt: {
          $gt: new Date(),
        },
      });

    // Token не найден
    // или уже истёк
    if (!resetToken) {
      return res.status(400).json({
        message:
          "Invalid or expired reset link",
      });
    }

    // Ищем пользователя
    const user = await User.findById(
      resetToken.userId
    );

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired reset link",
      });
    }

    // Хешируем новый пароль
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // Обновляем пароль
    user.password = hashedPassword;

    await user.save();

    /*
     * Token становится
     * недействительным после использования.
     */

    await PasswordResetToken.deleteOne({
      _id: resetToken._id,
    });

    /*
     * Удаляем ВСЕ refresh-сессии
     * пользователя.
     *
     * Это означает, что после смены
     * пароля все старые устройства
     * должны авторизоваться заново.
     */

    await RefreshSession.deleteMany({
      userId: user._id,
    });

    return res.status(200).json({
      message:
        "Your password has been successfully reset",
    });
  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};
