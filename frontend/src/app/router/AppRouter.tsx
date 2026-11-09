import {
  Suspense,
  type ReactNode,
} from "react";

import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import {
  PageLoader,
} from "../../shared/ui/PageLoader/PageLoader";

import {
  routerConfig,
  AppRoutes,
  RoutePath,
} from "../../shared/config/RouterConfig";

import {
  useAppSelector,
} from "../store/hooks";

import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import MainLayout from "../layouts/MainLayout/MainLayout";

type RouteConfig =
  (typeof routerConfig)[keyof typeof routerConfig];

const ProtectedRoute = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    currentUser,
    isLoading,
  } = useAppSelector(
    (state) => state.user,
  );

  if (isLoading) {
    return <PageLoader />;
  }

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <>{children}</>;
};

const AppRouter = () => {
  const location = useLocation();

  const backgroundLocation =
    location.state?.backgroundLocation;

  const authRoutes =
    Object.values(routerConfig).filter(
      (route) =>
        route.layout === "auth",
    );

  const mainRoutes =
    Object.values(routerConfig).filter(
      (route) =>
        route.layout === "main",
    );

  return (
    <>
      <Routes
        location={
          backgroundLocation ||
          location
        }
      >
        <Route
          element={<AuthLayout />}
        >
          {authRoutes.map(
            (route: RouteConfig) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  route.element ? (
                    <Suspense
                      fallback={
                        <PageLoader />
                      }
                    >
                      {route.element}
                    </Suspense>
                  ) : undefined
                }
              />
            ),
          )}
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <MainLayout
                pathname={
                  location.pathname
                }
              />
            </ProtectedRoute>
          }
        >
          {mainRoutes.map(
            (route: RouteConfig) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  route.element ? (
                    <Suspense
                      fallback={
                        <PageLoader />
                      }
                    >
                      {route.element}
                    </Suspense>
                  ) : undefined
                }
              />
            ),
          )}
        </Route>
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path={
              RoutePath[
                AppRoutes.CREATE
              ]
            }
            element={
              <Suspense
                fallback={
                  <PageLoader />
                }
              >
                {
                  routerConfig[
                    AppRoutes.CREATE
                  ].element
                }
              </Suspense>
            }
          />

          <Route
            path={
              RoutePath[
                AppRoutes.POST
              ]
            }
            element={
              <Suspense
                fallback={
                  <PageLoader />
                }
              >
                {
                  routerConfig[
                    AppRoutes.POST
                  ].element
                }
              </Suspense>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default AppRouter;