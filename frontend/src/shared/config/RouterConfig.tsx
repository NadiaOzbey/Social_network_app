import LoginPage from "../../pages/LoginPage/LoginPage";
import ResetPage from "../../pages/ResetPage/ResetPage";
import SignUpPage from "../../pages/SignUpPage/SignUpPage";
import MainPage from "../../pages/MainPage/MainPage";
import ProfilePage from "../../pages/ProfilePage/ProfilePage";
import EditProfilePage from "../../pages/EditProfilePage/EditProfilePage";
import PostPage from "../../pages/PostPage/PostPage";
import ExplorePage from "../../pages/ExplorePage/ExplorePage";
import NotFoundPage from "../../pages/NotFoundPage/NotFoundPage";

import CreatePost from "../../features/Post/CreatePost/CreatePost";

import SearchSidebar from "../../app/layouts/MainLayout/SecondarySidebars/SearchSidebar/SearchSidebar";
import NotificationsSidebar from "../../app/layouts/MainLayout/SecondarySidebars/NotificationsSidebar/NotificationsSidebar";

export const AppRoutes = {
  MAIN: "main",
  LOGIN: "login",
  SIGNUP: "signUp",
  RESET: "reset",
  PROFILE: "profile",
  EDIT_PROFILE: "editProfile",
  NOTIFICATIONS: "notifications",
  SEARCH: "search",
  EXPLORE: "explore",
  CREATE: "create",
  POST: "post",
  NOT_FOUND: "notFound",
} as const;

export const RoutePath = {
  [AppRoutes.MAIN]: "/",
  [AppRoutes.LOGIN]: "/login",
  [AppRoutes.SIGNUP]: "/register",
  [AppRoutes.RESET]: "/reset",
  [AppRoutes.PROFILE]: "/profile/:userId",
  [AppRoutes.EDIT_PROFILE]: "/profile/:userId/edit",
  [AppRoutes.NOTIFICATIONS]: "/notifications",
  [AppRoutes.SEARCH]: "/search",
  [AppRoutes.EXPLORE]: "/explore",
  [AppRoutes.CREATE]: "/create",
  [AppRoutes.POST]: "/post/:postId",
  [AppRoutes.NOT_FOUND]: "*",
} as const;

export const routerConfig = {
  [AppRoutes.MAIN]: {
    path: RoutePath[AppRoutes.MAIN],
    element: <MainPage />,
    layout: "main",
  },

  [AppRoutes.LOGIN]: {
    path: RoutePath[AppRoutes.LOGIN],
    element: <LoginPage />,
    layout: "auth",
  },

  [AppRoutes.SIGNUP]: {
    path: RoutePath[AppRoutes.SIGNUP],
    element: <SignUpPage />,
    layout: "auth",
  },

  [AppRoutes.RESET]: {
    path: RoutePath[AppRoutes.RESET],
    element: <ResetPage />,
    layout: "auth",
  },

  [AppRoutes.PROFILE]: {
    path: RoutePath[AppRoutes.PROFILE],
    element: <ProfilePage />,
    layout: "main",
  },

  [AppRoutes.EDIT_PROFILE]: {
    path: RoutePath[AppRoutes.EDIT_PROFILE],
    element: <EditProfilePage />,
    layout: "main",
  },

  [AppRoutes.NOTIFICATIONS]: {
    path: RoutePath[AppRoutes.NOTIFICATIONS],
    element: <NotificationsSidebar />,
    layout: "main",
  },

  [AppRoutes.SEARCH]: {
    path: RoutePath[AppRoutes.SEARCH],
    element: <SearchSidebar />,
    layout: "main",
  },

  [AppRoutes.EXPLORE]: {
    path: RoutePath[AppRoutes.EXPLORE],
    element: <ExplorePage />,
    layout: "main",
  },

  [AppRoutes.CREATE]: {
    path: RoutePath[AppRoutes.CREATE],
    element: <CreatePost />,
    layout: "main",
  },

  [AppRoutes.POST]: {
    path: RoutePath[AppRoutes.POST],
    element: <PostPage />,
    layout: "main",
  },

  [AppRoutes.NOT_FOUND]: {
    path: RoutePath[AppRoutes.NOT_FOUND],
    element: <NotFoundPage />,
    layout: "main",
  },
} as const;