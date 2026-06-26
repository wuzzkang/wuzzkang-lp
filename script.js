import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://pggaknycbpjvsmmofnln.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZ2FrbnljYnBqdnNtbW9mbmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5MDU3NjksImV4cCI6MjA5NzQ4MTc2OX0.p-UpXLmhKrHV2l2wHYO7YNDv8OftW2MDJp21-pKJVEU'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// RENDERING COMPONENTS (TEMPLATE LITERALS)
// ==========================================

const renderHeader = (data) => {
    if (!data) return '';
    const logoUrl = data.logo_url || '';
    const title = data.title || data.logo || 'Toko';

    return `
        <header class="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-slate-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-center md:justify-start items-center py-4">
                    <div class="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity">
                        ${logoUrl && logoUrl !== 'https://via.placeholder.com/150' ? 
                            `<img src="${logoUrl}" alt="${title}" class="h-12 w-12 rounded-full object-cover shadow-sm border-2 border-primary">` : 
                            `<div class="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shadow-sm">${title.charAt(0).toUpperCase()}</div>`
                        }
                        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">${title}</h1>
                    </div>
                </div>
            </div>
        </header>
    `;
};

const renderHero = (section) => {
    if (!section) return '';
    // Adaptasi struktur JSON: mendukung section.heading ATAU section.data.title
    const heading = section.heading || (section.data && section.data.title) || '';
    const subheading = section.subheading || (section.data && section.data.subtitle) || '';
    const ctaText = section.cta_text || (section.data && section.data.cta_text) || '';
    const ctaLink = section.cta_link || (section.data && section.data.cta_link) || '#';

    return `
        <section class="relative bg-gradient-to-b from-slate-50 to-white py-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
            <!-- Dekorasi latar belakang -->
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
            
            <div class="max-w-3xl mx-auto fade-in">
                <h2 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                    ${heading}
                </h2>
                <p class="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                    ${subheading}
                </p>
                ${ctaText ? `
                    <a href="${ctaLink}" class="inline-block bg-primary text-white font-semibold text-lg px-8 py-4 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 hover:bg-opacity-90 transition-all duration-300">
                        ${ctaText}
                    </a>
                ` : ''}
            </div>
        </section>
    `;
};

const renderFeatures = (data) => {
    if (!data || !data.items || data.items.length === 0) return '';
    
    const itemsHtml = data.items.map(item => `
        <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div class="text-5xl mb-6 bg-primary/10 w-20 h-20 flex items-center justify-center rounded-2xl">${item.icon || '✨'}</div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">${item.title || ''}</h3>
            <p class="text-slate-600 leading-relaxed">${item.desc || ''}</p>
        </div>
    `).join('');

    return `
        <section class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto fade-in" style="animation-delay: 0.1s;">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${itemsHtml}
            </div>
        </section>
    `;
};

const renderFooter = (data) => {
    if (!data) return '';
    const text = data.text || data.copyright || '';
    return `
        <footer class="bg-slate-900 py-10 px-4 mt-auto">
            <div class="max-w-7xl mx-auto text-center">
                <p class="text-slate-400 font-medium">${text}</p>
            </div>
        </footer>
    `;
};

const renderError = (message) => {
    return `
        <div class="min-h-[70vh] flex items-center justify-center px-4 fade-in">
            <div class="bg-white border border-red-100 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl shadow-red-500/10">
                <div class="text-6xl mb-6">😕</div>
                <h3 class="text-2xl font-bold text-slate-900 mb-3">Oops! Terjadi Masalah</h3>
                <p class="text-slate-500 mb-8 leading-relaxed">${message}</p>
                <button onclick="window.location.reload()" class="bg-slate-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-slate-800 transition-colors">
                    Coba Lagi
                </button>
            </div>
        </div>
    `;
};

// ==========================================
// CORE APP ENGINE
// ==========================================

