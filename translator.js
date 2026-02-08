/* =====================
   TRANSLATIONS
   ===================== */
const translations = {
  en: {
    nav_home: "Home",
    nav_destinations: "Destinations",
    nav_contact: "Contact",

    hero_title: "Cambodia at Your Fingertips",
    hero_subtitle: "Travel Safer, Travel Smarter with TosTrip",
    hero_explore: "Explore Tours",
    hero_offline: "Offline Mode",

    about_text: "Tostrip is a travel assistant platform that helps travelers live like a local. It allows users to spend a day experiencing authentic local life, discover hidden gems, and explore destinations safely and conveniently with offline access. With unique “Rent a Friend” packages, travelers connect with locals for a truly immersive experience. Currently focused on Siem Reap, Tostrip turns every trip into an unforgettable local adventure."
  },

  fr: {
    nav_home: "Accueil",
    nav_destinations: "Destinations",
    nav_contact: "Contact",

    hero_title: "Le Cambodge à portée de main",
    hero_subtitle: "Voyagez plus sûr et plus intelligemment avec TosTrip",
    hero_explore: "Explorer les circuits",
    hero_offline: "Mode hors ligne",

    about_text: "Tostrip est une plateforme d'assistant de voyage qui aide les voyageurs à vivre comme un local. Elle permet aux utilisateurs de passer une journée à découvrir la vie locale authentique, de découvrir des trésors cachés et d'explorer les destinations en toute sécurité et commodité, même hors ligne. Avec des forfaits uniques « Louer un ami », les voyageurs se connectent avec des locaux pour une expérience vraiment immersive. Actuellement axé sur Siem Reap, Tostrip transforme chaque voyage en une aventure locale inoubliable."
  },

  km: {
    nav_home: "ទំព័រដើម",
    nav_destinations: "គោលដៅ",
    nav_contact: "ទំនាក់ទំនង",

    hero_title: "កម្ពុជា នៅចុងម្រាមដៃអ្នក",
    hero_subtitle: "ធ្វើដំណើរយ៉ាងមានសុវត្ថិភាព និងឆ្លាតវៃជាមួយ TosTrip",
    hero_explore: "ស្វែងរកដំណើរកម្សាន្ត",
    hero_offline: "របៀបអอฟឡាញ",

    about_text: "Tostrip គឺជាវេទិកាដើម្បីជួយការធ្វើដំណើរដែលអាចជួយអ្នកធ្វើដំណើររស់នៅដូចជាជនជាតិ។ វាអនុញ្ញាតឱ្យអ្នកប្រើប្រាស់ចំណាយមួយថ្ងៃដើម្បីជួបជុំជីវិតមូលដ្ឋានដើមៗ រកឃើញកន្លែងលាក់ខ្លួន និងស្វែងរកគោលដៅដោយសុវត្ថិភាព និងងាយស្រួលជាមួយការចូលប្រើដោយអនឡាញ។ ជាមួយកញ្ចប់ “ជួលមិត្តភក្តិ” ផ្សេងទៀត អ្នកធ្វើដំណើរត្រូវបានភ្ជាប់ជាមួយជនជាតិ ដើម្បីទទួលបានបទពិសោធន៍ពិតប្រាកដ។ បច្ចុប្បន្នផ្តោតលើ Siem Reap, Tostrip បម្លែងដំណើរ प्रत्येक ទៅជាបទពិសោធន៍មូលដ្ឋានមិនអាចភ្លេចបាន។"
  }
};

/* =====================
   SET LANGUAGE
   ===================== */
function setLanguage(lang, label) {
  // Save language to localStorage
  localStorage.setItem("lang", lang);

  // Update language button label
  const langButton = document.getElementById("currentLang");
  if (langButton) langButton.textContent = label + " ";

  // Update all elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Close language menu
  const menu = document.getElementById("langMenu");
  if (menu) menu.classList.remove("active");
}

/* =====================
   TOGGLE LANGUAGE MENU
   ===================== */
function toggleLangMenu() {
  const menu = document.getElementById("langMenu");
  if (menu) menu.classList.toggle("active");
}

/* =====================
   INITIALIZE LANGUAGE ON PAGE LOAD
   ===================== */
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "en";

  const labels = {
    en: "English",
    fr: "Français",
    km: "ខ្មែរ"
  };

  setLanguage(savedLang, labels[savedLang]);

  // Optional: close menu when clicking outside
  document.addEventListener("click", function(e) {
    const wrapper = document.querySelector(".language-wrapper");
    if (wrapper && !wrapper.contains(e.target)) {
      const menu = document.getElementById("langMenu");
      if (menu) menu.classList.remove("active");
    }
  });
});
