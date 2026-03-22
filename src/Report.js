import Report from "./Report";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const REPORT_PASSWORD = "angies2024";

const WEEKLY_DATA = [
  { week: "W1 Jan", revenue: 46276, netRevenue: 34108, cost: 24196, food: 9727, staff: 7578, operation: 6891, grossProfit: 22080, netProfit: 9912, transactions: 1483 },
  { week: "W2 Jan", revenue: 43179, netRevenue: 30502, cost: 23712, food: 9572, staff: 7249, operation: 6891, grossProfit: 19467, netProfit: 6790, transactions: 1399 },
  { week: "W3 Jan", revenue: 37198, netRevenue: 27970, cost: 23105, food: 9530, staff: 6714, operation: 6861, grossProfit: 14093, netProfit: 4865, transactions: 1259 },
  { week: "W4 Jan", revenue: 35442, netRevenue: 26496, cost: 22501, food: 8710, staff: 6900, operation: 6891, grossProfit: 12941, netProfit: 3995, transactions: 1213 },
  { week: "W5 Feb", revenue: 38166, netRevenue: 28975, cost: 21298, food: 7285, staff: 7122, operation: 6891, grossProfit: 16868, netProfit: 7677, transactions: 1257 },
  { week: "W6 Feb", revenue: 34314, netRevenue: 26046, cost: 22911, food: 9594, staff: 6426, operation: 6891, grossProfit: 11403, netProfit: 3135, transactions: 1215 },
  { week: "W7 Feb", revenue: 34756, netRevenue: 26075, cost: 23229, food: 9618, staff: 6720, operation: 6891, grossProfit: 11527, netProfit: 2846, transactions: 1233 },
  { week: "W8 Feb", revenue: 30210, netRevenue: 22684, cost: 20365, food: 7144, staff: 6330, operation: 6891, grossProfit: 9845, netProfit: 2319, transactions: 1084 },
  { week: "W9 Mar", revenue: 30024, netRevenue: 23069, cost: 21098, food: 7879, staff: 6328, operation: 6891, grossProfit: 8926, netProfit: 1971, transactions: 1075 },
  { week: "W10 Mar", revenue: 29292, netRevenue: 21641, cost: 20701, food: 7496, staff: 6314, operation: 6891, grossProfit: 8591, netProfit: 940, transactions: 1035 },
  { week: "W11 Mar", revenue: 31518, netRevenue: 23162, cost: 6891, food: 0, staff: 0, operation: 6891, grossProfit: 24627, netProfit: 16271, transactions: 1082 },
];

const MONTHLY_DATA = [
  { month: "January", revenue: 200261, netRevenue: 148051, cost: 114812, food: 44824, staff: 35563, operation: 34425, grossProfit: 85449, netProfit: 33239, transactions: 6611 },
  { month: "February", revenue: 129304, netRevenue: 97874, cost: 87603, food: 34235, staff: 25804, operation: 27564, grossProfit: 41701, netProfit: 10271, transactions: 4607 },
  { month: "March", revenue: 60810, netRevenue: 44803, cost: 41374, food: 7496, staff: 6314, operation: 27564, grossProfit: 19436, netProfit: 3429, transactions: 2117 },
];

const STORE_DATA = [
  { name: "Ascot Vale", revenue: 324808, netRevenue: 246280, cost: 265908, food: 80422, staff: 69496, operation: 115990, grossProfit: 58900, netProfit: -19628, transactions: 11388, profitPct: -6.04, color: "#e8520a" },
  { name: "St Albans", revenue: 186948, netRevenue: 131729, cost: 116662, food: 43263, staff: 26640, operation: 46759, grossProfit: 70286, netProfit: 15067, transactions: 5758, profitPct: 8.06, color: "#f5c842" },
  { name: "Fitzroy North", revenue: 68584, netRevenue: 57995, cost: 65151, food: 10780, staff: 12713, operation: 41658, grossProfit: 3433, netProfit: -7156, transactions: 2930, profitPct: -10.43, color: "#22c55e" },
];

const ONLINE_DATA = [
  { name: "Uber Eats", transactions: 1767, grossRevenue: 66303, netRevenue: 35785, color: "#06c167" },
  { name: "DoorDash", transactions: 1279, grossRevenue: 36703, netRevenue: 20722, color: "#ff3008" },
];

const fmt = (n) => n >= 0 ? `$${n.toLocaleString()}` : `-$${Math.abs(n).toLocaleString()}`;
const pct = (n) => `${(n * 100).toFixed(1)}%`;

