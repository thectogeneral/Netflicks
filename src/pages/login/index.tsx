import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { createToast } from "vercel-toast";
import { useRouter } from "next/router";
import { auth } from "../../../config/firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ClipLoader } from "react-spinners";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [backdrop, setBackdrop] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEmail = /\S+@\S+\.\S+/.test(email);

    try {
      if (!email || !password) {
        return createToast("Please fill in all the fields", {
          cancel: "Cancel",
          timeout: 3000,
          type: "error",
        });
      } else if (!isEmail) {
        return createToast("Please enter a valid email", {
          cancel: "Cancel",
          timeout: 3000,
          type: "error",
        });
      } else {
        setLoggedIn(true);
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      if (error.message.includes("not-found")) {
        setLoggedIn(false);
        return createToast("The user is not found", {
          action: {
            text: "Sign Up",
            callback(toast) {
              router.push("/signup");
              toast.destroy();
            },
          },
          timeout: 3000,
          cancel: "Cancel",
          type: "dark",
        });
      } else if (error.message.includes("wrong-password")) {
        setLoggedIn(false);
        return createToast("The password is incorrect", {
          cancel: "Cancel",
          timeout: 3000,
          type: "error",
        });
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

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
      })
      .catch((err) => console.error(err));

    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <ClipLoader color="#ffffff" size={150} />
        </div>
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

          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 w-full max-w-md flex flex-col items-center bg-gray-800 bg-opacity-80 p-8 rounded-lg shadow-lg">
            <h1 className="text-white text-3xl font-bold mb-6">Login</h1>
            <form className="w-full" onSubmit={handleSubmit}>
              <div className="mb-4">
                <Input
                  isRequired
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <InputGroup className="mb-4">
                  <Input
                    type={isVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />

                  <InputRightElement width="4.5rem">
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <FaRegEye className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <FaRegEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  </InputRightElement>
                </InputGroup>
              </div>

              {loggedIn ? (
                <Button
                  disabled
                  color="primary"
                  className="ml-auto w-full flex justify-center items-center gap-2"
                >
                  <ClipLoader color="#ffffff" size={24} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                  color="primary"
                >
                  Login
                </Button>
              )}
            </form>
            <p className="text-white mt-4 text-center">
              Don't Have An Account?{" "}
              <Link className="text-blue-500 underline" href="/signup">
                Sign Up
              </Link>
              <span className="text-white"> | </span>
              <Button
                // Uncomment and implement resetPassword when needed
                // onClick={resetPassword}
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
