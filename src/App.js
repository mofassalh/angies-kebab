import { useState, useEffect, useRef } from "react";
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
  { id: 1, name: "Ascot Vale", address: "2 Epsom Road, Ascot Vale, 3032", time: "15 Minutes" },
  { id: 2, name: "Shop 2", address: "Address coming soon", time: "20 Minutes" },
];

const SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1200&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
];

export default function App() {
  const [menu, setMenu] = useState({});
  const [pages, setPages] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState("pickup");
  const [activePage, setActivePage] = useState("home");
  const [activeCategory, setActiveCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [checkoutPage, setCheckoutPage] = useState("menu");
  const [paying, setPaying] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showCartMobile, setShowCartMobile] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [qty, setQty] = useState(1);
  const [orderNum] = useState(() => Math.floor(Math.random() * 90000) + 10000);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);
  const [sliderIdx, setSliderIdx] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    fetchMenu();
    fetchPages();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSliderIdx(i => (i + 1) % SLIDER_IMAGES.length), 3500);
    return () => clearInterval(t);
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
      if (Object.keys(grouped).length > 0) setActiveCategory(Object.keys(grouped)[0]);
    }
    setLoading(false);
  }

  async function fetchPages() {
    const { data } = await supabase.from("pages").select("*").eq("show_in_nav", true).order("sort_order");
    if (data) setPages(data);
  }

  const addToCart = (item, opts = {}) => {
    const cartItem = {
      ...item, cartId: Date.now(), qty: opts.qty || 1,
      addons: opts.addons || [],
      finalPrice: item.price + (opts.addons || []).reduce((s, a) => s + (a.price || 0), 0),
    };
    setCart(prev => [...prev, cartItem]);
  };

  const removeFromCart = (cartId) => setCart(prev => prev.filter(c => c.cartId !== cartId));
  const subtotal = cart.reduce((s, c) => s + c.finalPrice * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const openItem = (item) => {
    setSelectedItem(item); setSelectedAddons([]); setQty(1);
  };

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
    setTimeout(() => { setPaying(false); setCheckoutPage("confirmation"); setShowCartMobile(false); }, 1500);
  };

  const filteredMenu = search.trim()
    ? Object.entries(menu).reduce((acc, [cat, items]) => {
        const f = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
        if (f.length) acc[cat] = f;
        return acc;
      }, {})
    : activeCategory ? { [activeCategory]: menu[activeCategory] || [] } : {};

  const currentPage = pages.find(p => p.slug === activePage);

  const OrderPanel = () => (
    <div style={{ background: "#fff", borderRadius: isMobile ? 0 : 16, border: "1px solid #e8e8e8", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 900, fontFamily: "'Nunito',sans-serif" }}>Order</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setOrderType("pickup")} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700, background: orderType === "pickup" ? "#1a1a1a" : "#fff", color: orderType === "pickup" ? "#fff" : "#555", border: "1px solid #e0e0e0", cursor: "pointer" }}>Pickup</button>
            <button onClick={() => { setOrderType("delivery"); setShowDeliveryModal(true); }} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700, background: orderType === "delivery" ? "#1a1a1a" : "#fff", color: orderType === "delivery" ? "#fff" : "#555", border: "1px solid #e0e0e0", cursor: "pointer" }}>Delivery</button>
          </div>
        </div>

        <div style={{ position: "relative", marginBottom: 10 }}>
          <button onClick={() => setShowLocationDropdown(!showLocationDropdown)} style={{ width: "100%", display: "flex", gap: 10, alignItems: "center", background: "#f7f7f5", border: "1px solid #e0e0e0", borderRadius: 10, padding: "10px 14px", cursor: "pointer" }}>
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
                <button key={loc.id} onClick={() => { setSelectedLocation(loc); setShowLocationDropdown(false); }} style={{ width: "100%", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, background: selectedLocation.id === loc.id ? "#fff8f5" : "#fff", border: "none", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
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
            <div style={{ fontSize: 13, fontWeight: 700 }}>Today - {selectedLocation.time}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", minHeight: 80 }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>Items</div>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", color: "#bbb", fontSize: 13, padding: "20px 0" }}>Your cart is empty</div>
        ) : cart.map(item => (
          <div key={item.cartId} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #f5f5f5" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{item.name} × {item.qty}</div>
                {item.addons && item.addons.length > 0 && <div style={{ fontSize: 11, color: "#e8520a" }}>+{item.addons.map(a => a.name).join(", ")}</div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>${(item.finalPrice * item.qty).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.cartId)} style={{ width: 20, height: 20, borderRadius: "50%", background: "#fee", color: "#f43f5e", border: "none", cursor: "pointer", fontSize: 12 }}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 900 }}>
            <span>Total</span><span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div style={{ padding: "12px 16px 16px" }}>
        {orderType === "pickup" ? (
          <button onClick={() => { if (cart.length > 0) { setCheckoutPage("checkout"); setShowCartMobile(false); } }} style={{ width: "100%", padding: "14px", borderRadius: 12, background: cart.length > 0 ? "#1a1a1a" : "#ccc", color: "#fff", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
            <span>Order Pickup</span><span>→</span>
          </button>
        ) : (
          <button onClick={() => setShowDeliveryModal(true)} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#e8520a", color: "#fff", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
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
        .nav-tab { cursor: pointer; border: none; background: none; font-family: 'Nunito',sans-serif; transition: all 0.15s; }
        .food-card { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
        .food-card:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.12); }
        ::-webkit-scrollbar { width: 0; height: 0; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease forwards; }
        @keyframes modalIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        .modal-in { animation: modalIn 0.25s ease forwards; }
        @keyframes slideUp { from { transform:translateY(100%); } to { transform:translateY(0); } }
        .slide-up { animation: slideUp 0.3s ease forwards; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .spin { animation: spin 0.7s linear infinite; display:inline-block; }
      `}</style>

      {/* ITEM MODAL */}
      {selectedItem && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setSelectedItem(null)}>
          <div className="modal-in" style={{ background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 560, maxHeight: "92vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ position: "relative" }}>
              {selectedItem.image_url ? (
                <img src={selectedItem.image_url} alt={selectedItem.name} style={{ width: "100%", height: 240, objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: 240, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>🍔</div>
              )}
              <button onClick={() => setSelectedItem(null)} style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 18 }}>✕</button>
            </div>
            <div style={{ padding: "20px 20px 100px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900 }}>{selectedItem.name}</h2>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#e8520a" }}>${selectedItem.price.toFixed(2)}</span>
              </div>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 16 }}>{selectedItem.description}</p>

              {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "#888", marginBottom: 10 }}>INGREDIENTS</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {selectedItem.ingredients.map((ing, i) => (
                      <span key={i} style={{ background: "#f7f7f5", border: "1px solid #e8e8e8", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{ing}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.addons && selectedItem.addons.length > 0 && (
                <div style={{ marginBottom: 20, background: "#f9f9f9", borderRadius: 14, padding: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>Customise</div>
                  {selectedItem.addons.map((addon, i) => {
                    const selected = selectedAddons.find(a => a.name === addon.name);
                    return (
                      <button key={i} onClick={() => setSelectedAddons(prev => selected ? prev.filter(a => a.name !== addon.name) : [...prev, addon])} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", background: "none", border: "none", borderBottom: "1px solid #eee", cursor: "pointer" }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{addon.name}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {addon.price > 0 && <span style={{ fontSize: 13, color: "#e8520a", fontWeight: 700 }}>+${addon.price.toFixed(2)}</span>}
                          <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${selected ? "#e8520a" : "#ccc"}`, background: selected ? "#e8520a" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>
                            {selected && "✓"}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div style={{ position: "sticky", bottom: 0, background: "#fff", borderTop: "1px solid #eee", padding: "14px 20px", display: "flex", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f5f5f5", borderRadius: 12, padding: "8px 12px" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 28, height: 28, borderRadius: "50%", background: qty > 1 ? "#e8520a" : "#e0e0e0", color: "#fff", border: "none", cursor: "pointer", fontSize: 18 }}>−</button>
                <span style={{ fontWeight: 900, fontSize: 16, minWidth: 20, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 28, height: 28, borderRadius: "50%", background: "#e8520a", color: "#fff", border: "none", cursor: "pointer", fontSize: 18 }}>+</button>
              </div>
              <button onClick={addToCartFromModal} style={{ flex: 1, padding: "14px", borderRadius: 12, background: "#1a1a1a", color: "#fff", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer" }}>
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
              <h3 style={{ fontSize: 20, fontWeight: 900 }}>Order Delivery Via</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {DELIVERY_PARTNERS.map(partner => (
                <a key={partner.name} href={partner.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <button style={{ width: "100%", padding: "14px 20px", borderRadius: 14, background: "#fff", border: `2px solid ${partner.color}`, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                    <span style={{ fontSize: 28 }}>{partner.emoji}</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: partner.color }}>{partner.name}</span>
                    <span style={{ marginLeft: "auto", color: "#ccc" }}>→</span>
                  </button>
                </a>
              ))}
            </div>
            <button onClick={() => setShowDeliveryModal(false)} style={{ width: "100%", marginTop: 16, padding: "10px", borderRadius: 10, background: "#f5f5f5", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", color: "#555" }}>Cancel</button>
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
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 16px", display: "flex", alignItems: "center", gap: 0, height: 64, position: "sticky", top: 0, zIndex: 100 }}>
        <img src="/logo.jpg" alt="Angie's" onClick={() => { setActivePage("home"); setSearch(""); }} style={{ height: 48, width: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid #f5c842", flexShrink: 0, cursor: "pointer", marginRight: 12 }} />

        {/* NAV TABS from pages */}
        <div style={{ display: "flex", overflowX: "auto", flex: 1 }}>
          {pages.map(page => (
            <button key={page.slug} className="nav-tab" onClick={() => { setActivePage(page.slug); setSearch(""); if (page.slug === "home") setActiveCategory(Object.keys(menu)[0] || ""); }} style={{ padding: "0 14px", height: 64, fontSize: 14, fontWeight: activePage === page.slug ? 800 : 600, color: activePage === page.slug ? "#e8520a" : "#555", borderBottom: activePage === page.slug ? "2px solid #e8520a" : "2px solid transparent", whiteSpace: "nowrap" }}>
              {page.title}
            </button>
          ))}
          {/* Menu categories as tabs when on home */}
          {activePage === "home" && Object.keys(menu).map(cat => (
            <button key={cat} className="nav-tab" onClick={() => setActiveCategory(cat)} style={{ padding: "0 14px", height: 64, fontSize: 14, fontWeight: activeCategory === cat ? 800 : 600, color: activeCategory === cat ? "#e8520a" : "#555", borderBottom: activeCategory === cat ? "2px solid #e8520a" : "2px solid transparent", whiteSpace: "nowrap" }}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", marginLeft: 8, flexShrink: 0 }}>
          <input value={search} onChange={e => { setSearch(e.target.value); if (e.target.value) setActivePage("home"); }} placeholder="Search..." style={{ width: isMobile ? 120 : 180, padding: "8px 16px 8px 32px", borderRadius: 20, border: "1px solid #e0e0e0", background: "#f7f7f5", fontSize: 13 }} />
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#999", fontSize: 13 }}>🔍</span>
        </div>
      </div>

      {/* CHECKOUT PAGE */}
      {checkoutPage === "checkout" && (
        <div className="fade-in" style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px 80px" }}>
          <button onClick={() => setCheckoutPage("menu")} style={{ background: "none", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", color: "#555", marginBottom: 20 }}>← Back</button>
          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Checkout</h2>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>📍 {selectedLocation.name} — {selectedLocation.address}</div>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "8px 12px", background: "#f7f7f5", borderRadius: 8 }}>
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
              <div key={item.cartId} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                <span>{item.name} × {item.qty}</span>
                <span style={{ fontWeight: 700 }}>${(item.finalPrice * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #eee", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 16 }}>
              <span>Total</span><span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={handlePay} disabled={paying} style={{ width: "100%", padding: "15px", borderRadius: 12, background: paying ? "#ccc" : "#1a1a1a", color: "#fff", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer" }}>
            {paying ? <span><span className="spin">⟳</span> Processing...</span> : `🔒 Pay $${subtotal.toFixed(2)}`}
          </button>
        </div>
      )}

      {/* CONFIRMATION */}
      {checkoutPage === "confirmation" && (
        <div className="fade-in" style={{ maxWidth: 480, margin: "40px auto", padding: "0 20px", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Order Confirmed!</h2>
          <p style={{ color: "#888", marginBottom: 24 }}>Thank you for ordering from Angie's!</p>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "#888", fontWeight: 700, marginBottom: 4 }}>ORDER NUMBER</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#e8520a" }}>{orderNum}</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 16, padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>📍 {selectedLocation.name}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#22c55e" }}>{selectedLocation.time}</div>
          </div>
          <button onClick={() => { setCart([]); setCheckoutPage("menu"); }} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#1a1a1a", color: "#fff", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer" }}>Order Again 🍔</button>
        </div>
      )}

      {/* MAIN CONTENT */}
      {checkoutPage === "menu" && (
        <>
          <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ flex: 1, minWidth: 0, paddingBottom: isMobile ? 80 : 40 }}>

              {/* HOME PAGE */}
              {activePage === "home" && (
                <>
                  {/* Image Slider */}
                  <div style={{ position: "relative", height: isMobile ? 200 : 300, overflow: "hidden", margin: "0 0 0 0" }}>
                    {SLIDER_IMAGES.map((img, i) => (
                      <div key={i} style={{ position: "absolute", inset: 0, transition: "opacity 0.8s", opacity: i === sliderIdx ? 1 : 0 }}>
                        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
                      </div>
                    ))}
                    <div style={{ position: "absolute", bottom: 20, left: 20, color: "#fff", zIndex: 2 }}>
                      <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 900 }}>Angie's Kebabs & Burgers</div>
                      <div style={{ fontSize: 13, opacity: 0.8 }}>⚪ Open until 11PM · 📍 {selectedLocation.name}</div>
                    </div>
                    <div style={{ position: "absolute", bottom: 16, right: 16, display: "flex", gap: 6, zIndex: 2 }}>
                      {SLIDER_IMAGES.map((_, i) => (
                        <button key={i} onClick={() => setSliderIdx(i)} style={{ width: i === sliderIdx ? 20 : 8, height: 8, borderRadius: 4, background: i === sliderIdx ? "#f5c842" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
                      ))}
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: "16px" }}>
                    {loading ? (
                      <div style={{ textAlign: "center", padding: 60, color: "#888" }}>
                        <div className="spin" style={{ fontSize: 32 }}>⟳</div>
                        <div style={{ marginTop: 12 }}>Loading menu...</div>
                      </div>
                    ) : (
                      Object.entries(filteredMenu).map(([cat, items]) => (
                        <div key={cat} className="fade-in">
                          <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 14 }}>{cat}</h2>
                          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginBottom: 28 }}>
                            {items.map(item => (
                              <div key={item.id} className="food-card" onClick={() => openItem(item)} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #eee" }}>
                                <div style={{ position: "relative" }}>
                                  {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} style={{ width: "100%", height: isMobile ? 120 : 160, objectFit: "cover", display: "block" }} />
                                  ) : (
                                    <div style={{ width: "100%", height: isMobile ? 120 : 160, background: "linear-gradient(135deg, #f5f5f5, #e8e8e8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🍔</div>
                                  )}
                                  <div style={{ position: "absolute", top: 6, left: 6, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 6 }}>${item.price.toFixed(2)}</div>
                                  <div style={{ position: "absolute", bottom: 6, right: 6, width: 28, height: 28, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", fontSize: 16 }}>+</div>
                                </div>
                                <div style={{ padding: "10px 12px 12px" }}>
                                  <div style={{ fontSize: isMobile ? 12 : 14, fontWeight: 800, marginBottom: 3 }}>{item.name}</div>
                                  {!isMobile && <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>{item.description}</div>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

              {/* OTHER PAGES — About, Contact, etc */}
              {activePage !== "home" && currentPage && (
                <div className="fade-in" style={{ padding: "32px 20px", maxWidth: 700 }}>
                  <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 16 }}>{currentPage.title}</h1>
                  {currentPage.image_url && (
                    <img src={currentPage.image_url} alt={currentPage.title} style={{ width: "100%", borderRadius: 14, marginBottom: 20, maxHeight: 300, objectFit: "cover" }} />
                  )}
                  <div style={{ fontSize: 15, color: "#444", lineHeight: 1.8, whiteSpace: "pre-line" }}>{currentPage.content}</div>
                </div>
              )}
            </div>

            {/* ORDER PANEL DESKTOP */}
            {!isMobile && (
              <div style={{ width: 340, flexShrink: 0, padding: "24px 24px 24px 0" }}>
                <div style={{ position: "sticky", top: 80 }}>
                  <OrderPanel />
                </div>
              </div>
            )}
          </div>

          {/* MOBILE BOTTOM BAR */}
          {isMobile && (
            <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #eee", padding: "10px 16px", zIndex: 100 }}>
              <button onClick={() => setShowCartMobile(true)} style={{ width: "100%", padding: "14px", borderRadius: 14, background: cartCount > 0 ? "#1a1a1a" : "#ccc", color: "#fff", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