export default function App() {
  const path = window.location.pathname;
  if (path === "/report") return <Report />;
  const isAdmin = path === "/admin";

  const [loggedIn, setLoggedIn] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("monthly");

  const handleLogin = () => {
    if (pass === REPORT_PASSWORD) { setLoggedIn(true); setError(""); }
    else setError("Wrong password!");
  };

  if (!loggedIn) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito',sans-serif" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } input { outline: none; }`}</style>
      <div style={{ background: "#111", borderRadius: 20, padding: 40, width: 360, border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <img src="/logo.jpg" alt="logo" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "3px solid #f5c842" }} />
          <h2 style={{ fontSize: 20, fontWeight: 900, marginTop: 12, color: "#fff" }}>P&L Report</h2>
          <p style={{ fontSize: 13, color: "#666", marginTop: 4 }}>Angie's Kebabs & Burgers</p>
        </div>
        <input type="password" placeholder="Enter password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, fontFamily: "'Nunito',sans-serif", marginBottom: 10 }} />
        {error && <p style={{ color: "#e8520a", fontSize: 13, marginBottom: 8 }}>{error}</p>}
        <button onClick={handleLogin} style={{ width: "100%", padding: "12px", borderRadius: 10, background: "#e8520a", color: "#fff", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>View Report →</button>
      </div>
    </div>
  );

  const totalRevenue = 390375;
  const totalNetRevenue = 290728;
  const totalCost = 312699;
  const totalNetProfit = -21971;
  const totalTransactions = 13335;
  const chartData = period === "monthly" ? MONTHLY_DATA : WEEKLY_DATA;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e2e8f0", fontFamily: "'Nunito',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
      `}</style>

      {/* NAVBAR */}
      <div style={{ background: "#111", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/logo.jpg" alt="logo" onClick={() => window.location.href = "/"} style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "2px solid #f5c842", cursor: "pointer" }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>P&L Dashboard</div>
            <div style={{ fontSize: 11, color: "#555" }}>Angie's Kebabs & Burgers · 2026</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["overview", "weekly", "stores", "online"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: activeTab === tab ? "#e8520a" : "rgba(255,255,255,0.06)", color: activeTab === tab ? "#fff" : "#666", border: "none", cursor: "pointer", textTransform: "capitalize", fontFamily: "'Nunito',sans-serif" }}>{tab}</button>
          ))}
        </div>
        <button onClick={() => setLoggedIn(false)} style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(255,255,255,0.06)", color: "#666", border: "none", cursor: "pointer", fontSize: 12, fontFamily: "'Nunito',sans-serif" }}>Logout</button>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 60px" }}>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="fade-up">
            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Gross Revenue", value: fmt(totalRevenue), sub: "2026 YTD", color: "#14b8a6", icon: "💰" },
                { label: "Net Revenue", value: fmt(totalNetRevenue), sub: "After platform fees", color: "#6366f1", icon: "📊" },
                { label: "Total Cost", value: fmt(totalCost), sub: "Food + Staff + Ops", color: "#f43f5e", icon: "💸" },
                { label: "Net Profit", value: fmt(totalNetProfit), sub: `${pct(totalNetProfit / totalNetRevenue)} margin`, color: totalNetProfit >= 0 ? "#22c55e" : "#f43f5e", icon: totalNetProfit >= 0 ? "📈" : "📉" },
                { label: "Transactions", value: totalTransactions.toLocaleString(), sub: "Total orders", color: "#f59e0b", icon: "🧾" },
                { label: "Avg. Order", value: fmt(Math.round(totalRevenue / totalTransactions)), sub: "Per transaction", color: "#ec4899", icon: "🍔" },
              ].map((k, i) => (
                <div key={i} style={{ background: `${k.color}18`, border: `1px solid ${k.color}30`, borderRadius: 14, padding: "16px 18px" }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{k.icon}</div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 20, fontWeight: 700, color: k.color, marginBottom: 3 }}>{k.value}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{k.label}</div>
                  <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, color: "#94a3b8" }}>💸 Cost Breakdown</div>
              {[
                { label: "Food Cost", value: 86555, total: totalNetRevenue, color: "#f59e0b" },
                { label: "Staff Cost", value: 67681, total: totalNetRevenue, color: "#6366f1" },
                { label: "Operation Cost", value: 158463, total: totalNetRevenue, color: "#f43f5e" },
              ].map((c, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{c.label}</span>
                    <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: c.color }}>{fmt(c.value)} <span style={{ color: "#555" }}>({pct(c.value / c.total)})</span></span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3 }}>
                    <div style={{ height: 6, background: c.color, borderRadius: 3, width: `${Math.min((c.value / c.total) * 100, 100)}%`, transition: "width 1s ease" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Monthly Chart */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, color: "#94a3b8" }}>📅 Monthly P&L</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={MONTHLY_DATA} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} width={60} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 8, fontSize: 12 }} formatter={v => [`$${v.toLocaleString()}`, ""]} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
                  <Bar dataKey="netRevenue" name="Net Revenue" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cost" name="Total Cost" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="netProfit" name="Net Profit" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* WEEKLY TAB */}
        {activeTab === "weekly" && (
          <div className="fade-up">
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, color: "#94a3b8" }}>📈 Weekly Revenue & Profit Trend</div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={WEEKLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="week" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} width={60} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 8, fontSize: 11 }} formatter={v => [`$${v.toLocaleString()}`, ""]} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
                  <Line type="monotone" dataKey="netRevenue" name="Net Revenue" stroke="#14b8a6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="cost" name="Cost" stroke="#f43f5e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="netProfit" name="Net Profit" stroke="#6366f1" strokeWidth={2.5} dot={false} strokeDasharray="4 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly Table */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20, overflowX: "auto" }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, color: "#94a3b8" }}>📋 Weekly Breakdown</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {["Week", "Transactions", "Gross Rev", "Net Rev", "Food", "Staff", "Ops", "Net Profit"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "right", color: "#475569", fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {WEEKLY_DATA.map((w, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                      <td style={{ padding: "8px 10px", color: "#94a3b8", fontWeight: 700 }}>{w.week}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "'Space Mono',monospace", fontSize: 11 }}>{w.transactions.toLocaleString()}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#14b8a6" }}>{fmt(w.revenue)}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#6366f1" }}>{fmt(w.netRevenue)}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#f59e0b" }}>{fmt(w.food)}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#ec4899" }}>{fmt(w.staff)}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#f43f5e" }}>{fmt(w.operation)}</td>
                      <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "'Space Mono',monospace", fontSize: 11, color: w.netProfit >= 0 ? "#22c55e" : "#f43f5e", fontWeight: 700 }}>{fmt(w.netProfit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STORES TAB */}
        {activeTab === "stores" && (
          <div className="fade-up">
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {STORE_DATA.map((store, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${store.color}30`, borderRadius: 16, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: store.color }}>{store.name}</div>
                      <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{store.transactions.toLocaleString()} transactions</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 18, fontWeight: 700, color: store.netProfit >= 0 ? "#22c55e" : "#f43f5e" }}>{fmt(store.netProfit)}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>Net Profit ({store.profitPct > 0 ? "+" : ""}{store.profitPct.toFixed(1)}%)</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    {[
                      { label: "Gross Revenue", value: fmt(store.revenue), color: "#14b8a6" },
                      { label: "Net Revenue", value: fmt(store.netRevenue), color: "#6366f1" },
                      { label: "Total Cost", value: fmt(store.cost), color: "#f43f5e" },
                      { label: "Food Cost", value: fmt(store.food), color: "#f59e0b" },
                      { label: "Staff Cost", value: fmt(store.staff), color: "#ec4899" },
                      { label: "Operation", value: fmt(store.operation), color: "#8b5cf6" },
                    ].map((m, j) => (
                      <div key={j} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px" }}>
                        <div style={{ fontSize: 10, color: "#475569", marginBottom: 3, fontWeight: 700 }}>{m.label}</div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, fontWeight: 700, color: m.color }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Store Comparison Chart */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, color: "#94a3b8" }}>🏪 Store Revenue Comparison</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={STORE_DATA} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" tick={{ fill: "#475569", fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} width={90} />
                    <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 8, fontSize: 12 }} formatter={v => [`$${v.toLocaleString()}`, ""]} />
                    <Bar dataKey="netRevenue" name="Net Revenue" radius={[0, 4, 4, 0]}>
                      {STORE_DATA.map((s, i) => <Cell key={i} fill={s.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ONLINE TAB */}
        {activeTab === "online" && (
          <div className="fade-up">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {ONLINE_DATA.map((p, i) => (
                <div key={i} style={{ background: `${p.color}15`, border: `1px solid ${p.color}30`, borderRadius: 16, padding: 20 }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: p.color, marginBottom: 12 }}>{p.name}</div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: "#555", marginBottom: 2 }}>Transactions</div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}>{p.transactions.toLocaleString()}</div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, color: "#555", marginBottom: 2 }}>Gross Revenue</div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, fontWeight: 700, color: p.color }}>{fmt(p.grossRevenue)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "#555", marginBottom: 2 }}>Net (After Commission)</div>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 16, fontWeight: 700, color: "#22c55e" }}>{fmt(p.netRevenue)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, color: "#94a3b8" }}>🥧 Revenue Split</div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={ONLINE_DATA} cx="50%" cy="50%" outerRadius={80} dataKey="grossRevenue" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {ONLINE_DATA.map((p, i) => <Cell key={i} fill={p.color} />)}
                  </Pie>
                  <Tooltip formatter={v => [`$${v.toLocaleString()}`, ""]} contentStyle={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12, color: "#94a3b8" }}>📋 Commission Impact</div>
              {ONLINE_DATA.map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: p.color }}>{p.name}</span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, color: "#f43f5e" }}>-{fmt(p.grossRevenue - p.netRevenue)} commission</div>
                    <div style={{ fontSize: 11, color: "#555" }}>{pct((p.grossRevenue - p.netRevenue) / p.grossRevenue)} rate</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}