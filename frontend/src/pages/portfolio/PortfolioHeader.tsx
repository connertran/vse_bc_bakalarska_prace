import type {
  CompletedSessions,
  UserProfile,
  UserRating,
} from "../../API/types";
import StatPortfolio from "./StatPortfolio.tsx";

type PortfolioHeaderProps = {
  user: UserProfile;
  rating: UserRating;
  completed: CompletedSessions;
  isOwnProfile: boolean;
};

function PortfolioHeader({
  user,
  rating,
  completed,
  isOwnProfile,
}: PortfolioHeaderProps) {
  const facultyNames = user.faculties.map((faculty) => faculty.name).join(", ");

  const isVerified = user.email_verified && user.alt_email_verified;

  function handleOpenChat() {
    console.log("Open chat with user", user.id);
  }

  function handleEditProfile() {
    console.log("Edit profile of user", user.id);
  }

  return (
    <header className="portfolio-header">
      <img
        className="portfolio-avatar"
        src={user.profile_pic}
        alt={`${user.name}'s profile picture`}
        width={140}
        height={140}
      />

      <div className="portfolio-info">
        <div className="portfolio-name-row">
          <h1>{user.name}</h1>
          {isVerified && <span>Verified</span>}
        </div>

        <div className="portfolio-education">
          <p>{user.university?.name ?? "University not set up"}</p>
          {facultyNames && <p>{facultyNames}</p>}
          {user.year_of_study && <p>Year of study: {user.year_of_study}</p>}
        </div>

        <div className="portfolio-stats">
          <StatPortfolio
            label="rating"
            value={rating.average === null ? "-" : rating.average}
          />
          <StatPortfolio label="reviews" value={rating.count} />

          <StatPortfolio
            label="students helped"
            value={completed.as_provider}
          />
          <StatPortfolio label="sessions attended" value={completed.total} />
        </div>
      </div>

      {/* own portfolio => edit profile, someone else's => open chat */}
      <button
        type="button"
        className="portfolio-action-button"
        onClick={isOwnProfile ? handleEditProfile : handleOpenChat}
      >
        {isOwnProfile ? "Edit profile" : "Open chat"}
      </button>
    </header>
  );
}

export default PortfolioHeader;