const renderPage = (pageConfig) => {
    const appEl = document.getElementById('app');
    
    const templateType = pageConfig.meta?.template_type || 'store';
    
    if (templateType === 'wedding') {
        const urlParams = new URLSearchParams(window.location.search);
        const guestName = urlParams.get('to') || urlParams.get('recipient') || 'Tamu Undangan';
        
        // 1. Dynamic Font Pairing for Wedding (Serif + Cursive)
        if (!document.getElementById('wedding-fonts')) {
            const link = document.createElement('link');
            link.id = 'wedding-fonts';
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poppins:wght@300;400;500;600;700&display=swap';
            document.head.appendChild(link);
        }
        
        // 2. Set dynamic theme colors based on theme choice
        const themeColors = {
            'sage-green': { primary: '#5A7C64', secondary: '#E8EFE9', text: '#2F3E33', bg: '#F4F7F4' },
            'rose-gold': { primary: '#B76E79', secondary: '#F9ECEF', text: '#4E3639', bg: '#FDF8F9' },
            'elegant-navy': { primary: '#1D2D44', secondary: '#E0E5EC', text: '#0D131A', bg: '#F8F9FA' },
            'classic-gold': { primary: '#C5A880', secondary: '#F5EFE6', text: '#3E3427', bg: '#FCFBF9' },
            'rustic-brown': { primary: '#8B5A2B', secondary: '#F2E6D9', text: '#3D2813', bg: '#FAF6F0' },
        };
        
        const themeName = pageConfig.meta?.theme || 'classic-gold';
        const colors = themeColors[themeName] || themeColors['classic-gold'];
        
        // Inject style for fonts and colors
        const style = document.createElement('style');
        style.innerHTML = `
            .wedding-font-serif { font-family: 'Playfair Display', serif !important; }
            .wedding-font-cursive { font-family: 'Great Vibes', cursive !important; }
            .wedding-font-sans { font-family: 'Poppins', sans-serif !important; }
            .bg-wedding-primary { background-color: ${colors.primary} !important; }
            .text-wedding-primary { color: ${colors.primary} !important; }
            .border-wedding-primary { border-color: ${colors.primary} !important; }
            .bg-wedding-secondary { background-color: ${colors.secondary} !important; }
        `;
        document.head.appendChild(style);
        
        // Apply page style
        document.body.style.backgroundColor = colors.bg;
        document.body.style.color = colors.text;
        document.body.className = 'wedding-font-sans transition-colors duration-300 min-h-screen flex flex-col';
        
        // Render SEO title
        const metaTitle = pageConfig.meta?.title || 'Undangan Pernikahan';
        document.title = metaTitle;
        updateMetaTag('property', 'og:title', metaTitle);
        
        // Build Wedding HTML
        const content = pageConfig.content || {};
        const groom = content.groom || {};
        const bride = content.bride || {};
        const akad = content.akad || {};
        const resepsi = content.resepsi || {};
        const gift = content.gift || {};
        const quote = content.quote || 'Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.';
        
        let giftHtml = '';
        if (gift && gift.bank_name && gift.account_number) {
            giftHtml = `
                <div class="mt-12 bg-white rounded-3xl p-8 max-w-md mx-auto shadow-sm border border-slate-100 text-center">
                    <span class="text-3xl">🎁</span>
                    <h3 class="wedding-font-serif text-2xl font-bold mt-2 mb-4">Kado Digital</h3>
                    <p class="text-sm text-slate-500 mb-4">Bagi yang ingin mengirimkan hadiah kasih, dapat ditransfer melalui rekening berikut:</p>
                    <div class="bg-wedding-secondary/50 rounded-2xl p-4 inline-block w-full">
                        <div class="font-bold text-sm text-slate-500">${gift.bank_name}</div>
                        <div class="text-lg font-mono font-bold text-wedding-primary my-1 select-all">${gift.account_number}</div>
                        <div class="text-xs text-slate-600 font-medium">a/n ${gift.account_holder || ''}</div>
                    </div>
                </div>
            `;
        }

        const weddingHtml = `
            <!-- Cover / Opening Card -->
            <section class="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden bg-wedding-secondary/20">
                <div class="absolute inset-0 opacity-10 pointer-events-none bg-cover bg-center" style="background-image: url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80');"></div>
                <div class="max-w-2xl mx-auto z-10 py-12">
                    <p class="wedding-font-serif uppercase tracking-[0.25em] text-xs font-semibold text-wedding-primary mb-4">Walimatul 'Ursy</p>
                    <h1 class="wedding-font-cursive text-7xl md:text-8xl text-wedding-primary my-6">${groom.nickname || 'Groom'} & ${bride.nickname || 'Bride'}</h1>
                    <p class="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-12">Kami mengundang Anda untuk merayakan pernikahan kami.</p>
                    
                    <div class="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-md inline-block max-w-sm border border-wedding-primary/10">
                        <p class="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
                        <h3 class="wedding-font-serif text-xl font-bold text-slate-800">${guestName}</h3>
                        <p class="text-[10px] text-slate-400 mt-2">*Mohon maaf bila ada kesalahan penulisan nama/gelar</p>
                    </div>
                </div>
            </section>

            <!-- Bride and Groom Section -->
            <section id="bride-groom" class="py-24 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
                <div class="wedding-font-serif italic text-lg text-slate-500 mb-8 max-w-xl mx-auto px-4">
                    "${quote}"
                </div>
                
                <h2 class="wedding-font-cursive text-5xl text-wedding-primary mt-12 mb-16">Kedua Mempelai</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
                    <!-- Groom -->
                    <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div class="h-20 w-20 rounded-full bg-wedding-secondary text-wedding-primary text-4xl flex items-center justify-center mx-auto mb-6">🤵</div>
                        <h3 class="wedding-font-serif text-2xl font-bold text-slate-900">${groom.name || ''}</h3>
                        <p class="text-xs text-slate-500 mt-3 leading-relaxed">
                            Putra tercinta dari:<br>
                            <span class="font-bold text-slate-700">${groom.father || ''}</span> & <span class="font-bold text-slate-700">${groom.mother || ''}</span>
                        </p>
                    </div>
                    
                    <!-- Bride -->
                    <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div class="h-20 w-20 rounded-full bg-wedding-secondary text-wedding-primary text-4xl flex items-center justify-center mx-auto mb-6">👰</div>
                        <h3 class="wedding-font-serif text-2xl font-bold text-slate-900">${bride.name || ''}</h3>
                        <p class="text-xs text-slate-500 mt-3 leading-relaxed">
                            Putri tercinta dari:<br>
                            <span class="font-bold text-slate-700">${bride.father || ''}</span> & <span class="font-bold text-slate-700">${bride.mother || ''}</span>
                        </p>
                    </div>
                </div>
            </section>

            <!-- Events Section -->
            <section id="events" class="py-20 px-4 bg-wedding-secondary/10">
                <div class="max-w-4xl mx-auto text-center">
                    <h2 class="wedding-font-cursive text-5xl text-wedding-primary mb-16">Acara & Informasi</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Akad Nikah -->
                        <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center flex flex-col justify-between">
                            <div>
                                <span class="text-3xl">💍</span>
                                <h3 class="wedding-font-serif text-2xl font-bold mt-2 mb-4">Akad Nikah</h3>
                                <p class="text-sm font-semibold text-slate-600">${akad.date || ''}</p>
                                <p class="text-xs text-slate-500 mt-1">${akad.time || ''}</p>
                                <p class="text-sm font-medium text-slate-700 mt-6 max-w-xs mx-auto">${akad.location || ''}</p>
                            </div>
                            ${akad.maps_url ? `
                                <a href="${akad.maps_url}" target="_blank" rel="noopener noreferrer" class="mt-8 inline-block bg-wedding-primary text-white text-xs font-semibold px-6 py-3 rounded-full hover:opacity-95 transition-opacity">
                                    📍 Buka Google Maps
                                </a>
                            ` : ''}
                        </div>
                        
                        <!-- Resepsi -->
                        <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center flex flex-col justify-between">
                            <div>
                                <span class="text-3xl">🎉</span>
                                <h3 class="wedding-font-serif text-2xl font-bold mt-2 mb-4">Resepsi</h3>
                                <p class="text-sm font-semibold text-slate-600">${resepsi.date || ''}</p>
                                <p class="text-xs text-slate-500 mt-1">${resepsi.time || ''}</p>
                                <p class="text-sm font-medium text-slate-700 mt-6 max-w-xs mx-auto">${resepsi.location || ''}</p>
                            </div>
                            ${resepsi.maps_url ? `
                                <a href="${resepsi.maps_url}" target="_blank" rel="noopener noreferrer" class="mt-8 inline-block bg-wedding-primary text-white text-xs font-semibold px-6 py-3 rounded-full hover:opacity-95 transition-opacity">
                                    📍 Buka Google Maps
                                </a>
                            ` : ''}
                        </div>
                    </div>

                    ${giftHtml}
                </div>
            </section>

            <!-- Footer -->
            <footer class="bg-slate-900 py-16 text-center text-slate-400 mt-auto">
                <div class="max-w-md mx-auto px-4">
                    <p class="wedding-font-cursive text-4xl text-wedding-primary mb-3">Terima Kasih</p>
                    <p class="text-xs leading-relaxed text-slate-500">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.</p>
                    <div class="h-px bg-slate-800 my-8"></div>
                    <p class="text-[10px] text-slate-600">© ${new Date().getFullYear()} ${groom.nickname || 'Groom'} & ${bride.nickname || 'Bride'} Wedding Invitation. Created by WuzzKang.</p>
                </div>
            </footer>
        `;
        
        appEl.innerHTML = weddingHtml;
        return;
    }

    // 1. Update Dinamis Tailwind Config (Theme Color) - Default Store
    const themeColors = {
        light: '#3b82f6',       // Blue
        dark: '#1f2937',        // Slate
        corporate: '#4b6bfb',   // Indigo
        retro: '#ef9fbc',       // Pink
        cyberpunk: '#ff007f',   // Neon Pink
    };
    
    const themeName = pageConfig.meta?.theme || 'light';
    const colorHex = themeColors[themeName] || '#3b82f6';
    
    // Update CSS variable (untuk spinner)
    document.documentElement.style.setProperty('--primary-color', colorHex);
    // Update Meta Theme Color
    updateMetaTag('name', 'theme-color', colorHex);
    
    // Inject script untuk meng-override konfigurasi warna primer Tailwind di runtime
    const style = document.createElement('style');
    style.innerHTML = `
        .bg-primary { background-color: ${colorHex} !important; }
        .text-primary { color: ${colorHex} !important; }
        .border-primary { border-color: ${colorHex} !important; }
        .shadow-primary\\/30 { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px ${colorHex}80 !important; }
        .bg-primary\\/10 { background-color: ${colorHex}1A !important; }
        .bg-primary\\/5 { background-color: ${colorHex}0D !important; }
    `;
    document.head.appendChild(style);
    
    // Set dark theme properties if dark/cyberpunk is selected
    const isDarkTheme = ['dark', 'cyberpunk'].includes(themeName);
    if (isDarkTheme) {
        document.body.classList.remove('text-slate-800', 'bg-slate-50');
        document.body.classList.add('text-slate-100', 'bg-slate-950');
    } else {
        document.body.classList.remove('text-slate-100', 'bg-slate-950');
        document.body.classList.add('text-slate-800', 'bg-slate-50');
    }
    
    // 2. Update SEO Meta Tags
    const metaTitle = pageConfig.meta?.title || 'WuzzKang Landing Page';
    const metaDesc = pageConfig.content?.hero?.subheading || '';
    
    document.title = metaTitle;
    updateMetaTag('property', 'og:title', metaTitle);
    if (metaDesc) updateMetaTag('property', 'og:description', metaDesc);
    
    // 3. Merakit HTML Berdasarkan Struktur JSON PageSchema
    let finalHtml = '';
    
    const headerData = { title: metaTitle };
    finalHtml += renderHeader(headerData);
    
    finalHtml += '<main class="flex-grow">';
    
    if (pageConfig.content && pageConfig.content.hero) {
        const heroSection = {
            heading: pageConfig.content.hero.heading,
            subheading: pageConfig.content.hero.subheading,
            cta_text: pageConfig.content.hero.cta_text,
            cta_link: '#contact'
        };
        finalHtml += renderHero(heroSection);
    }
    
    if (pageConfig.features && Array.isArray(pageConfig.features)) {
        const featuresData = { items: pageConfig.features };
        finalHtml += renderFeatures(featuresData);
    }
    
    finalHtml += '</main>';
    
    const footerData = { text: `© ${new Date().getFullYear()} ${metaTitle}. All Rights Reserved.` };
    finalHtml += renderFooter(footerData);
    
    // 4. Suntik HTML ke dalam App Container
    appEl.innerHTML = finalHtml;
};

