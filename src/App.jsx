import React, { useState, useEffect } from "react";

/* ═══════════════════════════════════════════
   CONSTANTS — IGS REAL DATA
═══════════════════════════════════════════ */
const VENUE = {
  name:    "IGS Convention Centre",
  tagline: "Tirunelveli's Premier Convention Venue",
  address: "51/4A, 4B Ambai Road, Palayamkottai, Tirunelveli – 627005",
  phone:   "+91 98416 08160",
  email:   "sreeganesamahal@gmail.com",
  gstin:   "33XXXXX1234X1ZX",
  gst:     0.18,
};

const HALLS = [
  { id:"ganesha",           label:"Shree Ganesha Mahal",         guests:500 },
  { id:"kaveri",            label:"Kaveri Hall",                  guests:350 },
  { id:"vaigai",            label:"Vaigai Hall",                  guests:200 },
  { id:"thamirabarani",     label:"Thamirabarani Hall",           guests:100 },
  { id:"kaveri_vaigai",     label:"Kaveri + Vaigai (Combined)",   guests:550 },
  { id:"vaigai_thamirabarani", label:"Vaigai + Thamirabarani (Combined)", guests:300 },
];

const SLOTS = [
  { id:"halfday_morning", label:"Morning Slot — 6:00 AM to 3:00 PM (Half Day)" },
  { id:"halfday_evening", label:"Evening / Reception — 3:00 PM to 10:00 PM (Half Day)" },
  { id:"fullday",         label:"Full Day — 3:00 PM to 2:00 PM (Next Day)" },
  { id:"night",           label:"Night / Reception — 11:00 PM to 10:00 PM (Next Day)" },
  { id:"corporate_half",  label:"Corporate Half Day — 3:00 PM to 10:00 PM" },
  { id:"corporate_full",  label:"Corporate Full Day — 11:00 AM to 10:00 PM" },
  { id:"2day",            label:"2-Day Booking — 3:00 PM to 2:00 PM (2nd Day)" },
  { id:"3day",            label:"3-Day Booking — 3:00 PM to 2:00 PM (3rd Day)" },
  { id:"4hour",           label:"4-Hour Meeting Session (Snacks & Beverages Incl.)" },
];

/* Pricing matrix: hall → slot → base rent (excl. GST) */
const PRICING = {
  ganesha: {
    halfday_morning: 150000, halfday_evening: 150000,
    fullday: 150000, night: 150000,
    "2day": 225000, "3day": 295000,
    corporate_half: null, corporate_full: null, "4hour": null,
  },
  kaveri: {
    halfday_morning: 40000, halfday_evening: 40000,
    fullday: 110000, night: 110000,
    "2day": 175000, "3day": null,
    corporate_half: 65000, corporate_full: 75000, "4hour": 20000,
  },
  vaigai: {
    halfday_morning: 20000, halfday_evening: 20000,
    fullday: 110000, night: 110000,
    "2day": 175000, "3day": null,
    corporate_half: 65000, corporate_full: 75000, "4hour": 10000,
  },
  thamirabarani: {
    halfday_morning: 10000, halfday_evening: 10000,
    fullday: 110000, night: 110000,
    "2day": 175000, "3day": null,
    corporate_half: 65000, corporate_full: 75000, "4hour": 7500,
  },
  kaveri_vaigai: {
    halfday_morning: 60000, halfday_evening: 60000,
    fullday: 90000, night: 90000,
    "2day": null, "3day": null,
    corporate_half: null, corporate_full: null, "4hour": null,
  },
  vaigai_thamirabarani: {
    halfday_morning: 40000, halfday_evening: 40000,
    fullday: 60000, night: 60000,
    "2day": null, "3day": null,
    corporate_half: null, corporate_full: null, "4hour": null,
  },
};

const EVENT_TYPES = [
  "Wedding Ceremony","Wedding Reception","Engagement Ceremony",
  "Mehendi Ceremony","Haldi Ceremony","Valaikappu","Seemantham",
  "Naming Ceremony","Upanayanam","Ear Piercing Ceremony",
  "Birthday Party","Anniversary Celebration","Retirement Function",
  "House Warming","Corporate Event","Conference / Seminar",
  "Product Launch","Social / Community Event","Other",
];

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Puducherry","Outside India",
];

const COUNTRY_CODES = [
  { code:"+91", flag:"🇮🇳", label:"India" },
  { code:"+1",  flag:"🇺🇸", label:"USA" },
  { code:"+44", flag:"🇬🇧", label:"UK" },
  { code:"+971",flag:"🇦🇪", label:"UAE" },
  { code:"+65", flag:"🇸🇬", label:"Singapore" },
  { code:"+60", flag:"🇲🇾", label:"Malaysia" },
  { code:"+61", flag:"🇦🇺", label:"Australia" },
  { code:"+966",flag:"🇸🇦", label:"Saudi Arabia" },
  { code:"+974",flag:"🇶🇦", label:"Qatar" },
];

const PAYMENT_MODES = ["Cash","UPI — GPay","UPI — PhonePe","UPI — Paytm","NEFT / RTGS","Cheque"];
const CATERING_OPTIONS = ["Not Required","Vegetarian","Non-Vegetarian","Both Veg & Non-Veg","Outside Caterer"];

const ADDITIONAL_CHARGES = [
  { label:"Electricity (EB)",           rate:"₹30 / unit" },
  { label:"Generator — Ganesha Mahal",  rate:"₹7,500 / hr" },
  { label:"Generator — Ambica Mahal",   rate:"₹5,000 / hr" },
  { label:"Generator — Dining Hall",    rate:"₹4,000 / hr (mandatory if dining used)" },
  { label:"Guest Room (Standard AC)",   rate:"₹1,500 / room" },
  { label:"Guest Room (Deluxe AC)",     rate:"₹1,750 / room" },
  { label:"Cleaning — Half Day",        rate:"₹7,500" },
  { label:"Cleaning — Full Day",        rate:"₹12,000" },
  { label:"Kitchen — Ganesha Mahal",    rate:"₹10,000 / day" },
  { label:"Cooking Gas (19 kg)",        rate:"₹2,850 / cylinder" },
  { label:"Chair Cover",                rate:"₹30 / chair" },
  { label:"Extra Bed",                  rate:"₹350 / bed" },
  { label:"Extra Time (beyond slot)",   rate:"₹10,000 / hr (Ganesha) · ₹1,000 / hr (others)" },
];

const TERMS = [
  "Hall rental charges inclusive of GST are payable in full as advance to confirm the reservation.",
  "A minimum advance of ₹25,000 is required to confirm any booking.",
  "Cancellation Policy: 60+ days before event — 80% refund · 30–60 days — 50% refund · 15–30 days — 25% refund · Under 15 days — No refund.",
  "One date change is allowed (subject to availability) with a rescheduling fee of ₹5,000.",
  "Check-in time is determined based on the EB meter reading at the time of entry.",
  "Extended usage beyond the agreed check-out time will attract additional charges: ₹10,000/hr for Shree Ganesha Mahal and ₹1,000/hr for other halls.",
  "Electricity (EB) charges at ₹30/unit will be billed separately based on actual consumption.",
  "Generator charges are billed separately based on actual usage hours.",
  "GST at 18% is applicable on all charges including additional services.",
  "Security deposit and all ancillary charges must be settled at least 2 weeks before the event date.",
  "Damage to venue property, furniture, or equipment will be assessed and billed to the party responsible.",
  "Outside catering requires prior written permission from management.",
  "The venue strictly prohibits the use of crackers, open fire, or hazardous materials inside the premises.",
  "Management reserves the right to refuse service in case of violation of venue policies.",
];

/* ═══════════════════════════════════════════
   HELPERS & ID GENERATOR
═══════════════════════════════════════════ */
const generateNextBookingId = (currentBookings) => {
  const year = new Date().getFullYear();
  let maxSeq = 0;
  currentBookings.forEach(b => {
    if (b.id && b.id.startsWith(`IGS${year}`)) {
      const seq = parseInt(b.id.substring(7), 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    }
  });
  return `IGS${year}${String(maxSeq + 1).padStart(3, "0")}`; 
};

const fmt      = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
const fmtDate  = (s) => s ? new Date(s + "T00:00:00").toLocaleDateString("en-IN",{ day:"2-digit", month:"long", year:"numeric" }) : "—";
const todayStr = () => new Date().toISOString().split("T")[0];
const gst      = (base) => Math.round(base * VENUE.gst);
const total    = (base) => base + gst(base);
const hallLabel = (id) => HALLS.find(h => h.id === id)?.label || id;
const slotLabel = (id) => SLOTS.find(s => s.id === id)?.label || id;
const getPrice  = (hallId, slotId) => PRICING[hallId]?.[slotId] ?? null;
const fullName  = (b) => [b.firstName, b.lastName].filter(Boolean).join(" ");

const generateWaMessage = (b) => {
  let msg = `*Booking Confirmation - IGS Convention Centre* 🕉️\n`;
  msg += `-----------------------------------\n`;
  msg += `*Booking ID:* ${b.id}\n`;
  msg += `*Invoice No:* INV-${b.id}\n\n`;
  msg += `*Customer:* ${fullName(b)}\n`;
  msg += `*Event:* ${b.eventType}\n`;
  msg += `*Date:* ${fmtDate(b.eventDate)}\n`;
  msg += `*Hall:* ${hallLabel(b.hallId)}\n`;
  msg += `*Slot:* ${slotLabel(b.slotId)}\n\n`;
  msg += `*Payment Summary:*\n`;
  msg += `Total Amount (incl. 18% GST): ${fmt(b.totalAmount)}\n`;
  msg += `Advance Paid: ${fmt(b.advanceAmount)} (${b.paymentMode})\n`;
  msg += `*Balance Due: ${fmt(b.totalAmount - b.advanceAmount)}*\n\n`;
  msg += `*Key Terms & Conditions:*\n`;
  msg += `• Hall rental must be paid in full as advance to confirm.\n`;
  msg += `• Extended usage beyond slot attracts extra charges.\n`;
  msg += `• EB (Electricity) & Generator are billed separately based on actual usage.\n`;
  msg += `• Standard cancellation policies apply.\n\n`;
  msg += `Thank you for choosing IGS Convention Centre! 🙏\n`;
  msg += `Contact: +91 98416 08160 | sreeganesamahal@gmail.com`;
  return encodeURIComponent(msg);
};

const generateCancelWaMessage = (b) => {
  let msg = `*Booking Cancellation - IGS Convention Centre* ❌\n`;
  msg += `-----------------------------------\n`;
  msg += `*Cancellation No:* CAN-${b.id}\n`;
  msg += `*Booking ID:* ${b.id}\n\n`;
  msg += `*Customer:* ${fullName(b)}\n`;
  msg += `*Event Date:* ${fmtDate(b.eventDate)}\n`;
  msg += `*Hall:* ${hallLabel(b.hallId)}\n\n`;
  msg += `*Refund Details:*\n`;
  msg += `Advance Paid: ${fmt(b.advanceAmount)}\n`;
  msg += `Retention Kept: ${fmt(b.retentionAmount)}\n`;
  msg += `*Total Refundable: ${fmt(b.refundAmount)}*\n\n`;
  msg += `Your cancellation has been processed successfully. If a refund is applicable, it will be processed shortly.\n\n`;
  msg += `Contact: +91 98416 08160 | sreeganesamahal@gmail.com`;
  return encodeURIComponent(msg);
};

/* ═══════════════════════════════════════════
   STORAGE — localStorage
═══════════════════════════════════════════ */
const STORAGE_KEY = "igs_bookings_v3"; 
const loadBookings = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
};
const saveBookings = (arr) => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

