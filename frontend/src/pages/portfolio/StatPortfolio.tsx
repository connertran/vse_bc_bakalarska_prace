import "./Portfolio.css";

type StatPortfolioProps = {
  label: string;
  value: string | number;
};

function StatPortfolio({ label, value }: StatPortfolioProps) {
  return (
    <div className="portfolio-stat">
      {value} {label}
    </div>
  );
}

export default StatPortfolio;
