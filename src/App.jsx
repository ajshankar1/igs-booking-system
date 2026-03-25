import { useState } from "react";

/* ─── Real IGS Details ─── */
const VENUE = {
  name:    "IGS Convention Centre",
  tagline: "Tirunelveli's Premier Convention Venue",
  address: "51/4A, 4B Ambai Road, Palayamkottai, Tirunelveli – 627002",
  phone:   "+91 98416 08160",
  email:   "sreeganesamahal@gmail.com",
  gstin:   "33XXXXX1234X1ZX",
  gstRate: 0.18,
};

const HALLS = [
  { name:"Shree Ganesha Mahal", capacity:500, tag:"Flagship Hall" },
  { name:"Kaveri Hall",         capacity:350, tag:"Premium Hall"  },
  { name:"Vaigai Hall",         capacity:200, tag:"Elegant Hall"  },
  { name:"Thamirabarani Hall",  capacity:100, tag:"Intimate Hall" },
];
const HALL_NAMES = HALLS.map(h => `${h.name} (${h.capacity} pax)`);

const EVENT_TYPES = [
  "Wedding Ceremony","Wedding Reception","Engagement","Naming Ceremony",
  "Birthday","Upanayanam","Baby Shower","Anniversary",
  "Corporate Event","Conference","Pooja / Religious","Other",
];

/* ─── Helpers ─── */
const genId   = () => "IGS" + String(Date.now()).slice(-6);
const fmt     = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const fmtDate = (s) =>
  s ? new Date(s + "T00:00:00").toLocaleDateString("en-IN", {
    day:"2-digit", month:"long", year:"numeric" }) : "—";
const todayStr = () => new Date().toISOString().split("T")[0];
const addGST   = (base) => Math.round(base * VENUE.gstRate);

/* ─── Sample Bookings ─── */
const SAMPLE = [
  {
    id:"IGS240001", customerName:"Suresh Rajan", phone:"9876543210",
    email:"suresh@gmail.com", address:"12, Anna Nagar, Tirunelveli",
    eventType:"Wedding Ceremony", eventDate:"2026-04-10",
    hall:"Shree Ganesha Mahal (500 pax)", baseAmount:150000, gstAmount:27000, totalAmount:177000,
    advanceAmount:50000, advancePaidOn:"2026-03-15",
    notes:"Mandapam & floral arch required", createdOn:"2026-03-15",
  },
  {
    id:"IGS240002", customerName:"Priya Kumari", phone:"8765432109",
    email:"priya@gmail.com", address:"45, Palayamkottai, Tirunelveli",
    eventType:"Wedding Reception", eventDate:"2026-04-22",
    hall:"Kaveri Hall (350 pax)", baseAmount:110000, gstAmount:19800, totalAmount:129800,
    advanceAmount:30000, advancePaidOn:"2026-03-18",
    notes:"DJ + stage decorations needed", createdOn:"2026-03-18",
  },
  {
    id:"IGS240003", customerName:"Venkat Narayanan", phone:"7654321098",
    email:"venkat@gmail.com", address:"7, Krishnapuram, Tirunelveli",
    eventType:"Conference", eventDate:"2026-05-05",
    hall:"Thamirabarani Hall (100 pax)", baseAmount:65000, gstAmount:11700, totalAmount:76700,
    advanceAmount:25000, advancePaidOn:"2026-03-20",
    notes:"Projector & AV setup needed", createdOn:"2026-03-20",
  },
  {
    id:"IGS240004", customerName:"Lakshmi Devi", phone:"9988776655",
    email:"lakshmi@gmail.com", address:"Melapalayam, Tirunelveli",
    eventType:"Engagement", eventDate:"2026-05-18",
    hall:"Vaigai Hall (200 pax)", baseAmount:110000, gstAmount:19800, totalAmount:129800,
    advanceAmount:40000, advancePaidOn:"2026-03-21",
    notes:"Simple floral decor", createdOn:"2026-03-21",
  },
];