/* ═══════════════════════════════════════════
   SHARED UI ATOMS
═══════════════════════════════════════════ */
const INP = {
  width:"100%", padding:"9px 12px", border:"1px solid #d8c9a8", borderRadius:5,
  fontSize:14, background:"#FFFDF7", boxSizing:"border-box", fontFamily:"'Lato',sans-serif",
};
const SEP = ({ label }) => (
  <div style={{ fontSize:11, fontWeight:700, color:"#C9A227", textTransform:"uppercase",
    letterSpacing:2, margin:"22px 0 12px", display:"flex", alignItems:"center", gap:8 }}>
    <span style={{ flex:1, height:1, background:"#e8d8b8" }} />
    {label}
    <span style={{ flex:1, height:1, background:"#e8d8b8" }} />
  </div>
);
const Fld = ({ label, req, children, span }) => (
  <div style={span ? { gridColumn:"span " + span } : {}}>
    <label style={{ fontSize:12, color:"#5a4a3a", fontWeight:700, marginBottom:5,
      display:"block", textTransform:"uppercase", letterSpacing:0.5 }}>
      {label}{req && <span style={{ color:"#c0392b" }}> *</span>}
    </label>
    {children}
  </div>
);
const StatusBadge = ({ status }) => {
  const map = {
    Active:    { bg:"#E8F5E9", color:"#1B5E20", label:"Active" },
    Cancelled: { bg:"#FFEBEE", color:"#B71C1C", label:"Cancelled" },
    Modified:  { bg:"#FFF3E0", color:"#E65100", label:"Modified" },
    Quoted:    { bg:"#E3F2FD", color:"#0D47A1", label:"Quoted" },
  };
  const s = map[status] || map.Active;
  return (
    <span style={{ background:s.bg, color:s.color, padding:"2px 10px",
      borderRadius:20, fontSize:11, fontWeight:700 }}>{s.label}</span>
  );
};

const Btn = ({ icon, title, onClick, bg }) => (
  <button onClick={onClick} title={title}
    style={{ background:bg, border:"none", borderRadius:4, padding:"5px 7px", fontSize:13 }}>
    {icon}
  </button>
);

