import jwt, {
  type JwtPayload,
  type SignOptions,
} from "jsonwebtoken";

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} must be set in .env`);
  }

  return value;
}

const ACCESS_SECRET = requireEnv("JWT_ACCESS_SECRET");
const REFRESH_SECRET = requireEnv("JWT_REFRESH_SECRET");

const ACCESS_EXPIRES_IN = (
  process.env.JWT_ACCESS_EXPIRES_IN ?? "15m"
) as SignOptions["expiresIn"];

const REFRESH_EXPIRES_IN = (
  process.env.JWT_REFRESH_EXPIRES_IN ?? "7d"
) as SignOptions["expiresIn"];

export interface TokenPayload {
  id: string;
  email: string;
  username: string;
}

export interface RefreshTokenPayload extends TokenPayload {
  jti: string;
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
    algorithm: "HS256",
  });
}

export function signRefreshToken(
  payload: TokenPayload,
  jti: string
): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
    algorithm: "HS256",
    jwtid: jti,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, ACCESS_SECRET, {
    algorithms: ["HS256"],
  });

  if (
    typeof decoded === "string" ||
    typeof decoded.id !== "string" ||
    typeof decoded.email !== "string" ||
    typeof decoded.username !== "string"
  ) {
    throw new Error("Invalid access token payload");
  }

  return {
    id: decoded.id,
    email: decoded.email,
    username: decoded.username,
  };
}

export function verifyRefreshToken(
  token: string
): RefreshTokenPayload {
  const decoded = jwt.verify(token, REFRESH_SECRET, {
    algorithms: ["HS256"],
  }) as JwtPayload & Partial<TokenPayload>;

  if (
    typeof decoded.id !== "string" ||
    typeof decoded.email !== "string" ||
    typeof decoded.username !== "string" ||
    typeof decoded.jti !== "string"
  ) {
    throw new Error("Invalid refresh token payload");
  }

  return {
    id: decoded.id,
    email: decoded.email,
    username: decoded.username,
    jti: decoded.jti,
  };
}