import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import Swal from "sweetalert2";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            Swal.fire({
                title: "Passwords don't match",
                text: "Please make sure both passwords are the same.",
                icon: "warning",
                confirmButtonColor: "#193b30"
            });
            return;
        }

        if (password.length < 6) {
            Swal.fire({
                title: "Choose a stronger password",
                text: "Your password must contain at least 6 characters.",
                icon: "warning",
                confirmButtonColor: "#193b30"
            });
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await registerUser({ name, email, password });

            await Swal.fire({
                title: "Welcome to Smart Trip!",
                text: response.data.message || "Your account has been created successfully.",
                icon: "success",
                confirmButtonColor: "#193b30",
                background: "#fffdf8",
                color: "#193b30"
            });

            navigate("/");
        } catch (error) {
            Swal.fire({
                title: "Registration failed",
                text: error.response?.data?.message || "Please try again in a moment.",
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
        <main className="register-page">
            <div className="register-decoration register-decoration-one" aria-hidden="true" />
            <div className="register-decoration register-decoration-two" aria-hidden="true" />

            <section className="register-layout">
                <div className="register-intro">
                    <Link to="/" className="register-brand" aria-label="Smart Trip home">
                        <span className="register-brand-icon" aria-hidden="true">✦</span>
                        <span>smart<span className="register-brand-accent">trip</span></span>
                    </Link>

                    <p className="register-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
                    <h1>More places.<br />More <em>memories.</em></h1>
                    <p className="register-intro-copy">
                        Create your account and start planning thoughtful journeys,
                        discovering new places, and making every trip your own.
                    </p>

                    <div className="register-travel-note">
                        <span className="register-note-icon" aria-hidden="true">↗</span>
                        <div>
                            <strong>Your journey, your way.</strong>
                            <span>Discover somewhere wonderful.</span>
                        </div>
                    </div>
                </div>
                 <div className="register-card">
                    <div className="register-card-heading">
                        <span className="register-card-kicker">LET'S GET STARTED</span>
                        <h2>Create your account</h2>
                        <p>Join Smart Trip and plan your next adventure.</p>
                    </div>

                    <form onSubmit={handleRegister} className="register-form">
                        <label className="register-field">
                            <span>Full name</span>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                autoComplete="name"
                                required
                            />
                        </label>

                        <label className="register-field">
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

                        <label className="register-field">
                            <span>Password</span>
                            <div className="register-password-wrap">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="At least 6 characters"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    autoComplete="new-password"
                                    minLength={6}
                                    required
                                />
                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={() => setShowPassword((current) => !current)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </label>

                        <label className="register-field">
                            <span>Confirm password</span>
                            <div className="register-password-wrap">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Enter your password again"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={() => setShowConfirmPassword((current) => !current)}
                                    aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </label>

                        <button
                            type="submit"
                            className="register-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating account..." : "Create account"}
                            {!isSubmitting && <span aria-hidden="true">↗</span>}
                        </button>
                    </form>

                    <p className="register-login-prompt">
                        Already have an account? <Link to="/">Log in</Link>
                    </p>

                    <div className="register-card-footer">
                        <span aria-hidden="true">✦</span> Made for curious travellers
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Register;