/* ══════════════════════════════════════════
   PRINT DOCUMENT
══════════════════════════════════════════ */
function PrintDoc({ type, booking, onClose }) {
  const balance   = booking.totalAmount - booking.advanceAmount;
  const isInvoice = type === "invoice";
  const docNo     = isInvoice ? "INV-" + booking.id : "RCP-" + booking.id;

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.75)",
      zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16,
    }}>
      <style>{`
        @media print {
          body > * { display: none !important; }
          #igsPrint { display: block !important; position: fixed;
            top: 0; left: 0; width: 100%; padding: 24px; }
        }
      `}</style>

      <div style={{ background:"white", width:"100%", maxWidth:740, maxHeight:"94vh",
        overflowY:"auto", borderRadius:6, boxShadow:"0 24px 64px rgba(0,0,0,0.5)" }}>
        <div style={{ background:"#5C0E0E", padding:"11px 18px", display:"flex",
          justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:"white", fontWeight:700, fontFamily:"Playfair Display, Georgia, serif", fontSize:14 }}>
            {isInvoice ? "📄 Invoice" : "🧾 Advance Receipt"} — {docNo}
          </span>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => window.print()} style={{
              background:"#C9A227", color:"white", border:"none",
              padding:"7px 18px", cursor:"pointer", borderRadius:4, fontWeight:700, fontSize:13,
            }}>🖨️ Print</button>
            <button onClick={onClose} style={{
              background:"transparent", color:"white", border:"1px solid rgba(255,255,255,0.4)",
              padding:"7px 14px", cursor:"pointer", borderRadius:4, fontSize:13,
            }}>✕ Close</button>
          </div>
        </div>

        <div id="igsPrint" style={{ padding:"38px 44px", fontFamily:"Georgia,'Times New Roman',serif", color:"#222" }}>
          <div style={{ textAlign:"center", marginBottom:26, paddingBottom:20, borderBottom:"3px double #C9A227" }}>
            <div style={{ fontSize:8, letterSpacing:8, color:"#C9A227", marginBottom:8 }}>✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦</div>
            <div style={{ fontFamily:"Playfair Display, Georgia, serif", fontSize:32,
              fontWeight:700, color:"#5C0E0E", letterSpacing:2 }}>🕉️ IGS Convention Centre</div>
            <div style={{ fontSize:13, color:"#7B1818", fontWeight:600, letterSpacing:3,
              textTransform:"uppercase", marginTop:4 }}>Tirunelveli's Premier Convention Venue</div>
            <div style={{ fontSize:12, color:"#666", marginTop:8, lineHeight:1.8 }}>
              51/4A, 4B Ambai Road, Palayamkottai, Tirunelveli – 627002<br/>
              📞 +91 98416 08160 &nbsp;|&nbsp; ✉ sreeganesamahal@gmail.com<br/>
              GSTIN: {VENUE.gstin}
            </div>
          </div>

          <div style={{ textAlign:"center", marginBottom:24 }}>
            <div style={{ display:"inline-block", background:"#5C0E0E", color:"white",
              padding:"6px 40px", fontSize:16, fontWeight:700, letterSpacing:4, textTransform:"uppercase" }}>
              — {isInvoice ? "Invoice" : "Advance Receipt"} —
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:22,
            background:"#FBF5E6", padding:"16px 20px", border:"1px solid #e0d0b0", borderRadius:4 }}>
            <div>
              <div style={{ fontSize:10, color:"#888", letterSpacing:2, textTransform:"uppercase", marginBottom:5 }}>Bill To</div>
              <div style={{ fontSize:18, fontWeight:700, color:"#5C0E0E" }}>{booking.customerName}</div>
              <div style={{ fontSize:13, marginTop:4 }}>📞 {booking.phone}</div>
              {booking.email   && <div style={{ fontSize:13 }}>✉ {booking.email}</div>}
              {booking.address && <div style={{ fontSize:13, maxWidth:220, marginTop:3 }}>📍 {booking.address}</div>}
            </div>
            <div>
              <table style={{ borderCollapse:"collapse", fontSize:13 }}>
                <tbody>
                  {[
                    [isInvoice?"Invoice No":"Receipt No", docNo],
                    ["Date",       fmtDate(todayStr())],
                    ["Event Date", fmtDate(booking.eventDate)],
                    ["Event",      booking.eventType],
                    ["Hall",       booking.hall.split(" (")[0]],
                  ].map(([k,v]) => (
                    <tr key={k}>
                      <td style={{ padding:"3px 12px 3px 0", color:"#666" }}>{k}:</td>
                      <td style={{ padding:"3px 0", fontWeight:600 }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#5C0E0E", color:"white" }}>
                <th style={{ padding:"11px 14px", textAlign:"left", fontSize:13 }}>Description</th>
                <th style={{ padding:"11px 14px", textAlign:"right", fontSize:13 }}>Base Rent</th>
                <th style={{ padding:"11px 14px", textAlign:"right", fontSize:13 }}>GST 18%</th>
                <th style={{ padding:"11px 14px", textAlign:"right", fontSize:13 }}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding:"16px 14px", borderBottom:"1px solid #e0d0b0" }}>
                  <div style={{ fontWeight:700, fontSize:15 }}>
                    {booking.eventType} — {booking.hall.split(" (")[0]}
                  </div>
                  <div style={{ fontSize:12, color:"#777", marginTop:4 }}>Event Date: {fmtDate(booking.eventDate)}</div>
                  {booking.notes && <div style={{ fontSize:12, color:"#777", marginTop:3 }}>Note: {booking.notes}</div>}
                </td>
                <td style={{ padding:"16px 14px", textAlign:"right", borderBottom:"1px solid #e0d0b0" }}>
                  {fmt(booking.baseAmount)}
                </td>
                <td style={{ padding:"16px 14px", textAlign:"right", borderBottom:"1px solid #e0d0b0", color:"#666" }}>
                  {fmt(booking.gstAmount)}
                </td>
                <td style={{ padding:"16px 14px", textAlign:"right", borderBottom:"1px solid #e0d0b0",
                  fontWeight:700, fontSize:16 }}>
                  {fmt(booking.totalAmount)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              {isInvoice ? (
                <>
                  <tr style={{ background:"#fdf9f3" }}>
                    <td colSpan={3} style={{ padding:"10px 14px", textAlign:"right", color:"#2D6A4F" }}>
                      (–) Advance Received on {fmtDate(booking.advancePaidOn)}
                    </td>
                    <td style={{ padding:"10px 14px", textAlign:"right", color:"#2D6A4F", fontWeight:700 }}>
                      – {fmt(booking.advanceAmount)}
                    </td>
                  </tr>
                  <tr style={{ background:"#5C0E0E", color:"white" }}>
                    <td colSpan={3} style={{ padding:"14px", textAlign:"right", fontWeight:700, fontSize:15 }}>Balance Due</td>
                    <td style={{ padding:"14px", textAlign:"right", fontWeight:700, fontSize:20 }}>{fmt(balance)}</td>
                  </tr>
                </>
              ) : (
                <>
                  <tr style={{ background:"#fdf9f3" }}>
                    <td colSpan={3} style={{ padding:"10px 14px", textAlign:"right", color:"#555" }}>
                      Total Booking Amount (incl. GST)
                    </td>
                    <td style={{ padding:"10px 14px", textAlign:"right", fontWeight:700 }}>{fmt(booking.totalAmount)}</td>
                  </tr>
                  <tr style={{ background:"#C9A227", color:"white" }}>
                    <td colSpan={3} style={{ padding:"14px", textAlign:"right", fontWeight:700, fontSize:15 }}>Advance Received</td>
                    <td style={{ padding:"14px", textAlign:"right", fontWeight:700, fontSize:20 }}>{fmt(booking.advanceAmount)}</td>
                  </tr>
                  <tr style={{ background:"#fdf9f3" }}>
                    <td colSpan={3} style={{ padding:"10px 14px", textAlign:"right", color:"#7B1818", fontWeight:600 }}>
                      Balance Remaining (payable on/before event date)
                    </td>
                    <td style={{ padding:"10px 14px", textAlign:"right", color:"#7B1818", fontWeight:700 }}>{fmt(balance)}</td>
                  </tr>
                </>
              )}
            </tfoot>
          </table>

          <div style={{ borderTop:"3px double #C9A227", marginTop:28, paddingTop:18,
            display:"flex", justifyContent:"space-between", gap:30, fontSize:12, color:"#666" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:"#333", marginBottom:6 }}>Terms & Conditions</div>
              <div style={{ lineHeight:1.9 }}>
                • Hall rental (incl. GST) payable in full as advance to confirm booking.<br/>
                • Cancellation: 60+ days – 80% refund · 30–60 days – 50% · Under 15 days – No refund.<br/>
                • Extra hours: ₹10,000/hr (Ganesha Mahal) · ₹1,000/hr (other halls).<br/>
                • EB charges: ₹30/unit. Generator &amp; other charges extra as applicable.<br/>
                • Damage to property will be assessed and billed accordingly.
              </div>
              <div style={{ marginTop:10 }}>
                <strong>Payment Methods:</strong> Cash · UPI (GPay/PhonePe/Paytm) · NEFT/RTGS · Cheque
              </div>
            </div>
            <div style={{ textAlign:"right", minWidth:180 }}>
              <div style={{ marginTop:50, borderTop:"1px solid #555", paddingTop:6, fontSize:13, color:"#444" }}>
                Authorised Signature
              </div>
              <div style={{ fontWeight:700, color:"#5C0E0E", marginTop:4 }}>IGS Convention Centre</div>
              <div style={{ fontSize:11, color:"#888" }}>Palayamkottai, Tirunelveli</div>
            </div>
          </div>

          <div style={{ textAlign:"center", marginTop:22, color:"#C9A227", fontSize:11, letterSpacing:2 }}>
            ✦ THANK YOU FOR CHOOSING IGS CONVENTION CENTRE ✦
          </div>
          <div style={{ textAlign:"center", marginTop:4, fontSize:11, color:"#aaa" }}>
            📞 +91 98416 08160 &nbsp;·&nbsp; sreeganesamahal@gmail.com &nbsp;·&nbsp; 51/4A, 4B Ambai Road, Palayamkottai, Tirunelveli – 627002
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */
function Dashboard({ bookings, onTab }) {
  const today    = todayStr();
  const upcoming = bookings.filter(b => b.eventDate >= today);
  const totalRev = bookings.reduce((s,b) => s + b.totalAmount, 0);
  const totalAdv = bookings.reduce((s,b) => s + b.advanceAmount, 0);
  const nextEvt  = [...upcoming].sort((a,b) => a.eventDate.localeCompare(b.eventDate))[0];
  const recent   = [...bookings].sort((a,b) => b.createdOn.localeCompare(a.createdOn)).slice(0,5);

  const stats = [
    { label:"Total Bookings",    value:bookings.length, icon:"📋", color:"#5C0E0E" },
    { label:"Upcoming Events",   value:upcoming.length, icon:"📅", color:"#C9A227" },
    { label:"Total Revenue",     value:fmt(totalRev),   icon:"💰", color:"#2D6A4F" },
    { label:"Advance Collected", value:fmt(totalAdv),   icon:"✅", color:"#1D3557" },
  ];

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {stats.map((s,i) => (
          <div key={i} style={{ background:"white", borderRadius:8, padding:"20px 22px",
            boxShadow:"0 2px 10px rgba(0,0,0,0.07)", borderLeft:`4px solid ${s.color}` }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:22, fontWeight:700, color:s.color,
              fontFamily:"Playfair Display, Georgia, serif" }}>{s.value}</div>
            <div style={{ fontSize:12, color:"#888", marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {nextEvt && (
        <div style={{ background:"linear-gradient(135deg,#5C0E0E,#7B1818,#9B2226)",
          borderRadius:8, padding:"20px 26px", color:"white", marginBottom:24,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, opacity:0.7, letterSpacing:3, textTransform:"uppercase" }}>Next Upcoming Event</div>
            <div style={{ fontFamily:"Playfair Display, Georgia, serif", fontSize:22, fontWeight:700, marginTop:6 }}>
              {nextEvt.customerName}
            </div>
            <div style={{ opacity:0.85, marginTop:3 }}>
              {nextEvt.eventType} &nbsp;·&nbsp; {nextEvt.hall.split(" (")[0]}
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:22, color:"#C9A227", fontWeight:700 }}>📅 {fmtDate(nextEvt.eventDate)}</div>
            <div style={{ fontSize:13, opacity:0.7, marginTop:4 }}>{nextEvt.phone}</div>
            <div style={{ fontSize:13, fontWeight:700, marginTop:3 }}>{fmt(nextEvt.totalAmount)}</div>
          </div>
        </div>
      )}

      <div style={{ background:"white", borderRadius:8, boxShadow:"0 2px 10px rgba(0,0,0,0.07)" }}>
        <div style={{ padding:"14px 20px", borderBottom:"1px solid #f0e8d8",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"Playfair Display, Georgia, serif", fontWeight:700, color:"#5C0E0E", fontSize:17 }}>
            Recent Bookings
          </span>
          <button onClick={() => onTab("bookings")} style={{
            background:"transparent", border:"1px solid #C9A227", color:"#C9A227",
            padding:"5px 14px", cursor:"pointer", borderRadius:20, fontSize:12, fontWeight:600,
          }}>View All →</button>
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#FBF5E6" }}>
              {["Booking ID","Customer","Event","Date","Hall","Total","Balance"].map(h => (
                <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11,
                  color:"#888", fontWeight:700, textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((b,i) => {
              const bal = b.totalAmount - b.advanceAmount;
              return (
                <tr key={b.id} style={{ borderBottom:"1px solid #f5ebe0", background:i%2===0?"white":"#fdfaf5" }}>
                  <td style={{ padding:"12px 14px", color:"#C9A227", fontWeight:700, fontSize:12 }}>{b.id}</td>
                  <td style={{ padding:"12px 14px", fontWeight:600 }}>
                    {b.customerName}
                    <div style={{ fontSize:11, color:"#aaa", fontWeight:400 }}>{b.phone}</div>
                  </td>
                  <td style={{ padding:"12px 14px" }}>
                    <span style={{ background:"#FBF5E6", color:"#5C0E0E", padding:"2px 9px",
                      borderRadius:20, fontSize:11, fontWeight:700 }}>{b.eventType}</span>
                  </td>
                  <td style={{ padding:"12px 14px", fontSize:13 }}>{fmtDate(b.eventDate)}</td>
                  <td style={{ padding:"12px 14px", fontSize:12 }}>{b.hall.split(" (")[0]}</td>
                  <td style={{ padding:"12px 14px", fontWeight:700 }}>{fmt(b.totalAmount)}</td>
                  <td style={{ padding:"12px 14px", fontWeight:700, color:bal>0?"#C9A227":"#2D6A4F" }}>{fmt(bal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   BOOKING FORM
══════════════════════════════════════════ */
function BookingForm({ existing, onSave, onCancel }) {
  const [form, setForm] = useState(existing || {
    customerName:"", phone:"", email:"", address:"",
    eventType:"Wedding Ceremony", eventDate:"", hall:HALL_NAMES[0],
    baseAmount:"", advanceAmount:"", advancePaidOn:todayStr(), notes:"",
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const baseAmt  = Number(form.baseAmount) || 0;
  const gstAmt   = addGST(baseAmt);
  const totalAmt = baseAmt + gstAmt;
  const balance  = totalAmt - (Number(form.advanceAmount) || 0);

  const handleSave = () => {
    if (!form.customerName.trim() || !form.eventDate || !form.baseAmount) {
      alert("Please fill: Customer Name, Event Date, Base Hall Rent.");
      return;
    }
    onSave({
      ...form,
      id:            existing?.id || genId(),
      createdOn:     existing?.createdOn || todayStr(),
      baseAmount:    baseAmt,
      gstAmount:     gstAmt,
      totalAmount:   totalAmt,
      advanceAmount: Number(form.advanceAmount) || 0,
    });
  };

  const inp = {
    width:"100%", padding:"9px 12px", border:"1px solid #d8c9a8", borderRadius:5,
    fontSize:14, background:"#FFFDF7", boxSizing:"border-box", fontFamily:"Georgia, serif",
  };

  return (
    <div style={{ background:"white", borderRadius:8, boxShadow:"0 2px 10px rgba(0,0,0,0.07)",
      padding:28, maxWidth:760 }}>
      <div style={{ fontFamily:"Playfair Display, Georgia, serif", fontSize:21, fontWeight:700,
        color:"#5C0E0E", marginBottom:24, paddingBottom:14, borderBottom:"2px solid #f0e8d8" }}>
        {existing ? "✏️ Edit Booking" : "➕ New Booking"} — IGS Convention Centre
      </div>

      <SecTitle>Customer Information</SecTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:22 }}>
        <Fld label="Customer Name *"><input style={inp} value={form.customerName} onChange={set("customerName")} placeholder="Full name" /></Fld>
        <Fld label="Phone Number *"><input style={inp} value={form.phone} onChange={set("phone")} placeholder="+91 XXXXXXXXXX" /></Fld>
        <Fld label="Email"><input style={inp} type="email" value={form.email} onChange={set("email")} placeholder="email@example.com" /></Fld>
        <Fld label="Address"><input style={inp} value={form.address} onChange={set("address")} placeholder="City, Tirunelveli" /></Fld>
      </div>

      <SecTitle>Event Details</SecTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:22 }}>
        <Fld label="Event Type *">
          <select style={inp} value={form.eventType} onChange={set("eventType")}>
            {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </Fld>
        <Fld label="Event Date *"><input style={inp} type="date" value={form.eventDate} onChange={set("eventDate")} /></Fld>
        <div style={{ gridColumn:"span 2" }}>
          <Fld label="Hall / Venue *">
            <select style={inp} value={form.hall} onChange={set("hall")}>
              {HALLS.map(h => (
                <option key={h.name} value={`${h.name} (${h.capacity} pax)`}>
                  {h.name} ({h.capacity} pax) — {h.tag}
                </option>
              ))}
            </select>
          </Fld>
        </div>
      </div>

      <SecTitle>Payment Details (GST @ 18%)</SecTitle>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:16 }}>
        <Fld label="Base Hall Rent (₹) *">
          <input style={inp} type="number" value={form.baseAmount} onChange={set("baseAmount")} placeholder="e.g. 150000" />
        </Fld>
        <Fld label="Advance Amount (₹)">
          <input style={inp} type="number" value={form.advanceAmount} onChange={set("advanceAmount")} placeholder="e.g. 50000" />
        </Fld>
        <Fld label="Advance Paid On">
          <input style={inp} type="date" value={form.advancePaidOn} onChange={set("advancePaidOn")} />
        </Fld>
      </div>

      {form.baseAmount && (
        <div style={{ background:"#FBF5E6", border:"1px solid #e0d0b0", borderRadius:6,
          padding:"14px 18px", marginBottom:18, display:"flex", gap:24, flexWrap:"wrap", fontSize:14 }}>
          <span>Base Rent: <strong style={{ color:"#5C0E0E" }}>{fmt(baseAmt)}</strong></span>
          <span>+ GST 18%: <strong style={{ color:"#666" }}>{fmt(gstAmt)}</strong></span>
          <span>Total: <strong style={{ color:"#5C0E0E", fontSize:16 }}>{fmt(totalAmt)}</strong></span>
          <span>Advance: <strong style={{ color:"#2D6A4F" }}>{fmt(form.advanceAmount)}</strong></span>
          <span>Balance: <strong style={{ color:"#C9A227" }}>{fmt(balance)}</strong></span>
        </div>
      )}

      <div style={{ marginBottom:24 }}>
        <label style={{ fontSize:12, color:"#5a4a3a", fontWeight:700, display:"block",
          textTransform:"uppercase", letterSpacing:0.5, marginBottom:6 }}>Notes / Special Requirements</label>
        <textarea style={{ ...inp, height:80, resize:"vertical" }}
          value={form.notes} onChange={set("notes")}
          placeholder="Mandapam, generator, guest rooms, catering, parking, AV setup, etc." />
      </div>

      <div style={{ display:"flex", gap:12 }}>
        <button onClick={handleSave} style={{
          background:"#5C0E0E", color:"white", border:"none",
          padding:"12px 30px", borderRadius:5, fontWeight:700,
          cursor:"pointer", fontSize:15, fontFamily:"Georgia, serif",
        }}>{existing ? "✅ Update Booking" : "💾 Save Booking"}</button>
        <button onClick={onCancel} style={{
          background:"transparent", color:"#5C0E0E", border:"1px solid #5C0E0E",
          padding:"12px 20px", borderRadius:5, cursor:"pointer", fontFamily:"Georgia, serif",
        }}>Cancel</button>
      </div>
    </div>
  );
}

function SecTitle({ children }) {
  return (
    <div style={{ fontSize:11, fontWeight:700, color:"#C9A227", textTransform:"uppercase",
      letterSpacing:2, marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
      <span style={{ flex:1, height:1, background:"#e8d8b8" }} />
      {children}
      <span style={{ flex:1, height:1, background:"#e8d8b8" }} />
    </div>
  );
}
function Fld({ label, children }) {
  return (
    <div>
      <label style={{ fontSize:12, color:"#5a4a3a", fontWeight:700, marginBottom:5,
        display:"block", textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════
   BOOKINGS LIST
══════════════════════════════════════════ */
function BookingsList({ bookings, onEdit, onPrint, onDelete }) {
  const [search,     setSearch]     = useState("");
  const [filterEvt,  setFilterEvt]  = useState("All");
  const [filterHall, setFilterHall] = useState("All");

  const filtered = bookings
    .filter(b => {
      const q = search.toLowerCase();
      return (b.customerName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) || b.phone.includes(q)) &&
        (filterEvt  === "All" || b.eventType === filterEvt) &&
        (filterHall === "All" || b.hall.startsWith(filterHall));
    })
    .sort((a,b) => a.eventDate.localeCompare(b.eventDate));

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by name, booking ID or phone..."
          style={{ flex:1, minWidth:200, padding:"10px 14px", border:"1px solid #d8c9a8",
            borderRadius:6, fontSize:14, background:"white", fontFamily:"Georgia, serif" }} />
        <select value={filterEvt} onChange={e => setFilterEvt(e.target.value)}
          style={{ padding:"10px 12px", border:"1px solid #d8c9a8", borderRadius:6,
            background:"white", fontSize:13, fontFamily:"Georgia, serif" }}>
          <option>All</option>
          {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={filterHall} onChange={e => setFilterHall(e.target.value)}
          style={{ padding:"10px 12px", border:"1px solid #d8c9a8", borderRadius:6,
            background:"white", fontSize:13, fontFamily:"Georgia, serif" }}>
          <option>All</option>
          {HALLS.map(h => <option key={h.name} value={h.name}>{h.name}</option>)}
        </select>
      </div>

      <div style={{ background:"white", borderRadius:8, boxShadow:"0 2px 10px rgba(0,0,0,0.07)", overflow:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:900 }}>
          <thead>
            <tr style={{ background:"#5C0E0E", color:"white" }}>
              {["ID","Customer","Event","Date","Hall","Base","GST","Total","Advance","Balance","Actions"].map(h => (
                <th key={h} style={{ padding:"11px 10px", textAlign:"left", fontSize:10,
                  fontWeight:700, letterSpacing:0.7, textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={11} style={{ textAlign:"center", padding:40, color:"#bbb" }}>
                No bookings found.
              </td></tr>
            ) : filtered.map((b,i) => {
              const bal = b.totalAmount - b.advanceAmount;
              return (
                <tr key={b.id} style={{ borderBottom:"1px solid #f5ebe0",
                  background:i%2===0?"white":"#fdfaf5" }}>
                  <td style={{ padding:"10px", color:"#C9A227", fontWeight:700, fontSize:11 }}>{b.id}</td>
                  <td style={{ padding:"10px" }}>
                    <div style={{ fontWeight:700, fontSize:13 }}>{b.customerName}</div>
                    <div style={{ fontSize:11, color:"#aaa" }}>{b.phone}</div>
                  </td>
                  <td style={{ padding:"10px" }}>
                    <span style={{ background:"#FBF5E6", color:"#5C0E0E", padding:"2px 8px",
                      borderRadius:20, fontSize:10, fontWeight:700, whiteSpace:"nowrap" }}>
                      {b.eventType}
                    </span>
                  </td>
                  <td style={{ padding:"10px", fontSize:11, whiteSpace:"nowrap" }}>{fmtDate(b.eventDate)}</td>
                  <td style={{ padding:"10px", fontSize:11, color:"#555" }}>{b.hall.split(" (")[0]}</td>
                  <td style={{ padding:"10px", fontSize:12 }}>{fmt(b.baseAmount)}</td>
                  <td style={{ padding:"10px", fontSize:12, color:"#666" }}>{fmt(b.gstAmount)}</td>
                  <td style={{ padding:"10px", fontWeight:700, fontSize:13 }}>{fmt(b.totalAmount)}</td>
                  <td style={{ padding:"10px", color:"#2D6A4F", fontWeight:600, fontSize:12 }}>{fmt(b.advanceAmount)}</td>
                  <td style={{ padding:"10px", fontWeight:700, fontSize:13, color:bal>0?"#C9A227":"#2D6A4F" }}>{fmt(bal)}</td>
                  <td style={{ padding:"10px" }}>
                    <div style={{ display:"flex", gap:3 }}>
                      {[
                        { icon:"✏️", title:"Edit",            fn:() => onEdit(b),                                     bg:"#f0f0f0" },
                        { icon:"📄", title:"Invoice",         fn:() => onPrint("invoice", b),                         bg:"#FBF5E6" },
                        { icon:"🧾", title:"Advance Receipt", fn:() => onPrint("receipt", b),                         bg:"#FBF5E6" },
                        { icon:"🗑️", title:"Delete",         fn:() => { if(confirm("Delete this booking?")) onDelete(b.id); }, bg:"#fff0f0" },
                      ].map((btn,j) => (
                        <button key={j} onClick={btn.fn} title={btn.title} style={{
                          background:btn.bg, border:"none", borderRadius:4,
                          padding:"5px 7px", cursor:"pointer", fontSize:13,
                        }}>{btn.icon}</button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:10, fontSize:12, color:"#777", display:"flex", gap:24 }}>
        <span>{filtered.length} booking(s)</span>
        <span>Total: <strong style={{ color:"#5C0E0E" }}>{fmt(filtered.reduce((s,b)=>s+b.totalAmount,0))}</strong></span>
        <span>Balance Pending: <strong style={{ color:"#C9A227" }}>{fmt(filtered.reduce((s,b)=>s+(b.totalAmount-b.advanceAmount),0))}</strong></span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   CALENDAR VIEW
══════════════════════════════════════════ */
function CalendarView({ bookings }) {
  const now = new Date();
  const [viewDate, setViewDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selected, setSelected] = useState(null);

  const yr = viewDate.getFullYear();
  const mo = viewDate.getMonth();
  const firstDay    = new Date(yr, mo, 1).getDay();
  const daysInMonth = new Date(yr, mo+1, 0).getDate();
  const monthLabel  = viewDate.toLocaleDateString("en-IN", { month:"long", year:"numeric" });
  const today       = now.toISOString().split("T")[0];
  const pad = n => String(n).padStart(2,"0");

  const bMap = {};
  bookings.forEach(b => {
    if (!bMap[b.eventDate]) bMap[b.eventDate] = [];
    bMap[b.eventDate].push(b);
  });

  const cells = [...Array(firstDay).fill(null),
    ...Array.from({ length:daysInMonth }, (_,i) => i+1)];
  const selKey      = selected ? `${yr}-${pad(mo+1)}-${pad(selected)}` : null;
  const selBookings = selKey ? (bMap[selKey] || []) : [];
  const moKey       = `${yr}-${pad(mo+1)}`;
  const moBookings  = bookings.filter(b => b.eventDate.startsWith(moKey));

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:20, alignItems:"start" }}>
      <div style={{ background:"white", borderRadius:8, boxShadow:"0 2px 10px rgba(0,0,0,0.07)", overflow:"hidden" }}>
        <div style={{ background:"#5C0E0E", color:"white", padding:"14px 20px",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <button onClick={() => setViewDate(new Date(yr,mo-1,1))} style={{
            background:"transparent", color:"white", border:"1px solid rgba(255,255,255,0.3)",
            padding:"5px 14px", cursor:"pointer", borderRadius:4, fontSize:18 }}>‹</button>
          <span style={{ fontFamily:"Playfair Display, Georgia, serif", fontSize:19, fontWeight:700 }}>
            {monthLabel}
          </span>
          <button onClick={() => setViewDate(new Date(yr,mo+1,1))} style={{
            background:"transparent", color:"white", border:"1px solid rgba(255,255,255,0.3)",
            padding:"5px 14px", cursor:"pointer", borderRadius:4, fontSize:18 }}>›</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", textAlign:"center" }}>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d} style={{ padding:"10px 0", fontSize:11, fontWeight:700,
              color:"#888", background:"#FBF5E6", textTransform:"uppercase" }}>{d}</div>
          ))}
          {cells.map((day,i) => {
            if (!day) return <div key={i} />;
            const dk    = `${yr}-${pad(mo+1)}-${pad(day)}`;
            const hasB  = !!bMap[dk];
            const bCnt  = bMap[dk]?.length || 0;
            const isT   = dk === today;
            const isSel = day === selected;
            return (
              <div key={i} onClick={() => setSelected(isSel?null:day)}
                style={{
                  padding:"10px 6px 8px", cursor:"pointer", textAlign:"center",
                  borderBottom:"1px solid #f5ebe0", borderRight:"1px solid #f5ebe0",
                  background:isSel?"#5C0E0E":hasB?"#FBF5E6":"white",
                  color:isSel?"white":isT?"#5C0E0E":"#333",
                  fontWeight:(isT||isSel)?700:400,
                  outline:isT?"2px solid #C9A227":"none", outlineOffset:-2,
                }}>
                <div style={{ fontSize:14 }}>{day}</div>
                {hasB && (
                  <div style={{ display:"flex", justifyContent:"center", gap:2, marginTop:3 }}>
                    {Array.from({length:Math.min(bCnt,4)}).map((_,j) => (
                      <span key={j} style={{ display:"inline-block", width:6, height:6,
                        borderRadius:"50%", background:isSel?"white":"#C9A227" }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ padding:"10px 16px", display:"flex", gap:20, fontSize:12,
          color:"#888", borderTop:"1px solid #f5ebe0" }}>
          <span>🟡 Booked</span>
          <span style={{ color:"#5C0E0E", fontWeight:700 }}>■ Today</span>
          <span>Click to view</span>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <div style={{ background:"white", borderRadius:8, boxShadow:"0 2px 10px rgba(0,0,0,0.07)", overflow:"hidden" }}>
          <div style={{ background:selected?"#C9A227":"#aaa", color:"white",
            padding:"11px 16px", fontWeight:700, fontSize:14 }}>
            {selected ? `📅 ${fmtDate(selKey)}` : "📅 Select a date"}
          </div>
          {!selected ? (
            <div style={{ padding:24, textAlign:"center", color:"#bbb", fontSize:13 }}>
              Click any date on the calendar
            </div>
          ) : selBookings.length === 0 ? (
            <div style={{ padding:24, textAlign:"center" }}>
              <div style={{ fontSize:36, marginBottom:8 }}>✅</div>
              <div style={{ color:"#2D6A4F", fontWeight:700, fontSize:16 }}>Available</div>
              <div style={{ fontSize:13, color:"#aaa", marginTop:4 }}>No bookings on this date</div>
            </div>
          ) : selBookings.map(b => (
            <div key={b.id} style={{ padding:16, borderBottom:"1px solid #f5ebe0" }}>
              <div style={{ fontWeight:700, fontSize:15 }}>{b.customerName}</div>
              <div style={{ fontSize:12, color:"#aaa" }}>{b.phone}</div>
              <span style={{ background:"#FBF5E6", color:"#5C0E0E", padding:"2px 9px",
                borderRadius:20, fontSize:11, fontWeight:700, display:"inline-block", marginTop:6 }}>
                {b.eventType}
              </span>
              <div style={{ fontSize:12, color:"#666", marginTop:5 }}>{b.hall.split(" (")[0]}</div>
              <div style={{ fontSize:13, fontWeight:700, color:"#2D6A4F", marginTop:3 }}>{fmt(b.totalAmount)}</div>
            </div>
          ))}
        </div>

        <div style={{ background:"white", borderRadius:8, boxShadow:"0 2px 10px rgba(0,0,0,0.07)", padding:18 }}>
          <div style={{ fontFamily:"Playfair Display, Georgia, serif", fontWeight:700,
            color:"#5C0E0E", marginBottom:14, fontSize:16 }}>
            {viewDate.toLocaleDateString("en-IN",{month:"long",year:"numeric"})} Summary
          </div>
          {[
            ["Total Events",     moBookings.length,                                                  "#5C0E0E"],
            ["Revenue (w/ GST)", fmt(moBookings.reduce((s,b)=>s+b.totalAmount,0)),                   "#333"],
            ["Advance Received", fmt(moBookings.reduce((s,b)=>s+b.advanceAmount,0)),                 "#2D6A4F"],
            ["Balance Pending",  fmt(moBookings.reduce((s,b)=>s+(b.totalAmount-b.advanceAmount),0)), "#C9A227"],
          ].map(([k,v,c]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between",
              padding:"8px 0", borderBottom:"1px solid #f5ebe0", fontSize:13 }}>
              <span style={{ color:"#666" }}>{k}</span>
              <strong style={{ color:c }}>{v}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════ */
export default function App() {
  const [bookings, setBookings]           = useState(SAMPLE);
  const [activeTab, setActiveTab]         = useState("dashboard");
  const [printDoc, setPrintDoc]           = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);

  const saveBooking = (b) => {
    setBookings(prev => {
      const idx = prev.findIndex(x => x.id === b.id);
      if (idx >= 0) { const n = [...prev]; n[idx] = b; return n; }
      return [...prev, b];
    });
    setEditingBooking(null);
    setActiveTab("bookings");
  };

  const TABS = [
    { id:"dashboard",   icon:"🏠", label:"Dashboard"   },
    { id:"new-booking", icon:"➕", label:"New Booking"  },
    { id:"bookings",    icon:"📋", label:"All Bookings" },
    { id:"calendar",    icon:"📅", label:"Calendar"     },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#F2E8D0", fontFamily:"Georgia,'Times New Roman',serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        button { transition:opacity 0.15s; }
        button:hover { opacity:0.82; }
        input:focus, select:focus, textarea:focus {
          outline:none; border-color:#C9A227 !important;
          box-shadow:0 0 0 3px rgba(201,162,39,0.14);
        }
      `}</style>

      {printDoc && (
        <PrintDoc type={printDoc.type} booking={printDoc.booking} onClose={() => setPrintDoc(null)} />
      )}

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#3D0808 0%,#5C0E0E 45%,#7B1818 100%)",
        padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between",
        boxShadow:"0 3px 16px rgba(0,0,0,0.35)" }}>
        <div style={{ padding:"16px 0" }}>
          <div style={{ fontFamily:"Playfair Display, Georgia, serif", fontSize:26,
            fontWeight:700, color:"white", letterSpacing:1 }}>🕉️ IGS Convention Centre</div>
          <div style={{ fontSize:11, color:"rgba(201,162,39,0.9)", letterSpacing:3,
            textTransform:"uppercase", marginTop:3 }}>Booking Management System</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ color:"rgba(255,255,255,0.7)", fontSize:12 }}>
            {new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
          </div>
          <div style={{ color:"#C9A227", fontSize:11, marginTop:3 }}>
            📍 Palayamkottai, Tirunelveli &nbsp;·&nbsp; 📞 +91 98416 08160
          </div>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:10, marginTop:2 }}>
            sreeganesamahal@gmail.com
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background:"white", borderBottom:"2px solid #e8d8b8", padding:"0 24px",
        display:"flex", gap:0, boxShadow:"0 1px 6px rgba(0,0,0,0.06)" }}>
        {TABS.map(tab => (
          <button key={tab.id}
            onClick={() => { setEditingBooking(null); setActiveTab(tab.id); }}
            style={{
              background:"transparent", border:"none",
              borderBottom:activeTab===tab.id?"3px solid #5C0E0E":"3px solid transparent",
              padding:"15px 22px", cursor:"pointer",
              color:activeTab===tab.id?"#5C0E0E":"#777",
              fontWeight:activeTab===tab.id?700:400,
              fontSize:14, fontFamily:"Georgia, serif",
              display:"flex", alignItems:"center", gap:7, transition:"all 0.2s",
            }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding:"26px 28px" }}>
        {activeTab==="dashboard" && !editingBooking && (
          <Dashboard bookings={bookings} onTab={setActiveTab} />
        )}
        {(activeTab==="new-booking" || editingBooking) && (
          <BookingForm
            existing={editingBooking}
            onSave={saveBooking}
            onCancel={() => { setEditingBooking(null); setActiveTab("dashboard"); }}
          />
        )}
        {activeTab==="bookings" && !editingBooking && (
          <BookingsList
            bookings={bookings}
            onEdit={(b) => setEditingBooking(b)}
            onPrint={(type, booking) => setPrintDoc({ type, booking })}
            onDelete={(id) => setBookings(prev => prev.filter(b => b.id !== id))}
          />
        )}
        {activeTab==="calendar" && !editingBooking && (
          <CalendarView bookings={bookings} />
        )}
      </div>

      <div style={{ background:"#3D0808", color:"rgba(255,255,255,0.45)",
        textAlign:"center", padding:"12px", fontSize:11, letterSpacing:0.5 }}>
        © 2026 IGS Convention Centre &nbsp;·&nbsp;
        51/4A, 4B Ambai Road, Palayamkottai, Tirunelveli – 627002 &nbsp;·&nbsp;
        +91 98416 08160 &nbsp;·&nbsp; sreeganesamahal@gmail.com
      </div>
    </div>
  );
}
