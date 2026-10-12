const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const pillBtn = `                  </button>

                  <div className="flex items-center gap-0.5 rounded-full p-1 mt-6" role="group" aria-label="Invitation language" style={{ background: "rgba(255, 253, 246, 0.9)", border: "1px solid rgba(185, 138, 47, 0.45)", boxShadow: "0 10px 24px -12px rgba(120,86,30,0.5)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
                    <button onClick={() => setLang('si')} type="button" aria-pressed={lang === 'si'} className="rounded-full px-3 py-1 text-[0.78rem] font-semibold transition-colors" style={lang === 'si' ? { fontFamily: "'Abhaya Libre', serif", background: "linear-gradient(135deg, #B98A2F, #8C6420)", color: "#FDF8EC" } : { fontFamily: "'Abhaya Libre', serif", background: "transparent", color: "#8C6420" }}>සිං</button>
                    <button onClick={() => setLang('en')} type="button" aria-pressed={lang === 'en'} className="rounded-full px-3 py-1 text-[0.78rem] font-semibold transition-colors" style={lang === 'en' ? { fontFamily: "'Montserrat', sans-serif", background: "linear-gradient(135deg, #B98A2F, #8C6420)", color: "#FDF8EC" } : { fontFamily: "'Montserrat', sans-serif", background: "transparent", color: "#8C6420" }}>EN</button>
                  </div>
                </div>`;

code = code.replace(/<\/button>\s*<\/div>\s*<\/>\s*\)}/s, pillBtn + '\n              </>\n            )}');

fs.writeFileSync('src/App.tsx', code);
console.log("Done");
