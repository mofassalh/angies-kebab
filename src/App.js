import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://egyxvzjfqnpcfdnwusxn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVneXh2empmcW5wY2Zkbnd1c3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyODMyMjUsImV4cCI6MjA4OTg1OTIyNX0.modzK6AhGyo3YBjZtDl2lK4tFQuj0B3KsDFIf2n-was";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DELIVERY_PARTNERS = [
  { name: "Menulog", color: "#ff6b35", emoji: "🟠", url: "https://www.menulog.com.au" },
  { name: "DoorDash", color: "#ff3008", emoji: "🔴", url: "https://www.doordash.com" },
  { name: "Uber Eats", color: "#06c167", emoji: "🟢", url: "https://www.ubereats.com" },
];

const LOCATIONS = [
  { id: 1, name: "Angies Kebabs & Burgers — Ascot Vale", address: "2 Epsom Road, Ascot Vale, 3032", time: "11:15 AM", phone: "(03) 9370 1234" },
  { id: 2, name: "Location 2 — Coming Soon", address: "Address TBD", time: "11:30 AM", phone: "" },
  { id: 3, name: "Location 3 — Coming Soon", address: "Address TBD", time: "11:45 AM", phone: "" },
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
  const [menu, setMenu] = useState({});
  const [pages, setPages] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("pickup");
  const [activePage, setActivePage] = useState("home");
  const [activeCategory, setActiveCategory] = useState("__popular__");
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [search, setSearch] = useState("");
  const [appPage, setAppPage] = useState("menu");
  const [paying, setPaying] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showCartMobile, setShowCartMobile] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [qty, setQty] = useState(1);
  const [orderNum] = useState(() => Math.floor(Math.random() * 90000) + 10000);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [user, setUser] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    fetchMenu();
    fetchPages();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
    supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
  }, []);

  async function fetchMenu() {
    setLoading(true);
    const { data } = await supabase.from("menu_items").select("*").eq("available", true).order("category");
    if (data) {
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
    if (data) setPages(data);
  }

  async function handleLogin() {
    if (!loginEmail || !loginPass) return;
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPass });
    if (error) alert("Login failed: " + error.message);
    else setShowLoginModal(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  const addToCart = (item, opts = {}) => {
    setCart(prev => [...prev, {
      ...item, cartId: Date.now(), qty: opts.qty || 1,
      addons: opts.addons || [],
      finalPrice: item.price + (opts.addons || []).reduce((s, a) => s + (a.price || 0), 0),
    }]);
  };

  const removeFromCart = (cartId) => setCart(prev => prev.filter(c => c.cartId !== cartId));
  const subtotal = cart.reduce((s, c) => s + c.finalPrice * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const openItem = (item) => { setSelectedItem(item); setSelectedAddons([]); setQty(1); };
  const addonExtra = selectedAddons.reduce((s, a) => s + (a.price || 0), 0);
  const itemTotal = selectedItem ? (selectedItem.price + addonExtra) * qty : 0;

  const addToCartFromModal = () => {
    addToCart(selectedItem, { qty, addons: selectedAddons });
    setSelectedItem(null);
  };

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
    ? allItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    : activeCategory === "__popular__"
    ? popularItems
    : menu[activeCategory] || [];

  const displayLabel = search.trim() ? `Search: "${search}"` : activeCategory === "__popular__" ? "Popular" : activeCategory;
  const currentPage = pages.find(p => p.slug === activePage);

  const goHome = () => {
    setActivePage("home");
    setActiveCategory("__popular__");
    setSearch("");
    setAppPage("menu");
  };

  const OrderPanel = () => (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 22, fontWeight: 800 }}>Order</span>
          <div style={{ display: "flex", background: "#f0f0f0", borderRadius: 20, padding: 3 }}>
            <button onClick={() => setOrderType("pickup")} style={{ padding: "5px 14px", borderRadius: 16, fontSize: 13, fontWeight: 700, background: orderType === "pickup" ? "#fff" : "transparent", border: "none", cursor: "pointer", boxShadow: orderType === "pickup" ? "0 1px 4px rgba(0,0,0,0.12)" : "none" }}>Pickup</button>
            <button onClick={() => { setOrderType("delivery"); setShowDeliveryModal(true); }} style={{ padding: "5px 14px", borderRadius: 16, fontSize: 13, fontWeight: 700, background: orderType === "delivery" ? "#fff" : "transparent", border: "none", cursor: "pointer", boxShadow: orderType === "delivery" ? "0 1px 4px rgba(0,0,0,0.12)" : "none" }}>Delivery</button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #f5f5f5", marginBottom: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🏪</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>{selectedLocation.name}</div>
            <div style={{ fontSize: 11, color: "#888" }}>{selectedLocation.address}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🕐</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "#888" }}>Pickup Time</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Today - {selectedLocation.time}</div>
          </div>
          <button onClick={() => setShowLocationModal(true)} style={{ padding: "4px 10px", borderRadius: 16, border: "1px solid #ddd", background: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>CHANGE</button>
        </div>
      </div>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid #f0f0f0", minHeight: 70 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 800 }}>Items</span>
          <button style={{ background: "none", border: "none", fontSize: 12, color: "#888", cursor: "pointer", fontWeight: 700 }}>+ Add Voucher</button>
        </div>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", color: "#ccc", fontSize: 13, padding: "12px 0" }}>No items yet</div>
        ) : cart.map(item => (
          <div key={item.cartId} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{item.name} × {item.qty}</div>
              {item.addons?.length > 0 && <div style={{ fontSize: 11, color: "#e8520a" }}>+{item.addons.map(a => a.name).join(", ")}</div>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>${(item.finalPrice * item.qty).toFixed(2)}</span>
              <button onClick={() => removeFromCart(item.cartId)} style={{ width: 18, height: 18, borderRadius: "50%", background: "#f0f0f0", color: "#999", border: "none", cursor: "pointer", fontSize: 10 }}>✕</button>
            </div>
          </div>
        ))}
      </div>
      {allItems.length > 0 && (
        <div style={{ padding: "10px 20px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 8 }}>Complement your Order</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
            {allItems.slice(0, 4).map(item => (
              <div key={item.id} onClick={() => openItem(item)} style={{ flexShrink: 0, width: 76, cursor: "pointer" }}>
                <div style={{ position: "relative", marginBottom: 4 }}>
                  {item.image_url ? <img src={item.image_url} alt={item.name} style={{ width: 76, height: 66, objectFit: "cover", borderRadius: 8 }} /> : <div style={{ width: 76, height: 66, background: "#f5f5f5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🍔</div>}
                  <div style={{ position: "absolute", top: 3, left: 3, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 4px", borderRadius: 4 }}>+${item.price.toFixed(2)}</div>
                </div>
                <div style={{ fontSize: 9, fontWeight: 600, color: "#555", lineHeight: 1.3 }}>{item.name.slice(0, 14)}{item.name.length > 14 ? "..." : ""}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ padding: "10px 16px 14px" }}>
        {cart.length > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800, marginBottom: 8 }}><span>Total</span><span>${subtotal.toFixed(2)}</span></div>}
        {orderType === "pickup" ? (
          <button onClick={() => { if (cart.length > 0) { setAppPage("checkout"); setShowCartMobile(false); } }} style={{ width: "100%", padding: "13px", borderRadius: 10, background: cart.length > 0 ? "#1a1a1a" : "#ccc", color: "#fff", fontSize: 14, fontWeight: 800, border: "none", cursor: cart.length > 0 ? "pointer" : "default", display: "flex", justifyContent: "space-between" }}>
            <span>Pre-Order Pickup</span><span>→</span>
          </button>
        ) : (
          <button onClick={() => setShowDeliveryModal(true)} style={{ width: "100%", padding: "13px", borderRadius: 10, background: "#e8520a", color: "#fff", fontSize: 14, fontWeight: 800, border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
            <span>Order Delivery 🛵</span><span>→</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#1a1a1a" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .cat-tab { cursor: pointer; border: none; background: none; transition: all 0.15s; }
        .food-card { transition: box-shadow 0.2s; cursor: pointer; }
        .food-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .gallery-img { cursor: zoom-in; transition: transform 0.2s; }
        .gallery-img:hover { transform: scale(1.03); }
        ::-webkit-scrollbar { width: 0; height: 0; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .fade-in { animation: fadeIn 0.25s ease; }
        @keyframes modalIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .modal-in { animation: modalIn 0.25s ease; }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        .slide-up { animation: slideUp 0.3s ease; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .spin { animation: spin 0.7s linear infinite; display:inline-block; }
        a { color: inherit; text-decoration: none; }
      `}</style>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowLoginModal(false)}>
          <div className="modal-in" style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 360, width: "100%" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Log In</h3>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Sign in to track your orders</p>
            <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="Email address" type="email" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, marginBottom: 10 }} />
            <input value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Password" type="password" onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, marginBottom: 14 }} />
            <button onClick={handleLogin} style={{ width: "100%", padding: "12px", borderRadius: 8, background: "#1a1a1a", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", marginBottom: 10 }}>Log In →</button>
            <button onClick={() => setShowLoginModal(false)} style={{ width: "100%", padding: "10px", borderRadius: 8, background: "#f5f5f5", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#555" }}>Cancel</button>
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

      {/* ITEM MODAL */}
      {selectedItem && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setSelectedItem(null)}>
          <div className="modal-in" style={{ background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ position: "relative" }}>
              {selectedItem.image_url ? <img src={selectedItem.image_url} alt={selectedItem.name} style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }} /> : <div style={{ width: "100%", height: 220, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>🍔</div>}
              <button onClick={() => setSelectedItem(null)} style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.95)", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>✕</button>
            </div>
            <div style={{ padding: "20px 20px 100px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, flex: 1, marginRight: 12 }}>{selectedItem.name}</h2>
                <span style={{ fontSize: 18, fontWeight: 800 }}>${selectedItem.price.toFixed(2)}</span>
              </div>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 16 }}>{selectedItem.description}</p>
              {selectedItem.ingredients?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Ingredients</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selectedItem.ingredients.map((ing, i) => <span key={i} style={{ background: "#f5f5f5", borderRadius: 20, padding: "4px 12px", fontSize: 12 }}>{ing}</span>)}
                  </div>
                </div>
              )}
              {selectedItem.addons?.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Customise</div>
                  {selectedItem.addons.map((addon, i) => {
                    const sel = selectedAddons.find(a => a.name === addon.name);
                    return (
                      <button key={i} onClick={() => setSelectedAddons(prev => sel ? prev.filter(a => a.name !== addon.name) : [...prev, addon])} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", background: "none", border: "none", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
                        <span style={{ fontSize: 14 }}>{addon.name}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {addon.price > 0 && <span style={{ fontSize: 13, color: "#666" }}>+${addon.price.toFixed(2)}</span>}
                          <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${sel ? "#1a1a1a" : "#ddd"}`, background: sel ? "#1a1a1a" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>{sel && "✓"}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div style={{ position: "sticky", bottom: 0, background: "#fff", borderTop: "1px solid #f0f0f0", padding: "12px 20px", display: "flex", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #e0e0e0", borderRadius: 8, padding: "6px 10px" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 26, height: 26, borderRadius: "50%", background: qty > 1 ? "#1a1a1a" : "#e0e0e0", color: "#fff", border: "none", cursor: "pointer", fontSize: 16 }}>−</button>
                <span style={{ fontWeight: 800, fontSize: 15, minWidth: 20, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 26, height: 26, borderRadius: "50%", background: "#1a1a1a", color: "#fff", border: "none", cursor: "pointer", fontSize: 16 }}>+</button>
              </div>
              <button onClick={addToCartFromModal} style={{ flex: 1, padding: "12px", borderRadius: 8, background: "#1a1a1a", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>Add to Order — ${itemTotal.toFixed(2)}</button>
            </div>
          </div>
        </div>
      )}

      {/* DELIVERY MODAL */}
      {showDeliveryModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowDeliveryModal(false)}>
          <div className="modal-in" style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 380, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}><div style={{ fontSize: 36, marginBottom: 8 }}>🛵</div><h3 style={{ fontSize: 18, fontWeight: 800 }}>Order Delivery Via</h3></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {DELIVERY_PARTNERS.map(p => (
                <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer">
                  <button style={{ width: "100%", padding: "13px 18px", borderRadius: 10, background: "#fff", border: `2px solid ${p.color}`, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                    <span style={{ fontSize: 24 }}>{p.emoji}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: p.color }}>{p.name}</span>
                    <span style={{ marginLeft: "auto", color: "#ccc" }}>→</span>
                  </button>
                </a>
              ))}
            </div>
            <button onClick={() => setShowDeliveryModal(false)} style={{ width: "100%", marginTop: 12, padding: "10px", borderRadius: 8, background: "#f5f5f5", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#555" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* LOCATION MODAL */}
      {showLocationModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowLocationModal(false)}>
          <div className="modal-in" style={{ background: "#fff", borderRadius: 16, padding: 24, maxWidth: 400, width: "100%" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Select Location</h3>
            {LOCATIONS.map(loc => (
              <button key={loc.id} onClick={() => { setSelectedLocation(loc); setShowLocationModal(false); }} style={{ width: "100%", padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, background: selectedLocation.id === loc.id ? "#f5f5f5" : "#fff", border: "1px solid #e8e8e8", borderRadius: 10, cursor: "pointer", marginBottom: 8, textAlign: "left" }}>
                <span style={{ fontSize: 20 }}>📍</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{loc.name}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{loc.address}</div>
                </div>
                {selectedLocation.id === loc.id && <span style={{ fontWeight: 800, color: "#1a1a1a" }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MOBILE CART */}
      {isMobile && showCartMobile && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999 }} onClick={() => setShowCartMobile(false)}>
          <div className="slide-up" style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "20px 20px 0 0", maxHeight: "88vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f0f0f0" }}>
              <span style={{ fontSize: 16, fontWeight: 800 }}>Your Order</span>
              <button onClick={() => setShowCartMobile(false)} style={{ background: "#f0f0f0", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>
            <div style={{ padding: 16 }}><OrderPanel /></div>
          </div>
        </div>
      )}

      {/* TOP NAVBAR */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 20px", display: "flex", alignItems: "center", height: 60, position: "sticky", top: 0, zIndex: 100, gap: 14 }}>
        <img src="/logo.jpg" alt="Angie's" onClick={goHome} style={{ height: 44, width: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0, cursor: "pointer" }} />
        <div style={{ position: "relative", flex: isMobile ? 1 : "0 0 220px" }}>
          <input value={search} onChange={e => { setSearch(e.target.value); if (e.target.value) setActivePage("home"); }} placeholder="Search Menu" style={{ width: "100%", padding: "8px 32px 8px 32px", borderRadius: 20, border: "1px solid #e0e0e0", background: "#f7f7f7", fontSize: 13 }} />
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: 13 }}>🔍</span>
          {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#999", fontSize: 14 }}>✕</button>}
        </div>
        {!isMobile && pages.filter(p => p.slug !== "home").map(page => (
          <button key={page.slug} onClick={() => setActivePage(page.slug)} style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid #e0e0e0", background: activePage === page.slug ? "#1a1a1a" : "#fff", color: activePage === page.slug ? "#fff" : "#1a1a1a", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{page.title}</button>
        ))}
        <div style={{ marginLeft: "auto" }} />
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!isMobile && <span style={{ fontSize: 12, color: "#666" }}>{user.email}</span>}
            <button onClick={handleLogout} style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid #e0e0e0", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Log out</button>
          </div>
        ) : (
          <button onClick={() => setShowLoginModal(true)} style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid #e0e0e0", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Log in</button>
        )}
      </div>

      {/* CATEGORY TABS */}
      {activePage === "home" && !search && (
        <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 20px", display: "flex", overflowX: "auto", position: "sticky", top: 60, zIndex: 99 }}>
          {allNavCats.map(cat => {
            const key = cat === "Popular" ? "__popular__" : cat;
            const isActive = activeCategory === key;
            return (
              <button key={cat} className="cat-tab" onClick={() => setActiveCategory(key)} style={{ padding: "14px 16px", fontSize: 14, fontWeight: isActive ? 800 : 500, color: isActive ? "#1a1a1a" : "#666", borderBottom: isActive ? "2px solid #1a1a1a" : "2px solid transparent", whiteSpace: "nowrap" }}>{cat}</button>
            );
          })}
        </div>
      )}

      {/* CHECKOUT */}
      {appPage === "checkout" && (
        <div className="fade-in" style={{ maxWidth: 520, margin: "0 auto", padding: "24px 20px 80px" }}>
          <button onClick={() => setAppPage("menu")} style={{ background: "none", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#555", marginBottom: 20 }}>← Back to menu</button>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Checkout</h2>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>📍 {selectedLocation.name}</div>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, padding: 16, marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, padding: "8px 12px", background: "#f8f8f8", borderRadius: 8 }}>
              <span>💳</span><span style={{ fontSize: 13, color: "#555", fontWeight: 600 }}>Secured by Stripe</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "#22c55e", fontWeight: 700 }}>🔒 SSL</span>
            </div>
            <input placeholder="Card number" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, marginBottom: 10 }} />
            <input placeholder="Cardholder name" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, marginBottom: 10 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input placeholder="MM / YY" style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14 }} />
              <input placeholder="CVV" style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14 }} />
            </div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, padding: 16, marginBottom: 20 }}>
            {cart.map(item => (
              <div key={item.cartId} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
                <span>{item.name} × {item.qty}</span>
                <span style={{ fontWeight: 700 }}>${(item.finalPrice * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #eee", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16 }}>
              <span>Total</span><span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={handlePay} disabled={paying} style={{ width: "100%", padding: "15px", borderRadius: 10, background: paying ? "#ccc" : "#1a1a1a", color: "#fff", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer" }}>
            {paying ? <span><span className="spin">⟳</span> Processing...</span> : `🔒 Pay $${subtotal.toFixed(2)}`}
          </button>
        </div>
      )}

      {/* CONFIRMATION */}
      {appPage === "confirmation" && (
        <div className="fade-in" style={{ maxWidth: 480, margin: "40px auto", padding: "0 20px", textAlign: "center" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Order Confirmed!</h2>
          <p style={{ color: "#888", marginBottom: 24 }}>Thank you for ordering from Angie's!</p>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 14, padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 700, marginBottom: 4, textTransform: "uppercase" }}>Order Number</div>
            <div style={{ fontSize: 30, fontWeight: 900 }}>#{orderNum}</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 14, padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>📍 {selectedLocation.name}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#22c55e" }}>Ready at {selectedLocation.time}</div>
          </div>
          <button onClick={() => { setCart([]); setAppPage("menu"); goHome(); }} style={{ width: "100%", padding: "14px", borderRadius: 10, background: "#1a1a1a", color: "#fff", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer" }}>Order Again 🍔</button>
        </div>
      )}

      {/* MAIN */}
      {appPage === "menu" && (
        <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ flex: 1, minWidth: 0, paddingBottom: isMobile ? 90 : 60 }}>

            {/* HOME */}
            {activePage === "home" && (
              <div style={{ padding: "20px 20px 0" }}>
                {loading ? (
                  <div style={{ textAlign: "center", padding: 60, color: "#999" }}>
                    <div className="spin" style={{ fontSize: 28 }}>⟳</div>
                    <div style={{ marginTop: 12, fontSize: 14 }}>Loading menu...</div>
                  </div>
                ) : (
                  <>
                    {/* MENU ITEMS */}
                    <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>{displayLabel}</h2>
                    {displayItems.length === 0 ? (
                      <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🍔</div>
                        <div>No items found</div>
                      </div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(230px, 1fr))", gap: 16, marginBottom: 40 }}>
                        {displayItems.map(item => (
                          <div key={item.id} className="food-card" onClick={() => openItem(item)} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #f0f0f0" }}>
                            <div style={{ position: "relative" }}>
                              {item.image_url ? <img src={item.image_url} alt={item.name} style={{ width: "100%", height: isMobile ? 130 : 165, objectFit: "cover", display: "block" }} /> : <div style={{ width: "100%", height: isMobile ? 130 : 165, background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>🍔</div>}
                              <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.72)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>${item.price.toFixed(2)}</div>
                              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.78), transparent)", padding: "22px 12px 10px" }}>
                                <div style={{ color: "#fff", fontSize: isMobile ? 12 : 14, fontWeight: 700 }}>{item.name}</div>
                              </div>
                              <div style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", fontSize: 18, color: "#1a1a1a" }}>+</div>
                            </div>
                            {!isMobile && item.description && (
                              <div style={{ padding: "10px 12px 12px", fontSize: 12, color: "#888", lineHeight: 1.4 }}>{item.description.slice(0, 60)}{item.description.length > 60 ? "..." : ""}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* IMAGE GALLERY */}
                    <div style={{ marginBottom: 40 }}>
                      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Gallery</h2>
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 16 }}>
                        {GALLERY_IMAGES.map((img, i) => (
                          <div key={i} style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "4/3" }}>
                            <img src={img} alt={`Gallery ${i + 1}`} className="gallery-img" onClick={() => setLightboxImg(img)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* OTHER PAGES */}
            {activePage !== "home" && currentPage && (
              <div className="fade-in" style={{ padding: "28px 20px", maxWidth: 700 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 16 }}>{currentPage.title}</h1>
                {currentPage.image_url && <img src={currentPage.image_url} alt={currentPage.title} style={{ width: "100%", borderRadius: 12, marginBottom: 20, maxHeight: 280, objectFit: "cover" }} />}
                <div style={{ fontSize: 15, color: "#444", lineHeight: 1.9, whiteSpace: "pre-line" }}>{currentPage.content}</div>
              </div>
            )}

            {/* FOOTER */}
            <footer style={{ background: "#1a1a1a", color: "#fff", padding: "40px 20px 24px", marginTop: 20 }}>
              <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 32, marginBottom: 32 }}>
                {/* Brand */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <img src="/logo.jpg" alt="Angie's" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid #f5c842" }} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15 }}>Angie's Kebabs & Burgers</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Melbourne's Best Kebabs</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>Serving Melbourne's finest kebabs & burgers since 2010. Fresh ingredients, bold flavours.</p>
                  {/* Social Links */}
                  <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                    {[
                      { icon: "📘", label: "Facebook", url: "https://facebook.com" },
                      { icon: "📸", label: "Instagram", url: "https://instagram.com" },
                      { icon: "🐦", label: "Twitter", url: "https://twitter.com" },
                      { icon: "▶️", label: "TikTok", url: "https://tiktok.com" },
                    ].map(s => (
                      <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" title={s.label} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transition: "background 0.2s" }}>{s.icon}</a>
                    ))}
                  </div>
                </div>

                {/* Locations */}
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14, color: "#f5c842" }}>📍 Our Locations</div>
                  {LOCATIONS.map(loc => (
                    <div key={loc.id} style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{loc.name}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{loc.address}</div>
                      {loc.phone && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{loc.phone}</div>}
                    </div>
                  ))}
                </div>

                {/* Contact & Hours */}
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14, color: "#f5c842" }}>📞 Contact & Hours</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 2 }}>
                    <div>📧 info@angiesknb.com</div>
                    <div>📞 (03) 9370 1234</div>
                    <div style={{ marginTop: 12, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>Opening Hours</div>
                    <div>Mon–Fri: 11am – 11pm</div>
                    <div>Sat–Sun: 11am – 12am</div>
                  </div>
                  {/* Page links */}
                  <div style={{ marginTop: 16 }}>
                    {pages.map(p => (
                      <button key={p.slug} onClick={() => setActivePage(p.slug)} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", padding: "3px 0", textAlign: "left", marginBottom: 2 }}>
                        → {p.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>© 2026 Angie's Kebabs & Burgers. All rights reserved.</div>
                <div style={{ display: "flex", gap: 16 }}>
                  {["Privacy Policy", "Terms of Service"].map(t => (
                    <button key={t} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer" }}>{t}</button>
                  ))}
                </div>
              </div>
            </footer>
          </div>

          {/* ORDER PANEL DESKTOP */}
          {!isMobile && (
            <div style={{ width: 360, flexShrink: 0, padding: "20px 20px 60px 0" }}>
              <div style={{ position: "sticky", top: 118 }}>
                <OrderPanel />
              </div>
            </div>
          )}
        </div>
      )}

      {/* MOBILE BOTTOM BAR */}
      {isMobile && appPage === "menu" && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #eee", padding: "10px 16px", zIndex: 100 }}>
          <button onClick={() => setShowCartMobile(true)} style={{ width: "100%", padding: "13px", borderRadius: 10, background: "#1a1a1a", color: "#fff", fontSize: 14, fontWeight: 800, border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 6, padding: "2px 10px", fontSize: 13 }}>{cartCount}</span>
            <span>Pre-Order Pickup</span>
            <span>${subtotal.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
