import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://egyxvzjfqnpcfdnwusxn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVneXh2empmcW5wY2Zkbnd1c3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODMyMjUsImV4cCI6MjA4OTg1OTIyNX0.modzK6AhGyo3YBjZtDl2lK4tFQuj0B3KsDFIf2n-was";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SLIDES = [
  "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=1200&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80",
  "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=1200&q=80",
  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=1200&q=80",
];

const LOCATIONS = [
  { id: 1, name: "Ascot Vale", address: "2 Epsom Road, Ascot Vale, 3032", time: "15 Minutes" },
  { id: 2, name: "Location 2", address: "Address coming soon", time: "20 Minutes" },
  { id: 3, name: "Location 3", address: "Address coming soon", time: "25 Minutes" },
];

const MEAT_OPTIONS = ["Lamb", "Chicken", "Mixed Meat"];
const SAUCE_OPTIONS = ["BBQ", "Garlic", "Chilli", "Peri Peri", "No Sauce"];
const TOPPING_OPTIONS = [
  { name: "Extra Cheese", price: 1.50 },
  { name: "Jalapeños", price: 0.50 },
  { name: "Bacon", price: 2.00 },
  { name: "Avocado", price: 1.50 },
  { name: "Fried Egg", price: 1.00 },
  { name: "Extra Sauce", price: 0.50 },
];