/* ═══════════════════════════════════════════
   VIEW MODAL — Read-Only Booking Details & History
═══════════════════════════════════════════ */
function ViewModal({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)",
      zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"white", borderRadius:8, padding:28, maxWidth:760, width:"100%",
        boxShadow:"0 20px 60px rgba(0,0,0,.4)", maxHeight:"90vh", overflowY:"auto" }}>
        
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, borderBottom:"2px solid #f0e8d8", paddingBottom:12 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:21, fontWeight:700, color:"#5C0E0E" }}>
            👁️ Booking Details
          </div>
          <button onClick={onClose} style={{ background:"#f5f5f5", color:"#333", border:"1px solid #ddd", padding:"6px 12px", borderRadius:5, fontWeight:700, cursor:"pointer" }}>
            ✕ Close
          </button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          {/* Customer Details */}
          <div style={{ background:"#FBF5E6", padding:16, borderRadius:6, border:"1px solid #e8d8b8" }}>
            <h4 style={{ color:"#C9A227", marginBottom:10, textTransform:"uppercase", fontSize:12, letterSpacing:1 }}>Customer Details</h4>
            <div style={{ fontSize:14, marginBottom:6 }}><strong>Booking ID:</strong> {booking.id}</div>
            <div style={{ fontSize:14, marginBottom:6 }}><strong>Name:</strong> {fullName(booking)}</div>
            <div style={{ fontSize:14, marginBottom:6 }}><strong>Phone:</strong> {booking.primaryCc} {booking.primaryPhone}</div>
            {booking.alternatePhone && <div style={{ fontSize:14, marginBottom:6 }}><strong>Alt Phone:</strong> {booking.alternateCc} {booking.alternatePhone}</div>}
            <div style={{ fontSize:14, marginBottom:6 }}><strong>Email:</strong> {booking.email || "—"}</div>
            <div style={{ fontSize:14, marginBottom:6 }}><strong>Address:</strong> {[booking.address1, booking.city, booking.state].filter(Boolean).join(", ")}</div>
          </div>

          {/* Event Details */}
          <div style={{ background:"#FBF5E6", padding:16, borderRadius:6, border:"1px solid #e8d8b8" }}>
            <h4 style={{ color:"#C9A227", marginBottom:10, textTransform:"uppercase", fontSize:12, letterSpacing:1 }}>Event Details</h4>
            <div style={{ fontSize:14, marginBottom:6 }}><strong>Status:</strong> <StatusBadge status={booking.status} /></div>
            <div style={{ fontSize:14, marginBottom:6 }}><strong>Event Type:</strong> {booking.eventType}</div>
            <div style={{ fontSize:14, marginBottom:6 }}><strong>Event Date:</strong> {fmtDate(booking.eventDate)}</div>
            <div style={{ fontSize:14, marginBottom:6 }}><strong>Hall / Venue:</strong> {hallLabel(booking.hallId)}</div>
            <div style={{ fontSize:14, marginBottom:6 }}><strong>Booking Slot:</strong> {slotLabel(booking.slotId)}</div>
            <div style={{ fontSize:14, marginBottom:6 }}><strong>Guests / Catering:</strong> {booking.guestCount || "—"} / {booking.catering}</div>
          </div>
        </div>

        {/* Financial Details */}
        <div style={{ background:"#f9f9f9", padding:16, borderRadius:6, border:"1px solid #ddd", marginTop:20 }}>
          <h4 style={{ color:"#555", marginBottom:10, textTransform:"uppercase", fontSize:12, letterSpacing:1 }}>Financial Summary</h4>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:10 }}>
            <div>
              <div style={{fontSize:11, color:"#888"}}>Total Amount (incl. GST)</div>
              <div style={{fontSize:16, fontWeight:700}}>{fmt(booking.totalAmount)}</div>
            </div>
            <div>
              <div style={{fontSize:11, color:"#888"}}>Advance Paid</div>
              <div style={{fontSize:16, fontWeight:700, color:"#2D6A4F"}}>{fmt(booking.advanceAmount)}</div>
            </div>
            <div>
              <div style={{fontSize:11, color:"#888"}}>Balance Due</div>
              <div style={{fontSize:16, fontWeight:700, color:"#C9A227"}}>{fmt((booking.totalAmount || 0) - (booking.advanceAmount || 0))}</div>
            </div>
            <div>
              <div style={{fontSize:11, color:"#888"}}>Payment Mode</div>
              <div style={{fontSize:14, fontWeight:600, marginTop:2}}>{booking.paymentMode || "—"}</div>
            </div>
          </div>

          {booking.status === "Cancelled" && (
            <div style={{ marginTop:16, padding:12, background:"#FFEBEE", borderRadius:6, border:"1px solid #FFCDD2" }}>
              <strong style={{color:"#B71C1C", display:"block", marginBottom:4}}>Cancellation Details:</strong>
              <div style={{ fontSize:13, color:"#B71C1C" }}>
                <strong>Refund Processed:</strong> {fmt(booking.refundAmount)} &nbsp;|&nbsp; 
                <strong>Retention Kept:</strong> {fmt(booking.retentionAmount)}<br/>
                <strong>Reason:</strong> {booking.cancelReason || "No reason provided"}
              </div>
            </div>
          )}
        </div>

        {booking.notes && (
          <div style={{ marginTop:20, padding:16, background:"#fff", border:"1px solid #eee", borderRadius:6 }}>
            <h4 style={{ color:"#555", marginBottom:6, textTransform:"uppercase", fontSize:12, letterSpacing:1 }}>Special Notes</h4>
            <div style={{ fontSize:14, color:"#333", lineHeight:1.6 }}>{booking.notes}</div>
          </div>
        )}

        {/* ACTIVITY LOG - MODIFICATION HISTORY */}
        {booking.history && booking.history.length > 0 && (
          <div style={{ marginTop:20, padding:16, background:"#fff", border:"1px solid #eee", borderRadius:6 }}>
            <h4 style={{ color:"#555", marginBottom:12, textTransform:"uppercase", fontSize:12, letterSpacing:1 }}>⏳ Activity & Modification Log</h4>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {booking.history.map((h, idx) => {
                let borderColor = "#1B5E20"; // Created/Restored
                if (h.action === "Modified") borderColor = "#E65100";
                if (h.action === "Cancelled") borderColor = "#B71C1C";

                return (
                  <div key={idx} style={{ padding:"10px 14px", background:"#f9f9f9", borderRadius:4, borderLeft:`4px solid ${borderColor}` }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#333", marginBottom:4 }}>
                      {h.action} <span style={{ fontWeight:400, color:"#888" }}>on {new Date(h.date).toLocaleString("en-IN")}</span>
                    </div>
                    {h.action === "Modified" && (
                      <div style={{ fontSize:12, color:"#555", lineHeight:1.6 }}>
                        <strong>Previous Value:</strong><br/>
                        Event Date: {fmtDate(h.previousDate)} &nbsp;|&nbsp; 
                        Hall: {hallLabel(h.previousHall)} &nbsp;|&nbsp; 
                        Total: {fmt(h.previousTotal)} &nbsp;|&nbsp; 
                        Advance: {fmt(h.previousAdvance)}
                      </div>
                    )}
                    {h.action === "Cancelled" && (
                      <div style={{ fontSize:12, color:"#B71C1C" }}>Reason: {h.reason || "None"}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PRINT DOCUMENT — Invoice / Receipt / Quotation / Cancellation
═══════════════════════════════════════════ */
function PrintDoc({ type, booking, onClose }) {
  const base    = booking.baseAmount || 0;
  const gstAmt  = booking.gstAmount  || gst(base);
  const tot     = booking.totalAmount|| total(base);
  const adv     = booking.advanceAmount || 0;
  const balance = tot - adv;
  const name    = fullName(booking);
  
  const isInv    = type === "invoice";
  const isRcp    = type === "receipt";
  const isQt     = type === "quotation";
  const isCancel = type === "cancellation";
  
  const docNo    = isInv ? "INV-" + booking.id : isRcp ? "RCP-" + booking.id : isCancel ? "CAN-" + booking.id : "QT-" + booking.id;
  const docTitle = isInv ? "— TAX INVOICE —" : isRcp ? "— ADVANCE RECEIPT —" : isCancel ? "— CANCELLATION RECEIPT —" : "— QUOTATION —";

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.78)",
      zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #igsPrint, #igsPrint * { visibility: visible !important; }
          #igsPrint { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; }
        }
      `}</style>
      <div style={{ background:"white", width:"100%", maxWidth:760, maxHeight:"95vh",
        overflowY:"auto", borderRadius:6, boxShadow:"0 24px 64px rgba(0,0,0,.5)" }}>
        {/* Toolbar */}
        <div style={{ background:isCancel ? "#B71C1C" : "#5C0E0E", padding:"11px 18px", display:"flex",
          justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ color:"white", fontWeight:700, fontSize:14 }}>
            {isQt ? "📋 Quotation" : isInv ? "📄 Invoice" : isCancel ? "📄 Cancellation Receipt" : "🧾 Advance Receipt"} — {docNo}
          </span>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={() => window.print()} style={{
              background:"#C9A227", color:"white", border:"none",
              padding:"7px 18px", borderRadius:4, fontWeight:700, fontSize:13 }}>🖨️ Print</button>
            <button onClick={onClose} style={{
              background:"transparent", color:"white", border:"1px solid rgba(255,255,255,.4)",
              padding:"7px 14px", borderRadius:4, fontSize:13 }}>✕ Close</button>
          </div>
        </div>

        {/* Document body */}
        <div id="igsPrint" style={{ padding:"36px 42px", fontFamily:"Georgia,'Times New Roman',serif", color:"#222" }}>
          {/* Letterhead */}
          <div style={{ textAlign:"center", marginBottom:22, paddingBottom:18, borderBottom:"3px double #C9A227" }}>
            <div style={{ fontSize:8, letterSpacing:8, color:"#C9A227", marginBottom:6 }}>✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦ ✦</div>
            <div style={{ fontSize:30, fontWeight:700, color:isCancel ? "#B71C1C" : "#5C0E0E", letterSpacing:2 }}>🕉️ IGS Convention Centre</div>
            <div style={{ fontSize:12, color:"#7B1818", fontWeight:600, letterSpacing:3, textTransform:"uppercase", marginTop:3 }}>
              Tirunelveli's Premier Convention Venue
            </div>
            <div style={{ fontSize:11.5, color:"#666", marginTop:7, lineHeight:1.8 }}>
              51/4A, 4B Ambai Road, Palayamkottai, Tirunelveli – 627005<br/>
              📞 +91 98416 08160 &nbsp;|&nbsp; ✉ sreeganesamahal@gmail.com &nbsp;|&nbsp; GSTIN: {VENUE.gstin}
            </div>
          </div>

          {/* Doc title */}
          <div style={{ textAlign:"center", marginBottom:22 }}>
            <span style={{ display:"inline-block", background:isCancel ? "#B71C1C" : "#5C0E0E", color:"white",
              padding:"6px 36px", fontSize:15, fontWeight:700, letterSpacing:4 }}>{docTitle}</span>
          </div>

          {/* Bill to + Doc info */}
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20,
            background:"#FBF5E6", padding:"16px 18px", border:"1px solid #e0d0b0", borderRadius:4 }}>
            <div>
              <div style={{ fontSize:10, color:"#888", letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>
                {isQt ? "Prepared For" : "Bill To"}
              </div>
              <div style={{ fontSize:17, fontWeight:700, color:isCancel ? "#B71C1C" : "#5C0E0E" }}>{name}</div>
              {booking.primaryCc && <div style={{ fontSize:13, marginTop:3 }}>📞 {booking.primaryCc} {booking.primaryPhone}</div>}
              {booking.alternateCc && booking.alternatePhone &&
                <div style={{ fontSize:12, color:"#666" }}>📞 {booking.alternateCc} {booking.alternatePhone} (Alt)</div>}
              {booking.email && <div style={{ fontSize:13 }}>✉ {booking.email}</div>}
              {(booking.address1 || booking.city) && (
                <div style={{ fontSize:12, color:"#666", marginTop:3, maxWidth:240, lineHeight:1.6 }}>
                  📍 {[booking.address1, booking.address2, booking.landmark, booking.city, booking.state, booking.pinCode].filter(Boolean).join(", ")}
                </div>
              )}
              {booking.gstRequired && booking.companyName && (
                <div style={{ marginTop:6, fontSize:12, color:"#333" }}>
                  <strong>Company:</strong> {booking.companyName}<br/>
                  <strong>GSTIN:</strong> {booking.companyGstin}
                </div>
              )}
            </div>
            <div>
              <table style={{ borderCollapse:"collapse", fontSize:13 }}>
                <tbody>
                  {[
                    [isQt ? "Quotation No" : isInv ? "Invoice No" : isCancel ? "Cancellation No" : "Receipt No", docNo],
                    [isCancel ? "Cancelled On" : "Date", fmtDate(isCancel ? booking.cancelledOn : todayStr())],
                    ["Event Date", fmtDate(booking.eventDate)],
                    ["Event", booking.eventType],
                    ["Hall", hallLabel(booking.hallId)],
                    ["Slot", slotLabel(booking.slotId)],
                    ["Guests", booking.guestCount || "—"],
                  ].map(([k,v]) => (
                    <tr key={k}>
                      <td style={{ padding:"3px 12px 3px 0", color:"#666", whiteSpace:"nowrap" }}>{k}:</td>
                      <td style={{ padding:"3px 0", fontWeight:600, fontSize:12 }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Items table */}
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:isCancel ? "#B71C1C" : "#5C0E0E", color:"white" }}>
                <th style={{ padding:"10px 14px", textAlign:"left", fontSize:13 }}>Description</th>
                <th style={{ padding:"10px 14px", textAlign:"right", fontSize:13 }}>Base Rent</th>
                <th style={{ padding:"10px 14px", textAlign:"right", fontSize:13 }}>GST 18%</th>
                <th style={{ padding:"10px 14px", textAlign:"right", fontSize:13 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding:"16px 14px", borderBottom:"1px solid #e0d0b0" }}>
                  <div style={{ fontWeight:700, fontSize:15, color: isCancel ? "#B71C1C" : "#222" }}>
                    {booking.eventType} — {hallLabel(booking.hallId)} {isCancel && "(CANCELLED)"}
                  </div>
                  <div style={{ fontSize:12, color:"#777", marginTop:4 }}>Slot: {slotLabel(booking.slotId)}</div>
                  <div style={{ fontSize:12, color:"#777" }}>Event Date: {fmtDate(booking.eventDate)}</div>
                  {booking.notes && <div style={{ fontSize:12, color:"#888", marginTop:3 }}>Note: {booking.notes}</div>}
                  {isCancel && booking.cancelReason && <div style={{ fontSize:12, color:"#B71C1C", marginTop:3 }}>Cancellation Reason: {booking.cancelReason}</div>}
                </td>
                <td style={{ padding:"16px 14px", textAlign:"right", borderBottom:"1px solid #e0d0b0" }}>{fmt(base)}</td>
                <td style={{ padding:"16px 14px", textAlign:"right", borderBottom:"1px solid #e0d0b0", color:"#555" }}>{fmt(gstAmt)}</td>
                <td style={{ padding:"16px 14px", textAlign:"right", borderBottom:"1px solid #e0d0b0", fontWeight:700, fontSize:15 }}>{fmt(tot)}</td>
              </tr>
            </tbody>
            <tfoot>
              {isCancel ? (
                <>
                  <tr style={{ background:"#f9f5ed" }}>
                    <td colSpan={3} style={{ padding:"10px 14px", textAlign:"right", color:"#555" }}>Total Booking Amount (incl. GST)</td>
                    <td style={{ padding:"10px 14px", textAlign:"right", fontWeight:700 }}>{fmt(tot)}</td>
                  </tr>
                  <tr style={{ background:"#f9f5ed" }}>
                    <td colSpan={3} style={{ padding:"10px 14px", textAlign:"right", color:"#555" }}>Advance Received ({booking.paymentMode || "—"})</td>
                    <td style={{ padding:"10px 14px", textAlign:"right", fontWeight:700 }}>{fmt(adv)}</td>
                  </tr>
                  <tr style={{ background:"#FFEBEE", color:"#B71C1C" }}>
                    <td colSpan={3} style={{ padding:"13px 14px", textAlign:"right", fontWeight:700, fontSize:14 }}>Retention Charges Kept</td>
                    <td style={{ padding:"13px 14px", textAlign:"right", fontWeight:700, fontSize:15 }}>{fmt(booking.retentionAmount || 0)}</td>
                  </tr>
                  <tr style={{ background:"#E8F5E9", color:"#1B5E20" }}>
                    <td colSpan={3} style={{ padding:"13px 14px", textAlign:"right", fontWeight:700, fontSize:15 }}>Total Refundable Amount</td>
                    <td style={{ padding:"13px 14px", textAlign:"right", fontWeight:700, fontSize:20 }}>{fmt(booking.refundAmount || 0)}</td>
                  </tr>
                </>
              ) : isInv ? (
                <>
                  <tr style={{ background:"#f9f5ed" }}>
                    <td colSpan={3} style={{ padding:"10px 14px", textAlign:"right", color:"#2D6A4F" }}>
                      (–) Advance Received on {fmtDate(booking.advancePaidOn)} via {booking.paymentMode || "—"}
                    </td>
                    <td style={{ padding:"10px 14px", textAlign:"right", color:"#2D6A4F", fontWeight:700 }}>– {fmt(adv)}</td>
                  </tr>
                  <tr style={{ background:"#5C0E0E", color:"white" }}>
                    <td colSpan={3} style={{ padding:"13px 14px", textAlign:"right", fontWeight:700, fontSize:15 }}>Balance Due</td>
                    <td style={{ padding:"13px 14px", textAlign:"right", fontWeight:700, fontSize:20 }}>{fmt(balance)}</td>
                  </tr>
                </>
              ) : isRcp ? (
                <>
                  <tr style={{ background:"#f9f5ed" }}>
                    <td colSpan={3} style={{ padding:"10px 14px", textAlign:"right", color:"#555" }}>Total Booking Amount (incl. GST)</td>
                    <td style={{ padding:"10px 14px", textAlign:"right", fontWeight:700 }}>{fmt(tot)}</td>
                  </tr>
                  <tr style={{ background:"#C9A227", color:"white" }}>
                    <td colSpan={3} style={{ padding:"13px 14px", textAlign:"right", fontWeight:700, fontSize:15 }}>Advance Received ({booking.paymentMode || "Cash"})</td>
                    <td style={{ padding:"13px 14px", textAlign:"right", fontWeight:700, fontSize:20 }}>{fmt(adv)}</td>
                  </tr>
                  <tr style={{ background:"#f9f5ed" }}>
                    <td colSpan={3} style={{ padding:"10px 14px", textAlign:"right", color:"#7B1818", fontWeight:600 }}>Balance Payable on/before Event Date</td>
                    <td style={{ padding:"10px 14px", textAlign:"right", color:"#7B1818", fontWeight:700 }}>{fmt(balance)}</td>
                  </tr>
                </>
              ) : (
                /* Quotation */
                <>
                  <tr style={{ background:"#f9f5ed" }}>
                    <td colSpan={3} style={{ padding:"10px 14px", textAlign:"right", fontWeight:700 }}>Total Quoted Amount (incl. GST)</td>
                    <td style={{ padding:"10px 14px", textAlign:"right", fontWeight:700, fontSize:16 }}>{fmt(tot)}</td>
                  </tr>
                  <tr style={{ background:"#1D3557", color:"white" }}>
                    <td colSpan={3} style={{ padding:"10px 14px", textAlign:"right", fontWeight:700 }}>Advance Required to Confirm Booking</td>
                    <td style={{ padding:"10px 14px", textAlign:"right", fontWeight:700 }}>Min. ₹25,000</td>
                  </tr>
                </>
              )}
            </tfoot>
          </table>

          {/* Additional charges note */}
          {isQt && (
            <div style={{ marginTop:20, fontSize:12, color:"#555", padding:"12px 16px",
              background:"#FBF5E6", border:"1px solid #e0d0b0", borderRadius:4 }}>
              <strong style={{ color:"#5C0E0E" }}>Additional Charges (billed separately based on actual usage):</strong>
              <div style={{ marginTop:6, display:"flex", flexWrap:"wrap", gap:"4px 24px" }}>
                {ADDITIONAL_CHARGES.map(c => (
                  <span key={c.label}>{c.label}: <strong>{c.rate}</strong></span>
                ))}
              </div>
              <div style={{ marginTop:6, color:"#888" }}>* GST @ 18% applicable on all additional charges.</div>
            </div>
          )}

          {/* Terms */}
          <div style={{ marginTop:22, borderTop:"2px solid #e0d0b0", paddingTop:16 }}>
            <div style={{ fontWeight:700, color:isCancel ? "#B71C1C" : "#5C0E0E", marginBottom:8, fontSize:13 }}>Terms & Conditions</div>
            <ol style={{ paddingLeft:18, fontSize:11.5, color:"#555", lineHeight:1.85 }}>
              {TERMS.map((t, i) => <li key={i}>{t}</li>)}
            </ol>
          </div>

          {/* Signature */}
          <div style={{ marginTop:22, display:"flex", justifyContent:"space-between" }}>
            <div style={{ fontSize:12, color:"#666" }}>
              <strong>Payment Methods:</strong> Cash · UPI (GPay / PhonePe / Paytm) · NEFT/RTGS · Cheque
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ marginTop:40, borderTop:"1px solid #555", paddingTop:5, fontSize:12, color:"#444" }}>Authorised Signature</div>
              <div style={{ fontWeight:700, color:isCancel ? "#B71C1C" : "#5C0E0E", marginTop:3 }}>IGS Convention Centre</div>
            </div>
          </div>
          <div style={{ textAlign:"center", marginTop:20, color:"#C9A227", fontSize:11, letterSpacing:2 }}>
            ✦ THANK YOU FOR CHOOSING IGS CONVENTION CENTRE ✦
          </div>
          <div style={{ textAlign:"center", marginTop:4, fontSize:10.5, color:"#aaa" }}>
            +91 98416 08160 · sreeganesamahal@gmail.com · 51/4A, 4B Ambai Road, Palayamkottai, Tirunelveli – 627005
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUCCESS MODAL
═══════════════════════════════════════════ */
function SuccessModal({ booking, onClose, onPrint }) {
  const waMsg = generateWaMessage(booking);
  const guestPhone = (booking.primaryCc || "").replace("+", "") + booking.primaryPhone.replace(/\D/g, "");
  const ownerPhone = "919841608160"; // IGS Owner WhatsApp

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)",
      zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"white", borderRadius:8, padding:32, maxWidth:500, width:"100%",
        boxShadow:"0 20px 60px rgba(0,0,0,.4)", textAlign:"center" }}>
        
        <div style={{ fontSize:48, marginBottom:10 }}>🎉</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700,
          color:"#2D6A4F", marginBottom:6 }}>Booking Confirmed!</div>
        <div style={{ color:"#666", marginBottom:24, fontSize:14 }}>
          Booking <strong>{booking.id}</strong> saved successfully.
        </div>

        <div style={{ background:"#FBF5E6", border:"1px solid #e8d8b8", borderRadius:6, padding:"16px", marginBottom:24, textAlign:"left" }}>
          <div style={{ fontSize:13, color:"#555", marginBottom:4 }}><strong>Invoice No:</strong> INV-{booking.id}</div>
          <div style={{ fontSize:13, color:"#555", marginBottom:4 }}><strong>Customer:</strong> {fullName(booking)}</div>
          <div style={{ fontSize:13, color:"#555", marginBottom:4 }}><strong>Event Date:</strong> {fmtDate(booking.eventDate)}</div>
          <div style={{ fontSize:13, color:"#555" }}><strong>Balance Due:</strong> {fmt((booking.totalAmount || 0) - (booking.advanceAmount || 0))}</div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <button onClick={() => { onPrint("invoice", booking); onClose(); }} style={{
            width:"100%", background:"#5C0E0E", color:"white", border:"none",
            padding:"14px", borderRadius:5, fontWeight:700, fontSize:16, cursor:"pointer" }}>
            📄 Generate & Print Invoice
          </button>

          <div style={{ display:"flex", gap:10, marginTop:4 }}>
            <a href={`https://api.whatsapp.com/send?phone=${guestPhone}&text=${waMsg}`} target="_blank" rel="noreferrer"
              style={{ flex:1, display:"block", background:"#25D366", color:"white", textDecoration:"none",
              padding:"10px", borderRadius:5, fontWeight:700, fontSize:13 }}>
              💬 WA to Guest
            </a>
            <a href={`https://api.whatsapp.com/send?phone=${ownerPhone}&text=${waMsg}`} target="_blank" rel="noreferrer"
              style={{ flex:1, display:"block", background:"#128C7E", color:"white", textDecoration:"none",
              padding:"10px", borderRadius:5, fontWeight:700, fontSize:13 }}>
              📱 WA to Owner
            </a>
          </div>

          <button onClick={onClose} style={{
            width:"100%", background:"#f5f5f5", color:"#333", border:"1px solid #ddd",
            padding:"12px", borderRadius:5, fontWeight:700, fontSize:14, marginTop:4, cursor:"pointer" }}>
            Done / Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUCCESS CANCELLATION MODAL
═══════════════════════════════════════════ */
function SuccessCancelModal({ booking, onClose, onPrint }) {
  const waMsg = generateCancelWaMessage(booking);
  const guestPhone = (booking.primaryCc || "").replace("+", "") + booking.primaryPhone.replace(/\D/g, "");
  const ownerPhone = "919841608160";

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)",
      zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"white", borderRadius:8, padding:32, maxWidth:500, width:"100%",
        boxShadow:"0 20px 60px rgba(0,0,0,.4)", textAlign:"center" }}>
        
        <div style={{ fontSize:48, marginBottom:10 }}>❌</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700,
          color:"#B71C1C", marginBottom:6 }}>Booking Cancelled!</div>
        <div style={{ color:"#666", marginBottom:24, fontSize:14 }}>
          Booking <strong>{booking.id}</strong> has been successfully cancelled.
        </div>

        <div style={{ background:"#FFEBEE", border:"1px solid #FFCDD2", borderRadius:6, padding:"16px", marginBottom:24, textAlign:"left" }}>
          <div style={{ fontSize:13, color:"#B71C1C", marginBottom:4 }}><strong>Cancellation No:</strong> CAN-{booking.id}</div>
          <div style={{ fontSize:13, color:"#B71C1C", marginBottom:4 }}><strong>Refund Amount:</strong> {fmt(booking.refundAmount)}</div>
          <div style={{ fontSize:13, color:"#B71C1C" }}><strong>Retention Kept:</strong> {fmt(booking.retentionAmount)}</div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <button onClick={() => { onPrint("cancellation", booking); onClose(); }} style={{
            width:"100%", background:"#B71C1C", color:"white", border:"none",
            padding:"14px", borderRadius:5, fontWeight:700, fontSize:16, cursor:"pointer" }}>
            📄 Print Cancellation Receipt
          </button>

          <div style={{ display:"flex", gap:10, marginTop:4 }}>
            <a href={`https://api.whatsapp.com/send?phone=${guestPhone}&text=${waMsg}`} target="_blank" rel="noreferrer"
              style={{ flex:1, display:"block", background:"#25D366", color:"white", textDecoration:"none",
              padding:"10px", borderRadius:5, fontWeight:700, fontSize:13 }}>
              💬 WA to Guest
            </a>
            <a href={`https://api.whatsapp.com/send?phone=${ownerPhone}&text=${waMsg}`} target="_blank" rel="noreferrer"
              style={{ flex:1, display:"block", background:"#128C7E", color:"white", textDecoration:"none",
              padding:"10px", borderRadius:5, fontWeight:700, fontSize:13 }}>
              📱 WA to Owner
            </a>
          </div>

          <button onClick={onClose} style={{
            width:"100%", background:"#f5f5f5", color:"#333", border:"1px solid #ddd",
            padding:"12px", borderRadius:5, fontWeight:700, fontSize:14, marginTop:4, cursor:"pointer" }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BOOKING FORM — New / Edit
═══════════════════════════════════════════ */
const EMPTY = {
  firstName:"", lastName:"", primaryCc:"+91", primaryPhone:"",
  alternateCc:"+91", alternatePhone:"", email:"",
  address1:"", address2:"", landmark:"", city:"", state:"Tamil Nadu", pinCode:"",
  eventType:"Wedding Ceremony", eventDate:"", hallId:"ganesha", slotId:"fullday",
  guestCount:"", baseAmount:"", advanceAmount:"", advancePaidOn:todayStr(),
  paymentMode:"Cash", catering:"Not Required", guestRooms:"",
  gstRequired:false, companyName:"", companyGstin:"", companyAddress:"",
  notes:"", status:"Active",
};

function BookingForm({ existing, onSave, onCancel }) {
  const [form, setForm] = useState(existing || { ...EMPTY });
  const [autoPrice, setAutoPrice] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [k]: v }));
  };

  /* Auto-populate rent when hall / slot changes */
  useEffect(() => {
    if (!autoPrice) return;
    const p = getPrice(form.hallId, form.slotId);
    if (p !== null) setForm(f => ({ ...f, baseAmount: String(p) }));
  }, [form.hallId, form.slotId, autoPrice]);

  const base  = Number(form.baseAmount) || 0;
  const gstA  = gst(base);
  const totA  = total(base);
  const adv   = Number(form.advanceAmount) || 0;
  const bal   = totA - adv;

  /* Available slots for chosen hall */
  const availSlots = SLOTS.filter(s => {
    const p = getPrice(form.hallId, s.id);
    return p !== null;
  });

  const handleSave = () => {
    if (!form.firstName.trim()) return setErrorMsg("First Name is required.");
    if (!form.primaryPhone.trim()) return setErrorMsg("Primary Phone is required.");
    if (!form.eventDate) return setErrorMsg("Event Date is required.");
    if (!form.baseAmount) return setErrorMsg("Hall Rent is required.");
    
    setErrorMsg("");
    onSave({
      ...form,
      createdOn:    existing?.createdOn || todayStr(),
      baseAmount:   base,
      gstAmount:    gstA,
      totalAmount:  totA,
      advanceAmount: adv,
    });
  };

  return (
    <div style={{ background:"white", borderRadius:8, boxShadow:"0 2px 10px rgba(0,0,0,.07)", padding:28, maxWidth:960, margin:"0 auto" }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:21, fontWeight:700,
        color:"#5C0E0E", marginBottom:4, paddingBottom:14, borderBottom:"2px solid #f0e8d8" }}>
        {existing ? "✏️ Edit Booking" : "➕ New Booking"} — IGS Convention Centre
      </div>
      
      {errorMsg && (
        <div style={{ background: "#FFEBEE", color: "#B71C1C", padding: "10px 14px", borderRadius: 4, marginBottom: 16, fontSize: 14, fontWeight: 600 }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {existing && (
        <div style={{ marginTop:10, display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:13, color:"#666" }}>Booking ID: <strong>{existing.id}</strong></span>
          <StatusBadge status={form.status} />
        </div>
      )}

      {/* ── CONTACT ── */}
      <SEP label="Contact Details" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:8 }}>
        <Fld label="First Name" req><input style={INP} value={form.firstName} onChange={set("firstName")} placeholder="First name" /></Fld>
        <Fld label="Last Name"><input style={INP} value={form.lastName} onChange={set("lastName")} placeholder="Last name" /></Fld>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:8 }}>
        <Fld label="Primary Phone" req>
          <div style={{ display:"flex", gap:6 }}>
            <select style={{ ...INP, width:120 }} value={form.primaryCc} onChange={set("primaryCc")}>
              {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
            </select>
            <input style={{ ...INP, flex:1 }} value={form.primaryPhone} onChange={set("primaryPhone")} placeholder="10-digit number" />
          </div>
        </Fld>
        <Fld label="Alternate Phone">
          <div style={{ display:"flex", gap:6 }}>
            <select style={{ ...INP, width:120 }} value={form.alternateCc} onChange={set("alternateCc")}>
              {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
            </select>
            <input style={{ ...INP, flex:1 }} value={form.alternatePhone} onChange={set("alternatePhone")} placeholder="Optional" />
          </div>
        </Fld>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:14, marginBottom:8 }}>
        <Fld label="Email Address"><input style={INP} type="email" value={form.email} onChange={set("email")} placeholder="email@example.com" /></Fld>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:8 }}>
        <Fld label="Address Line 1"><input style={INP} value={form.address1} onChange={set("address1")} placeholder="Door No, Street" /></Fld>
        <Fld label="Address Line 2"><input style={INP} value={form.address2} onChange={set("address2")} placeholder="Area / Colony" /></Fld>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:14, marginBottom:8 }}>
        <Fld label="Landmark"><input style={INP} value={form.landmark} onChange={set("landmark")} placeholder="Optional" /></Fld>
        <Fld label="City" req><input style={INP} value={form.city} onChange={set("city")} placeholder="City" /></Fld>
        <Fld label="State" req>
          <select style={INP} value={form.state} onChange={set("state")}>
            {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Fld>
        <Fld label="PIN Code" req><input style={INP} value={form.pinCode} onChange={set("pinCode")} placeholder="627005" maxLength={6} /></Fld>
      </div>

      {/* ── EVENT ── */}
      <SEP label="Event Details" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:8 }}>
        <Fld label="Event Type" req>
          <select style={INP} value={form.eventType} onChange={set("eventType")}>
            {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </Fld>
        <Fld label="Event Date" req><input style={INP} type="date" value={form.eventDate} onChange={set("eventDate")} /></Fld>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:8 }}>
        <Fld label="Hall / Venue" req>
          <select style={INP} value={form.hallId} onChange={set("hallId")}>
            {HALLS.map(h => <option key={h.id} value={h.id}>{h.label} ({h.guests} Guests)</option>)}
          </select>
        </Fld>
        <Fld label="Booking Slot" req>
          <select style={INP} value={form.slotId} onChange={(e) => {
            setForm(f => ({ ...f, slotId: e.target.value }));
          }}>
            {availSlots.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </Fld>
        <Fld label="Expected Guest Count" req>
          <input style={INP} type="number" value={form.guestCount} onChange={set("guestCount")} placeholder={`Max ${HALLS.find(h=>h.id===form.hallId)?.guests || "—"} guests`} />
        </Fld>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:8 }}>
        <Fld label="Catering">
          <select style={INP} value={form.catering} onChange={set("catering")}>
            {CATERING_OPTIONS.map(c => <option key={c}>{c}</option>)}
          </select>
        </Fld>
        <Fld label="Guest Rooms Required">
          <input style={INP} value={form.guestRooms} onChange={set("guestRooms")} placeholder="e.g. 3 rooms (AC Standard)" />
        </Fld>
      </div>

      {/* ── GST INVOICE ── */}
      <div style={{ display:"flex", alignItems:"center", gap:10, margin:"14px 0 8px",
        padding:"10px 14px", background:"#f0f4ff", borderRadius:6, border:"1px solid #c5cae9" }}>
        <input type="checkbox" id="gstReq" checked={form.gstRequired} onChange={set("gstRequired")}
          style={{ width:16, height:16, cursor:"pointer" }} />
        <label htmlFor="gstReq" style={{ cursor:"pointer", fontSize:14, fontWeight:600, color:"#1D3557" }}>
          I require a GST Invoice for this booking (for corporate / business use)
        </label>
      </div>
      {form.gstRequired && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:8,
          padding:"14px", background:"#f9f9ff", borderRadius:6, border:"1px solid #e0e0ff" }}>
          <Fld label="Company / Organisation Name" req>
            <input style={INP} value={form.companyName} onChange={set("companyName")} placeholder="Company name" />
          </Fld>
          <Fld label="GSTIN Number" req>
            <input style={INP} value={form.companyGstin} onChange={set("companyGstin")} placeholder="22XXXXX1234X1ZX" />
          </Fld>
          <Fld label="Registered Business Address">
            <input style={INP} value={form.companyAddress} onChange={set("companyAddress")} placeholder="Business address" />
          </Fld>
        </div>
      )}

      {/* ── PAYMENT ── */}
      <SEP label="Payment Details (GST @ 18%)" />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:14, marginBottom:10 }}>
        <Fld label="Base Hall Rent (₹)" req>
          <input style={INP} type="number" value={form.baseAmount}
            onChange={(e) => { setAutoPrice(false); set("baseAmount")(e); }}
            placeholder="Auto-filled" />
        </Fld>
        <Fld label="GST 18% (₹)">
          <input style={{ ...INP, background:"#f5f5f5", color:"#888" }} value={base ? gstA : ""} readOnly placeholder="Auto" />
        </Fld>
        <Fld label="Advance Amount (₹)">
          <input style={INP} type="number" value={form.advanceAmount} onChange={set("advanceAmount")} placeholder="e.g. 50000" />
        </Fld>
        <Fld label="Payment Mode">
          <select style={INP} value={form.paymentMode} onChange={set("paymentMode")}>
            {PAYMENT_MODES.map(m => <option key={m}>{m}</option>)}
          </select>
        </Fld>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
        <Fld label="Advance Paid On">
          <input style={INP} type="date" value={form.advancePaidOn} onChange={set("advancePaidOn")} />
        </Fld>
      </div>

      {/* Live summary */}
      {base > 0 && (
        <div style={{ background:"#FBF5E6", border:"1px solid #e0d0b0", borderRadius:6,
          padding:"14px 18px", marginBottom:16, display:"flex", gap:28, flexWrap:"wrap", fontSize:14 }}>
          <span>Base Rent: <strong style={{ color:"#5C0E0E" }}>{fmt(base)}</strong></span>
          <span>+ GST 18%: <strong>{fmt(gstA)}</strong></span>
          <span>Total: <strong style={{ color:"#5C0E0E", fontSize:16 }}>{fmt(totA)}</strong></span>
          <span>Advance: <strong style={{ color:"#2D6A4F" }}>{fmt(adv)}</strong></span>
          <span>Balance: <strong style={{ color:"#C9A227", fontSize:15 }}>{fmt(bal)}</strong></span>
        </div>
      )}

      <Fld label="Notes / Special Requirements">
        <textarea style={{ ...INP, height:76, resize:"vertical", marginTop:2 }} value={form.notes}
          onChange={set("notes")} placeholder="Mandapam, decorations, generator, AV setup, special requests…" />
      </Fld>

      {/* Actions */}
      <div style={{ display:"flex", gap:12, marginTop:20, flexWrap:"wrap" }}>
        <button onClick={handleSave} style={{
          background:"#5C0E0E", color:"white", border:"none",
          padding:"12px 28px", borderRadius:5, fontWeight:700, fontSize:15 }}>
          {existing ? "✅ Confirm Update" : "✅ Confirm Booking"}
        </button>
        <button onClick={onCancel} style={{
          background:"transparent", color:"#5C0E0E", border:"1px solid #5C0E0E",
          padding:"12px 20px", borderRadius:5 }}>Cancel</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════ */
