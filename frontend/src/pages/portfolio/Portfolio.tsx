import { useEffect, useState } from "react";
import { useParams } from "react-router";
import API from "../../API/api";
import type {
  CompletedSessions,
  UserCourse,
  UserProfile,
  UserRating,
} from "../../API/types";
import getCurrentUserId from "../../auth/getCurrentUserId";
import PortfolioHeader from "./PortfolioHeader";
import PortfolioAbout from "./PortfolioAbout";
import PortfolioCourses from "./PortfolioCourses";
import "./Portfolio.css";

type PortfolioData = {
  user: UserProfile;
  rating: UserRating;
  completed: CompletedSessions;
  courses: UserCourse[];
};

function Portfolio() {
  const { id } = useParams();
  const currentUserId = getCurrentUserId();
  const userId = Number(id);

  const [data, setData] = useState<PortfolioData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || Number.isNaN(userId)) {
      setError("Invalid user id.");
      return;
    }

    // ignore the response if the user changed before it arrived
    let isCancelled = false;
    setData(null);
    setError(null);

    async function loadPortfolio(userId: number) {
      try {
        const [user, rating, completed, courses] = await Promise.all([
          API.getUser(userId),
          API.getUserRating(userId),
          API.getUserCompletedSessions(userId),
          API.getUserCourses(userId),
        ]);
        if (!isCancelled) setData({ user, rating, completed, courses });
      } catch (err) {
        if (!isCancelled)
          setError(Array.isArray(err) ? err.join(", ") : "Request failed");
      }
    }

    loadPortfolio(userId);
    // cleanup function
    // when the user changes the user's portfolio id, the old unfinished request will be cancelled
    return () => {
      isCancelled = true;
    };
  }, [userId]);

  if (error) return <p className="portfolio">{error}</p>;
  if (!data) return <p className="portfolio">Loading...</p>;

  return (
    <main className="portfolio">
      <PortfolioHeader
        user={data.user}
        rating={data.rating}
        completed={data.completed}
        isOwnProfile={data.user.id === currentUserId}
      />
      <PortfolioAbout bio={data.user.bio} />
      <PortfolioCourses
        courses={data.courses}
        isOwnProfile={data.user.id === currentUserId}
      />
    </main>
  );
}

export default Portfolio;
