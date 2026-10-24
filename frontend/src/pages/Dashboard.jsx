import { useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiCompass, FiHeart, FiLogOut, FiMapPin, FiPlus, FiBookmark, FiStar, FiUser } from "react-icons/fi";
import dashboardBg from "../assets/dashboard-bg.jpg";

const destinations = [
  { name: "Amalfi Coast", country: "Italy", tag: "Coastal escape", image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=85" },
  { name: "Kyoto", country: "Japan", tag: "Slow travel", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85" },
  { name: "Patagonia", country: "Chile", tag: "Wild adventure", image: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=85" },
];

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const firstName = user?.name?.split(" ")[0] || "traveler";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-[#f8f8f5] text-[#17251f]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2.5" aria-label="Smart Trip home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#183d32] text-white"><FiCompass size={19} /></span>
          <span className="text-lg font-semibold tracking-tight">Smart<span className="text-[#da704c]">Trip</span></span>
        </button>
        <div className="hidden items-center gap-8 text-sm font-medium text-[#64716a] md:flex">
          <button className="text-[#183d32]">Home</button>
          <button onClick={() => navigate("/create-trip")} className="transition hover:text-[#183d32]">Plan a trip</button>
          <button onClick={() => navigate("/saved-trips")} className="transition hover:text-[#183d32]">My trips</button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/profile")} className="hidden items-center gap-2 rounded-full border border-[#dfe5df] bg-white px-3 py-2 text-sm font-medium sm:flex"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e8efe8] text-[#183d32]"><FiUser size={14} /></span>{firstName}</button>
          <button onClick={handleLogout} className="rounded-full p-2 text-[#718078] transition hover:bg-white hover:text-[#da704c]" aria-label="Log out"><FiLogOut size={18} /></button>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-12 pt-7 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pt-12">
        <div className="flex flex-col justify-center">
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.18em] text-[#da704c]"><FiStar /> AI-powered travel planning</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.03] tracking-[-.05em] sm:text-6xl">Go somewhere <span className="font-serif italic text-[#da704c]">wonderful.</span></h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#6d7a72]">Your next unforgettable trip starts here. Tell us what you&apos;re dreaming of and Smart Trip will shape every detail around you.</p>
          <div className="mt-8 flex flex-wrap gap-3"><button onClick={() => navigate("/create-trip")} className="flex items-center gap-3 rounded-full bg-[#183d32] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#183d32]/15 transition hover:-translate-y-0.5 hover:bg-[#245744]">Plan a new trip <FiArrowUpRight size={17} /></button><button onClick={() => navigate("/saved-trips")} className="rounded-full border border-[#dce4dc] bg-white px-6 py-3.5 text-sm font-semibold text-[#183d32] transition hover:border-[#183d32]">Explore my trips</button></div>
          <div className="mt-10 flex items-center gap-8 text-sm text-[#718078]"><div><strong className="block text-2xl font-semibold text-[#183d32]">8k+</strong>trips planned</div><div className="h-9 w-px bg-[#dfe5df]" /><div><strong className="block text-2xl font-semibold text-[#183d32]">4.9/5</strong>traveler rating</div></div>
        </div>
        <div className="relative min-h-[430px] overflow-hidden rounded-[2rem]" style={{ backgroundImage: `linear-gradient(180deg, rgba(18,47,38,.04), rgba(18,47,38,.5)), url(${dashboardBg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/30 bg-white/90 p-4 shadow-xl backdrop-blur-md sm:inset-x-7 sm:bottom-7"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-[#da704c]">Today&apos;s inspiration</p><h2 className="mt-1 text-xl font-semibold">Made for the curious</h2></div><span className="rounded-full bg-[#f4e3dc] p-2 text-[#da704c]"><FiHeart size={16} /></span></div><p className="mt-2 text-sm leading-6 text-[#6d7a72]">Trade the familiar for a view you&apos;ll remember forever.</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10"><div className="mb-6 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#da704c]">Curated for you</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Find your next horizon</h2></div><button onClick={() => navigate("/create-trip")} className="hidden items-center gap-2 text-sm font-semibold text-[#183d32] sm:flex">See all inspiration <FiArrowUpRight /></button></div><div className="grid gap-4 md:grid-cols-3">{destinations.map((destination) => <button key={destination.name} onClick={() => navigate("/create-trip")} className="group relative min-h-[265px] overflow-hidden rounded-2xl text-left"><img src={destination.image} alt={`${destination.name}, ${destination.country}`} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#102e26]/85 via-[#102e26]/10 to-transparent" /><div className="absolute bottom-5 left-5 text-white"><p className="mb-1 text-xs font-medium uppercase tracking-widest text-white/70">{destination.tag}</p><h3 className="text-2xl font-semibold">{destination.name}</h3><p className="mt-1 flex items-center gap-1 text-sm text-white/80"><FiMapPin size={13} /> {destination.country}</p></div><span className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-[#183d32] opacity-0 transition group-hover:opacity-100"><FiArrowUpRight /></span></button>)}</div></section>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10"><div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#e9f0e9] p-7 sm:p-10 md:flex-row md:items-center"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#da704c]">Your travel workspace</p><h2 className="mt-2 text-2xl font-semibold">Ready when inspiration strikes.</h2><p className="mt-2 max-w-md text-sm leading-6 text-[#64716a]">Build an itinerary, save your favorite routes, and keep every detail in one beautiful place.</p></div><div className="flex gap-3"><button onClick={() => navigate("/create-trip")} className="flex items-center gap-2 rounded-full bg-[#183d32] px-5 py-3 text-sm font-semibold text-white"><FiPlus /> Start planning</button><button onClick={() => navigate("/saved-trips")} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#183d32]"><FiBookmark className="mr-2 inline" /> Saved trips</button></div></div></section>
    </main>
  );
}

export default Dashboard;
