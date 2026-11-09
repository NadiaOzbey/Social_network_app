import { Link } from "react-router-dom";

import {
  getUserImageUrl,
  type SearchUser,
} from "../../../../../../shared/api/user";

import cls from "./FoundUsersList.module.scss";

type FoundUsersListProps = {
  users: SearchUser[];
  onUserClick: (user: SearchUser) => void;
};

const FoundUsersList = ({
  users,
  onUserClick,
}: FoundUsersListProps) => {
  return (
    <div className={cls.container}>
      {users.map((user) => (
        <Link
          key={user._id}
          to={`/profile/${user._id}`}
          onClick={() => onUserClick(user)}
        >
          <div className={cls.userLine}>
            <img
              src={getUserImageUrl(user._id)}
              alt={`${user.username} avatar`}
            />

            <div className={cls.nameInfo}>
              <p>{user.username}</p>

              <p>{user.fullName}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FoundUsersList;