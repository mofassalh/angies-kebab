import { useState, useEffect } from "react";

const SLIDES = [
  "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=1200&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80",
  "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=1200&q=80",
  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=1200&q=80",
];

const INITIAL_MENU = {
  Popular: [
    { id: 1, name: "Angie's HSP (Limited Edition)", desc: "Crunchy Chips, Choice Of Doner Meat, Homemade Peri Peri Sauce", price: 17.99, img: "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=400&q=80" },
    { id: 2, name: "Crunchy Chips & House Gravy", desc: "Crunchy Chips & House Gravy Serving", price: 9.99, img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
    { id: 3, name: "Shish Kebab", desc: "Marinated lamb on skewer, served with rice & salad", price: 12.99, img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80" },
    { id: 4, name: "Angie's Classic Burger", desc: "Beef patty, cheddar, lettuce, tomato, special sauce", price: 10.99, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  ],
  Kebabs: [
    { id: 5, name: "Shish Kebab", desc: "Marinated lamb on skewer, served with rice & salad", price: 12.99, img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80" },
    { id: 6, name: "Doner Kebab", desc: "Classic Turkish doner with garlic sauce & fresh veg", price: 9.99, img: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80" },
    { id: 7, name: "Adana Kebab", desc: "Spicy minced lamb, chargrilled to perfection", price: 13.99, img: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80" },
    { id: 8, name: "Mixed Kebab Platter", desc: "Shish + Adana + Doner with sides", price: 18.99, img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" },
  ],
  Burgers: [
    { id: 9, name: "Angie's Classic Burger", desc: "Beef patty, cheddar, lettuce, tomato, special sauce", price: 10.99, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
    { id: 10, name: "Smoky BBQ Burger", desc: "Double patty, smoked bacon, BBQ sauce, onion rings", price: 13.99, img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80" },
    { id: 11, name: "Spicy Chicken Burger", desc: "Crispy chicken, jalapeños, sriracha mayo", price: 11.49, img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80" },
    { id: 12, name: "Veggie Burger", desc: "Plant-based patty, avocado, sundried tomato", price: 9.99, img: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&q=80" },
  ],
  "Wraps & Rolls": [
    { id: 13, name: "Chicken Shawarma Wrap", desc: "Grilled chicken, garlic sauce, pickles, fries inside", price: 8.99, img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80" },
    { id: 14, name: "Falafel Wrap", desc: "Crispy falafel, hummus, tabbouleh, tahini", price: 7.99, img: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80" },
    { id: 15, name: "Lamb Kofta Roll", desc: "Spiced kofta, mint yoghurt, fresh herbs", price: 9.49, img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80" },
  ],
  Sides: [
    { id: 16, name: "Loaded Fries", desc: "Crispy fries, cheese sauce, jalapeños", price: 4.99, img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80" },
    { id: 17, name: "Onion Rings", desc: "Golden battered onion rings with dip", price: 3.99, img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80" },
    { id: 18, name: "Garlic Bread", desc: "Toasted with herb butter", price: 2.99, img: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400&q=80" },
  ],
  Drinks: [
    { id: 19, name: "Soft Drink (Can)", desc: "Coke, Fanta, Sprite, Water", price: 1.99, img: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=400&q=80" },
    { id: 20, name: "Mango Lassi", desc: "Fresh mango, yoghurt, cardamom", price: 3.49, img: "https://images.unsplash.com/photo-1571006682786-e9a1c42ea6ab?w=400&q=80" },
  ],
};

const DELIVERY_PARTNERS = [
  { name: "Menulog", color: "#ff6b35", emoji: "🟠", url: "https://www.menulog.com.au/restaurants-angies-kebabs-burgers" },
  { name: "DoorDash", color: "#ff3008", emoji: "🔴", url: "https://www.doordash.com/store/angies-kebabs-burgers" },
  { name: "Uber Eats", color: "#06c167", emoji: "🟢", url: "https://www.ubereats.com/store/angies-kebabs-burgers" },
];

const ADMIN_PASSWORD = "angies2024";

export default function App() {
  const path = window.location.pathname;
  const isAdmin = path === "/admin";

  const [menu, setMenu] = useState(INITIAL_MENU);
  const [orderType, setOrderType] = useState("pickup");
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("menu");
  const [paying, setPaying] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [orderNum] = useState(() => Math.floor(Math.random() * 90000) + 10000);

  // Admin states
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [adminTab, setAdminTab] = useState("Popular");
  const [newItem, setNewItem] = useState({ name: "", desc: "", price: "", img: "", category: "Popular" });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setSlideIndex(p => (p + 1) % SLIDES.length), 3500);
    return () => clearInterval(timer);
  }, []);

  const addToCart = (item) => setCart(prev => {
    const ex = prev.find(c => c.id === item.id);
    if (ex) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
    return [...prev, { ...item, qty: 1 }];
  });

  const removeFromCart = (id) => setCart(prev => {
    const ex = prev.find(c => c.id === id);
    if (!ex) return prev;
    if (ex.qty === 1) return prev.filter(c => c.id !== id);
    return prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c);
  });

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const total = subtotal;
  const handlePay = () => { setPaying(true); setTimeout(() => { setPaying(false); setPage("confirmation"); }, 2000); };

  // Admin functions
  const handleAdminLogin = () => {
    if (adminPass === ADMIN_PASSWORD) { setAdminLoggedIn(true); setAdminError(""); }
    else setAdminError("Wrong password!");
  };

  const handleDeleteItem = (cat, id) => {
    setMenu(prev => ({ ...prev, [cat]: prev[cat].filter(i => i.id !== id) }));
  };

  const handleEditSave = () => {
    setMenu(prev => ({
      ...prev,
      [editingItem.category]: prev[editingItem.category].map(i => i.id === editingItem.id ? editingItem : i)
    }));
    setEditingItem(null);
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return;
    const id = Date.now();
    const item = { ...newItem, id, price: parseFloat(newItem.price) };
    setMenu(prev => ({ ...prev, [newItem.category]: [...(prev[newItem.category] || []), item] }));
    setNewItem({ name: "", desc: "", price: "", img: "", category: "Popular" });
    setShowAddForm(false);
  };

  // ===================== ADMIN PAGE =====================
  if (isAdmin) {
    if (!adminLoggedIn) return (
      <div style={{ minHeight: "100vh", background: "#f7f7f5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito',sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 40, width: 360, boxShadow: "0 8px 40px rgba(0,0,0,0.1)" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <img src="/logo.jpg" alt="logo" style={{ width: 70, height: 70, borderRadius: "50%", objectFit: "cover", border: "3px solid #f5c842" }} />
            <h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 12 }}>Admin Panel</h2>
            <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Angie's Kebabs & Burgers</p>
          </div>
          <input
            type="password" placeholder="Enter admin password"
            value={adminPass} onChange={e => setAdminPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdminLogin()}
            style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif", marginBottom: 10 }}
          />
          {adminError && <p style={{ color: "#e8520a", fontSize: 13, marginBottom: 8 }}>{adminError}</p>}
          <button onClick={handleAdminLogin} style={{ width: "100%", padding: "12px", borderRadius: 10, background: "#1a1a1a", color: "#fff", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>Login →</button>
        </div>
      </div>
    );

    return (
      <div style={{ minHeight: "100vh", background: "#f7f7f5", fontFamily: "'Nunito',sans-serif" }}>
        <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } input,textarea { outline: none; } .del-btn:hover { background: #ff3b30 !important; color: #fff !important; } .edit-btn:hover { background: #e8520a !important; color: #fff !important; }`}</style>

        {/* Admin Navbar */}
        <div style={{ background: "#1a1a1a", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/logo.jpg" alt="logo" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "2px solid #f5c842" }} />
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>Admin Panel</span>
            <span style={{ background: "#e8520a", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>LIVE</span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href="/" style={{ color: "#aaa", fontSize: 13, textDecoration: "none" }}>← View Website</a>
            <button onClick={() => setAdminLoggedIn(false)} style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "'Nunito',sans-serif" }}>Logout</button>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Total Items", value: Object.values(menu).flat().length, icon: "🍔" },
              { label: "Categories", value: Object.keys(menu).length, icon: "📋" },
              { label: "Most Items", value: Object.entries(menu).sort((a,b) => b[1].length - a[1].length)[0][0], icon: "⭐" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid #eee" }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 900 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Add New Item Button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900 }}>Menu Items</h2>
            <button onClick={() => setShowAddForm(!showAddForm)} style={{ padding: "8px 18px", borderRadius: 10, background: "#e8520a", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>+ Add New Item</button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>➕ New Menu Item</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <input placeholder="Item name *" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif" }} />
                <input placeholder="Price (e.g. 12.99) *" value={newItem.price} onChange={e => setNewItem(p => ({ ...p, price: e.target.value }))} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif" }} />
              </div>
              <textarea placeholder="Description" value={newItem.desc} onChange={e => setNewItem(p => ({ ...p, desc: e.target.value }))} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif", marginBottom: 12, resize: "vertical", minHeight: 60 }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <input placeholder="Image URL" value={newItem.img} onChange={e => setNewItem(p => ({ ...p, img: e.target.value }))} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif" }} />
                <select value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif", background: "#fff" }}>
                  {Object.keys(menu).map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleAddItem} style={{ padding: "10px 24px", borderRadius: 10, background: "#1a1a1a", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>✅ Save Item</button>
                <button onClick={() => setShowAddForm(false)} style={{ padding: "10px 24px", borderRadius: 10, background: "#f5f5f5", color: "#555", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Category Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
            {Object.keys(menu).map(cat => (
              <button key={cat} onClick={() => setAdminTab(cat)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700, background: adminTab === cat ? "#1a1a1a" : "#fff", color: adminTab === cat ? "#fff" : "#555", border: "1px solid #e0e0e0", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Nunito',sans-serif" }}>{cat} ({menu[cat].length})</button>
            ))}
          </div>

          {/* Items List */}
          {menu[adminTab].map(item => (
            <div key={item.id}>
              {editingItem && editingItem.id === item.id ? (
                <div style={{ background: "#fff8f5", border: "2px solid #e8520a", borderRadius: 16, padding: 16, marginBottom: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                    <input value={editingItem.name} onChange={e => setEditingItem(p => ({ ...p, name: e.target.value }))} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif" }} />
                    <input value={editingItem.price} onChange={e => setEditingItem(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif" }} />
                  </div>
                  <textarea value={editingItem.desc} onChange={e => setEditingItem(p => ({ ...p, desc: e.target.value }))} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif", marginBottom: 10, resize: "vertical", minHeight: 50 }} />
                  <input value={editingItem.img} onChange={e => setEditingItem(p => ({ ...p, img: e.target.value }))} placeholder="Image URL" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif", marginBottom: 10 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleEditSave} style={{ padding: "8px 20px", borderRadius: 8, background: "#e8520a", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>✅ Save</button>
                    <button onClick={() => setEditingItem(null)} style={{ padding: "8px 20px", borderRadius: 8, background: "#f5f5f5", color: "#555", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 14 }}>
                  <img src={item.img} alt={item.name} style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover", flexShrink: 0, background: "#f0f0f0" }} onError={e => { e.target.style.background = "#f0f0f0"; e.target.src = ""; }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#888", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.desc}</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#e8520a" }}>${item.price.toFixed(2)}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button className="edit-btn" onClick={() => setEditingItem({ ...item, category: adminTab })} style={{ padding: "6px 14px", borderRadius: 8, background: "#f5f5f5", color: "#555", border: "1px solid #e0e0e0", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Nunito',sans-serif", transition: "all 0.15s" }}>✏️ Edit</button>
                    <button className="del-btn" onClick={() => handleDeleteItem(adminTab, item.id)} style={{ padding: "6px 14px", borderRadius: 8, background: "#fff0f0", color: "#ff3b30", border: "1px solid #ffd0d0", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Nunito',sans-serif", transition: "all 0.15s" }}>🗑️ Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===================== MAIN WEBSITE =====================
  const filteredMenu = search.trim()
    ? Object.entries(menu).reduce((acc, [cat, items]) => {
        const f = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.desc.toLowerCase().includes(search.toLowerCase()));
        if (f.length) acc[cat] = f;
        return acc;
      }, {})
    : { [activeCategory]: menu[activeCategory] };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f5", fontFamily: "'Nunito', sans-serif", color: "#1a1a1a" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .cat-tab { cursor: pointer; transition: all 0.15s; border: none; background: none; }
        .cat-tab:hover { color: #e8520a; }
        .food-card { transition: transform 0.2s, box-shadow 0.2s; }
        .food-card:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.12); }
        .add-btn { cursor: pointer; transition: all 0.15s; border: none; }
        .add-btn:hover { transform: scale(1.1); }
        .pay-btn { cursor: pointer; transition: all 0.15s; border: none; }
        .pay-btn:hover { opacity: 0.9; }
        .partner-btn { cursor: pointer; transition: all 0.2s; border: none; }
        .partner-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .qty-btn { cursor: pointer; border: none; transition: all 0.15s; }
        .qty-btn:hover { background: #e8520a !important; color: #fff !important; }
        .dot { cursor: pointer; transition: all 0.2s; border: none; }
        ::-webkit-scrollbar { width: 0; height: 0; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeIn 0.3s ease forwards; }
        @keyframes modalIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        .modal-in { animation: modalIn 0.25s ease forwards; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .spin { animation: spin 0.7s linear infinite; display:inline-block; }
        input { outline: none; }
      `}</style>

      {/* DELIVERY MODAL */}
      {showDeliveryModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setShowDeliveryModal(false)}>
          <div className="modal-in" style={{ background: "#fff", borderRadius: 20, padding: 28, maxWidth: 380, width: "100%" }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🛵</div>
              <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>Order Delivery Via</h3>
              <p style={{ fontSize: 13, color: "#888" }}>Choose your preferred delivery partner</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {DELIVERY_PARTNERS.map(partner => (
                <a key={partner.name} href={partner.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
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

      {/* NAVBAR */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 24px", display: "flex", alignItems: "center", gap: 16, height: 64, position: "sticky", top: 0, zIndex: 100 }}>
        <img src="/logo.jpg" alt="Angie's Logo" style={{ height: 50, width: 50, borderRadius: "50%", objectFit: "cover", border: "2px solid #f5c842", flexShrink: 0 }} />
        <div style={{ flex: 1, position: "relative" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Menu" style={{ width: "100%", padding: "8px 16px 8px 36px", borderRadius: 20, border: "1px solid #e0e0e0", background: "#f7f7f5", fontSize: 14, fontFamily: "'Nunito',sans-serif" }} />
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#999" }}>🔍</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid #e0e0e0", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>About</button>
        </div>
      </div>

      {page === "menu" && (
        <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* CATEGORY TABS */}
            <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 24px", display: "flex", overflowX: "auto", position: "sticky", top: 64, zIndex: 99 }}>
              {Object.keys(menu).map(cat => (
                <button key={cat} className="cat-tab" onClick={() => { setActiveCategory(cat); setSearch(""); }} style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: activeCategory === cat ? "#e8520a" : "#555", borderBottom: activeCategory === cat ? "2px solid #e8520a" : "2px solid transparent", whiteSpace: "nowrap", fontFamily: "'Nunito',sans-serif" }}>{cat}</button>
              ))}
            </div>

            {/* IMAGE SLIDER — Popular tab এর নিচে, menu items-এর উপরে */}
            {activeCategory === "Popular" && !search.trim() && (
              <div style={{ position: "relative", height: 260, overflow: "hidden", margin: "24px 24px 0 24px", borderRadius: 16 }}>
                {SLIDES.map((src, i) => (
                  <img key={i} src={src} alt={`slide-${i}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: i === slideIndex ? 1 : 0, transition: "opacity 0.7s ease" }} />
                ))}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.65))", borderRadius: 16 }} />
                <div style={{ position: "absolute", bottom: 20, left: 20, color: "#fff" }}>
                  <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 3 }}>Angie's Kebabs & Burgers</div>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>🕐 Open until 11PM &nbsp;·&nbsp; 📍 Ascot Vale, 3032</div>
                </div>
                <div style={{ position: "absolute", bottom: 16, right: 16, display: "flex", gap: 6 }}>
                  {SLIDES.map((_, i) => (
                    <button key={i} className="dot" onClick={() => setSlideIndex(i)} style={{ width: i === slideIndex ? 20 : 8, height: 8, borderRadius: 4, background: i === slideIndex ? "#f5c842" : "rgba(255,255,255,0.5)", border: "none" }} />
                  ))}
                </div>
              </div>
            )}

            {/* MENU ITEMS */}
            <div style={{ padding: "24px" }}>
              {Object.entries(filteredMenu).map(([cat, items]) => (
                <div key={cat} className="fade-in">
                  <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>{cat}</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
                    {items.map(item => {
                      const inCart = cart.find(c => c.id === item.id);
                      return (
                        <div key={item.id} className="food-card" style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #eee" }}>
                          <div style={{ position: "relative" }}>
                            <img src={item.img} alt={item.name} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} onError={e => { e.target.style.background = "#f0f0f0"; e.target.style.minHeight = "160px"; e.target.src = ""; }} />
                            <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>${item.price.toFixed(2)}</div>
                            {!inCart ? (
                              <button className="add-btn" onClick={() => addToCart(item)} style={{ position: "absolute", bottom: 8, right: 8, width: 32, height: 32, borderRadius: "50%", background: "#fff", color: "#1a1a1a", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>+</button>
                            ) : (
                              <div style={{ position: "absolute", bottom: 8, right: 8, display: "flex", alignItems: "center", gap: 4, background: "#fff", borderRadius: 20, padding: "2px 6px", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                                <button className="qty-btn" onClick={() => removeFromCart(item.id)} style={{ width: 24, height: 24, borderRadius: "50%", background: "#f0f0f0", color: "#333", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                                <span style={{ fontSize: 13, fontWeight: 800, minWidth: 16, textAlign: "center" }}>{inCart.qty}</span>
                                <button className="qty-btn" onClick={() => addToCart(item)} style={{ width: 24, height: 24, borderRadius: "50%", background: "#e8520a", color: "#fff", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                              </div>
                            )}
                          </div>
                          <div style={{ padding: "12px 14px 14px" }}>
                            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4, lineHeight: 1.3 }}>{item.name}</div>
                            <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>{item.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT ORDER PANEL */}
          <div style={{ width: 340, flexShrink: 0, padding: "24px 24px 24px 0" }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8e8", overflow: "hidden", position: "sticky", top: 80 }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 18, fontWeight: 900 }}>Order</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setOrderType("pickup")} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700, background: orderType === "pickup" ? "#1a1a1a" : "#fff", color: orderType === "pickup" ? "#fff" : "#555", border: "1px solid #e0e0e0", cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>Pickup</button>
                    <button onClick={() => { setOrderType("delivery"); setShowDeliveryModal(true); }} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700, background: orderType === "delivery" ? "#1a1a1a" : "#fff", color: orderType === "delivery" ? "#fff" : "#555", border: "1px solid #e0e0e0", cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>Delivery</button>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ fontSize: 18 }}>📍</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>Angies kebabs & Burgers</div>
                    <div style={{ fontSize: 12, color: "#888" }}>2 Epsom Road, Ascot Vale, 3032</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 16 }}>🕐</span>
                  <div>
                    <div style={{ fontSize: 12, color: "#888" }}>{orderType === "pickup" ? "Pickup Time" : "Delivery Time"}</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{orderType === "pickup" ? "Today - 15 Minutes" : "Today - 30-40 Minutes"}</div>
                  </div>
                </div>
              </div>

              <div style={{ padding: "16px 20px", minHeight: 80, borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 800 }}>Items</span>
                  <span style={{ fontSize: 12, color: "#e8520a", fontWeight: 700 }}>+ Add Voucher</span>
                </div>
                {cart.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#bbb", fontSize: 13, padding: "20px 0" }}>Your cart is empty</div>
                ) : cart.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#f5f5f5", borderRadius: 20, padding: "2px 6px" }}>
                        <button className="qty-btn" onClick={() => removeFromCart(item.id)} style={{ width: 20, height: 20, borderRadius: "50%", background: "#e0e0e0", color: "#333", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                        <span style={{ fontSize: 12, fontWeight: 800, minWidth: 14, textAlign: "center" }}>{item.qty}</span>
                        <button className="qty-btn" onClick={() => addToCart(item)} style={{ width: 20, height: 20, borderRadius: "50%", background: "#e8520a", color: "#fff", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {cart.length > 0 && (
                <div style={{ padding: "12px 20px", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 900 }}>
                    <span>Total</span><span>${total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div style={{ padding: "14px 20px" }}>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 10, color: "#888" }}>Complement your Order</div>
                <div style={{ display: "flex", gap: 10 }}>
                  {menu["Sides"].slice(0, 2).map(item => (
                    <div key={item.id} onClick={() => addToCart(item)} style={{ flex: 1, cursor: "pointer" }}>
                      <div style={{ position: "relative" }}>
                        <img src={item.img} alt={item.name} style={{ width: "100%", height: 65, objectFit: "cover", borderRadius: 10 }} />
                        <div style={{ position: "absolute", top: 4, left: 4, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4 }}>+ ${item.price.toFixed(2)}</div>
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 700, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: "0 16px 16px" }}>
                {orderType === "pickup" ? (
                  <button className="pay-btn" onClick={() => cart.length > 0 && setPage("checkout")} style={{ width: "100%", padding: "14px", borderRadius: 12, background: cart.length > 0 ? "#1a1a1a" : "#ccc", color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: "'Nunito',sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Order Pickup</span><span>→</span>
                  </button>
                ) : (
                  <button className="pay-btn" onClick={() => setShowDeliveryModal(true)} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#e8520a", color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: "'Nunito',sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Order Delivery 🛵</span><span>→</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT */}
      {page === "checkout" && (
        <div className="fade-in" style={{ maxWidth: 520, margin: "40px auto", padding: "0 20px 80px" }}>
          <button onClick={() => setPage("menu")} style={{ background: "none", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", color: "#555", marginBottom: 20, fontFamily: "'Nunito',sans-serif" }}>← Back to Menu</button>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>Pickup Checkout</h2>
          <div style={{ marginBottom: 20 }}>
            <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, padding: 16 }}>
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
          </div>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, padding: 16, marginBottom: 24 }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                <span>{item.name} × {item.qty}</span><span style={{ fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #eee", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 16 }}>
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button className="pay-btn" onClick={handlePay} disabled={paying} style={{ width: "100%", padding: "15px", borderRadius: 12, background: paying ? "#ccc" : "#1a1a1a", color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: "'Nunito',sans-serif" }}>
            {paying ? <span><span className="spin">⟳</span> Processing...</span> : `🔒 Pay $${total.toFixed(2)}`}
          </button>
        </div>
      )}

      {page === "confirmation" && (
        <div className="fade-in" style={{ maxWidth: 480, margin: "60px auto", padding: "0 20px", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Order Confirmed!</h2>
          <p style={{ color: "#888", marginBottom: 24 }}>Thank you for ordering from Angie's!</p>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "#888", fontWeight: 700, marginBottom: 4 }}>ORDER NUMBER</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#e8520a" }}>#{orderNum}</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 16, padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>🏃 Ready for Pickup In</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#22c55e" }}>15 Minutes</div>
          </div>
          <button className="pay-btn" onClick={() => { setCart([]); setPage("menu"); }} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#1a1a1a", color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: "'Nunito',sans-serif" }}>Order Again 🍔</button>
        </div>
      )}
    </div>
  );
}