const DELIVERY_PARTNERS = [
  { name: "Menulog", color: "#ff6b35", emoji: "🟠", url: "https://www.menulog.com.au/restaurants-angies-kebabs-burgers" },
  { name: "DoorDash", color: "#ff3008", emoji: "🔴", url: "https://www.doordash.com/store/angies-kebabs-burgers" },
  { name: "Uber Eats", color: "#06c167", emoji: "🟢", url: "https://www.ubereats.com/store/angies-kebabs-burgers" },
];

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
  "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80",
  "https://images.unsplash.com/photo-1561758033-7e924f619b47?w=400&q=80",
  "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80",
];

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menu, setMenu] = useState({});
  const [pages, setPages] = useState([]);
  const [orderType, setOrderType] = useState("pickup");
  const [activeCategory, setActiveCategory] = useState("__popular__");
  const [activePage, setActivePage] = useState("home");
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [appPage, setAppPage] = useState("menu");
  const [paying, setPaying] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showCartMobile, setShowCartMobile] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMeat, setSelectedMeat] = useState(MEAT_OPTIONS[0]);
  const [selectedSauce, setSelectedSauce] = useState(SAUCE_OPTIONS[0]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [qty, setQty] = useState(1);
  const [orderNum] = useState(() => Math.floor(Math.random() * 90000) + 10000);
  const [loading, setLoading] = useState(true);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlideIndex(p => (p + 1) % SLIDES.length), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetchMenu();
    fetchPages();
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null));
    supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user || null));
  }, []);

  async function fetchMenu() {
    setLoading(true);
    const { data } = await supabase.from("menu_items").select("*").eq("available", true).order("category");
    if (data && data.length > 0) {
      const grouped = {};
      data.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item);
      });
      setMenu(grouped);
    }
    setLoading(false);
  }

  async function fetchPages() {
    const { data } = await supabase.from("pages").select("*").eq("show_in_nav", true).order("sort_order");
    if (data) setPages(data.filter(p => p.slug !== "home"));
  }

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPass });
    if (error) alert("Login failed: " + error.message);
    else setShowLoginModal(false);
  }

  const openItemDetail = (item) => {
    setSelectedItem(item);
    setSelectedMeat(MEAT_OPTIONS[0]);
    setSelectedSauce(SAUCE_OPTIONS[0]);
    setSelectedToppings([]);
    setSelectedAddons([]);
    setQty(1);
  };

  const toggleTopping = (t) => setSelectedToppings(prev => prev.find(x => x.name === t.name) ? prev.filter(x => x.name !== t.name) : [...prev, t]);
  const toggleAddon = (a) => setSelectedAddons(prev => prev.find(x => x.name === a.name) ? prev.filter(x => x.name !== a.name) : [...prev, a]);

  const toppingTotal = selectedToppings.reduce((s, t) => s + t.price, 0);
  const addonTotal = selectedAddons.reduce((s, a) => s + (a.price || 0), 0);
  const itemTotal = selectedItem ? (selectedItem.price + toppingTotal + addonTotal) * qty : 0;

  const addToCartWithOptions = () => {
    if (!selectedItem) return;
    setCart(prev => [...prev, {
      ...selectedItem,
      cartId: Date.now(),
      meat: selectedMeat,
      sauce: selectedSauce,
      toppings: selectedToppings,
      addons: selectedAddons,
      qty,
      finalPrice: selectedItem.price + toppingTotal + addonTotal,
    }]);
    setSelectedItem(null);
  };

  const removeFromCart = (cartId) => setCart(prev => prev.filter(c => c.cartId !== cartId));
  const subtotal = cart.reduce((s, c) => s + c.finalPrice * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const handlePay = async () => {
    setPaying(true);
    await supabase.from("orders").insert({
      order_number: `#${orderNum}`, order_type: orderType,
      items: cart, total: subtotal, status: "pending", payment_status: "paid",
    });
    setTimeout(() => { setPaying(false); setAppPage("confirmation"); setShowCartMobile(false); }, 1500);
  };

  const allItems = Object.values(menu).flat();
  const popularItems = allItems.slice(0, 6);
  const menuCategories = Object.keys(menu);
  const allNavCats = menuCategories.length > 0 ? ["Popular", ...menuCategories] : [];

  const displayItems = search.trim()
    ? allItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || (i.description || "").toLowerCase().includes(search.toLowerCase()))
    : activeCategory === "__popular__" ? popularItems : (menu[activeCategory] || []);

  const displayLabel = search.trim() ? `Search: "${search}"` : activeCategory === "__popular__" ? "Popular" : activeCategory;
  const currentPage = pages.find(p => p.slug === activePage);

  const goHome = () => { setActivePage("home"); setActiveCategory("__popular__"); setSearch(""); setAppPage("menu"); };

  const OrderPanel = () => (
    <div style={{ background: "#fff", borderRadius: isMobile ? 0 : 16, border: "1px solid #e8e8e8", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 900, fontFamily: "'Nunito',sans-serif" }}>Order</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setOrderType("pickup")} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700, background: orderType === "pickup" ? "#1a1a1a" : "#fff", color: orderType === "pickup" ? "#fff" : "#555", border: "1px solid #e0e0e0", cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>Pickup</button>
            <button onClick={() => { setOrderType("delivery"); setShowDeliveryModal(true); }} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700, background: orderType === "delivery" ? "#1a1a1a" : "#fff", color: orderType === "delivery" ? "#fff" : "#555", border: "1px solid #e0e0e0", cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>Delivery</button>
          </div>
        </div>

        <div style={{ position: "relative", marginBottom: 10 }}>
          <button onClick={() => setShowLocationDropdown(!showLocationDropdown)} style={{ width: "100%", display: "flex", gap: 10, alignItems: "center", background: "#f7f7f5", border: "1px solid #e0e0e0", borderRadius: 10, padding: "10px 14px", cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
            <span>📍</span>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 800 }}>{selectedLocation.name}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{selectedLocation.address}</div>
            </div>
            <span style={{ color: "#888", fontSize: 12 }}>{showLocationDropdown ? "▲" : "▼"}</span>
          </button>
          {showLocationDropdown && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #e0e0e0", borderRadius: 10, zIndex: 200, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", marginTop: 4 }}>
              {LOCATIONS.map(loc => (
                <button key={loc.id} onClick={() => { setSelectedLocation(loc); setShowLocationDropdown(false); }} style={{ width: "100%", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, background: selectedLocation.id === loc.id ? "#fff8f5" : "#fff", border: "none", borderBottom: "1px solid #f0f0f0", cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
                  <span>📍</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: selectedLocation.id === loc.id ? "#e8520a" : "#1a1a1a" }}>{loc.name}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{loc.address}</div>
                  </div>
                  {selectedLocation.id === loc.id && <span style={{ marginLeft: "auto", color: "#e8520a" }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span>🕐</span>
          <div>
            <div style={{ fontSize: 12, color: "#888" }}>Pickup Time</div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>Today - {selectedLocation.time}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", minHeight: 80 }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12, fontFamily: "'Nunito',sans-serif" }}>Items</div>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", color: "#bbb", fontSize: 13, padding: "16px 0" }}>Your cart is empty</div>
        ) : cart.map(item => (
          <div key={item.cartId} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #f5f5f5" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>{item.name} × {item.qty}</div>
                {(item.meat || item.sauce) && <div style={{ fontSize: 11, color: "#888" }}>{item.meat}{item.sauce ? ` · ${item.sauce}` : ""}</div>}
                {item.toppings?.length > 0 && <div style={{ fontSize: 11, color: "#e8520a" }}>+{item.toppings.map(t => t.name).join(", ")}</div>}
                {item.addons?.length > 0 && <div style={{ fontSize: 11, color: "#e8520a" }}>+{item.addons.map(a => a.name).join(", ")}</div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>${(item.finalPrice * item.qty).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.cartId)} style={{ width: 20, height: 20, borderRadius: "50%", background: "#fee", color: "#f43f5e", border: "none", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Complement */}
      {allItems.length > 0 && (
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 8, color: "#888" }}>Complement your Order</div>
          <div style={{ display: "flex", gap: 8 }}>
            {allItems.slice(0, 2).map(item => (
              <div key={item.id} onClick={() => openItemDetail(item)} style={{ flex: 1, cursor: "pointer" }}>
                <div style={{ position: "relative" }}>
                  {item.image_url ? <img src={item.image_url} alt={item.name} style={{ width: "100%", height: 65, objectFit: "cover", borderRadius: 10 }} /> : <div style={{ width: "100%", height: 65, background: "#f5f5f5", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🍔</div>}
                  <div style={{ position: "absolute", top: 4, left: 4, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4 }}>+ ${item.price.toFixed(2)}</div>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Nunito',sans-serif" }}>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cart.length > 0 && (
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 900, fontFamily: "'Nunito',sans-serif" }}>
            <span>Total</span><span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div style={{ padding: "0 16px 16px", marginTop: 12 }}>
        {orderType === "pickup" ? (
          <button onClick={() => { if (cart.length > 0) { setAppPage("checkout"); setShowCartMobile(false); } }} style={{ width: "100%", padding: "14px", borderRadius: 12, background: cart.length > 0 ? "#1a1a1a" : "#ccc", color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: "'Nunito',sans-serif", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Order Pickup</span><span>→</span>
          </button>
        ) : (
          <button onClick={() => setShowDeliveryModal(true)} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#e8520a", color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: "'Nunito',sans-serif", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Order Delivery 🛵</span><span>→</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f5", fontFamily: "'Nunito', sans-serif", color: "#1a1a1a" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .cat-tab { cursor: pointer; transition: all 0.15s; border: none; background: none; }
        .food-card { transition: transform 0.18s, box-shadow 0.18s; cursor: pointer; }
        .food-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.12); }
        .option-btn { transition: all 0.15s; cursor: pointer; }
        .partner-btn { cursor: pointer; transition: all 0.2s; border: none; }
        .partner-btn:hover { transform: translateY(-2px); }
        .gallery-img { cursor: zoom-in; transition: transform 0.2s; display: block; width: 100%; height: 100%; object-fit: cover; }
        .gallery-img:hover { transform: scale(1.04); }
        .dot { cursor: pointer; transition: all 0.2s; border: none; }
        ::-webkit-scrollbar { width: 0; height: 0; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease forwards; }
        @keyframes modalIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        .modal-in { animation: modalIn 0.25s ease forwards; }
        @keyframes slideUp { from { transform:translateY(100%); } to { transform:translateY(0); } }
        .slide-up { animation: slideUp 0.3s ease forwards; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .spin { animation: spin 0.7s linear infinite; display:inline-block; }
        input { outline: none; }
        a { text-decoration: none; color: inherit; }
      `}</style>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowLoginModal(false)}>
          <div className="modal-in" style={{ background: "#fff", borderRadius: 20, padding: 28, maxWidth: 360, width: "100%" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 4 }}>Log In</h3>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Sign in to track your orders</p>
            <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="Email address" type="email" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, marginBottom: 10, fontFamily: "'Nunito',sans-serif" }} />
            <input value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Password" type="password" onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, marginBottom: 14, fontFamily: "'Nunito',sans-serif" }} />
            <button onClick={handleLogin} style={{ width: "100%", padding: "12px", borderRadius: 10, background: "#1a1a1a", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", marginBottom: 8, fontFamily: "'Nunito',sans-serif" }}>Log In →</button>
            <button onClick={() => setShowLoginModal(false)} style={{ width: "100%", padding: "10px", borderRadius: 10, background: "#f5f5f5", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#555", fontFamily: "'Nunito',sans-serif" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxImg && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="" style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 12, objectFit: "contain" }} />
          <button onClick={() => setLightboxImg(null)} style={{ position: "fixed", top: 20, right: 20, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 40, height: 40, color: "#fff", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
      )}

      {/* ITEM DETAIL MODAL */}
      {selectedItem && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setSelectedItem(null)}>
          <div className="modal-in" style={{ background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 560, maxHeight: "92vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ position: "relative" }}>
              {selectedItem.image_url ? (
                <img src={selectedItem.image_url} alt={selectedItem.name} style={{ width: "100%", height: 240, objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: 240, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>🍔</div>
              )}
              <button onClick={() => setSelectedItem(null)} style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            <div style={{ padding: "20px 20px 100px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, flex: 1, paddingRight: 12 }}>{selectedItem.name}</h2>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#e8520a", flexShrink: 0 }}>${selectedItem.price.toFixed(2)}</span>
              </div>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 20 }}>{selectedItem.description}</p>

              {/* Ingredients */}
              {selectedItem.ingredients?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#888", marginBottom: 10, letterSpacing: 0.5 }}>INGREDIENTS</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selectedItem.ingredients.map((ing, i) => (
                      <span key={i} style={{ background: "#f7f7f5", border: "1px solid #e8e8e8", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, color: "#555" }}>{ing}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Choice of Meat */}
              <div style={{ marginBottom: 20, background: "#f9f9f9", borderRadius: 14, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 15, fontWeight: 800 }}>Choice of Meat</span>
                  <span style={{ fontSize: 11, background: "#1a1a1a", color: "#fff", borderRadius: 20, padding: "2px 10px", fontWeight: 700 }}>Required</span>
                </div>
                {MEAT_OPTIONS.map(meat => (
                  <button key={meat} onClick={() => setSelectedMeat(meat)} className="option-btn" style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", background: "none", border: "none", borderBottom: "1px solid #eee", fontFamily: "'Nunito',sans-serif" }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{meat}</span>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${selectedMeat === meat ? "#e8520a" : "#ccc"}`, background: selectedMeat === meat ? "#e8520a" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {selectedMeat === meat && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Choice of Sauce */}
              <div style={{ marginBottom: 20, background: "#f9f9f9", borderRadius: 14, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 15, fontWeight: 800 }}>Choice of Sauce</span>
                  <span style={{ fontSize: 11, background: "#1a1a1a", color: "#fff", borderRadius: 20, padding: "2px 10px", fontWeight: 700 }}>Required</span>
                </div>
                {SAUCE_OPTIONS.map(sauce => (
                  <button key={sauce} onClick={() => setSelectedSauce(sauce)} className="option-btn" style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", background: "none", border: "none", borderBottom: "1px solid #eee", fontFamily: "'Nunito',sans-serif" }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{sauce}</span>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${selectedSauce === sauce ? "#e8520a" : "#ccc"}`, background: selectedSauce === sauce ? "#e8520a" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {selectedSauce === sauce && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Extra Toppings */}
              <div style={{ marginBottom: 20, background: "#f9f9f9", borderRadius: 14, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 15, fontWeight: 800 }}>Extra Toppings</span>
                  <span style={{ fontSize: 11, background: "#f0f0f0", color: "#888", borderRadius: 20, padding: "2px 10px", fontWeight: 700 }}>Optional</span>
                </div>
                {TOPPING_OPTIONS.map(topping => {
                  const sel = selectedToppings.find(t => t.name === topping.name);
                  return (
                    <button key={topping.name} onClick={() => toggleTopping(topping)} className="option-btn" style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", background: "none", border: "none", borderBottom: "1px solid #eee", fontFamily: "'Nunito',sans-serif" }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{topping.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 13, color: "#e8520a", fontWeight: 700 }}>+${topping.price.toFixed(2)}</span>
                        <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${sel ? "#e8520a" : "#ccc"}`, background: sel ? "#e8520a" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>{sel && "✓"}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Admin addons */}
              {selectedItem.addons?.length > 0 && (
                <div style={{ marginBottom: 20, background: "#f9f9f9", borderRadius: 14, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 15, fontWeight: 800 }}>Add-ons</span>
                    <span style={{ fontSize: 11, background: "#f0f0f0", color: "#888", borderRadius: 20, padding: "2px 10px", fontWeight: 700 }}>Optional</span>
                  </div>
                  {selectedItem.addons.map((addon, i) => {
                    const sel = selectedAddons.find(a => a.name === addon.name);
                    return (
                      <button key={i} onClick={() => toggleAddon(addon)} className="option-btn" style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", background: "none", border: "none", borderBottom: "1px solid #eee", fontFamily: "'Nunito',sans-serif" }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{addon.name}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {addon.price > 0 && <span style={{ fontSize: 13, color: "#e8520a", fontWeight: 700 }}>+${addon.price.toFixed(2)}</span>}
                          <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${sel ? "#e8520a" : "#ccc"}`, background: sel ? "#e8520a" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>{sel && "✓"}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ position: "sticky", bottom: 0, background: "#fff", borderTop: "1px solid #eee", padding: "14px 20px", display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f5f5f5", borderRadius: 12, padding: "8px 12px" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 28, height: 28, borderRadius: "50%", background: qty > 1 ? "#e8520a" : "#e0e0e0", color: "#fff", border: "none", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ fontWeight: 900, fontSize: 16, minWidth: 20, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 28, height: 28, borderRadius: "50%", background: "#e8520a", color: "#fff", border: "none", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
              <button onClick={addToCartWithOptions} style={{ flex: 1, padding: "14px", borderRadius: 12, background: "#1a1a1a", color: "#fff", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
                Add to Cart — ${itemTotal.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELIVERY MODAL */}
      {showDeliveryModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowDeliveryModal(false)}>
          <div className="modal-in" style={{ background: "#fff", borderRadius: 20, padding: 28, maxWidth: 380, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🛵</div>
              <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>Order Delivery Via</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {DELIVERY_PARTNERS.map(partner => (
                <a key={partner.name} href={partner.url} target="_blank" rel="noopener noreferrer">
                  <button className="partner-btn" style={{ width: "100%", padding: "14px 20px", borderRadius: 14, background: "#fff", border: `2px solid ${partner.color}`, display: "flex", alignItems: "center", gap: 14, fontFamily: "'Nunito',sans-serif" }}>
                    <span style={{ fontSize: 28 }}>{partner.emoji}</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: partner.color }}>{partner.name}</span>
                    <span style={{ marginLeft: "auto", fontSize: 18, color: "#ccc" }}>→</span>
                  </button>
                </a>
              ))}
            </div>
            <button onClick={() => setShowDeliveryModal(false)} style={{ width: "100%", marginTop: 16, padding: "10px", borderRadius: 10, background: "#f5f5f5", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif", color: "#555" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* MOBILE CART */}
      {isMobile && showCartMobile && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999 }} onClick={() => setShowCartMobile(false)}>
          <div className="slide-up" style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#f7f7f5", borderRadius: "20px 20px 0 0", maxHeight: "85vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee" }}>
              <span style={{ fontSize: 16, fontWeight: 900 }}>Your Order</span>
              <button onClick={() => setShowCartMobile(false)} style={{ background: "#f0f0f0", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
            <OrderPanel />
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 16px", display: "flex", alignItems: "center", gap: 12, height: 64, position: "sticky", top: 0, zIndex: 100 }}>
        <img src="/logo.jpg" alt="Angie's" onClick={goHome} style={{ height: 48, width: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid #f5c842", flexShrink: 0, cursor: "pointer" }} />
        <div style={{ flex: 1, position: "relative" }}>
          <input value={search} onChange={e => { setSearch(e.target.value); if (e.target.value) setActivePage("home"); }} placeholder="Search Menu" style={{ width: "100%", padding: "8px 16px 8px 36px", borderRadius: 20, border: "1px solid #e0e0e0", background: "#f7f7f5", fontSize: 14, fontFamily: "'Nunito',sans-serif" }} />
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#999" }}>🔍</span>
          {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 16 }}>✕</button>}
        </div>
        {/* Extra page tabs in navbar */}
        {!isMobile && pages.map(page => (
          <button key={page.slug} onClick={() => setActivePage(page.slug)} style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid #e0e0e0", background: activePage === page.slug ? "#1a1a1a" : "#fff", color: activePage === page.slug ? "#fff" : "#1a1a1a", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Nunito',sans-serif" }}>{page.title}</button>
        ))}
        {user ? (
          <button onClick={() => supabase.auth.signOut()} style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid #e0e0e0", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Nunito',sans-serif" }}>Log out</button>
        ) : (
          <button onClick={() => setShowLoginModal(true)} style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid #e0e0e0", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Nunito',sans-serif" }}>Log in</button>
        )}
      </div>

      {/* CATEGORY TABS */}
      {activePage === "home" && (
        <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 16px", display: "flex", overflowX: "auto", position: "sticky", top: 64, zIndex: 99 }}>
          {allNavCats.map(cat => {
            const key = cat === "Popular" ? "__popular__" : cat;
            const isActive = !search && activeCategory === key;
            return (
              <button key={cat} className="cat-tab" onClick={() => { setActiveCategory(key); setSearch(""); }} style={{ padding: "14px 14px", fontSize: 13, fontWeight: 700, color: isActive ? "#e8520a" : "#555", borderBottom: isActive ? "2px solid #e8520a" : "2px solid transparent", whiteSpace: "nowrap", fontFamily: "'Nunito',sans-serif" }}>{cat}</button>
            );
          })}
        </div>
      )}

      {/* CHECKOUT */}
      {appPage === "checkout" && (
        <div className="fade-in" style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px 80px" }}>
          <button onClick={() => setAppPage("menu")} style={{ background: "none", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", color: "#555", marginBottom: 20, fontFamily: "'Nunito',sans-serif" }}>← Back to Menu</button>
          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Pickup Checkout</h2>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>📍 {selectedLocation.name} — {selectedLocation.address}</div>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "8px 12px", background: "#f7f7f5", borderRadius: 8 }}>
              <span>💳</span><span style={{ fontSize: 13, color: "#555", fontWeight: 600 }}>Secured by Stripe</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "#22c55e", fontWeight: 700 }}>🔒 SSL</span>
            </div>
            <input placeholder="Card number" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif", marginBottom: 10 }} />
            <input placeholder="Cardholder name" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif", marginBottom: 10 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input placeholder="MM / YY" style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif" }} />
              <input placeholder="CVV" style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif" }} />
            </div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            {cart.map(item => (
              <div key={item.cartId} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ fontWeight: 700 }}>{item.name} × {item.qty}</span>
                  <span style={{ fontWeight: 700 }}>${(item.finalPrice * item.qty).toFixed(2)}</span>
                </div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{item.meat} · {item.sauce}</div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 16 }}>
              <span>Total</span><span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={handlePay} disabled={paying} style={{ width: "100%", padding: "15px", borderRadius: 12, background: paying ? "#ccc" : "#1a1a1a", color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: "'Nunito',sans-serif", border: "none", cursor: "pointer" }}>
            {paying ? <span><span className="spin">⟳</span> Processing...</span> : `🔒 Pay $${subtotal.toFixed(2)}`}
          </button>
        </div>
      )}

      {/* CONFIRMATION */}
      {appPage === "confirmation" && (
        <div className="fade-in" style={{ maxWidth: 480, margin: "40px auto", padding: "0 20px", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Order Confirmed!</h2>
          <p style={{ color: "#888", marginBottom: 24 }}>Thank you for ordering from Angie's!</p>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "#888", fontWeight: 700, marginBottom: 4 }}>ORDER NUMBER</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#e8520a" }}>#{orderNum}</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 16, padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>📍 {selectedLocation.name}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#22c55e" }}>{selectedLocation.time}</div>
          </div>
          <button onClick={() => { setCart([]); setAppPage("menu"); goHome(); }} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#1a1a1a", color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: "'Nunito',sans-serif", border: "none", cursor: "pointer" }}>Order Again 🍔</button>
        </div>
      )}

      {/* MAIN MENU */}
      {appPage === "menu" && (
        <>
          <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ flex: 1, minWidth: 0, paddingBottom: isMobile ? 80 : 40 }}>

              {/* HOME */}
              {activePage === "home" && (
                <>
                  {/* Image Slider */}
                  {!search && (
                    <div style={{ position: "relative", height: isMobile ? 200 : 260, overflow: "hidden", margin: "16px 16px 0", borderRadius: 16 }}>
                      {SLIDES.map((src, i) => (
                        <img key={i} src={src} alt={`slide-${i}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: i === slideIndex ? 1 : 0, transition: "opacity 0.7s ease" }} />
                      ))}
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.65))", borderRadius: 16 }} />
                      <div style={{ position: "absolute", bottom: 16, left: 16, color: "#fff" }}>
                        <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 900, marginBottom: 3 }}>Angie's Kebabs & Burgers</div>
                        <div style={{ fontSize: 11, opacity: 0.85 }}>🕐 Open until 11PM · 📍 {selectedLocation.name}</div>
                      </div>
                      <div style={{ position: "absolute", bottom: 16, right: 16, display: "flex", gap: 6 }}>
                        {SLIDES.map((_, i) => (
                          <button key={i} className="dot" onClick={() => setSlideIndex(i)} style={{ width: i === slideIndex ? 20 : 8, height: 8, borderRadius: 4, background: i === slideIndex ? "#f5c842" : "rgba(255,255,255,0.5)", border: "none" }} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ padding: "16px" }}>
                    {loading ? (
                      <div style={{ textAlign: "center", padding: 60, color: "#888" }}>
                        <div className="spin" style={{ fontSize: 32 }}>⟳</div>
                        <div style={{ marginTop: 12 }}>Loading menu...</div>
                      </div>
                    ) : (
                      <>
                        {/* Menu Items */}
                        <div className="fade-in">
                          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 14 }}>{displayLabel}</h2>
                          {displayItems.length === 0 ? (
                            <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>
                              <div style={{ fontSize: 40, marginBottom: 12 }}>🍔</div>
                              <div>No items yet — add from Admin panel</div>
                            </div>
                          ) : (
                            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginBottom: 32 }}>
                              {displayItems.map(item => (
                                <div key={item.id} className="food-card" onClick={() => openItemDetail(item)} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #eee" }}>
                                  <div style={{ position: "relative" }}>
                                    {item.image_url ? (
                                      <img src={item.image_url} alt={item.name} style={{ width: "100%", height: isMobile ? 120 : 160, objectFit: "cover", display: "block" }} />
                                    ) : (
                                      <div style={{ width: "100%", height: isMobile ? 120 : 160, background: "linear-gradient(135deg,#f5f5f5,#e8e8e8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🍔</div>
                                    )}
                                    <div style={{ position: "absolute", top: 6, left: 6, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 6 }}>${item.price.toFixed(2)}</div>
                                    <div style={{ position: "absolute", bottom: 6, right: 6, width: 28, height: 28, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", fontSize: 16, fontWeight: 300 }}>+</div>
                                  </div>
                                  <div style={{ padding: "10px 12px 12px" }}>
                                    <div style={{ fontSize: isMobile ? 12 : 14, fontWeight: 800, marginBottom: 3, lineHeight: 1.3 }}>{item.name}</div>
                                    {!isMobile && <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>{item.description}</div>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* IMAGE GALLERY */}
                        <div style={{ marginBottom: 32 }}>
                          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 14 }}>Gallery</h2>
                          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 12 }}>
                            {GALLERY_IMAGES.map((img, i) => (
                              <div key={i} style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "4/3" }}>
                                <img src={img} alt={`Gallery ${i + 1}`} className="gallery-img" onClick={() => setLightboxImg(img)} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {/* OTHER PAGES */}
              {activePage !== "home" && currentPage && (
                <div className="fade-in" style={{ padding: "28px 20px", maxWidth: 700 }}>
                  <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 16 }}>{currentPage.title}</h1>
                  {currentPage.image_url && <img src={currentPage.image_url} alt={currentPage.title} style={{ width: "100%", borderRadius: 12, marginBottom: 20, maxHeight: 280, objectFit: "cover" }} />}
                  <div style={{ fontSize: 15, color: "#444", lineHeight: 1.9, whiteSpace: "pre-line" }}>{currentPage.content}</div>
                </div>
              )}

              {/* FOOTER */}
              <footer style={{ background: "#1a1a1a", color: "#fff", padding: "40px 20px 24px", marginTop: 8 }}>
                <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 32, marginBottom: 32 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <img src="/logo.jpg" alt="Angie's" onClick={goHome} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid #f5c842", cursor: "pointer" }} />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15 }}>Angie's Kebabs & Burgers</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Melbourne's Best Kebabs</div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 16 }}>Serving Melbourne's finest kebabs & burgers. Fresh ingredients, bold flavours.</p>
                    <div style={{ display: "flex", gap: 10 }}>
                      {[{ icon: "📘", url: "https://facebook.com", label: "Facebook" }, { icon: "📸", url: "https://instagram.com", label: "Instagram" }, { icon: "🐦", url: "https://twitter.com", label: "Twitter" }, { icon: "▶️", url: "https://tiktok.com", label: "TikTok" }].map(s => (
                        <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" title={s.label} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{s.icon}</a>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14, color: "#f5c842" }}>📍 Our Locations</div>
                    {LOCATIONS.map(loc => (
                      <div key={loc.id} style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{loc.name}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{loc.address}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14, color: "#f5c842" }}>📞 Contact & Hours</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 2 }}>
                      <div>📧 info@angiesknb.com</div>
                      <div>📞 (03) 9370 1234</div>
                      <div style={{ marginTop: 10, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>Opening Hours</div>
                      <div>Mon–Fri: 11am – 11pm</div>
                      <div>Sat–Sun: 11am – 12am</div>
                    </div>
                    <div style={{ marginTop: 14 }}>
                      {pages.map(p => (
                        <button key={p.slug} onClick={() => setActivePage(p.slug)} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", padding: "3px 0", textAlign: "left", fontFamily: "'Nunito',sans-serif" }}>→ {p.title}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>© 2026 Angie's Kebabs & Burgers. All rights reserved.</div>
                  <div style={{ display: "flex", gap: 16 }}>
                    {["Privacy Policy", "Terms of Service"].map(t => (
                      <button key={t} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>{t}</button>
                    ))}
                  </div>
                </div>
              </footer>

            </div>

            {/* ORDER PANEL DESKTOP */}
            {!isMobile && (
              <div style={{ width: 340, flexShrink: 0, padding: "24px 24px 24px 0" }}>
                <div style={{ position: "sticky", top: 130 }}>
                  <OrderPanel />
                </div>
              </div>
            )}
          </div>

          {/* MOBILE BOTTOM BAR */}
          {isMobile && (
            <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #eee", padding: "10px 16px", zIndex: 100 }}>
              <button onClick={() => setShowCartMobile(true)} style={{ width: "100%", padding: "14px", borderRadius: 14, background: cartCount > 0 ? "#1a1a1a" : "#ccc", color: "#fff", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer", fontFamily: "'Nunito',sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "2px 10px", fontSize: 13 }}>{cartCount} items</span>
                <span>View Order</span>
                <span>${subtotal.toFixed(2)}</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
