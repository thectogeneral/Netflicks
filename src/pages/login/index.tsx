import { Button, Input } from "@nextui-org/react";
import Loading from "../../components/Loading";
//import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [backdrop, setBackdrop] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/movie/27205/images?api_key=bb2818a2abb39fbdf6da79343e5e376b`
      )
      .then((res) => {
        setBackdrop(
          "https://image.tmdb.org/t/p/original" +
            res.data.backdrops[3].file_path
        );
      });

    const params = new URLSearchParams(location.search);
    const email = params.get("email");
    if (email) {
      setEmail(email);
    }
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div
          style={{
            position: "relative",
            backgroundImage: `url(${backdrop})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={`flex flex-col items-center justify-center min-h-screen`}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)",
            }}
          ></div>

          <div className="relative z-10 w-full max-w-md flex flex-col items-center rounded-md p-8">
            <h1 className="text-white text-3xl font-bold mb-6">Login</h1>
            <form className="w-full">
              <Input
                isRequired
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md text-white mb-4"
                label="Email"
                labelClassName="text-white"
              />
              <Input
                isRequired
                //type={isVisible ? "text" : "password"}
                placeholder="enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md text-white mb-4"
                label="Password"
                labelClassName="text-white"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    //onClick={toggleVisibility}
                  ></button>
                }
              />
              <Button
                //onClick={handleSubmit}
                className="w-full mt-4 text-white"
                color="primary"
              >
                Login
              </Button>
            </form>
            <p className="text-white mt-4 text-center">
              Don{"'"}t Have An Account? <span className="text-white"> | </span>
              <Button
                //onClick={resetPassword}
                className="bg-transparent text-blue-500 underline"
              >
                Forgot Password
              </Button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
