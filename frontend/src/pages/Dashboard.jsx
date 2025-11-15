import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5050")
      .then(res => setMessage(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="text-xl">
      Backend says: {message}
    </div>
  );
}
