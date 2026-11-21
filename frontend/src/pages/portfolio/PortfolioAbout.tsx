type PortfolioAboutProps = {
  bio: string | null;
};

function PortfolioAbout({ bio }: PortfolioAboutProps) {
  return (
    <section className="portfolio-about">
      <h2>About</h2>
      <p>{bio || "This user has not written anything in their bio yet."}</p>
    </section>
  );
}

export default PortfolioAbout;
