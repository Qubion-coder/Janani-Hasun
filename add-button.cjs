const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const introBtn = `                </button>

                <button
                  onClick={() => setLang(l => l === 'si' ? 'en' : 'si')}
                  className="absolute left-4 top-4 z-[110] grid h-11 px-4 place-items-center rounded-full transition-transform duration-200 hover:-translate-y-0.5 active:scale-90 sm:left-6 sm:top-6 font-bold"
                  style={{
                    background: "linear-gradient(135deg, rgb(122, 31, 26), rgb(92, 20, 15))",
                    color: "rgb(232, 216, 164)",
                    border: "1px solid rgba(92, 20, 15, 0.55)",
                    boxShadow: "rgba(142, 116, 39, 0.6) 0px 14px 28px -14px"
                  }}
                >
                  {lang === 'si' ? 'EN' : 'සිංහල'}
                </button>`;

code = code.replace(/<\/button>\s*<div className="relative z-\[105\]/g, introBtn + '\n\n                <div className="relative z-[105]');

const openBtn = `          >
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setLang(l => l === 'si' ? 'en' : 'si')}
              className="fixed top-6 left-6 z-50 bg-white/80 backdrop-blur-md px-4 py-3 rounded-full shadow-lg text-[#8f7322] hover:bg-emerald-50 transition-colors font-bold tracking-widest text-[11px]"
            >
              {lang === 'si' ? 'EN' : 'සිංහල'}
            </motion.button>
            <motion.button`;

code = code.replace(/          >\s*<motion\.button/g, openBtn);

fs.writeFileSync('src/App.tsx', code);
console.log("Done");
