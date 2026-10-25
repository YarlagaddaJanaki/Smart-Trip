import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import Swal from "sweetalert2";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            setIsSubmitting(true);

            const response = await loginUser({ email, password });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            await Swal.fire({
                title: "Smart Trip",
                text: "Login Successful!",
                icon: "success",
                confirmButtonColor: "#193b30",
                background: "#fffdf8",
                color: "#193b30"
            });

            navigate("/dashboard");
        } catch (error) {
            Swal.fire({
                title: "Login Failed",
                text: error.response?.data?.message || "Login Failed",
                icon: "error",
                confirmButtonColor: "#193b30",
                background: "#fffdf8",
                color: "#193b30"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="login-page">
            <div className="login-decoration login-decoration-one" aria-hidden="true" />
            <div className="login-decoration login-decoration-two" aria-hidden="true" />

            <section className="login-layout">
                <div className="login-intro">
                    <Link to="/" className="login-brand" aria-label="Smart Trip">
                        <span className="login-brand-icon" aria-hidden="true">✦</span>
                        <span>smart<span className="login-brand-accent">trip</span></span>
                    </Link>

                    <p className="login-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
                    <h1>Every journey<br />starts with a <em>hello.</em></h1>
                    <p className="login-intro-copy">
                        Welcome back to Smart Trip. Your next great discovery
                        is just around the corner.
                    </p>

                    <div className="login-travel-note">
                        <span className="login-note-icon" aria-hidden="true">↗</span>
                        <div>
                            <strong>Pick up where you left off.</strong>
                            <span>Your next adventure is waiting.</span>
                        </div>
                    </div>
                </div>

                <div className="login-card">
                    <div className="login-card-heading">
                        <span className="login-card-kicker">WELCOME BACK</span>
                        <h2>Log in to Smart Trip</h2>
                        <p>Enter your details to continue your journey.</p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <label className="login-field">
                            <span>Email address</span>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="email"
                                required
                            />
                        </label>
                      <label className="login-field">
                            <span>Password</span>
                            <div className="login-password-wrap">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="login-password-toggle"
                                    onClick={() => setShowPassword((current) => !current)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </label>

                        <button type="submit" className="login-submit" disabled={isSubmitting}>
                            {isSubmitting ? "Logging in..." : "Log in"}
                            {!isSubmitting && <span aria-hidden="true">↗</span>}
                        </button>
                    </form>

                    <p className="login-register-prompt">
                        Don't have an account? <Link to="/register">Create one</Link>
                    </p>

                    <div className="login-card-footer">
                        <span aria-hidden="true">✦</span> Made for curious travellers
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Login;
