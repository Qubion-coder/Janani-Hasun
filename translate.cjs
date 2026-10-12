const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regexReplacements = [
    [/ඒකනායක මහතා සහ\s+මහත්මිය\s+යන දෙපළගේ\s+ආදරණීය දියණිය/g, "{lang === 'si' ? `ඒකනායක මහතා සහ\n                      මහත්මිය\n                      යන දෙපළගේ\n                      ආදරණීය දියණිය` : `Loving daughter of\n                      Mr. & Mrs.\n                      Ekanayake`}"],
    [/බණ්ඩාර මහතා සහ\s+මහත්මිය\s+යන දෙපළගේ\s+ආදරණීය පුත්‍රයා/g, "{lang === 'si' ? `බණ්ඩාර මහතා සහ\n                      මහත්මිය\n                      යන දෙපළගේ\n                      ආදරණීය පුත්‍රයා` : `Loving son of\n                      Mr. & Mrs.\n                      Bandara`}"],
    [/>\s*චාරිත්‍රානුකූලව අතිනත ගැනීමේ ප්‍රීතිය නිමිත්තෙන්\s*<\/p>/g, ">\n                  {lang === 'si' ? 'චාරිත්‍රානුකූලව අතිනත ගැනීමේ ප්‍රීතිය නිමිත්තෙන්' : 'On the joyous occasion of their marriage'}\n                </p>"],
    [/>\s*ජනවාරි\s*<\/span>/g, ">\n                      {lang === 'si' ? 'ජනවාරි' : 'January'}\n                    </span>"],
    [/>\s*බදාදා\s*<\/span>/g, ">\n                      {lang === 'si' ? 'බදාදා' : 'Wednesday'}\n                    </span>"],
    [/>\s*උදෑසන සිට දහවල් 12:00 දක්වා \(උදෑසන ආහාර වේලක් ද පිරිනැමේ\)\s*<\/div>/g, ">\n                    {lang === 'si' ? 'උදෑසන සිට දහවල් 12:00 දක්වා (උදෑසන ආහාර වේලක් ද පිරිනැමේ)' : 'From morning until 12:00 PM (Breakfast will be served)'}\n                  </div>"],
    [/>\s*හෝටල් පරිශ්‍රයේ දී පැවැත්වෙන මංගල උත්සවයට\s*<\/p>/g, ">\n                    {lang === 'si' ? 'හෝටල් පරිශ්‍රයේ දී පැවැත්වෙන මංගල උත්සවයට' : 'to the wedding reception held at the hotel premises'}\n                  </p>"],
    [/>\s*ඔබට අපි ගෞරවයෙන් ආරාධනා කරන්නෙමු.\s*<\/p>/g, ">\n                    {lang === 'si' ? 'ඔබට අපි ගෞරවයෙන් ආරාධනා කරන්නෙමු.' : 'We respectfully invite you.'}\n                  </p>"],
    [/>\s*අපේ සුබ දවස උදා වීමට...\s*<\/h2>/g, ">\n                  {lang === 'si' ? 'අපේ සුබ දවස උදා වීමට...' : 'Until our special day...'}\n                </h2>"],
    [/>\s*2027 ජනවාරි 20 බදාදා\s*<\/p>/g, ">\n                  {lang === 'si' ? '2027 ජනවාරි 20 බදාදා' : 'Wednesday, January 20, 2027'}\n                </p>"],
    [/>\s*උත්සව විස්තර\s*<\/h2>/g, ">\n                  {lang === 'si' ? 'උත්සව විස්තර' : 'Event Details'}\n                </h2>"],
    [/>\s*මංගල උත්සවය සහ පෝරුවේ චාරිත්‍රය\s*<\/h3>/g, ">\n                    {lang === 'si' ? 'මංගල උත්සවය සහ පෝරුවේ චාරිත්‍රය' : 'Wedding Reception & Poruwa Ceremony'}\n                  </h3>"],
    [/>\s*ඔබගේ පැමිණීම අපට මහත් සතුටකි\. කරුණාකර කලින් දන්වන්න\.\s*<\/p>/g, ">\n                  {lang === 'si' ? 'ඔබගේ පැමිණීම අපට මහත් සතුටකි. කරුණාකර කලින් දන්වන්න.' : 'Your presence is our greatest joy. Please let us know in advance.'}\n                </p>"],
    [/>\s*ඔබගේ පැමිණීම 2027 ජනවාරි 10 දිනට පෙර කරුණාකර දන්වන්න\s*<\/p>/g, ">\n                  {lang === 'si' ? 'ඔබගේ පැමිණීම 2027 ජනවාරි 10 දිනට පෙර කරුණාකර දන්වන්න' : 'Please RSVP before January 10, 2027'}\n                </p>"],
    [/>\s*සතුටින් සහභාගි වෙමි\s*<\/button>/g, ">\n                        {lang === 'si' ? 'සතුටින් සහභාගි වෙමි' : 'Joyfully Attending'}\n                      </button>"],
    [/>\s*සහභාගි විය නොහැක\s*<\/button>/g, ">\n                        {lang === 'si' ? 'සහභාගි විය නොහැක' : 'Unable to Attend'}\n                      </button>"]
];

for (const [search, replace] of regexReplacements) {
    if (code.match(search)) {
        code = code.replace(search, replace);
    } else {
        console.log("NOT FOUND REGEX:", search);
    }
}

fs.writeFileSync('src/App.tsx', code);
console.log("Done");
