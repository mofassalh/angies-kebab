import { useState, useEffect } from "react";

const SLIDES = [
  "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=1200&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80",
  "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=1200&q=80",
  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=1200&q=80",
];

const LOCATIONS = [
  { id: 1, name: "Ascot Vale", address: "2 Epsom Road, Ascot Vale, 3032", time: "15 Minutes" },
  { id: 2, name: "Shop 2", address: "Address coming soon", time: "20 Minutes" },
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

const INITIAL_MENU = {
  Home: [
    { id: 1, name: "Angie's HSP (Limited Edition)", desc: "Crunchy Chips, Choice Of Doner Meat, Homemade Peri Peri Sauce", price: 17.99, img: "https://images.unsplash.com/photo-1513185158878-8d8c2a2a3da3?w=400&q=80", ingredients: ["Crunchy chips", "Doner meat", "Peri peri sauce", "Fresh herbs"], badge: "🔥 Limited Edition" },
    { id: 2, name: "Crunchy Chips & House Gravy", desc: "Crunchy Chips & House Gravy Serving", price: 9.99, img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80", ingredients: ["Crunchy chips", "House gravy", "Seasoning"], badge: "⭐ Popular" },
    { id: 3, name: "Shish Kebab", desc: "Marinated lamb on skewer, served with rice & salad", price: 12.99, img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80", ingredients: ["Lamb", "Rice", "Fresh salad", "Garlic sauce"], badge: "" },
    { id: 4, name: "Angie's Classic Burger", desc: "Beef patty, cheddar, lettuce, tomato, special sauce", price: 10.99, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", ingredients: ["Beef patty", "Cheddar cheese", "Lettuce", "Tomato", "Special sauce", "Brioche bun"], badge: "❤️ Fan Fav" },
  ],
  Kebabs: [
    { id: 5, name: "Shish Kebab", desc: "Marinated lamb on skewer, served with rice & salad", price: 12.99, img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&q=80", ingredients: ["Marinated lamb", "Rice", "Garden salad", "Garlic sauce", "Pita bread"], badge: "" },
    { id: 6, name: "Doner Kebab", desc: "Classic Turkish doner with garlic sauce & fresh veg", price: 9.99, img: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80", ingredients: ["Doner meat", "Garlic sauce", "Fresh vegetables", "Pita bread"], badge: "⭐ Popular" },
    { id: 7, name: "Adana Kebab", desc: "Spicy minced lamb, chargrilled to perfection", price: 13.99, img: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80", ingredients: ["Minced lamb", "Red pepper", "Spices", "Chargrilled", "Rice"], badge: "🌶️ Spicy" },
    { id: 8, name: "Mixed Kebab Platter", desc: "Shish + Adana + Doner with sides", price: 18.99, img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80", ingredients: ["Shish kebab", "Adana kebab", "Doner meat", "Rice", "Salad", "Bread"], badge: "👨‍👩‍👧 Family" },
  ],
  Burgers: [
    { id: 9, name: "Angie's Classic Burger", desc: "Beef patty, cheddar, lettuce, tomato, special sauce", price: 10.99, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", ingredients: ["Beef patty", "Cheddar cheese", "Lettuce", "Tomato", "Special sauce", "Brioche bun"], badge: "❤️ Fan Fav" },
    { id: 10, name: "Smoky BBQ Burger", desc: "Double patty, smoked bacon, BBQ sauce, onion rings", price: 13.99, img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80", ingredients: ["Double beef patty", "Smoked bacon", "BBQ sauce", "Onion rings", "Cheddar", "Brioche bun"], badge: "🔥 Bestseller" },
    { id: 11, name: "Spicy Chicken Burger", desc: "Crispy chicken, jalapeños, sriracha mayo", price: 11.49, img: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80", ingredients: ["Crispy chicken", "Jalapeños", "Sriracha mayo", "Lettuce", "Brioche bun"], badge: "🌶️ Spicy" },
    { id: 12, name: "Veggie Burger", desc: "Plant-based patty, avocado, sundried tomato", price: 9.99, img: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&q=80", ingredients: ["Plant-based patty", "Avocado", "Sundried tomato", "Lettuce", "Vegan mayo"], badge: "🌿 Vegan" },
  ],
  "Wraps & Rolls": [
    { id: 13, name: "Chicken Shawarma Wrap", desc: "Grilled chicken, garlic sauce, pickles, fries inside", price: 8.99, img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80", ingredients: ["Grilled chicken", "Garlic sauce", "Pickles", "Fries", "Flatbread"], badge: "⭐ Popular" },
    { id: 14, name: "Falafel Wrap", desc: "Crispy falafel, hummus, tabbouleh, tahini", price: 7.99, img: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80", ingredients: ["Crispy falafel", "Hummus", "Tabbouleh", "Tahini", "Flatbread"], badge: "🌿 Vegan" },
    { id: 15, name: "Lamb Kofta Roll", desc: "Spiced kofta, mint yoghurt, fresh herbs", price: 9.49, img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80", ingredients: ["Lamb kofta", "Mint yoghurt", "Fresh herbs", "Flatbread"], badge: "" },
  ],
  Sides: [
    { id: 16, name: "Loaded Fries", desc: "Crispy fries, cheese sauce, jalapeños", price: 4.99, img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80", ingredients: ["Crispy fries", "Cheese sauce", "Jalapeños", "Seasoning"], badge: "🔥 Must Try" },
    { id: 17, name: "Onion Rings", desc: "Golden battered onion rings with dip", price: 3.99, img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80", ingredients: ["Onion rings", "Beer batter", "Dipping sauce"], badge: "" },
    { id: 18, name: "Garlic Bread", desc: "Toasted with herb butter", price: 2.99, img: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400&q=80", ingredients: ["Bread", "Garlic butter", "Fresh herbs"], badge: "" },
  ],
  Drinks: [
    { id: 19, name: "Soft Drink (Can)", desc: "Coke, Fanta, Sprite, Water", price: 1.99, img: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?w=400&q=80", ingredients: ["Coke / Fanta / Sprite / Water"], badge: "" },
    { id: 20, name: "Mango Lassi", desc: "Fresh mango, yoghurt, cardamom", price: 3.49, img: "https://images.unsplash.com/photo-1571006682786-e9a1c42ea6ab?w=400&q=80", ingredients: ["Fresh mango", "Yoghurt", "Cardamom", "Sugar"], badge: "❤️ Fav" },
  ],
};

const DELIVERY_PARTNERS = [
  { name: "Menulog", color: "#ff6b35", emoji: "🟠", url: "https://www.menulog.com.au/restaurants-angies-kebabs-burgers" },
  { name: "DoorDash", color: "#ff3008", emoji: "🔴", url: "https://www.doordash.com/store/angies-kebabs-burgers" },
  { name: "Uber Eats", color: "#06c167", emoji: "🟢", url: "https://www.ubereats.com/store/angies-kebabs-burgers" },
];

const ADMIN_PASSWORD = "angies2024";

const getPath = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('p') || window.location.pathname.slice(1);
};

export default function App() {
  const path = '/' + getPath();
  const isAdmin = path === "/admin";

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [orderType, setOrderType] = useState("pickup");
  const [activeCategory, setActiveCategory] = useState("Home");
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("menu");
  const [paying, setPaying] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showCartMobile, setShowCartMobile] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMeat, setSelectedMeat] = useState(MEAT_OPTIONS[0]);
  const [selectedSauce, setSelectedSauce] = useState(SAUCE_OPTIONS[0]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [qty, setQty] = useState(1);
  const [orderNum] = useState(() => Math.floor(Math.random() * 90000) + 10000);

  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [adminTab, setAdminTab] = useState("Home");
  const [newItem, setNewItem] = useState({ name: "", desc: "", price: "", img: "", category: "Home" });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setSlideIndex(p => (p + 1) % SLIDES.length), 3500);
    return () => clearInterval(timer);
  }, []);

  const openItemDetail = (item) => {
    setSelectedItem(item);
    setSelectedMeat(MEAT_OPTIONS[0]);
    setSelectedSauce(SAUCE_OPTIONS[0]);
    setSelectedToppings([]);
    setQty(1);
  };

  const toggleTopping = (topping) => {
    setSelectedToppings(prev =>
      prev.find(t => t.name === topping.name)
        ? prev.filter(t => t.name !== topping.name)
        : [...prev, topping]
    );
  };

  const toppingTotal = selectedToppings.reduce((s, t) => s + t.price, 0);
  const itemTotal = selectedItem ? (selectedItem.price + toppingTotal) * qty : 0;

  const addToCartWithOptions = () => {
    if (!selectedItem) return;
    const cartItem = {
      ...selectedItem,
      cartId: Date.now(),
      meat: selectedMeat,
      sauce: selectedSauce,
      toppings: selectedToppings,
      qty,
      finalPrice: selectedItem.price + toppingTotal,
    };
    setCart(prev => [...prev, cartItem]);
    setSelectedItem(null);
  };

  const removeFromCart = (cartId) => setCart(prev => prev.filter(c => c.cartId !== cartId));

  const subtotal = cart.reduce((s, c) => s + c.finalPrice * c.qty, 0);
  const total = subtotal;
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const handlePay = () => { setPaying(true); setTimeout(() => { setPaying(false); setPage("confirmation"); setShowCartMobile(false); }, 2000); };

  const handleAdminLogin = () => {
    if (adminPass === ADMIN_PASSWORD) { setAdminLoggedIn(true); setAdminError(""); }
    else setAdminError("Wrong password!");
  };
  const handleDeleteItem = (cat, id) => setMenu(prev => ({ ...prev, [cat]: prev[cat].filter(i => i.id !== id) }));
  const handleEditSave = () => {
    setMenu(prev => ({ ...prev, [editingItem.category]: prev[editingItem.category].map(i => i.id === editingItem.id ? editingItem : i) }));
    setEditingItem(null);
  };
  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return;
    const item = { ...newItem, id: Date.now(), price: parseFloat(newItem.price), ingredients: [], badge: "" };
    setMenu(prev => ({ ...prev, [newItem.category]: [...(prev[newItem.category] || []), item] }));
    setNewItem({ name: "", desc: "", price: "", img: "", category: "Home" });
    setShowAddForm(false);
  };

  // ===================== ADMIN =====================
  if (isAdmin) {
    if (!adminLoggedIn) return (
      <div style={{ minHeight: "100vh", background: "#f7f7f5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito',sans-serif" }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: 40, width: 360, boxShadow: "0 8px 40px rgba(0,0,0,0.1)" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <img src="/logo.jpg" alt="logo" style={{ width: 70, height: 70, borderRadius: "50%", objectFit: "cover", border: "3px solid #f5c842" }} />
            <h2 style={{ fontSize: 22, fontWeight: 900, marginTop: 12 }}>Admin Panel</h2>
          </div>
          <input type="password" placeholder="Enter admin password" value={adminPass} onChange={e => setAdminPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdminLogin()} style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif", marginBottom: 10, outline: "none" }} />
          {adminError && <p style={{ color: "#e8520a", fontSize: 13, marginBottom: 8 }}>{adminError}</p>}
          <button onClick={handleAdminLogin} style={{ width: "100%", padding: "12px", borderRadius: 10, background: "#1a1a1a", color: "#fff", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>Login →</button>
        </div>
      </div>
    );
    return (
      <div style={{ minHeight: "100vh", background: "#f7f7f5", fontFamily: "'Nunito',sans-serif" }}>
        <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } input,textarea,select { outline: none; }`}</style>
        <div style={{ background: "#1a1a1a", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/logo.jpg" alt="logo" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "2px solid #f5c842" }} />
            <span style={{ color: "#fff", fontWeight: 800 }}>Admin Panel</span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/" style={{ color: "#aaa", fontSize: 13, textDecoration: "none" }}>← Website</a>
            <button onClick={() => setAdminLoggedIn(false)} style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>Logout</button>
          </div>
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900 }}>Menu Items</h2>
            <button onClick={() => setShowAddForm(!showAddForm)} style={{ padding: "8px 18px", borderRadius: 10, background: "#e8520a", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>+ Add New Item</button>
          </div>
          {showAddForm && (
            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <input placeholder="Item name *" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif" }} />
                <input placeholder="Price *" value={newItem.price} onChange={e => setNewItem(p => ({ ...p, price: e.target.value }))} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif" }} />
              </div>
              <textarea placeholder="Description" value={newItem.desc} onChange={e => setNewItem(p => ({ ...p, desc: e.target.value }))} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif", marginBottom: 12, resize: "vertical", minHeight: 60 }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <input placeholder="Image URL" value={newItem.img} onChange={e => setNewItem(p => ({ ...p, img: e.target.value }))} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif" }} />
                <select value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 14, fontFamily: "'Nunito',sans-serif", background: "#fff" }}>
                  {Object.keys(menu).map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleAddItem} style={{ padding: "10px 24px", borderRadius: 10, background: "#1a1a1a", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>✅ Save</button>
                <button onClick={() => setShowAddForm(false)} style={{ padding: "10px 24px", borderRadius: 10, background: "#f5f5f5", color: "#555", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>Cancel</button>
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
            {Object.keys(menu).map(cat => (
              <button key={cat} onClick={() => setAdminTab(cat)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700, background: adminTab === cat ? "#1a1a1a" : "#fff", color: adminTab === cat ? "#fff" : "#555", border: "1px solid #e0e0e0", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Nunito',sans-serif" }}>{cat} ({menu[cat].length})</button>
            ))}
          </div>
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
                  <img src={item.img} alt={item.name} style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} onError={e => { e.target.style.background = "#f0f0f0"; e.target.src = ""; }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.desc}</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#e8520a" }}>${item.price.toFixed(2)}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEditingItem({ ...item, category: adminTab })} style={{ padding: "6px 14px", borderRadius: 8, background: "#f5f5f5", color: "#555", border: "1px solid #e0e0e0", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>✏️ Edit</button>
                    <button onClick={() => handleDeleteItem(adminTab, item.id)} style={{ padding: "6px 14px", borderRadius: 8, background: "#fff0f0", color: "#ff3b30", border: "1px solid #ffd0d0", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>🗑️ Delete</button>
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

  const OrderPanel = () => (
    <div style={{ background: "#fff", borderRadius: isMobile ? 0 : 16, border: "1px solid #e8e8e8", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 900 }}>Order</span>
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
            <div style={{ fontSize: 13, fontWeight: 700 }}>Today - {selectedLocation.time}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 800 }}>Items</span>
        </div>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", color: "#bbb", fontSize: 13, padding: "20px 0" }}>Your cart is empty</div>
        ) : cart.map(item => (
          <div key={item.cartId} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #f5f5f5" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{item.meat} · {item.sauce}</div>
                {item.toppings.length > 0 && <div style={{ fontSize: 11, color: "#e8520a", marginTop: 1 }}>+{item.toppings.map(t => t.name).join(", ")}</div>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>${(item.finalPrice * item.qty).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.cartId)} style={{ width: 20, height: 20, borderRadius: "50%", background: "#fee", color: "#f43f5e", border: "none", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>
            </div>
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
            <div key={item.id} onClick={() => openItemDetail(item)} style={{ flex: 1, cursor: "pointer" }}>
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
          <button onClick={() => { if (cart.length > 0) { setPage("checkout"); setShowCartMobile(false); } }} style={{ width: "100%", padding: "14px", borderRadius: 12, background: cart.length > 0 ? "#1a1a1a" : "#ccc", color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: "'Nunito',sans-serif", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
      `}</style>

      {/* ITEM DETAIL MODAL */}
      {selectedItem && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 2000, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setSelectedItem(null)}>
          <div className="modal-in" style={{ background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 560, maxHeight: "92vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            {/* Image */}
            <div style={{ position: "relative" }}>
              <img src={selectedItem.img} alt={selectedItem.name} style={{ width: "100%", height: 240, objectFit: "cover" }} onError={e => { e.target.style.background = "#f0f0f0"; e.target.src = ""; }} />
              <button onClick={() => setSelectedItem(null)} style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              {selectedItem.badge && <div style={{ position: "absolute", top: 12, left: 12, background: "#1a1a1a", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>{selectedItem.badge}</div>}
            </div>

            <div style={{ padding: "20px 20px 100px" }}>
              {/* Name & Price */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, flex: 1, paddingRight: 12 }}>{selectedItem.name}</h2>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#e8520a", flexShrink: 0 }}>${selectedItem.price.toFixed(2)}</span>
              </div>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 20 }}>{selectedItem.desc}</p>

              {/* Ingredients */}
              {selectedItem.ingredients && selectedItem.ingredients.length > 0 && (
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
                  const selected = selectedToppings.find(t => t.name === topping.name);
                  return (
                    <button key={topping.name} onClick={() => toggleTopping(topping)} className="option-btn" style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", background: "none", border: "none", borderBottom: "1px solid #eee", fontFamily: "'Nunito',sans-serif" }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{topping.name}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 13, color: "#e8520a", fontWeight: 700 }}>+${topping.price.toFixed(2)}</span>
                        <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${selected ? "#e8520a" : "#ccc"}`, background: selected ? "#e8520a" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>
                          {selected && "✓"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Add to Cart */}
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
        <img src="/logo.jpg" alt="Angie's" onClick={() => { setActiveCategory("Home"); setSearch(""); setPage("menu"); }} style={{ height: 48, width: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid #f5c842", flexShrink: 0, cursor: "pointer" }} />
        <div style={{ flex: 1, position: "relative" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Menu" style={{ width: "100%", padding: "8px 16px 8px 36px", borderRadius: 20, border: "1px solid #e0e0e0", background: "#f7f7f5", fontSize: 14, fontFamily: "'Nunito',sans-serif" }} />
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#999" }}>🔍</span>
        </div>
      </div>

      {page === "menu" && (
        <>
          <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ flex: 1, minWidth: 0, paddingBottom: isMobile ? 80 : 40 }}>
              <div style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 16px", display: "flex", overflowX: "auto", position: "sticky", top: 64, zIndex: 99 }}>
                {Object.keys(menu).map(cat => (
                  <button key={cat} className="cat-tab" onClick={() => { setActiveCategory(cat); setSearch(""); }} style={{ padding: "14px 14px", fontSize: 13, fontWeight: 700, color: activeCategory === cat ? "#e8520a" : "#555", borderBottom: activeCategory === cat ? "2px solid #e8520a" : "2px solid transparent", whiteSpace: "nowrap", fontFamily: "'Nunito',sans-serif" }}>{cat}</button>
                ))}
              </div>

              {activeCategory === "Home" && !search.trim() && (
                <div style={{ position: "relative", height: isMobile ? 200 : 260, overflow: "hidden", margin: "16px 16px 0 16px", borderRadius: 16 }}>
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
                {Object.entries(filteredMenu).map(([cat, items]) => (
                  <div key={cat} className="fade-in">
                    <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 14 }}>{cat}</h2>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginBottom: 28 }}>
                      {items.map(item => (
                        <div key={item.id} className="food-card" onClick={() => openItemDetail(item)} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", border: "1px solid #eee" }}>
                          <div style={{ position: "relative" }}>
                            <img src={item.img} alt={item.name} style={{ width: "100%", height: isMobile ? 120 : 160, objectFit: "cover", display: "block" }} onError={e => { e.target.style.background = "#f0f0f0"; e.target.src = ""; }} />
                            <div style={{ position: "absolute", top: 6, left: 6, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 6 }}>${item.price.toFixed(2)}</div>
                            {item.badge && <div style={{ position: "absolute", bottom: 6, left: 6, background: "#f5c842", color: "#1a1a1a", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 10 }}>{item.badge}</div>}
                            <div style={{ position: "absolute", bottom: 6, right: 6, width: 28, height: 28, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", fontSize: 16, fontWeight: 300 }}>+</div>
                          </div>
                          <div style={{ padding: "10px 12px 12px" }}>
                            <div style={{ fontSize: isMobile ? 12 : 14, fontWeight: 800, marginBottom: 3, lineHeight: 1.3 }}>{item.name}</div>
                            {!isMobile && <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>{item.desc}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!isMobile && (
              <div style={{ width: 340, flexShrink: 0, padding: "24px 24px 24px 0" }}>
                <div style={{ position: "sticky", top: 80 }}>
                  <OrderPanel />
                </div>
              </div>
            )}
          </div>

          {isMobile && (
            <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1px solid #eee", padding: "10px 16px", zIndex: 100 }}>
              <button onClick={() => setShowCartMobile(true)} style={{ width: "100%", padding: "14px", borderRadius: 14, background: cartCount > 0 ? "#1a1a1a" : "#ccc", color: "#fff", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer", fontFamily: "'Nunito',sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 8, padding: "2px 10px", fontSize: 13 }}>{cartCount} items</span>
                <span>View Order</span>
                <span>${total.toFixed(2)}</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* CHECKOUT */}
      {page === "checkout" && (
        <div className="fade-in" style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px 80px" }}>
          <button onClick={() => setPage("menu")} style={{ background: "none", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", color: "#555", marginBottom: 20, fontFamily: "'Nunito',sans-serif" }}>← Back to Menu</button>
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
            <div style={{ fontSize: 13, fontWeight: 800, color: "#555", marginBottom: 10 }}>ORDER SUMMARY</div>
            {cart.map(item => (
              <div key={item.cartId} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ fontWeight: 700 }}>{item.name} × {item.qty}</span>
                  <span style={{ fontWeight: 700 }}>${(item.finalPrice * item.qty).toFixed(2)}</span>
                </div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{item.meat} · {item.sauce}{item.toppings.length > 0 ? ` · ${item.toppings.map(t => t.name).join(", ")}` : ""}</div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 16, marginTop: 8 }}>
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={handlePay} disabled={paying} style={{ width: "100%", padding: "15px", borderRadius: 12, background: paying ? "#ccc" : "#1a1a1a", color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: "'Nunito',sans-serif", border: "none", cursor: paying ? "not-allowed" : "pointer" }}>
            {paying ? <span><span className="spin">⟳</span> Processing...</span> : `🔒 Pay $${total.toFixed(2)}`}
          </button>
        </div>
      )}

      {/* CONFIRMATION */}
      {page === "confirmation" && (
        <div className="fade-in" style={{ maxWidth: 480, margin: "40px auto", padding: "0 20px", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>Order Confirmed!</h2>
          <p style={{ color: "#888", marginBottom: 24 }}>Thank you for ordering from Angie's!</p>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "#888", fontWeight: 700, marginBottom: 4 }}>ORDER NUMBER</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#e8520a" }}>#{orderNum}</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 16, padding: 20, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>📍 {selectedLocation.name}</div>
            <div style={{ fontSize: 13, color: "#888" }}>{selectedLocation.address}</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 16, padding: 20, marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>🏃 Ready for Pickup In</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#22c55e" }}>{selectedLocation.time}</div>
          </div>
          <button onClick={() => { setCart([]); setPage("menu"); }} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#1a1a1a", color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: "'Nunito',sans-serif", border: "none", cursor: "pointer" }}>Order Again 🍔</button>
        </div>
      )}
    </div>
  );
}