function Dashboard({ bookings, onTab, onNew, onView, onEdit, onCancel }) {
  const today    = todayStr();
  const active   = bookings.filter(b => b.status !== "Cancelled");
  const upcoming = active.filter(b => b.eventDate >= today);
  const totalRev = active.reduce((s,b) => s + (b.totalAmount||0), 0);
  const totalAdv = active.reduce((s,b) => s + (b.advanceAmount||0), 0);
  const nextEvt  = [...upcoming].sort((a,b) => a.eventDate.localeCompare(b.eventDate))[0];
  const recent   = [...bookings].sort((a,b) => b.createdOn.localeCompare(a.createdOn)).slice(0,6);

  const stats = [
    { label:"Total Bookings",    value:active.length,   icon:"📋", color:"#5C0E0E" },
    { label:"Upcoming Events",   value:upcoming.length, icon:"📅", color:"#C9A227" },
    { label:"Total Revenue",     value:fmt(totalRev),   icon:"💰", color:"#2D6A4F" },
    { label:"Advance Collected", value:fmt(totalAdv),   icon:"✅", color:"#1D3557" },
  ];

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {stats.map((s,i) => (
          <div key={i} style={{ background:"white", borderRadius:8, padding:"20px 22px",
            boxShadow:"0 2px 10px rgba(0,0,0,.07)", borderLeft:`4px solid ${s.color}` }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:22, fontWeight:700, color:s.color, fontFamily:"'Playfair Display',serif" }}>{s.value}</div>
            <div style={{ fontSize:12, color:"#888", marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {nextEvt && (
        <div style={{ background:"linear-gradient(135deg,#5C0E0E,#7B1818,#9B2226)",
          borderRadius:8, padding:"20px 26px", color:"white", marginBottom:24,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, opacity:.7, letterSpacing:3, textTransform:"uppercase" }}>Next Upcoming Event</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, marginTop:6 }}>
              {fullName(nextEvt)}
            </div>
            <div style={{ opacity:.85, marginTop:3 }}>{nextEvt.eventType} · {hallLabel(nextEvt.hallId)}</div>
            <div style={{ opacity:.7, fontSize:12, marginTop:3 }}>{slotLabel(nextEvt.slotId)}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:22, color:"#C9A227", fontWeight:700 }}>📅 {fmtDate(nextEvt.eventDate)}</div>
            <div style={{ fontSize:13, opacity:.7, marginTop:4 }}>{nextEvt.primaryCc} {nextEvt.primaryPhone}</div>
            <div style={{ fontSize:14, fontWeight:700, marginTop:3 }}>{fmt(nextEvt.totalAmount)}</div>
          </div>
        </div>
      )}

      <div style={{ background:"white", borderRadius:8, boxShadow:"0 2px 10px rgba(0,0,0,.07)" }}>
        <div style={{ padding:"14px 20px", borderBottom:"1px solid #f0e8d8",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:"#5C0E0E", fontSize:17 }}>Recent Bookings</span>
          <button onClick={() => onTab("bookings")} style={{
            background:"transparent", border:"1px solid #C9A227", color:"#C9A227",
            padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:600 }}>View All →</button>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:800 }}>
            <thead>
              <tr style={{ background:"#FBF5E6" }}>
                {["ID","Customer","Event","Date","Hall","Total","Status"].map(h => (
                  <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontSize:11,
                    color:"#888", fontWeight:700, textTransform:"uppercase" }}>{h}</th>
                ))}
                <th style={{ padding:"10px 12px", textAlign:"right", fontSize:11, color:"#888", fontWeight:700, textTransform:"uppercase" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((b,i) => (
                <tr key={b.id} style={{ borderBottom:"1px solid #f5ebe0", background:i%2===0?"white":"#fdfaf5" }}>
                  <td style={{ padding:"11px 12px", color:"#C9A227", fontWeight:700, fontSize:12 }}>{b.id}</td>
                  <td style={{ padding:"11px 12px", fontWeight:600, fontSize:13 }}>
                    {fullName(b)}
                    <div style={{ fontSize:11, color:"#aaa", fontWeight:400 }}>{b.primaryCc} {b.primaryPhone}</div>
                  </td>
                  <td style={{ padding:"11px 12px" }}>
                    <span style={{ background:"#FBF5E6", color:"#5C0E0E", padding:"2px 8px",
                      borderRadius:20, fontSize:11, fontWeight:700 }}>{b.eventType}</span>
                  </td>
                  <td style={{ padding:"11px 12px", fontSize:12, whiteSpace:"nowrap" }}>{fmtDate(b.eventDate)}</td>
                  <td style={{ padding:"11px 12px", fontSize:12 }}>{hallLabel(b.hallId)}</td>
                  <td style={{ padding:"11px 12px", fontWeight:700 }}>{fmt(b.totalAmount)}</td>
                  <td style={{ padding:"11px 12px" }}><StatusBadge status={b.status} /></td>
                  <td style={{ padding:"11px 12px", textAlign:"right" }}>
                    <div style={{ display:"flex", gap:4, justifyContent:"flex-end" }}>
                      <Btn icon="👁️" title="View Details" onClick={() => onView(b)} bg="#e3f2fd" />
                      {b.status !== "Cancelled" && (
                        <>
                          <Btn icon="✏️" title="Edit Booking" onClick={() => onEdit(b)} bg="#f0f0f0" />
                          <Btn icon="❌" title="Cancel Booking" onClick={() => onCancel(b.id)} bg="#fff0f0" />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ALL BOOKINGS LIST
═══════════════════════════════════════════ */
function BookingsList({ bookings, onView, onEdit, onPrint, onCancel, onRestore, onDelete }) {
  const [search, setSearch]   = useState("");
  const [fStatus, setFStatus] = useState("All");
  const [fHall, setFHall]     = useState("All");

  const filtered = bookings
    .filter(b => {
      const q = search.toLowerCase();
      const nm = fullName(b).toLowerCase();
      return (nm.includes(q) || b.id.toLowerCase().includes(q) || (b.primaryPhone||"").includes(q)) &&
        (fStatus === "All" || b.status === fStatus) &&
        (fHall   === "All" || b.hallId === fHall);
    })
    .sort((a,b) => a.eventDate.localeCompare(b.eventDate));

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by name, booking ID or phone..."
          style={{ flex:1, minWidth:200, ...INP }} />
        <select value={fStatus} onChange={e => setFStatus(e.target.value)} style={{ ...INP, width:"auto" }}>
          <option>All</option>
          <option>Active</option><option>Modified</option><option>Cancelled</option><option>Quoted</option>
        </select>
        <select value={fHall} onChange={e => setFHall(e.target.value)} style={{ ...INP, width:"auto" }}>
          <option value="All">All Halls</option>
          {HALLS.map(h => <option key={h.id} value={h.id}>{h.label}</option>)}
        </select>
      </div>

      <div style={{ background:"white", borderRadius:8, boxShadow:"0 2px 10px rgba(0,0,0,.07)", overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:1000 }}>
          <thead>
            <tr style={{ background:"#5C0E0E", color:"white" }}>
              {["ID","Customer","Event","Date","Hall","Total","Advance","Balance","Status","Actions"].map(h => (
                <th key={h} style={{ padding:"11px 10px", textAlign:"left", fontSize:10,
                  fontWeight:700, letterSpacing:.7, textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={11} style={{ textAlign:"center", padding:40, color:"#bbb" }}>No bookings found.</td></tr>
            ) : filtered.map((b,i) => {
              const bal = (b.totalAmount||0) - (b.advanceAmount||0);
              const isCancelled = b.status === "Cancelled";
              return (
                <tr key={b.id} style={{ borderBottom:"1px solid #f5ebe0",
                  background:isCancelled?"#fff5f5": i%2===0?"white":"#fdfaf5",
                  opacity:isCancelled?.7:1 }}>
                  <td style={{ padding:"10px", color:"#C9A227", fontWeight:700, fontSize:11 }}>{b.id}</td>
                  <td style={{ padding:"10px" }}>
                    <div style={{ fontWeight:700, fontSize:13 }}>{fullName(b)}</div>
                    <div style={{ fontSize:11, color:"#aaa" }}>{b.primaryCc} {b.primaryPhone}</div>
                  </td>
                  <td style={{ padding:"10px" }}>
                    <span style={{ background:"#FBF5E6", color:"#5C0E0E", padding:"2px 7px",
                      borderRadius:20, fontSize:10, fontWeight:700, whiteSpace:"nowrap" }}>{b.eventType}</span>
                  </td>
                  <td style={{ padding:"10px", fontSize:11, whiteSpace:"nowrap" }}>{fmtDate(b.eventDate)}</td>
                  <td style={{ padding:"10px", fontSize:11 }}>{hallLabel(b.hallId)}</td>
                  <td style={{ padding:"10px", fontWeight:700, fontSize:13 }}>{fmt(b.totalAmount)}</td>
                  <td style={{ padding:"10px", color:"#2D6A4F", fontWeight:600, fontSize:12 }}>{fmt(b.advanceAmount)}</td>
                  <td style={{ padding:"10px", fontWeight:700, fontSize:13, color:bal>0?"#C9A227":"#2D6A4F" }}>{fmt(bal)}</td>
                  <td style={{ padding:"10px" }}><StatusBadge status={b.status} /></td>
                  <td style={{ padding:"10px" }}>
                    <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
                      <Btn icon="👁️" title="View" onClick={() => onView(b)} bg="#e3f2fd" />
                      {!isCancelled && <>
                        <Btn icon="✏️" title="Edit"            onClick={() => onEdit(b)}                   bg="#f0f0f0" />
                        <Btn icon="📋" title="Quotation"       onClick={() => onPrint("quotation",b)}      bg="#e8f0fe" />
                        <Btn icon="📄" title="Invoice"         onClick={() => onPrint("invoice",b)}        bg="#FBF5E6" />
                        <Btn icon="🧾" title="Advance Receipt" onClick={() => onPrint("receipt",b)}        bg="#FBF5E6" />
                        <Btn icon="❌" title="Cancel Booking"  onClick={() => onCancel(b.id)}              bg="#fff0f0" />
                        <Btn icon="🗑️" title="Delete"          onClick={() => onDelete(b.id)}              bg="#ffebeb" />
                      </>}
                      {isCancelled && (
                        <>
                          <Btn icon="📄" title="Cancellation Receipt" onClick={() => onPrint("cancellation", b)} bg="#ffebee" />
                          <Btn icon="↩️" title="Restore Booking" onClick={() => onRestore(b.id)}             bg="#e8f5e9" />
                          <Btn icon="🗑️" title="Permanently Delete" onClick={() => onDelete(b.id)}           bg="#ffebeb" />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:10, fontSize:12, color:"#777", display:"flex", gap:24, flexWrap:"wrap" }}>
        <span>{filtered.length} booking(s) shown</span>
        <span>Total Revenue: <strong style={{ color:"#5C0E0E" }}>{fmt(filtered.filter(b=>b.status!=="Cancelled").reduce((s,b)=>s+(b.totalAmount||0),0))}</strong></span>
        <span>Balance Pending: <strong style={{ color:"#C9A227" }}>{fmt(filtered.filter(b=>b.status!=="Cancelled").reduce((s,b)=>s+((b.totalAmount||0)-(b.advanceAmount||0)),0))}</strong></span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FIND BOOKING (For Dedicated Modify / Cancel Tabs)
═══════════════════════════════════════════ */
function FindBooking({ title, icon, actionLabel, bookings, onSelect, actionBg, onView }) {
  const [search, setSearch] = useState("");

  const activeBookings = bookings.filter(b => b.status === "Active" || b.status === "Modified");

  const results = search.trim().length >= 3 ? activeBookings.filter(b =>
    b.id.toLowerCase().includes(search.toLowerCase()) ||
    (b.primaryPhone && b.primaryPhone.includes(search)) ||
    (b.alternatePhone && b.alternatePhone.includes(search)) ||
    fullName(b).toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div style={{ background:"white", borderRadius:8, boxShadow:"0 2px 10px rgba(0,0,0,.07)", padding:28, maxWidth:960, margin:"0 auto" }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:21, fontWeight:700,
        color:"#5C0E0E", marginBottom:20 }}>
        {icon} {title}
      </div>
      <div style={{ marginBottom:24 }}>
        <label style={{ fontSize:12, color:"#5a4a3a", fontWeight:700, marginBottom:5, display:"block", textTransform:"uppercase", letterSpacing:0.5 }}>
          Search Booking to {actionLabel.split(" ")[0]}
        </label>
        <input
          style={{ ...INP, fontSize:16, padding:"12px 16px" }}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Enter Booking ID, Customer Name, or Phone Number..."
          autoFocus
        />
        <div style={{ fontSize:12, color:"#888", marginTop:6 }}>Type at least 3 characters to search active bookings.</div>
      </div>

      {search.trim().length >= 3 && (
        <div>
          {results.length === 0 ? (
            <div style={{ padding:30, textAlign:"center", background:"#f9f9f9", borderRadius:8, color:"#888" }}>
              No active bookings found matching "{search}".
            </div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#FBF5E6", color:"#5C0E0E" }}>
                    <th style={{ padding:"10px 14px", textAlign:"left", fontSize:11, textTransform:"uppercase", letterSpacing:0.5 }}>Booking Info</th>
                    <th style={{ padding:"10px 14px", textAlign:"left", fontSize:11, textTransform:"uppercase", letterSpacing:0.5 }}>Event Details</th>
                    <th style={{ padding:"10px 14px", textAlign:"right", fontSize:11, textTransform:"uppercase", letterSpacing:0.5 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(b => (
                    <tr key={b.id} style={{ borderBottom:"1px solid #f0e8d8" }}>
                      <td style={{ padding:"14px" }}>
                        <strong style={{ color:"#C9A227" }}>{b.id}</strong><br/>
                        <div style={{ fontSize:14, fontWeight:700, marginTop:4 }}>{fullName(b)}</div>
                        <div style={{ fontSize:12, color:"#666" }}>📞 {b.primaryPhone}</div>
                      </td>
                      <td style={{ padding:"14px" }}>
                        <div style={{ fontSize:13, fontWeight:700 }}>{fmtDate(b.eventDate)}</div>
                        <div style={{ fontSize:12, color:"#5C0E0E", marginTop:4 }}>{hallLabel(b.hallId)}</div>
                        <div style={{ fontSize:12, color:"#888" }}>{b.eventType}</div>
                      </td>
                      <td style={{ padding:"14px", textAlign:"right", verticalAlign:"middle" }}>
                        <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                          <button onClick={() => onView(b)} style={{
                            background:"#e3f2fd", color:"#0D47A1", border:"none",
                            padding:"10px 14px", borderRadius:5, fontWeight:700, fontSize:13 }}>
                            👁️ View Details
                          </button>
                          <button onClick={() => onSelect(b)} style={{
                            background:actionBg, color:"white", border:"none",
                            padding:"10px 20px", borderRadius:5, fontWeight:700, fontSize:13 }}>
                            {actionLabel}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CANCEL MODAL
═══════════════════════════════════════════ */
function CancelModal({ booking, onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  const [chargeType, setChargeType] = useState("policy");
  const [customRetention, setCustomRetention] = useState("");

  const name = fullName(booking);
  const days = Math.ceil((new Date(booking.eventDate) - new Date()) / 86400000);
  const policyRefundPct = days >= 60 ? 80 : days >= 30 ? 50 : days >= 15 ? 25 : 0;
  const policyRetentionPct = 100 - policyRefundPct;
  const advance = booking.advanceAmount || 0;

  let retention = 0;
  if (chargeType === "policy") retention = (policyRetentionPct / 100) * advance;
  else if (chargeType === "custom") retention = Number(customRetention) || 0;

  const refund = Math.max(0, advance - retention);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)",
      zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"white", borderRadius:8, padding:28, maxWidth:520, width:"100%",
        boxShadow:"0 20px 60px rgba(0,0,0,.4)", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700,
          color:"#B71C1C", marginBottom:16 }}>❌ Cancel Booking</div>

        <div style={{ background:"#FFEBEE", border:"1px solid #FFCDD2", borderRadius:6,
          padding:"14px 16px", marginBottom:16, fontSize:13, lineHeight:1.7 }}>
          <strong>Booking ID:</strong> {booking.id} &nbsp; | &nbsp; <strong>Customer:</strong> {name}<br/>
          <strong>Event Date:</strong> {fmtDate(booking.eventDate)} ({days > 0 ? `${days} days away` : "past"})<br/>
          <strong>Advance Paid:</strong> {fmt(advance)}
        </div>

        <label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:8, textTransform:"uppercase" }}>
          Retention Policy / Charges
        </label>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
          <label style={{ display:"flex", gap:8, alignItems:"center", fontSize:14, cursor:"pointer" }}>
            <input type="radio" checked={chargeType==="policy"} onChange={()=>setChargeType("policy")} style={{width:16,height:16}} />
            <div>
              <strong>Apply Standard Policy ({policyRetentionPct}% Retention)</strong>
              <div style={{ fontSize:12, color:"#666" }}>Charge: {fmt((policyRetentionPct / 100) * advance)} | Refund: {fmt(advance - ((policyRetentionPct / 100) * advance))}</div>
            </div>
          </label>
          <label style={{ display:"flex", gap:8, alignItems:"center", fontSize:14, cursor:"pointer" }}>
            <input type="radio" checked={chargeType==="waive"} onChange={()=>setChargeType("waive")} style={{width:16,height:16}} />
            <div>
              <strong>Waive Charges (0% Retention)</strong>
              <div style={{ fontSize:12, color:"#666" }}>Full refund of advance: {fmt(advance)}</div>
            </div>
          </label>
          <label style={{ display:"flex", gap:8, alignItems:"center", fontSize:14, cursor:"pointer" }}>
            <input type="radio" checked={chargeType==="custom"} onChange={()=>setChargeType("custom")} style={{width:16,height:16}} />
            <div>
              <strong>Custom Retention Amount</strong>
            </div>
          </label>
          {chargeType === "custom" && (
            <input style={{...INP, marginLeft:24, width:"calc(100% - 24px)"}} type="number" value={customRetention} onChange={e=>setCustomRetention(e.target.value)} placeholder="Enter exact amount to retain (e.g., 5000)" />
          )}
        </div>

        <div style={{ background:"#f5f5f5", padding:"12px 16px", borderRadius:6, marginBottom:16, display:"flex", justifyContent:"space-between", fontSize:14 }}>
          <span>Final Retention: <strong style={{color:"#B71C1C"}}>{fmt(retention)}</strong></span>
          <span>Final Refund: <strong style={{color:"#2D6A4F"}}>{fmt(refund)}</strong></span>
        </div>

        <label style={{ fontSize:12, fontWeight:700, color:"#555", display:"block", marginBottom:5,
          textTransform:"uppercase", letterSpacing:.5 }}>Cancellation Reason</label>
        <textarea value={reason} onChange={e => setReason(e.target.value)}
          placeholder="Enter reason for cancellation"
          style={{ ...INP, height:60, resize:"vertical", marginBottom:16 }} />

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={() => onConfirm(reason, retention, refund)} style={{
            background:"#B71C1C", color:"white", border:"none",
            padding:"11px 22px", borderRadius:5, fontWeight:700, fontSize:14 }}>
            Confirm Cancellation
          </button>
          <button onClick={onClose} style={{
            background:"#f5f5f5", color:"#333", border:"1px solid #ddd",
            padding:"11px 18px", borderRadius:5 }}>Keep Booking</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DELETE MODAL
═══════════════════════════════════════════ */
function DeleteModal({ booking, onConfirm, onClose }) {
  const name = fullName(booking);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)",
      zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"white", borderRadius:8, padding:28, maxWidth:480, width:"100%",
        boxShadow:"0 20px 60px rgba(0,0,0,.4)" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700,
          color:"#B71C1C", marginBottom:16 }}>🗑️ Permanently Delete Booking</div>
        <div style={{ background:"#FFEBEE", border:"1px solid #FFCDD2", borderRadius:6,
          padding:"14px 16px", marginBottom:16, fontSize:13, lineHeight:1.7 }}>
          <strong>Booking ID:</strong> {booking.id}<br/>
          <strong>Customer:</strong> {name}<br/>
          <strong>Event Date:</strong> {fmtDate(booking.eventDate)}
        </div>
        <div style={{ fontSize:13, color:"#B71C1C", marginBottom:20, lineHeight:1.6, fontWeight:600 }}>
          Warning: This action cannot be undone. The booking will be permanently removed from the system.
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onConfirm} style={{
            background:"#B71C1C", color:"white", border:"none",
            padding:"11px 22px", borderRadius:5, fontWeight:700, fontSize:14 }}>
            Permanently Delete
          </button>
          <button onClick={onClose} style={{
            background:"#f5f5f5", color:"#333", border:"1px solid #ddd",
            padding:"11px 18px", borderRadius:5 }}>Keep Booking</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   GUEST HISTORY
═══════════════════════════════════════════ */
function GuestHistory({ bookings, onView, onEdit, onCancel }) {
  const [phone, setPhone] = useState("");

  const filteredBookings = phone.trim().length >= 4 ? bookings.filter(b => 
    (b.primaryPhone && b.primaryPhone.includes(phone)) || 
    (b.alternatePhone && b.alternatePhone.includes(phone))
  ).sort((a,b) => b.eventDate.localeCompare(a.eventDate)) : [];

  const totalSpent = filteredBookings.filter(b=>b.status!=="Cancelled").reduce((s, b) => s + (b.totalAmount || 0), 0);

  return (
    <div style={{ background:"white", borderRadius:8, boxShadow:"0 2px 10px rgba(0,0,0,.07)", padding:28, maxWidth:960, margin:"0 auto" }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:21, fontWeight:700,
        color:"#5C0E0E", marginBottom:20 }}>👥 Guest Booking History</div>
      
      <div style={{ display:"flex", gap:10, marginBottom:24, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:250 }}>
          <label style={{ fontSize:12, color:"#5a4a3a", fontWeight:700, marginBottom:5, display:"block", textTransform:"uppercase", letterSpacing:0.5 }}>
            Search by Mobile Number
          </label>
          <input value={phone} onChange={e => setPhone(e.target.value)}
            placeholder="Enter at least 4 digits..."
            style={INP} />
        </div>
      </div>

      {phone.trim().length < 4 ? (
        <div style={{ padding:40, textAlign:"center", color:"#888", background:"#f9f9f9", borderRadius:8 }}>
          Please enter at least 4 digits of the guest's mobile number to search their history.
        </div>
      ) : filteredBookings.length === 0 ? (
        <div style={{ padding:40, textAlign:"center", color:"#888", background:"#f9f9f9", borderRadius:8 }}>
          No bookings found for mobile number containing "{phone}".
        </div>
      ) : (
        <div>
          <div style={{ display:"flex", gap:20, marginBottom:20 }}>
            <div style={{ background:"#FBF5E6", padding:"12px 20px", borderRadius:6, border:"1px solid #e8d8b8" }}>
              <div style={{ fontSize:11, color:"#888", textTransform:"uppercase", fontWeight:700 }}>Total Bookings</div>
              <div style={{ fontSize:20, color:"#5C0E0E", fontWeight:700 }}>{filteredBookings.length}</div>
            </div>
            <div style={{ background:"#FBF5E6", padding:"12px 20px", borderRadius:6, border:"1px solid #e8d8b8" }}>
              <div style={{ fontSize:11, color:"#888", textTransform:"uppercase", fontWeight:700 }}>Total Spent (Active)</div>
              <div style={{ fontSize:20, color:"#2D6A4F", fontWeight:700 }}>{fmt(totalSpent)}</div>
            </div>
          </div>

          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:800 }}>
              <thead>
                <tr style={{ background:"#5C0E0E", color:"white" }}>
                  {["ID", "Customer", "Event", "Date", "Hall", "Total", "Status"].map(h => (
                    <th key={h} style={{ padding:"11px 10px", textAlign:"left", fontSize:10,
                      fontWeight:700, letterSpacing:.7, textTransform:"uppercase" }}>{h}</th>
                  ))}
                  <th style={{ padding:"11px 10px", textAlign:"right", fontSize:10, fontWeight:700, letterSpacing:.7, textTransform:"uppercase" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b,i) => (
                  <tr key={b.id} style={{ borderBottom:"1px solid #f5ebe0", background:i%2===0?"white":"#fdfaf5" }}>
                    <td style={{ padding:"10px", color:"#C9A227", fontWeight:700, fontSize:11 }}>{b.id}</td>
                    <td style={{ padding:"10px" }}>
                      <div style={{ fontWeight:700, fontSize:13 }}>{fullName(b)}</div>
                      <div style={{ fontSize:11, color:"#aaa" }}>{b.primaryCc} {b.primaryPhone}</div>
                    </td>
                    <td style={{ padding:"10px", fontSize:12 }}>{b.eventType}</td>
                    <td style={{ padding:"10px", fontSize:12 }}>{fmtDate(b.eventDate)}</td>
                    <td style={{ padding:"10px", fontSize:12 }}>{hallLabel(b.hallId)}</td>
                    <td style={{ padding:"10px", fontWeight:700, fontSize:13 }}>{fmt(b.totalAmount)}</td>
                    <td style={{ padding:"10px" }}><StatusBadge status={b.status} /></td>
                    <td style={{ padding:"10px", textAlign:"right" }}>
                      <div style={{ display:"flex", gap:4, justifyContent:"flex-end" }}>
                        <Btn icon="👁️" title="View Details" onClick={() => onView(b)} bg="#e3f2fd" />
                        {b.status !== "Cancelled" && (
                          <>
                            <Btn icon="✏️" title="Edit Booking" onClick={() => onEdit(b)} bg="#f0f0f0" />
                            <Btn icon="❌" title="Cancel Booking" onClick={() => onCancel(b.id)} bg="#fff0f0" />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CALENDAR VIEW
═══════════════════════════════════════════ */
function CalendarView({ bookings }) {
  const now = new Date();
  const [vd, setVd] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [sel, setSel] = useState(null);
  const yr = vd.getFullYear(); const mo = vd.getMonth();
  const firstDay = new Date(yr,mo,1).getDay();
  const dim = new Date(yr,mo+1,0).getDate();
  const pad = n => String(n).padStart(2,"0");
  const today = now.toISOString().split("T")[0];
  const bMap = {};
  bookings.filter(b=>b.status!=="Cancelled").forEach(b => {
    if(!bMap[b.eventDate]) bMap[b.eventDate]=[];
    bMap[b.eventDate].push(b);
  });
  const cells = [...Array(firstDay).fill(null), ...Array.from({length:dim},(_,i)=>i+1)];
  const selKey = sel ? `${yr}-${pad(mo+1)}-${pad(sel)}` : null;
  const selB = selKey ? (bMap[selKey]||[]) : [];
  const moKey = `${yr}-${pad(mo+1)}`;
  const moB = bookings.filter(b=>b.status!=="Cancelled"&&b.eventDate.startsWith(moKey));

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 330px", gap:20, alignItems:"start" }}>
      <div style={{ background:"white", borderRadius:8, boxShadow:"0 2px 10px rgba(0,0,0,.07)", overflow:"hidden" }}>
        <div style={{ background:"#5C0E0E", color:"white", padding:"14px 20px",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <button onClick={()=>setVd(new Date(yr,mo-1,1))} style={{ background:"transparent", color:"white",
            border:"1px solid rgba(255,255,255,.3)", padding:"5px 14px", borderRadius:4, fontSize:18 }}>‹</button>
          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:19, fontWeight:700 }}>
            {vd.toLocaleDateString("en-IN",{month:"long",year:"numeric"})}
          </span>
          <button onClick={()=>setVd(new Date(yr,mo+1,1))} style={{ background:"transparent", color:"white",
            border:"1px solid rgba(255,255,255,.3)", padding:"5px 14px", borderRadius:4, fontSize:18 }}>›</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", textAlign:"center" }}>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>(
            <div key={d} style={{ padding:"10px 0", fontSize:11, fontWeight:700, color:"#888", background:"#FBF5E6", textTransform:"uppercase" }}>{d}</div>
          ))}
          {cells.map((day,i)=>{
            if(!day) return <div key={i}/>;
            const dk=`${yr}-${pad(mo+1)}-${pad(day)}`;
            const hasB=!!bMap[dk]; const cnt=bMap[dk]?.length||0;
            const isT=dk===today; const isSel=day===sel;
            return (
              <div key={i} onClick={()=>setSel(isSel?null:day)}
                style={{ padding:"10px 6px 8px", cursor:"pointer", textAlign:"center",
                  borderBottom:"1px solid #f5ebe0", borderRight:"1px solid #f5ebe0",
                  background:isSel?"#5C0E0E":hasB?"#FBF5E6":"white",
                  color:isSel?"white":isT?"#5C0E0E":"#333",
                  fontWeight:(isT||isSel)?700:400,
                  outline:isT?"2px solid #C9A227":"none", outlineOffset:-2 }}>
                <div style={{ fontSize:14 }}>{day}</div>
                {hasB&&(
                  <div style={{ display:"flex", justifyContent:"center", gap:2, marginTop:3 }}>
                    {Array.from({length:Math.min(cnt,4)}).map((_,j)=>(
                      <span key={j} style={{ display:"inline-block", width:6, height:6,
                        borderRadius:"50%", background:isSel?"white":"#C9A227" }}/>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ padding:"10px 16px", display:"flex", gap:20, fontSize:12, color:"#888", borderTop:"1px solid #f5ebe0" }}>
          <span>🟡 Booked</span><span style={{ color:"#5C0E0E", fontWeight:700 }}>■ Today</span><span>Click to view</span>
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ background:"white", borderRadius:8, boxShadow:"0 2px 10px rgba(0,0,0,.07)", overflow:"hidden" }}>
          <div style={{ background:sel?"#C9A227":"#aaa", color:"white", padding:"11px 16px", fontWeight:700, fontSize:14 }}>
            {sel ? `📅 ${fmtDate(selKey)}` : "📅 Select a date"}
          </div>
          {!sel ? (
            <div style={{ padding:24, textAlign:"center", color:"#bbb", fontSize:13 }}>Click any date on the calendar</div>
          ) : selB.length===0 ? (
            <div style={{ padding:24, textAlign:"center" }}>
              <div style={{ fontSize:36, marginBottom:8 }}>✅</div>
              <div style={{ color:"#2D6A4F", fontWeight:700, fontSize:16 }}>Available</div>
              <div style={{ fontSize:13, color:"#aaa", marginTop:4 }}>No bookings on this date</div>
            </div>
          ) : selB.map(b=>(
            <div key={b.id} style={{ padding:14, borderBottom:"1px solid #f5ebe0" }}>
              <div style={{ fontWeight:700, fontSize:14 }}>{fullName(b)}</div>
              <div style={{ fontSize:11, color:"#aaa" }}>{b.primaryCc} {b.primaryPhone}</div>
              <span style={{ background:"#FBF5E6", color:"#5C0E0E", padding:"2px 8px",
                borderRadius:20, fontSize:10, fontWeight:700, display:"inline-block", marginTop:5 }}>{b.eventType}</span>
              <div style={{ fontSize:12, color:"#666", marginTop:4 }}>{hallLabel(b.hallId)}</div>
              <div style={{ fontSize:12, color:"#888" }}>{SLOTS.find(s=>s.id===b.slotId)?.label.split("—")[0]}</div>
              <div style={{ fontSize:13, fontWeight:700, color:"#2D6A4F", marginTop:3 }}>{fmt(b.totalAmount)}</div>
            </div>
          ))}
        </div>
        <div style={{ background:"white", borderRadius:8, boxShadow:"0 2px 10px rgba(0,0,0,.07)", padding:16 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, color:"#5C0E0E", marginBottom:12, fontSize:15 }}>
            {vd.toLocaleDateString("en-IN",{month:"long",year:"numeric"})} Summary
          </div>
          {[
            ["Total Events",     moB.length,                                             "#5C0E0E"],
            ["Revenue (w/ GST)", fmt(moB.reduce((s,b)=>s+(b.totalAmount||0),0)),         "#333"],
            ["Advance Received", fmt(moB.reduce((s,b)=>s+(b.advanceAmount||0),0)),       "#2D6A4F"],
            ["Balance Pending",  fmt(moB.reduce((s,b)=>s+((b.totalAmount||0)-(b.advanceAmount||0)),0)), "#C9A227"],
          ].map(([k,v,c])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between",
              padding:"7px 0", borderBottom:"1px solid #f5ebe0", fontSize:13 }}>
              <span style={{ color:"#666" }}>{k}</span>
              <strong style={{ color:c }}>{v}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PRICING REFERENCE TAB
═══════════════════════════════════════════ */
function PricingRef() {
  const rows = [
    { hall:"Shree Ganesha Mahal (500 Guests)", rows:[
      ["Full Day / Night (3PM–2PM or 11PM–10PM)", 150000],
      ["2-Day Booking", 225000],
      ["3-Day Booking", 295000],
    ]},
    { hall:"Kaveri Hall (350 Guests)", rows:[
      ["Half Day (Morning or Evening)", 40000],
      ["Full Day (3PM–2PM)", 110000],
      ["2-Day Booking", 175000],
      ["Corporate Half Day", 65000],
      ["Corporate Full Day", 75000],
      ["4-Hour Meeting Session", 20000],
    ]},
    { hall:"Vaigai Hall (200 Guests)", rows:[
      ["Half Day (Morning or Evening)", 20000],
      ["Full Day (3PM–2PM)", 110000],
      ["2-Day Booking", 175000],
      ["Corporate Half Day", 65000],
      ["Corporate Full Day", 75000],
      ["4-Hour Meeting Session", 10000],
    ]},
    { hall:"Thamirabarani Hall (100 Guests)", rows:[
      ["Half Day (Morning or Evening)", 10000],
      ["Full Day (3PM–2PM)", 110000],
      ["2-Day Booking", 175000],
      ["Corporate Half Day", 65000],
      ["Corporate Full Day", 75000],
      ["4-Hour Meeting Session", 7500],
    ]},
    { hall:"Kaveri + Vaigai Combined", rows:[
      ["Half Day", 60000],
      ["Full Day", 90000],
    ]},
    { hall:"Vaigai + Thamirabarani Combined", rows:[
      ["Half Day", 40000],
      ["Full Day", 60000],
    ]},
  ];

  return (
    <div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700,
        color:"#5C0E0E", marginBottom:20 }}>💰 Hall Pricing Reference</div>
      {rows.map(({ hall, rows:pr }) => (
        <div key={hall} style={{ background:"white", borderRadius:8, marginBottom:16,
          boxShadow:"0 2px 10px rgba(0,0,0,.07)", overflow:"hidden", maxWidth:960, margin:"0 auto" }}>
          <div style={{ background:"#5C0E0E", color:"white", padding:"11px 18px",
            fontWeight:700, fontSize:14 }}>{hall}</div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#FBF5E6" }}>
                {["Slot / Duration","Base Rent","GST 18%","Total (incl. GST)"].map(h=>(
                  <th key={h} style={{ padding:"9px 14px", textAlign:"left", fontSize:11,
                    color:"#888", fontWeight:700, textTransform:"uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pr.map(([slot, base], i)=>(
                <tr key={slot} style={{ borderBottom:"1px solid #f5ebe0", background:i%2===0?"white":"#fdfaf5" }}>
                  <td style={{ padding:"10px 14px", fontSize:13 }}>{slot}</td>
                  <td style={{ padding:"10px 14px", fontSize:13 }}>{fmt(base)}</td>
                  <td style={{ padding:"10px 14px", fontSize:13, color:"#666" }}>{fmt(gst(base))}</td>
                  <td style={{ padding:"10px 14px", fontWeight:700, color:"#5C0E0E", fontSize:14 }}>{fmt(total(base))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <div style={{ background:"white", borderRadius:8, boxShadow:"0 2px 10px rgba(0,0,0,.07)", overflow:"hidden", maxWidth:960, margin:"0 auto" }}>
        <div style={{ background:"#1D3557", color:"white", padding:"11px 18px", fontWeight:700, fontSize:14 }}>
          Additional Charges (billed separately — GST @ 18% extra)
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <tbody>
            {ADDITIONAL_CHARGES.map((c,i)=>(
              <tr key={c.label} style={{ borderBottom:"1px solid #f5ebe0", background:i%2===0?"white":"#fdfaf5" }}>
                <td style={{ padding:"9px 14px", fontSize:13 }}>{c.label}</td>
                <td style={{ padding:"9px 14px", fontWeight:700, color:"#1D3557", fontSize:13 }}>{c.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════ */
export default function App() {
  const [bookings, setBookings]     = useState(loadBookings);
  const [activeTab, setActiveTab]   = useState("dashboard");
  const [printDoc, setPrintDoc]     = useState(null);
  const [viewing, setViewing]       = useState(null);
  const [editing, setEditing]       = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [deleting, setDeleting]     = useState(null);
  const [successBooking, setSuccessBooking] = useState(null);
  const [successCancelBooking, setSuccessCancelBooking] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => { saveBookings(bookings); }, [bookings]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const saveBooking = (b) => {
    let finalBooking = { ...b };
    const nowIso = new Date().toISOString();
    
    if (!finalBooking.id) {
      // Nayi Booking
      finalBooking.id = generateNextBookingId(bookings);
      finalBooking.status = "Active";
      finalBooking.history = [{ action: "Created Booking", date: nowIso }];
    } else {
      // Modify Existing
      const existing = bookings.find(x => x.id === finalBooking.id);
      if (existing) {
         // Purana data save karo history log mein
         finalBooking.history = [...(existing.history || []), {
           action: "Modified",
           date: nowIso,
           previousTotal: existing.totalAmount,
           previousAdvance: existing.advanceAmount,
           previousDate: existing.eventDate,
           previousHall: existing.hallId
         }];
         
         if (existing.status !== "Quoted" && existing.status !== "Cancelled") {
            finalBooking.status = "Modified";
         }
      }
    }

    setBookings(prev => {
      const idx = prev.findIndex(x => x.id === finalBooking.id);
      if (idx >= 0) {
        const n = [...prev];
        n[idx] = finalBooking;
        return n;
      }
      return [...prev, finalBooking];
    });

    setEditing(null);
    setSuccessBooking(finalBooking);
  };

  const handleCancel = (id, reason, retention, refund) => {
    let cancelledB = null;
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        cancelledB = {
          ...b, status:"Cancelled", cancelReason:reason, cancelledOn:todayStr(),
          retentionAmount: retention, refundAmount: refund,
          history: [...(b.history || []), { action: "Cancelled", date: new Date().toISOString(), reason }]
        };
        return cancelledB;
      }
      return b;
    }));
    setCancelling(null);
    if (cancelledB) setSuccessCancelBooking(cancelledB);
  };

  const handleRestore = (id) => {
    setBookings(prev => prev.map(b => b.id===id ? { 
      ...b, status:"Active", 
      history: [...(b.history || []), { action: "Restored from Cancellation", date: new Date().toISOString() }] 
    } : b));
  };

  const handlePermanentDelete = (id) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    setDeleting(null);
  };

  const TABS = [
    { id:"dashboard",   icon:"🏠", label:"Dashboard"   },
    { id:"new-booking", icon:"➕", label:"New Booking"  },
    { id:"modify-booking", icon:"✏️", label:"Modify Booking" },
    { id:"cancel-booking", icon:"❌", label:"Cancel Booking" },
    { id:"bookings",    icon:"📋", label:"All Bookings" },
    { id:"calendar",    icon:"📅", label:"Calendar"     },
    { id:"guest-history", icon:"👥", label:"Guest History" },
    { id:"pricing",     icon:"💰", label:"Pricing"      },
    { id:"terms",       icon:"📜", label:"Terms"        },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#F2E8D0", fontFamily:"'Lato',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        button{cursor:pointer;transition:opacity .15s;font-family:'Lato',sans-serif;}
        button:hover{opacity:.82;}
        input:focus,select:focus,textarea:focus{outline:none;border-color:#C9A227!important;box-shadow:0 0 0 3px rgba(201,162,39,.15);}
      `}</style>

      {printDoc && (
        <PrintDoc type={printDoc.type} booking={printDoc.booking} onClose={()=>setPrintDoc(null)} />
      )}
      {viewing && (
        <ViewModal booking={viewing} onClose={() => setViewing(null)} />
      )}
      {successBooking && (
        <SuccessModal 
          booking={successBooking} 
          onPrint={(type, b) => setPrintDoc({ type, booking: b })}
          onClose={() => {
            setSuccessBooking(null);
            if (activeTab === "new-booking") setActiveTab("dashboard");
          }} 
        />
      )}
      {successCancelBooking && (
        <SuccessCancelModal 
          booking={successCancelBooking} 
          onPrint={(type, b) => setPrintDoc({ type, booking: b })}
          onClose={() => {
            setSuccessCancelBooking(null);
            setActiveTab("bookings");
          }} 
        />
      )}
      {cancelling && (
        <CancelModal
          booking={cancelling}
          onConfirm={(reason, retention, refund) => handleCancel(cancelling.id, reason, retention, refund)}
          onClose={()=>setCancelling(null)} />
      )}
      {deleting && (
        <DeleteModal
          booking={deleting}
          onConfirm={() => handlePermanentDelete(deleting.id)}
          onClose={()=>setDeleting(null)} />
      )}

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#3D0808,#5C0E0E,#7B1818)",
        padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between",
        boxShadow:"0 3px 16px rgba(0,0,0,.35)" }}>
        <div style={{ padding:"16px 0" }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:"white", letterSpacing:1 }}>
            🕉️ IGS Convention Centre
          </div>
          <div style={{ fontSize:11, color:"rgba(201,162,39,.9)", letterSpacing:3, textTransform:"uppercase", marginTop:3 }}>
            Booking Management System
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ color:"rgba(255,255,255,.7)", fontSize:13 }}>
            {currentTime.toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
            &nbsp;·&nbsp;
            <strong>{currentTime.toLocaleTimeString("en-IN", {hour: '2-digit', minute:'2-digit', second: '2-digit', hour12: true})}</strong>
          </div>
          <div style={{ color:"#C9A227", fontSize:11, marginTop:4 }}>📍 Palayamkottai, Tirunelveli · 📞 +91 98416 08160</div>
          <div style={{ color:"rgba(255,255,255,.5)", fontSize:10, marginTop:2 }}>sreeganesamahal@gmail.com</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ background:"white", borderBottom:"2px solid #e8d8b8", padding:"0 24px",
        display:"flex", gap:0, boxShadow:"0 1px 6px rgba(0,0,0,.06)", overflowX:"auto" }}>
        {TABS.map(tab=>(
          <button key={tab.id}
            onClick={()=>{ setEditing(null); setActiveTab(tab.id); }}
            style={{ background:"transparent", border:"none", whiteSpace:"nowrap",
              borderBottom:activeTab===tab.id?"3px solid #5C0E0E":"3px solid transparent",
              padding:"15px 14px", color:activeTab===tab.id?"#5C0E0E":"#777",
              fontWeight:activeTab===tab.id?700:400, fontSize:13,
              display:"flex", alignItems:"center", gap:6, transition:"all .2s" }}>
            {tab.icon} {tab.label}
          </button>
        ))}
        <div style={{ flex:1 }}/>
      </div>

      {/* Main content */}
      <div style={{ padding:"26px 28px" }}>
        {activeTab==="dashboard" && !editing && (
          <Dashboard 
            bookings={bookings} 
            onTab={setActiveTab} 
            onNew={()=>setActiveTab("new-booking")}
            onView={b => setViewing(b)}
            onEdit={b => setEditing(b)}
            onCancel={id => setCancelling(bookings.find(b=>b.id===id))} 
          />
        )}
        {(activeTab==="new-booking" || editing) && (
          <BookingForm
            existing={editing}
            onSave={saveBooking}
            onCancel={()=>{
              setEditing(null);
              if (activeTab === "new-booking") setActiveTab("dashboard");
            }} />
        )}
        {activeTab==="modify-booking" && !editing && (
          <FindBooking title="Modify Booking" icon="✏️" actionLabel="Edit Booking"
            bookings={bookings} onSelect={b => setEditing(b)} actionBg="#5C0E0E" onView={b => setViewing(b)} />
        )}
        {activeTab==="cancel-booking" && !editing && (
          <FindBooking title="Cancel Booking" icon="❌" actionLabel="Cancel Booking"
            bookings={bookings} onSelect={b => setCancelling(b)} actionBg="#B71C1C" onView={b => setViewing(b)} />
        )}
        {activeTab==="bookings" && !editing && (
          <BookingsList
            bookings={bookings}
            onView={b => setViewing(b)}
            onEdit={(b)=>{ setEditing(b); }}
            onPrint={(type,b)=>setPrintDoc({type,booking:b})}
            onCancel={(id)=>setCancelling(bookings.find(b=>b.id===id))}
            onRestore={handleRestore}
            onDelete={(id)=>setDeleting(bookings.find(b=>b.id===id))} />
        )}
        {activeTab==="calendar" && !editing && <CalendarView bookings={bookings} />}
        {activeTab==="guest-history" && !editing && <GuestHistory bookings={bookings} onView={b => setViewing(b)} onEdit={b => setEditing(b)} onCancel={id => setCancelling(bookings.find(b=>b.id===id))} />}
        {activeTab==="pricing" && !editing && <PricingRef />}
        {activeTab==="terms" && !editing && (
          <div style={{ background:"white", borderRadius:8, padding:28, boxShadow:"0 2px 10px rgba(0,0,0,.07)", maxWidth:960, margin:"0 auto" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:"#5C0E0E", marginBottom:16 }}>
              📜 Terms & Conditions
            </div>
            <ol style={{ paddingLeft:20, lineHeight:1.8, color:"#444" }}>
              {TERMS.map((t, i) => <li key={i} style={{ marginBottom:10 }}>{t}</li>)}
            </ol>
          </div>
        )}
      </div>

      <div style={{ background:"#3D0808", color:"rgba(255,255,255,.45)",
        textAlign:"center", padding:"12px", fontSize:11 }}>
        © 2026 IGS Convention Centre · 51/4A, 4B Ambai Road, Palayamkottai, Tirunelveli – 627005
        · +91 98416 08160 · sreeganesamahal@gmail.com
      </div>
    </div>
  );
}
