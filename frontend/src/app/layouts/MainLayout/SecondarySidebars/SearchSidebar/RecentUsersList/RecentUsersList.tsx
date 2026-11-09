import { Link } from "react-router-dom";

import {
  getUserImageUrl,
  type SearchUser,
} from "../../../../../../shared/api/user";

import cls from "./RecentUsersList.module.scss";

type RecentUsersListProps = {
  users: SearchUser[];
};

const RecentUsersList = ({ users }: RecentUsersListProps) => {
  if (users.length === 0) {
    return <p>No recent users.</p>;
  }

  return (
    <div className={cls.container}>
      {users.map((user) => (
        <Link key={user._id} to={`/profile/${user._id}`}>
          <div className={cls.userLine}>
            <img
              src={getUserImageUrl(user._id)}
              alt={`${user.username} avatar`}
            />

            <p>{user.username}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecentUsersList;