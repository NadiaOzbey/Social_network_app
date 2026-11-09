import cls from "./SearchSidebar.module.scss";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAppSelector } from "../../../../../app/store/hooks";

import {
  searchUsers,
  type SearchUser,
} from "../../../../../shared/api/user";

import RecentUsersList from "./RecentUsersList/RecentUsersList";
import FoundUsersList from "./FoundUsersList/FoundUsersList";

const SearchSidebar = () => {
  const navigate = useNavigate();

  const { currentUser } = useAppSelector((state) => state.user);

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [recentUsers, setRecentUsers] = useState<SearchUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const recentUsersKey = currentUser
    ? `ichgram_recent_users_${currentUser._id}`
    : null;

  useEffect(() => {
    if (!recentUsersKey) {
      setRecentUsers([]);
      return;
    }

    const savedUsers = localStorage.getItem(recentUsersKey);

    if (!savedUsers) {
      setRecentUsers([]);
      return;
    }

    try {
      setRecentUsers(JSON.parse(savedUsers) as SearchUser[]);
    } catch {
      setRecentUsers([]);
    }
  }, [recentUsersKey]);

  useEffect(() => {
    if (!recentUsersKey) {
      return;
    }

    localStorage.setItem(
      recentUsersKey,
      JSON.stringify(recentUsers),
    );
  }, [recentUsers, recentUsersKey]);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setUsers([]);
      setError("");
      setIsLoading(false);

      return;
    }

    const loadUsers = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await searchUsers(trimmedQuery);

        setUsers(data);
      } catch (error) {
        console.error("Failed to search users:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to search users.",
        );

        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [query]);

  const handleClear = () => {
    setQuery("");
  };

  const handleUserClick = (user: SearchUser) => {
    setRecentUsers((previousUsers) => {
      const filteredUsers = previousUsers.filter(
        (recentUser) => recentUser._id !== user._id,
      );

      return [user, ...filteredUsers];
    });

    navigate(`/profile/${user._id}`);
  };

  return (
    <aside>
      <h1>Search</h1>

      <div className={cls.searchBar}>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search"
        />

        <button
          type="button"
          onClick={handleClear}
          aria-label="Close search"
        >
          ×
        </button>
      </div>

      <div className={cls.recent}>
        <h3>Recent</h3>

        <RecentUsersList users={recentUsers} />
      </div>

      {isLoading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!isLoading &&
        !error &&
        query.trim() !== "" &&
        users.length === 0 && <p>No users found.</p>}

      {!isLoading && users.length > 0 && (
        <FoundUsersList
          users={users}
          onUserClick={handleUserClick}
        />
      )}
    </aside>
  );
};

export default SearchSidebar;