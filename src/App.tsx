import React, { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import {
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { auth, db, OperationType, handleFirestoreError } from "./firebase";
import { Vehicle, UserProfile, SiteSettings } from "./types";
import { INITIAL_INVENTORY } from "./constants";
import { cn } from "./lib/utils";
import { motion, AnimatePresence } from "motion/react";
import {
  Gauge,
  Car,
  User as UserIcon,
  LogOut,
  LogIn,
  ChevronRight,
  ChevronLeft,
  Activity,
  Zap,
  ShieldCheck,
  TrendingUp,
  LayoutGrid,
  List as ListIcon,
  Search,
  Plus,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

// Components
import Inventory from "./components/Inventory";
import Garage from "./components/Garage";
import Profile from "./components/Profile";
import { AdminDashboard } from "./components/AdminDashboard";
import Hero from "./components/Hero";
import { VehicleCompare } from "./components/VehicleCompare";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [inventory, setInventory] = useState<Vehicle[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activeTab, setActiveTab] = useState<
    "showroom" | "garage" | "profile" | "admin"
  >("showroom");
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [comparingIds, setComparingIds] = useState<string[]>([]);
  const showroomRef = React.useRef<HTMLDivElement>(null);

  const scrollToShowroom = () => {
    showroomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCompare = (vehicle: Vehicle) => {
    setComparingIds((prev) => {
      if (prev.includes(vehicle.id)) {
        return prev.filter((id) => id !== vehicle.id);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 vehicles at a time.");
        return prev;
      }
      return [...prev, vehicle.id];
    });
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setActiveImageIndex(0);
    setShowDetailsModal(true);
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        console.log("User signed in:", firebaseUser.email);
        // Fetch or create user profile
        const userDocRef = doc(db, "users", firebaseUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email || "",
              photoUrl: firebaseUser.photoURL,
              role: "user",
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          } else {
            setProfile(userDoc.data() as UserProfile);
          }
        } catch (error) {
          handleFirestoreError(
            error,
            OperationType.GET,
            `users/${firebaseUser.uid}`,
          );
        }
      } else {
        setProfile(null);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Inventory Listener
  useEffect(() => {
    if (!isAuthReady) return;

    const q = query(collection(db, "inventory"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as Vehicle,
        );
        if (items.length === 0 && user) {
          // Seed initial inventory if empty (for demo purposes, only if admin or first run)
          // In a real app, this would be done via an admin panel or script
          console.log("Inventory empty, seeding initial data...");
          INITIAL_INVENTORY.forEach(async (v) => {
            try {
              await setDoc(doc(db, "inventory", v.id), v);
            } catch (e) {
              console.error("Failed to seed inventory:", e);
            }
          });
        }
        setInventory(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, "inventory");
      },
    );

    return () => unsubscribe();
  }, [isAuthReady, user]);

  // Settings Listener
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "site"), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as SiteSettings);
      }
    });
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setShowAuthModal(false);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveTab("showroom");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Gauge className="w-12 h-12 text-accent animate-pulse" />
          <p className="font-mono text-xs tracking-widest uppercase opacity-50">
            Initializing KSM Systems...
          </p>
        </motion.div>
      </div>
    );
  }

  if (
    settings?.maintenanceMode &&
    profile?.role !== "admin" &&
    user?.email?.toLowerCase() !== "samenso100@gmail.com"
  ) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-8 text-center">
        <div className="max-w-md flex flex-col items-center gap-6">
          <ShieldAlert className="w-16 h-16 text-accent" />
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            Maintenance Mode
          </h1>
          <p className="text-muted text-sm uppercase tracking-widest font-bold">
            The KSM Autos showroom is currently undergoing technical upgrades.
            Please check back shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ink selection:bg-accent selection:text-bg overflow-x-hidden">
      {/* Dynamic Theme Overrides */}
      {settings?.primaryAccentColor && (
        <style
          dangerouslySetInnerHTML={{
            __html: `
          :root {
            --color-accent: ${settings.primaryAccentColor} !important;
          }
        `,
          }}
        />
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setActiveTab("showroom")}
            >
              <div className="w-8 h-8 bg-accent flex items-center justify-center rounded-sm transform group-hover:rotate-12 transition-transform">
                <Gauge className="w-5 h-5 text-bg" />
              </div>
              <span className="font-bold tracking-tighter text-xl uppercase">
                KSM Autos
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              <NavButton
                active={activeTab === "showroom"}
                onClick={() => setActiveTab("showroom")}
                icon={<LayoutGrid className="w-4 h-4" />}
                label="Showroom"
              />
              <NavButton
                active={activeTab === "garage"}
                onClick={() =>
                  user ? setActiveTab("garage") : setShowAuthModal(true)
                }
                icon={<Car className="w-4 h-4" />}
                label="My Garage"
              />
              {(profile?.role === "admin" ||
                user?.email?.toLowerCase() === "samenso100@gmail.com") && (
                <NavButton
                  active={activeTab === "admin"}
                  onClick={() => setActiveTab("admin")}
                  icon={<ShieldAlert className="w-4 h-4" />}
                  label="Admin"
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border border-line hover:bg-white/5 transition-colors",
                    activeTab === "profile" && "bg-white/10 border-accent/50",
                  )}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt=""
                      className="w-6 h-6 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <UserIcon className="w-4 h-4" />
                  )}
                  <span className="text-xs font-medium hidden sm:inline">
                    {user.displayName}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-muted hover:text-ink transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-accent text-bg font-bold text-xs uppercase tracking-widest rounded-sm hover:scale-105 active:scale-95 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Access Showroom
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <AnimatePresence mode="wait">
          {activeTab === "showroom" && (
            <motion.div
              key="showroom"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Hero onExplore={scrollToShowroom} />

              {/* Featured Section */}
              <div
                ref={showroomRef}
                className="max-w-7xl mx-auto px-4 py-24 border-b border-line"
              >
                <div className="flex justify-between items-end mb-12">
                  <div>
                    <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">
                      Featured Selection
                    </h2>
                    <p className="text-muted text-[10px] uppercase tracking-widest font-bold mt-4">
                      Hand-picked premium inventory
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-accent">
                    <span>Scroll to explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {inventory
                    .filter((v) => v.isFeatured)
                    .slice(0, 2)
                    .map((v) => (
                      <div
                        key={v.id}
                        className="relative aspect-[16/9] overflow-hidden group cursor-pointer"
                        onClick={() => handleViewDetails(v)}
                      >
                        <img
                          src={v.imageUrl}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8">
                          <div className="text-[10px] text-accent uppercase tracking-widest font-bold mb-1">
                            {v.year} {v.make}
                          </div>
                          <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">
                            {v.model}
                          </h3>
                          <div className="mt-4 flex items-center gap-4">
                            <span className="text-xl font-mono font-bold">
                              ${v.price?.toLocaleString()}
                            </span>
                            <div className="h-0.5 w-12 bg-accent" />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="flex-1">
                    <Inventory
                      vehicles={inventory}
                      onInquire={(v) => {
                        setSelectedVehicle(v);
                        setShowInquiryModal(true);
                      }}
                      onCompare={handleCompare}
                      onViewDetails={handleViewDetails}
                      comparingIds={comparingIds}
                    />
                  </div>

                  <div className="lg:w-96 flex flex-col gap-8">
                    <div className="glass p-8 flex flex-col gap-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-accent">
                        Why KSM Autos?
                      </h4>
                      <div className="flex flex-col gap-4">
                        <FeatureItem
                          title="Certified Quality"
                          desc="Every vehicle undergoes a 200-point inspection."
                        />
                        <FeatureItem
                          title="Global Delivery"
                          desc="Secure worldwide shipping for all acquisitions."
                        />
                        <FeatureItem
                          title="Bespoke Finance"
                          desc="Tailored financial solutions for elite clients."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <VehicleCompare vehicles={inventory} />
            </motion.div>
          )}

          {activeTab === "garage" && user && (
            <motion.div
              key="garage"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-7xl mx-auto px-4 py-12"
            >
              <Garage user={user} />
            </motion.div>
          )}

          {activeTab === "profile" && user && profile && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-7xl mx-auto px-4 py-12"
            >
              <Profile user={user} profile={profile} />
            </motion.div>
          )}

          {activeTab === "admin" &&
            user &&
            (profile?.role === "admin" ||
              user?.email?.toLowerCase() === "samenso100@gmail.com") && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-7xl mx-auto px-4 py-12"
              >
                <AdminDashboard user={user} />
              </motion.div>
            )}
        </AnimatePresence>
      </main>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-bg/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass p-8 flex flex-col items-center text-center gap-6"
            >
              <div className="w-16 h-16 bg-accent/10 flex items-center justify-center rounded-full">
                <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tighter uppercase mb-2">
                  Secure Access
                </h2>
                <p className="text-muted text-sm">
                  Join KSM Autos to manage your high-performance collection and
                  access exclusive inventory.
                </p>
              </div>
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-bg font-bold rounded-sm hover:bg-accent hover:text-bg transition-all"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt=""
                  className="w-5 h-5"
                />
                Continue with Google
              </button>
              <p className="text-[10px] uppercase tracking-widest opacity-30">
                Encrypted via Firebase Authentication
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {showInquiryModal && selectedVehicle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInquiryModal(false)}
              className="absolute inset-0 bg-bg/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass p-8 flex flex-col gap-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold tracking-tighter uppercase leading-none">
                    Inquiry
                  </h2>
                  <p className="text-muted text-[10px] uppercase tracking-widest font-bold mt-1">
                    Ref: {selectedVehicle.id.slice(0, 8)}
                  </p>
                </div>
                <button
                  onClick={() => setShowInquiryModal(false)}
                  className="text-muted hover:text-ink"
                >
                  ×
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-sm border border-line">
                <img
                  src={selectedVehicle.imageUrl}
                  alt=""
                  className="w-16 h-16 object-cover rounded-sm"
                />
                <div>
                  <div className="text-[10px] text-muted uppercase tracking-widest font-bold">
                    {selectedVehicle.year} {selectedVehicle.make}
                  </div>
                  <div className="text-lg font-black tracking-tighter uppercase leading-none">
                    {selectedVehicle.model}
                  </div>
                  <div className="text-accent font-mono text-sm font-bold tracking-tighter mt-1">
                    ${selectedVehicle.price?.toLocaleString()}
                  </div>
                </div>
              </div>

              <form
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  try {
                    await addDoc(collection(db, "inquiries"), {
                      vehicleId: selectedVehicle.id,
                      vehicleName: `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`,
                      userName: formData.get("name"),
                      userEmail: formData.get("email"),
                      message: formData.get("message"),
                      status: "pending",
                      createdAt: new Date().toISOString(),
                    });
                    alert(
                      "Inquiry sent successfully. Our team will contact you shortly.",
                    );
                    setShowInquiryModal(false);
                  } catch (err) {
                    handleFirestoreError(
                      err,
                      OperationType.CREATE,
                      "inquiries",
                    );
                  }
                }}
              >
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">
                    Full Name
                  </label>
                  <input
                    name="name"
                    required
                    className="bg-white/5 border border-line p-3 rounded-sm text-sm focus:border-accent outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="bg-white/5 border border-line p-3 rounded-sm text-sm focus:border-accent outline-none"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-muted">
                    Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    className="bg-white/5 border border-line p-3 rounded-sm text-sm focus:border-accent outline-none h-24 resize-none"
                    placeholder="Any specific questions?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-accent text-bg font-bold uppercase tracking-widest rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all mt-2"
                >
                  Send Inquiry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Vehicle Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedVehicle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailsModal(false)}
              className="absolute inset-0 bg-bg/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl glass p-0 flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
            >
              <button
                onClick={() => setShowDetailsModal(false)}
                className="absolute top-4 right-4 z-50 p-2 bg-bg/60 backdrop-blur-md rounded-full text-muted hover:text-ink transition-colors"
              >
                ×
              </button>

              {/* Image Gallery Section */}
              <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden relative group">
                {(() => {
                  const vehicleImages =
                    selectedVehicle.images && selectedVehicle.images.length > 0
                      ? selectedVehicle.images
                      : [
                          selectedVehicle.imageUrl,
                          "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000",
                          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1000",
                        ]; // Fallback to main image + 2 placeholders if no gallery

                  return (
                    <>
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={activeImageIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          src={
                            vehicleImages[
                              activeImageIndex % vehicleImages.length
                            ]
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </AnimatePresence>

                      {vehicleImages.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImageIndex((prev) =>
                                prev === 0
                                  ? vehicleImages.length - 1
                                  : prev - 1,
                              );
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-accent text-bg rounded-full shadow-2xl transition-all z-30 hover:scale-110 active:scale-95 flex items-center justify-center"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImageIndex((prev) =>
                                prev === vehicleImages.length - 1
                                  ? 0
                                  : prev + 1,
                              );
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-accent text-bg rounded-full shadow-2xl transition-all z-30 hover:scale-110 active:scale-95 flex items-center justify-center"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>

                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30 bg-bg/40 backdrop-blur-md px-4 py-2 rounded-full">
                            {vehicleImages.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveImageIndex(idx);
                                }}
                                className={cn(
                                  "w-2 h-2 rounded-full transition-all",
                                  activeImageIndex === idx
                                    ? "bg-accent w-6"
                                    : "bg-white/30 hover:bg-white/50",
                                )}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>

              <div className="flex-1 p-8 flex flex-col gap-8 overflow-y-auto">
                <div>
                  <div className="text-xs text-accent uppercase tracking-widest font-bold mb-1">
                    {selectedVehicle.year} {selectedVehicle.make}
                  </div>
                  <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">
                    {selectedVehicle.model}
                  </h2>
                  <div className="text-2xl font-mono font-bold text-accent mt-2">
                    ${selectedVehicle.price?.toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 py-8 border-y border-line">
                  <DetailSpec
                    icon={<Gauge className="w-4 h-4" />}
                    label="Top Speed"
                    value={`${selectedVehicle.topSpeed} KM/H`}
                  />
                  <DetailSpec
                    icon={<Zap className="w-4 h-4" />}
                    label="0-100 KM/H"
                    value={`${selectedVehicle.acceleration}S`}
                  />
                  <DetailSpec
                    icon={<Activity className="w-4 h-4" />}
                    label="Horsepower"
                    value={`${selectedVehicle.horsepower} BHP`}
                  />
                  <DetailSpec
                    icon={<Car className="w-4 h-4" />}
                    label="Category"
                    value={selectedVehicle.category}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-muted">
                    Description
                  </h4>
                  <p className="text-sm text-muted leading-relaxed">
                    {selectedVehicle.description ||
                      "Experience the pinnacle of automotive engineering with this exceptional high-performance vehicle. Meticulously crafted for elite drivers who demand uncompromising speed and luxury."}
                  </p>
                </div>

                {selectedVehicle.features && (
                  <div className="flex flex-col gap-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-muted">
                      Key Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVehicle.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-white/5 border border-line rounded-full text-[10px] font-bold uppercase tracking-widest"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowInquiryModal(true);
                  }}
                  className="w-full py-4 bg-accent text-bg font-bold uppercase tracking-widest rounded-sm hover:scale-[1.02] active:scale-[0.98] transition-all mt-auto"
                >
                  Inquire About This Vehicle
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-line py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-accent" />
              <span className="font-bold tracking-tighter uppercase">
                KSM Autos
              </span>
            </div>
            <p className="text-xs text-muted">
              High-Performance Vehicle Management System
            </p>
          </div>
          <div className="flex gap-8 text-[10px] uppercase tracking-widest font-medium text-muted">
            <a href="#" className="hover:text-accent transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              API
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Support
            </a>
          </div>
          <div className="font-mono text-[10px] opacity-30">
            © 2026 KSM_AUTOS_SYSTEMS.V4
          </div>
        </div>
      </footer>
    </div>
  );
}

function DetailSpec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-white/5 flex items-center justify-center rounded-sm text-accent">
        {icon}
      </div>
      <div>
        <div className="text-[8px] uppercase tracking-widest font-bold text-muted">
          {label}
        </div>
        <div className="text-xs font-mono font-bold">{value}</div>
      </div>
    </div>
  );
}

function FeatureItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[10px] font-black uppercase tracking-widest text-ink">
        {title}
      </div>
      <p className="text-[10px] text-muted leading-relaxed">{desc}</p>
    </div>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all relative",
        active ? "text-accent" : "text-muted hover:text-ink",
      )}
    >
      {icon}
      {label}
      {active && (
        <motion.div
          layoutId="nav-underline"
          className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent"
        />
      )}
    </button>
  );
}
