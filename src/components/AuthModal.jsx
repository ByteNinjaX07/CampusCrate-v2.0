import { useState, useMemo } from "react";
import { X, ShieldCheck, Lock, Building2, User as UserIcon, Mail, KeyRound, AlertCircle, PlusCircle, Search } from "lucide-react";
import { getUserTag } from "../utils/userTag";
export const INSTITUTE_CATEGORIES = [
  {
    category: "Indian Institutes of Technology (IITs)",
    institutes: [
      "IIT Bombay (Mumbai)",
      "IIT Delhi",
      "IIT Madras (Chennai)",
      "IIT Kanpur",
      "IIT Kharagpur",
      "IIT Roorkee",
      "IIT Guwahati",
      "IIT Hyderabad",
      "IIT (BHU) Varanasi",
      "IIT (ISM) Dhanbad",
      "IIT Indore",
      "IIT Ropar",
      "IIT Mandi",
      "IIT Gandhinagar",
      "IIT Jodhpur",
      "IIT Patna",
      "IIT Bhubaneswar",
      "IIT Tirupati",
      "IIT Palakkad",
      "IIT Goa",
      "IIT Dharwad",
      "IIT Bhilai",
      "IIT Jammu"
    ]
  },
  {
    category: "National Institutes of Technology (NITs)",
    institutes: [
      "NIT Tiruchirappalli (Trichy)",
      "NIT Karnataka (Surathkal)",
      "NIT Rourkela",
      "NIT Warangal",
      "NIT Calicut",
      "MNNIT Allahabad (Prayagraj)",
      "VNIT Nagpur",
      "MNIT Jaipur",
      "NIT Kurukshetra",
      "NIT Silchar",
      "NIT Durgapur",
      "NIT Jalandhar",
      "SVNIT Surat",
      "NIT Meghalaya",
      "NIT Patna",
      "NIT Raipur",
      "NIT Srinagar",
      "NIT Agartala",
      "NIT Puducherry",
      "NIT Uttarakhand",
      "NIT Goa",
      "NIT Andhra Pradesh",
      "NIT Mizoram",
      "NIT Nagaland",
      "NIT Sikkim",
      "NIT Arunachal Pradesh",
      "NIT Manipur",
      "NIT Delhi"
    ]
  },
  {
    category: "Indian Institutes of Information Technology (IIITs)",
    institutes: [
      "IIIT Hyderabad",
      "IIIT Bangalore",
      "IIIT Allahabad",
      "IIIT Delhi (Indraprastha Inst of Tech)",
      "ABV-IIITM Gwalior",
      "PDPM IIITDM Jabalpur",
      "IIITDM Kancheepuram",
      "IIIT Lucknow",
      "IIIT Pune",
      "IIIT Vadodara",
      "IIIT Guwahati",
      "IIIT Kota",
      "IIIT Sri City",
      "IIIT Una",
      "IIIT Sonepat",
      "IIIT Kalyani",
      "IIIT Surat",
      "IIIT Bhopal",
      "IIIT Bhagalpur",
      "IIIT Kottayam",
      "IIIT Ranchi",
      "IIIT Nagpur",
      "IIIT Dharwad"
    ]
  },
  {
    category: "Indian Institutes of Management (IIMs)",
    institutes: [
      "IIM Ahmedabad",
      "IIM Bangalore",
      "IIM Calcutta",
      "IIM Lucknow",
      "IIM Kozhikode",
      "IIM Indore",
      "IIM Shillong",
      "IIM Rohtak",
      "IIM Ranchi",
      "IIM Raipur",
      "IIM Tiruchirappalli",
      "IIM Udaipur",
      "IIM Kashipur",
      "IIM Amritsar",
      "IIM Bodh Gaya",
      "IIM Jammu",
      "IIM Nagpur",
      "IIM Sambalpur",
      "IIM Sirmaur",
      "IIM Visakhapatnam"
    ]
  },
  {
    category: "Premier Research, Medical & Science Institutes (IISc, AIIMS, IISERs)",
    institutes: [
      "IISc Bangalore (Indian Institute of Science)",
      "AIIMS New Delhi",
      "AIIMS Bhopal",
      "AIIMS Bhubaneswar",
      "AIIMS Jodhpur",
      "AIIMS Patna",
      "AIIMS Rishikesh",
      "AIIMS Nagpur",
      "AIIMS Raipur",
      "IISER Pune",
      "IISER Kolkata",
      "IISER Mohali",
      "IISER Thiruvananthapuram",
      "IISER Bhopal",
      "IISER Berhampur",
      "IISER Tirupati",
      "NISER Bhubaneswar",
      "JIPMER Puducherry",
      "NIPER Mohali",
      "NIPER Ahmedabad",
      "NID Ahmedabad (National Institute of Design)",
      "NIFT New Delhi (National Institute of Fashion Tech)",
      "NIFT Mumbai",
      "NIFT Bengaluru"
    ]
  },
  {
    category: "Maharashtra Institutes & State Universities",
    institutes: [
      "COEP Technological University (Pune)",
      "VJTI Mumbai (Veermata Jijabai Technological Inst)",
      "ICT Mumbai (Institute of Chemical Technology)",
      "PICT Pune (Pune Institute of Computer Tech)",
      "Walchand College of Engineering (Sangli)",
      "MIT World Peace University (MIT-WPU Pune)",
      "VIT Pune (Vishwakarma Institute of Technology)",
      "SPPU (Savitribai Phule Pune University)",
      "University of Mumbai",
      "SGGS Institute of Engineering & Tech (Nanded)",
      "Government College of Engineering (Karad)",
      "Government College of Engineering (Aurangabad)",
      "Government College of Engineering (Amravati)",
      "Government College of Engineering (Nagpur)",
      "Government College of Engineering (Chandrapur)",
      "SPIT Mumbai (Sardar Patel Inst of Tech)",
      "D. J. Sanghvi College of Engineering (DJCSE Mumbai)",
      "K. J. Somaiya College of Engineering (Mumbai)",
      "Fr. Conceicao Rodrigues College of Engg (CRCE Bandra)",
      "PCCOE Pune (Pimpri Chinchwad College of Engg)",
      "D.Y. Patil College of Engineering (Akurdi/Pimpri)",
      "Vishwakarma Institute of Information Tech (VIIT Pune)",
      "Cummins College of Engineering for Women (Pune)",
      "RCOEM Nagpur (Ramdeobaba College of Engg)",
      "GH Raisoni College of Engineering (Nagpur)",
      "SIT Lonavala (Sinhgad Institute of Tech)",
      "Sinhgad College of Engineering (Vadgaon Pune)",
      "KIT College of Engineering (Kolhapur)",
      "RIT Rajaramnagar (Islampur)",
      "Government Polytechnic Mumbai / Pune / Nagpur"
    ]
  },
  {
    category: "Karnataka Institutes & Engineering Colleges",
    institutes: [
      "RV College of Engineering (RVCE Bangalore)",
      "BMS College of Engineering (BMSCE Bangalore)",
      "MSRIT (Ramaiah Institute of Technology)",
      "PES University (Bangalore)",
      "VTU Belagavi (Visvesvaraya Technological Univ)",
      "NIE Mysore (National Institute of Engineering)",
      "SJCE Mysore (Sri Jayachamarajendra College of Engg)",
      "BMS Institute of Technology & Management (BMSIT)",
      "Dayananda Sagar College of Engineering (DSCE Bangalore)",
      "Bangalore Institute of Technology (BIT)",
      "SIT Tumkur (Siddaganga Institute of Tech)",
      "NMIT Bangalore (Nitte Meenakshi Inst of Tech)",
      "Manipal Academy of Higher Education (MAHE Manipal)",
      "Christ University (Bangalore)",
      "Jain University (Bangalore)"
    ]
  },
  {
    category: "Delhi NCR Premier Institutes & Universities",
    institutes: [
      "DTU (Delhi Technological University / DCE)",
      "NSUT Delhi (Netaji Subhas Univ of Tech)",
      "IGDTUW Delhi (Indira Gandhi Delhi Technical Univ for Women)",
      "Delhi University (DU - SRCC, St Stephens, Hindu, Hansraj)",
      "JNU (Jawaharlal Nehru University Delhi)",
      "Jamia Millia Islamia (JMI New Delhi)",
      "USICT Delhi (GGSIPU Main Campus)",
      "MAIT Delhi (Maharaja Agrasen Institute of Tech)",
      "MSIT Delhi (Maharaja Surajmal Institute of Tech)",
      "BVCOE Delhi (Bharati Vidyapeeth)",
      "Shiv Nadar University (Greater Noida)",
      "Bennett University (Greater Noida)",
      "Jaypee Institute of Information Technology (JIIT Noida)",
      "Amity University (Noida / Gurgaon)"
    ]
  },
  {
    category: "Tamil Nadu & Kerala Premier Institutes",
    institutes: [
      "Anna University (Guindy Campus / MIT Chromepet)",
      "PSG College of Technology (Coimbatore)",
      "VIT Vellore (Vellore Institute of Technology)",
      "VIT Chennai",
      "SRM Institute of Science and Tech (Kattankulathur)",
      "SSN College of Engineering (Chennai)",
      "Thiagarajar College of Engineering (Madurai)",
      "SASTRA Deemed University (Thanjavur)",
      "Sathyabama Institute of Science and Technology",
      "Hindustan Institute of Technology and Science",
      "CET Trivandrum (College of Engineering Trivandrum)",
      "GEC Thrissur (Government Engineering College)",
      "TKM College of Engineering (Kollam)",
      "MEC Kochi (Model Engineering College)"
    ]
  },
  {
    category: "Telangana & Andhra Pradesh Institutes",
    institutes: [
      "JNTU Hyderabad (JNTUH Kukatpally)",
      "JNTU Kakinada",
      "JNTU Anantapur",
      "Osmania University College of Engineering (OUCE Hyderabad)",
      "CBIT Hyderabad (Chaitanya Bharathi Inst of Tech)",
      "Vasavi College of Engineering (Hyderabad)",
      "VNR VJIET Hyderabad (Vignana Jyothi Inst of Tech)",
      "Gokaraju Rangaraju Institute of Engineering & Tech (GRIET)",
      "CVR College of Engineering (Hyderabad)",
      "Mahindra University (Hyderabad)",
      "GITAM University (Visakhapatnam)",
      "Vignan University (Guntur)",
      "SRKR Engineering College (Bhimavaram)"
    ]
  },
  {
    category: "Central & State Universities Across India",
    institutes: [
      "Banaras Hindu University (BHU Varanasi)",
      "Aligarh Muslim University (AMU Aligarh)",
      "University of Hyderabad (HCU)",
      "Jadavpur University (Kolkata)",
      "IIEST Shibpur (Bengaluru/Kolkata)",
      "Thapar Institute of Engineering & Tech (Patiala)",
      "PEC Chandigarh (Punjab Engineering College)",
      "BIT Mesra (Ranchi)",
      "BITS Pilani (Main Campus)",
      "BITS Pilani (Goa Campus)",
      "BITS Pilani (Hyderabad Campus)",
      "KIIT University (Bhubaneswar)",
      "SOA University (Siksha O Anusandhan Bhubaneswar)",
      "LNMIIT Jaipur",
      "Nirma University (Ahmedabad)",
      "DA-IICT (Gandhinagar)",
      "MSU Baroda (Maharaja Sayajirao University)",
      "L.D. College of Engineering (Ahmedabad)",
      "HBTI Kanpur (Harcourt Butler Technical Univ)",
      "MMMUT Gorakhpur (Madan Mohan Malaviya Univ)",
      "IET Lucknow",
      "SGSITS Indore",
      "JEC Jabalpur",
      "MBM Engineering College (Jodhpur)",
      "Heritage Institute of Technology (Kolkata)",
      "IEM Kolkata (Institute of Engg & Management)",
      "Lovely Professional University (LPU Punjab)",
      "Chandigarh University (CU)",
      "Ashoka University (Sonipat)",
      "NLSIU Bangalore (National Law School)",
      "NALSAR Hyderabad",
      "WBNUJS Kolkata",
      "NLU Delhi"
    ]
  },
  {
    category: "Global Universities",
    institutes: [
      "Stanford University",
      "Massachusetts Institute of Technology (MIT USA)",
      "Harvard University",
      "UC Berkeley",
      "UCLA",
      "Oxford University",
      "University of Cambridge",
      "National University of Singapore (NUS)",
      "Nanyang Technological University (NTU Singapore)"
    ]
  }
];
export const ALL_INSTITUTES_FLAT = INSTITUTE_CATEGORIES.flatMap((cat) => cat.institutes);
export const AuthModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onGoogleLoginPopup,
  reasonMessage = "Google or Campus Email Sign-In is required to post lost or found items on CampusCrate."
}) => {
  const [activeTab, setActiveTab] = useState("google");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedInstitute, setSelectedInstitute] = useState("IIT Bombay (Mumbai)");
  const [isCustomInstitute, setIsCustomInstitute] = useState(false);
  const [customInstitute, setCustomInstitute] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return INSTITUTE_CATEGORIES;
    const q = searchQuery.toLowerCase().trim();
    return INSTITUTE_CATEGORIES.map((catGroup) => {
      const filtered = catGroup.institutes.filter(
        (inst) => inst.toLowerCase().includes(q)
      );
      return {
        category: catGroup.category,
        institutes: filtered
      };
    }).filter((catGroup) => catGroup.institutes.length > 0);
  }, [searchQuery]);
  if (!isOpen) return null;
  const handleGmailSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim()) {
      setError("Please enter your full name or username.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid Gmail or campus email address.");
      return;
    }
    if (!password || password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }
    const isEduDomain = email.toLowerCase().endsWith(".ac.in") || email.toLowerCase().endsWith(".edu") || email.toLowerCase().endsWith(".edu.in") || email.toLowerCase().endsWith(".res.in");
    const finalInstitute = isCustomInstitute || selectedInstitute === "Other / Custom Campus Institute" ? customInstitute.trim() || "Custom Campus Institute" : selectedInstitute;
    setIsSubmitting(true);
    setTimeout(() => {
      const newUser = {
        id: `gmail-user-${Date.now()}`,
        name: username.trim(),
        email: email.trim(),
        role: "student_loser",
        institute: finalInstitute,
        authenticated: true,
        authProvider: "gmail_password",
        isDomainVerified: isEduDomain,
        verificationStatus: isEduDomain ? "verified_edu" : "unverified",
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(username.trim())}`,
        blocked: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      };
      setIsSubmitting(false);
      onLoginSuccess(newUser);
      onClose();
    }, 600);
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden relative">
        
        {
    /* Header Bar */
  }
        <div className="bg-slate-900 text-white p-6 relative">
          <button
    onClick={onClose}
    className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
  >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Mandatory Campus Auth
            </span>
          </div>

          <h2 className="text-xl font-black text-white">Sign In to Continue</h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {reasonMessage}
          </p>
        </div>

        {
    /* Tab Selection */
  }
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1">
          <button
    onClick={() => {
      setActiveTab("google");
      setError("");
    }}
    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "google" ? "bg-white text-slate-900 shadow-xs border border-slate-200" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
  >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google One-Click Login</span>
          </button>

          <button
    onClick={() => {
      setActiveTab("gmail");
      setError("");
    }}
    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${activeTab === "gmail" ? "bg-white text-slate-900 shadow-xs border border-slate-200" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
  >
            <Mail className="w-4 h-4 text-slate-700" />
            <span>Campus ID & Manual Login</span>
          </button>
        </div>

        {
    /* Tab Content Body */
  }
        <div className="p-6 max-h-[78vh] overflow-y-auto">
          {error && <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>}

          {activeTab === "google" ? <div className="bg-[#18181b] text-slate-100 p-6 rounded-2xl border border-slate-800 text-left space-y-4 shadow-xl">
              {
    /* Header */
  }
              <div className="flex items-center gap-2 text-slate-200 text-sm font-medium border-b border-slate-800/80 pb-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google</span>
              </div>

              {
    /* Title Section */
  }
              <div className="pt-1">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-2xl mb-3 shadow-md">
                  C
                </div>
                <h3 className="text-2xl font-normal text-slate-100 tracking-tight">
                  Choose an account
                </h3>
                <p className="text-sm text-slate-400 mt-0.5">
                  to continue to <span className="text-indigo-400 font-semibold">CampusCrate</span>
                </p>
              </div>

              {
    /* Account Chooser Items matching Screenshot */
  }
              <div className="space-y-1 pt-2">
                {
    /* Account 1: Personal Gmail */
  }
                <button
    type="button"
    onClick={() => {
      const authedUser = {
        id: `google-user-${Date.now()}`,
        name: "Aryan Jadhav",
        email: "jadhavh651@gmail.com",
        role: "student_loser",
        authenticated: true,
        authProvider: "google",
        isDomainVerified: false,
        verificationStatus: "unverified",
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=Aryan%20Jadhav`,
        blocked: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      };
      onLoginSuccess(authedUser);
      onClose();
    }}
    className="w-full p-3 rounded-xl hover:bg-slate-800/80 transition-all flex items-center gap-3.5 text-left border border-transparent hover:border-slate-700/60 group"
  >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shrink-0">
                    A
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-slate-100 group-hover:text-white truncate">
                        Aryan Jadhav
                      </span>
                      <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold rounded border border-blue-500/30">
                        #GID-651
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      jadhavh651@gmail.com
                    </div>
                  </div>
                  <div className="text-xs text-indigo-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Select →
                  </div>
                </button>

                {
    /* Account 2: BITS Pilani University Account */
  }
                <button
    type="button"
    onClick={() => {
      const authedUser = {
        id: `google-user-${Date.now()}`,
        name: "ARYAN HEMANT JADHAV .",
        email: "2025eb03144@online.bits-pilani.ac.in",
        role: "student_loser",
        authenticated: true,
        authProvider: "google",
        isDomainVerified: true,
        verificationStatus: "verified_edu",
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=ARYAN%20HEMANT%20JADHAV`,
        blocked: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      };
      onLoginSuccess(authedUser);
      onClose();
    }}
    className="w-full p-3 rounded-xl hover:bg-slate-800/80 transition-all flex items-center gap-3.5 text-left border border-transparent hover:border-slate-700/60 group"
  >
                  <div className="w-10 h-10 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-base shrink-0">
                    A
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-semibold text-slate-100 group-hover:text-white truncate">
                        ARYAN HEMANT JADHAV .
                      </span>
                      <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded border border-purple-500/30">
                        Campus Edu
                      </span>
                      <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold rounded border border-emerald-500/30">
                        #EDU-03144
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      2025eb03144@online.bits-pilani.ac.in
                    </div>
                  </div>
                  <div className="text-xs text-purple-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Select →
                  </div>
                </button>

                {
    /* Account 3: Use another account */
  }
                <button
    type="button"
    onClick={() => {
      setShowCustomInput(!showCustomInput);
    }}
    className="w-full p-3 rounded-xl hover:bg-slate-800/80 transition-all flex items-center gap-3.5 text-left border border-transparent hover:border-slate-700/60 group"
  >
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-sm font-medium text-slate-200 group-hover:text-white">
                    Use another account
                  </div>
                </button>
              </div>

              {
    /* Custom Google Account Input */
  }
              {showCustomInput && <form
    onSubmit={(e) => {
      e.preventDefault();
      if (!email.trim() || !email.includes("@")) {
        setError("Please enter your Google account email.");
        return;
      }
      const displayName = username.trim() || email.split("@")[0];
      const isEduDomain = email.toLowerCase().endsWith(".ac.in") || email.toLowerCase().endsWith(".edu") || email.toLowerCase().endsWith(".edu.in");
      const authedUser = {
        id: `google-user-${Date.now()}`,
        name: displayName,
        email: email.trim(),
        role: "student_loser",
        authenticated: true,
        authProvider: "google",
        isDomainVerified: isEduDomain,
        verificationStatus: isEduDomain ? "verified_edu" : "unverified",
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
        blocked: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
      };
      onLoginSuccess(authedUser);
      onClose();
    }}
    className="p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-3 mt-2"
  >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-300">
                        Google / Campus Email Address
                      </label>
                      {email.trim() && (
                        <span className="px-1.5 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono font-bold text-[10px] rounded">
                          {getUserTag({ email, name: username || email.split("@")[0] })}
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com or student@college.ac.in"
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-colors shadow-xs"
                  >
                    Continue with this Google Account
                  </button>
                </form>}

              {
    /* OAuth Popup trigger link */
  }
              <div className="pt-1 text-center">
                <button
    type="button"
    onClick={() => {
      onGoogleLoginPopup();
      onClose();
    }}
    className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
  >
                  Or open in separate Chrome popup window ↗
                </button>
              </div>

              {
    /* Footer Terms */
  }
              <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-800/80 pt-3">
                Before using this app, you can review CampusCrate's <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a> and <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a>.
              </div>
            </div> : <form onSubmit={handleGmailSubmit} className="space-y-4">
              {
    /* Username / Full Name */
  }
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username / Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
    type="text"
    required
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    placeholder="e.g. Alex Rivera"
    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
  />
                </div>
              </div>

              {
    /* Gmail / University Email */
  }
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gmail / Campus Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="e.g. alex.rivera@gmail.com or alex@iitb.ac.in"
    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
  />
                </div>
              </div>

              {
    /* Searchable Institute Selection */
  }
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Institute / Campus Selection *
                  </label>
                  <span className="text-[10px] text-indigo-600 font-semibold">
                    Type to search 200+ Indian Colleges
                  </span>
                </div>

                {
    /* Real-time typing search bar */
  }
                {!isCustomInstitute && <div className="mb-2 relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Type to filter institute (e.g. VJTI, COEP, IIT, BITS, NIT)..."
    className="w-full pl-8 pr-3 py-1.5 text-xs bg-indigo-50/50 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
  />
                    {searchQuery && <button
    type="button"
    onClick={() => setSearchQuery("")}
    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs font-bold"
  >
                        ✕
                      </button>}
                  </div>}

                {
    /* Institute Dropdown */
  }
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <select
    disabled={isCustomInstitute}
    value={selectedInstitute}
    onChange={(e) => {
      setSelectedInstitute(e.target.value);
      if (e.target.value === "Other / Custom Campus Institute") {
        setIsCustomInstitute(true);
      }
    }}
    className={`w-full pl-9 pr-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isCustomInstitute ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" : "bg-slate-50 text-slate-900 border-slate-200 focus:bg-white"}`}
  >
                    {filteredCategories.length === 0 ? <option value="Other / Custom Campus Institute">
                        No match found — Click 'My institute isn't listed' below
                      </option> : filteredCategories.map((catGroup) => <optgroup key={catGroup.category} label={`${catGroup.category} (${catGroup.institutes.length})`}>
                          {catGroup.institutes.map((inst) => <option key={inst} value={inst}>
                              {inst}
                            </option>)}
                        </optgroup>)}
                    <optgroup label="Unlisted Campus">
                      <option value="Other / Custom Campus Institute">
                        Other / My institute isn't listed
                      </option>
                    </optgroup>
                  </select>
                </div>

                {
    /* Separate Unlisted Option Below Dropdown */
  }
                <div className="mt-2.5 flex items-center justify-between">
                  <button
    type="button"
    onClick={() => {
      const nextState = !isCustomInstitute;
      setIsCustomInstitute(nextState);
      if (nextState) {
        setSelectedInstitute("Other / Custom Campus Institute");
      } else {
        setSelectedInstitute(INSTITUTE_CATEGORIES[0].institutes[0]);
      }
    }}
    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-2 transition-colors group cursor-pointer"
  >
                    <span className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold transition-all ${isCustomInstitute ? "bg-indigo-600 border-indigo-600 text-white shadow-xs" : "border-slate-300 bg-white group-hover:border-indigo-400"}`}>
                      {isCustomInstitute ? "\u2713" : ""}
                    </span>
                    <span className="underline underline-offset-2 decoration-indigo-200 group-hover:decoration-indigo-600">
                      My institute isn't listed
                    </span>
                  </button>

                  {isCustomInstitute && <button
    type="button"
    onClick={() => {
      setIsCustomInstitute(false);
      setSelectedInstitute(INSTITUTE_CATEGORIES[0].institutes[0]);
    }}
    className="text-[11px] text-slate-500 hover:text-slate-700 underline"
  >
                      Choose from list
                    </button>}
                </div>
              </div>

              {
    /* Custom Institute Text Field if 'My institute isn't listed' is activated */
  }
              {isCustomInstitute && <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                    <PlusCircle className="w-4 h-4 text-indigo-600" />
                    <span>Enter Custom Institute Name *</span>
                  </div>
                  <input
    type="text"
    required
    value={customInstitute}
    onChange={(e) => setCustomInstitute(e.target.value)}
    placeholder="e.g. Walchand College of Engineering, Sangli"
    className="w-full px-3 py-2 text-xs bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
  />
                  <p className="text-[10px] text-indigo-700">
                    Type the full official name of your university, college, or campus.
                  </p>
                </div>}

              {
    /* Password */
  }
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Password *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
    type="password"
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="••••••••"
    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
  />
                </div>
              </div>

              <button
    type="submit"
    disabled={isSubmitting}
    className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
  >
                {isSubmitting ? <span className="animate-pulse">Authenticating Campus Access...</span> : <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In & Verify Campus Credentials</span>
                  </>}
              </button>
            </form>}
        </div>
      </div>
    </div>;
};
