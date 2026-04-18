import "./UserList.css";

function UserList({ users, activeUserId, onlineCount }) {
  return (
    <div className="user-list">
      <header className="user-list__header">
        <h1>MultiCode</h1>
        <p>{onlineCount} users online</p>
      </header>

      <ul className="user-list__items">
        {users.map((user) => {
          const isActive = user.id === activeUserId;

          return (
            <li
              key={user.id}
              className={`user-list__item ${isActive ? "user-list__item--active" : ""}`}
            >
              <span
                className={`user-list__status user-list__status--${user.status}`}
                aria-hidden="true"
              />
              <div className="user-list__meta">
                <p className="user-list__name">{user.name}</p>
                <p className="user-list__role">
                  {isActive ? "You" : "Collaborator"}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default UserList;
