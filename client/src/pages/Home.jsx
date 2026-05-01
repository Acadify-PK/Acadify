import { useEffect } from "react";
import axios from "../api/axios";

function Home() {
  useEffect(() => {
    axios
      .get("/")
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">LMS Home Page</h1>
    </div>
  );
}

export default Home;