document.addEventListener('DOMContentLoaded', async () => {
    const loadingEl = document.getElementById('loading');
    const appEl = document.getElementById('app');
    
    try {
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;

        const urlParams = new URLSearchParams(window.location.search);
        let queryField = '';
        let queryValue = '';

        if (urlParams.has('slug')) {
            queryField = 'slug';
            queryValue = urlParams.get('slug');
        } else if (hostname.includes('github.io')) {
            const segments = pathname.split('/').filter(Boolean);
            queryField = 'slug';
            // Hindari menggunakan nama repository (wuzzkang-lp) sebagai slug jika tidak ada segment lain
            if (segments.length > 1) {
                queryValue = segments[1]; // misal wuzzkang.github.io/wuzzkang-lp/slug-name
            } else if (segments.length === 1 && segments[0] !== 'wuzzkang-lp') {
                queryValue = segments[0]; // misal wuzzkang.github.io/slug-name (jika custom domain/user page)
            } else {
                queryValue = '';
            }
        } else {
            queryField = 'custom_domain';
            queryValue = hostname;
        }

        // Mode Testing Lokal (localhost)
        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('bmstaging.id')) {
            if (!queryValue) {
                throw new Error("Tambahkan parameter ?slug=nama-toko di URL untuk testing lokal.");
            }
        }

        if (!queryValue) {
            throw new Error("Slug landing page tidak ditemukan dalam URL.");
        }

        // Ambil data dari tabel projects di Supabase
        const { data: project, error } = await supabase
            .from('projects')
            .select('*')
            .eq(queryField, queryValue)
            .eq('status', 'deployed')
            .single();

        if (error || !project) {
            console.error("Supabase Error:", error);
            throw new Error("Landing page tidak ditemukan atau belum dipublikasikan.");
        }

        // Defensive Coding: Pastikan JSON ada
        if (!project.page_data) {
            console.error('Data JSON kosong!');
            throw new Error("Data landing page kosong.");
        }

        // Pastikan JSON diparsing jika ia masih string
        let pageConfig = project.page_data;
        if (typeof pageConfig === 'string') {
            try {
                pageConfig = JSON.parse(pageConfig);
            } catch(e) {
                console.error("Gagal mem-parsing page_data:", e);
                throw new Error("Format data JSON tidak valid.");
            }
        }

        // Inject FB Pixel jika ada
        const pixelId = pageConfig.meta?.facebook_pixel_id;
        if (pixelId) {
            injectFacebookPixel(pixelId);
        }

        // Render keseluruhan komponen UI murni berdasarkan JSON
        renderPage(pageConfig);

    } catch (err) {
        console.error(err);
        appEl.innerHTML = renderError(err.message);
    } finally {
        // Hilangkan Loading Spinner dengan transisi halus
        loadingEl.style.opacity = '0';
        setTimeout(() => {
            loadingEl.style.display = 'none';
        }, 300);
    }
});

// Helper Functions
function updateMetaTag(attribute, attributeValue, contentValue) {
    let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
    if (element) {
        element.setAttribute('content', contentValue);
    } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, attributeValue);
        element.setAttribute('content', contentValue);
        document.head.appendChild(element);
    }
}

function injectFacebookPixel(pixelId) {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    fbq('init', pixelId);
    fbq('track', 'PageView');

    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = "1";
    img.width = "1";
    img.style.display = "none";
    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.head.appendChild(noscript);
}
