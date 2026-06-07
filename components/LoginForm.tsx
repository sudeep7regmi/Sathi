"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("login sucessfull");
        router.push("/dashboard");
      } else {
        alert("invalid credential");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center py-66
 "
    >
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-xl rounded-3xl text-shadow-black p-6 shadow-md w-full max-w-sm"
      >
        {" "}
        <div className="bg-cover text-center  ">
          <h1 className="text-3xl p-4">Login</h1>
          <p className="text-shadow-olive-400 pb-3 mb-4"><u className="text-black cursor-pointer">Sign in</u> using a registered email and password </p>
        </div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="name@example.com"
          className="w-full p-2 mb-4 border rounded"
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="********"
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="flex items-center justify-between mb-4 gap-4">
          <button
            type="submit"
            className="w-full text-lg bg-green-800 text-white rounded-4xl p-3 hover:bg-blue-950 cursor-pointer"
          >
            Login
          </button>{" "}
          <Link
            href="/register"
            className="text-sm text-blue-500 hover:underline"
          >
            <p className="underline hover:text-blue-500 text-base">Register</p>
          </Link>
        </div>
      </form>
    </div>
  );
}
