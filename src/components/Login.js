

export default function Login() {
    return (
      <div className="border border-gray-400 p-8 rounded-2xl bg-white max-w-md mx-auto mt-10 shadow-lg">
        <div className="text-lg font-bold mb-6 text-center">SignIn to your account</div>
        <form className="space-y-6">
          {/* Full Name Input */}
          <div className="relative">
            <input
              required
              autoComplete="off"
              type="text"
              name="text"
              id="username"
              className="w-full px-4 py-3 text-base border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
            />
            <label
              htmlFor="username"
              className="absolute left-4 top-3 text-gray-500 transition-transform duration-300 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-blue-500 bg-white px-1"
            >
              Full Name
            </label>
          </div>
  
          {/* Email Input */}
          <div className="relative">
            <input
              required
              autoComplete="off"
              type="email"
              name="email"
              id="email"
              className="w-full px-4 py-3 text-base border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-3 text-gray-500 transition-transform duration-300 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-blue-500 bg-white px-1"
            >
              Email
            </label>
          </div>
  
          {/* Password Input */}
          <div className="relative">
            <input
              required
              autoComplete="off"
              type="password"
              name="password"
              id="password"
              className="w-full px-4 py-3 text-base border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-3 text-gray-500 transition-transform duration-300 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-75 peer-focus:text-blue-500 bg-white px-1"
            >
              Password
            </label>
          </div>
  
          {/* Submit Button */}
          <div className="text-center space-y-4">
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white text-lg font-bold uppercase rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95 transition-transform"
            >
              Submit
            </button>
            <div className="text-gray-600">
              New here?{" "}
              <span className="text-blue-500 cursor-pointer hover:underline">
                Create Account
              </span>
            </div>
          </div>
        </form>
      </div>
    );
  }
  