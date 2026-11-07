import LoggedInStatusRedirection from "../auth/LoggedInStatusRedirection";

function Home() {
  return (
    <>
      <LoggedInStatusRedirection />
      <h1>Home</h1>
    </>
  );
}

export default Home;
