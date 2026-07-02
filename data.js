/* =========================================================
   Content & data — EN / NL
   Personas: collaborator · analyst · challenger
   ========================================================= */

const I18N = {
  en: {
    lang: 'en',
    /* Start */
    eyebrow: 'PBL Persona Test',
    heroLine1: 'Your learning.',
    heroLine2: 'Your way.',
    heroSub: 'Discover your learning style and see how Problem-Based Learning (PBL) helps you grow.',
    features: [
      '5 quick questions',
      'No right or wrong answers',
      'Get your personal PBL persona',
    ],
    startBtn: 'Start the test',
    startNote: 'Takes less than 2 minutes',
    /* Quiz */
    questionWord: 'Question',
    ofWord: 'of',
    back: 'Back',
    /* Result */
    resultKicker: 'Your result',
    resultTitle1: 'Here is your',
    resultTitle2: 'PBL persona',
    tapHint: 'Tap a stone to read each profile',
    bestMatch: 'Best match',
    matchSuffix: 'match',
    youAre: "You're",
    growthTitle: 'How PBL helps you grow',
    seeOthers: 'See the other profiles',
    keyMessage: 'No matter your starting point, PBL helps you grow into a confident, open-minded and independent learner.',
    ctaTitle: 'Want to dive deeper into PBL?',
    ctaText: 'Explore how Problem-Based Learning works at Maastricht University and discover how you grow.',
    ctaBtn: 'Explore PBL at UM',
    ctaUrl: 'https://www.maastrichtuniversity.nl/study/get-to-know-us/engage-problem-based-learning',
    restart: 'Retake the test',
    /* Modal */
    modalTitle: 'Get your PBL infographic',
    modalSub: "Pop in your details and we'll send the infographic straight to your inbox.",
    fName: 'First name',
    fEmail: 'Email address',
    fNamePh: 'e.g. Sophie',
    fEmailPh: 'you@example.com',
    consent: 'Yes, keep me posted about Problem-Based Learning, study programmes and Experience Days at Maastricht University.',
    sendBtn: 'Send me the infographic',
    successTitle: "You're all set!",
    successText: 'Check your inbox — your PBL infographic is on its way. See you at an Experience Day soon!',
    close: 'Close',
  },
  nl: {
    lang: 'nl',
    eyebrow: 'PBL Persona Test',
    heroLine1: 'Jouw leren.',
    heroLine2: 'Jouw manier.',
    heroSub: 'Ontdek jouw leerstijl en zie hoe Probleemgestuurd Onderwijs (PBL) je helpt groeien.',
    features: [
      '5 korte vragen',
      'Geen goede of foute antwoorden',
      'Ontdek jouw PBL-persona',
    ],
    startBtn: 'Start de test',
    startNote: 'Duurt minder dan 2 minuten',
    questionWord: 'Vraag',
    ofWord: 'van',
    back: 'Terug',
    resultKicker: 'Jouw resultaat',
    resultTitle1: 'Dit is jouw',
    resultTitle2: 'PBL-persona',
    tapHint: 'Tik op een steen om elk profiel te lezen',
    bestMatch: 'Beste match',
    matchSuffix: 'match',
    youAre: 'Je bent',
    growthTitle: 'Hoe PBL je helpt groeien',
    seeOthers: 'Bekijk de andere profielen',
    keyMessage: 'Wat je startpunt ook is, PBL helpt je groeien tot een zelfverzekerde, open en zelfstandige leerder.',
    ctaTitle: 'Wil je dieper in PBL duiken?',
    ctaText: 'Ontdek hoe Probleemgestuurd Onderwijs werkt aan de Universiteit Maastricht en hoe jij groeit.',
    ctaBtn: 'Ontdek PBL aan de UM',
    ctaUrl: 'https://www.maastrichtuniversity.nl/study/get-to-know-us/engage-problem-based-learning',
    restart: 'Doe de test opnieuw',
    modalTitle: 'Ontvang jouw PBL-infographic',
    modalSub: 'Vul je gegevens in en we sturen de infographic direct naar je toe.',
    fName: 'Voornaam',
    fEmail: 'E-mailadres',
    fNamePh: 'bijv. Sophie',
    fEmailPh: 'jij@voorbeeld.nl',
    consent: 'Ja, houd me op de hoogte van Probleemgestuurd Onderwijs, opleidingen en Experience Days aan Maastricht University.',
    sendBtn: 'Stuur mij de infographic',
    successTitle: 'Helemaal gelukt!',
    successText: 'Check je inbox — je PBL-infographic is onderweg. Tot snel op een Experience Day!',
    close: 'Sluiten',
  },
};

/* Persona presentation */
const PERSONAS = {
  collaborator: {
    key: 'collaborator',
    color: 'var(--collab)',
    en: { name: 'Collaborator', tag: 'Learns through people' },
    nl: { name: 'Collaborator', tag: 'Leert via mensen' },
  },
  analyst: {
    key: 'analyst',
    color: 'var(--analyst)',
    en: { name: 'Analyst', tag: 'Learns through structure' },
    nl: { name: 'Analyst', tag: 'Leert via structuur' },
  },
  challenger: {
    key: 'challenger',
    color: 'var(--challenger)',
    en: { name: 'Challenger', tag: 'Learns by questioning' },
    nl: { name: 'Challenger', tag: 'Leert door te bevragen' },
  },
};

/* SVG icons per persona (white, currentColor) */
const ICONS = {
  collaborator: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  analyst: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  challenger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',
};

/* Result narrative text — split into paragraphs.
   {pct} is replaced with the match percentage. */
const RESULT_TEXT = {
  collaborator: {
    en: {
      intro: "You have answered all the questions, nice work! Your answers suggest you are {pct}% a Collaborator.",
      body: [
        "You thrive when you work with others. Teamwork, discussions, and sharing ideas give you energy and help you understand things better. You feel comfortable in group settings, communicate clearly, and are socially engaged. You learn best when you can talk things through and get feedback.",
        "That said, there are a couple of things to watch out for. You sometimes depend too much on others or find it harder to structure your independent preparation. That's where Problem-Based Learning (PBL) will help you grow.",
      ],
      grow: "Within a PBL setting, you'll develop your critical thinking, self-discipline, and independence. If you prepare on your own before tutorials, you'll contribute more actively to group discussions. You'll also learn to take control of your learning goals and overall progress.",
    },
    nl: {
      intro: "Je hebt alle vragen beantwoord, goed bezig! Op basis van je antwoorden ben je {pct}% een Collaborator.",
      body: [
        "Je leert het meest door actief in gesprek te gaan en samen te werken met anderen. Je vindt het leuk om ideeën te delen en te leren van je medestudenten. Je bent goed in communiceren, sociaal betrokken en voelt je op je gemak in groepswerk. Gesprekken voeren en feedback geven en ontvangen helpen jou bij het leren.",
        "Aan de andere kant zijn er een paar dingen om op te letten. Je leunt soms op anderen en vindt het lastig om je werk zelfstandig voor te bereiden. Probleemgestuurd Onderwijs (PBL) kan je hierbij helpen.",
      ],
      grow: "In een PBL-omgeving ontwikkel je je kritisch denkvermogen, zelfdiscipline en eigen initiatief. Door je individueel voor te bereiden op tutorials kun je actiever bijdragen aan discussies. Ook leer je om meer regie te nemen over je leerdoelen en je leerproces.",
    },
  },
  analyst: {
    en: {
      intro: "Amazing, you have gotten through the questions! Your answers suggest you are {pct}% an Analyst.",
      body: [
        "It means you prefer structure and clarity, and you like to prepare before speaking. You learn best by reading manuals or instructions, and you use your strong critical thinking skills to understand things deeply. You're well-organised, reflective, and comfortable working independently.",
        "At the same time, there are a few things to keep in mind. You're hesitant to speak up in groups, feel uncomfortable with ambiguity, or prefer clear answers over open discussion. That's where Problem-Based Learning (PBL) will help you grow.",
      ],
      grow: "Within a PBL setting, you'll learn to open up, build confidence, and feel more comfortable speaking in groups. By participating in a safe and supportive discussion environment, you'll strengthen these skills and get more out of working with others.",
    },
    nl: {
      intro: "Top, je hebt alle vragen beantwoord! Op basis van je antwoorden ben je {pct}% een Analyst.",
      body: [
        "Het betekent dat je een voorkeur hebt voor structuur en duidelijkheid, en dat je graag goed voorbereid bent voordat je iets zegt. Je leert het best door theorie te bestuderen, en je gebruikt je sterke analytische en kritische denkvaardigheden om dingen echt goed te begrijpen. Je bent goed georganiseerd, reflectief en voelt je prettig wanneer je zelfstandig werkt.",
        "Tegelijkertijd zijn er een paar aandachtspunten. Je vindt het lastig om actief mee te doen in groepsgesprekken, voelt je minder prettig bij onduidelijkheid, of je geeft de voorkeur aan duidelijke antwoorden boven open discussie. Probleemgestuurd Onderwijs (PBL) helpt je om hierin te groeien.",
      ],
      grow: "In een PBL-omgeving leer je je meer te uiten, bouw je aan je zelfvertrouwen en voel je je steeds comfortabeler in groepsgesprekken. Door deel te nemen aan een veilige discussieomgeving versterk je deze vaardigheden en haal je meer uit samenwerking met anderen.",
    },
  },
  challenger: {
    en: {
      intro: "Nice, you're done with the questions! Your answers suggest you are {pct}% a Challenger.",
      body: [
        "You like to question ideas and look at problems from different angles. You're curious and critical, and you're not afraid to ask “why?”. You don't accept ideas straight away. In discussions, you bring new perspectives and help the group dig deeper into problems by exploring alternative solutions. You encourage others to look at things differently and think beyond the obvious.",
        "However, it is important to be aware of a few things. You sometimes challenge ideas very directly, which others can find difficult. You focus more on critiquing ideas than building on them, and it can sometimes be tricky to balance questioning with listening to other perspectives. That's where Problem-Based Learning (PBL) will help you grow.",
      ],
      grow: "Within a PBL setting, you'll channel your critical mindset by actively listening to others, even when you disagree, and by accepting that not every question has a clear answer, learning to work with uncertainty. You'll also connect your curiosity to deeper academic exploration and reflect on discussions while learning from feedback from your peers.",
    },
    nl: {
      intro: "Nice! Je hebt alle vragen afgerond. Op basis van je antwoorden ben je {pct}% een Challenger.",
      body: [
        "Dat betekent dat je graag ideeën ter discussie stelt en problemen vanuit verschillende invalshoeken bekijkt. Je bent nieuwsgierig en kritisch, en je bent niet bang om “waarom?” vragen te stellen. Je accepteert ideeën niet meteen. In gesprekken breng je nieuwe perspectieven in en help je anderen om dieper na te denken door aannames ter discussie te stellen en alternatieve oplossingen te verkennen.",
        "Er zijn wel een paar dingen om op te letten. Je daagt ideeën soms heel direct uit, wat voor anderen lastig kan zijn. Je richt je soms meer op het bekritiseren van ideeën dan op het verder uitbouwen ervan, en het kan lastig zijn om een balans te vinden tussen vragen stellen en luisteren naar anderen. Probleemgestuurd Onderwijs (PBL) helpt je om hierin te groeien.",
      ],
      grow: "In een PBL-omgeving leer je actief te luisteren naar anderen, zelfs als je het oneens bent, en te accepteren dat niet elke vraag een duidelijk antwoord heeft. Hierdoor leer je omgaan met onzekerheid. Daarnaast gebruik je je nieuwsgierigheid om dieper op academische stof in te gaan en reflecteer je op discussies, waarbij je leert van feedback van je medestudenten.",
    },
  },
};

/* Questions — pillar shown as small label. Each option maps to a persona. */
const QUESTIONS = [
  {
    pillar: { en: 'Community', nl: 'Samen' },
    q: {
      en: 'What do you usually do in group work?',
      nl: 'Wat doe je meestal tijdens groepswerk?',
    },
    options: [
      { p: 'collaborator', en: 'I bring different ideas together', nl: 'Ik breng verschillende ideeën samen' },
      { p: 'analyst',      en: 'I listen and take notes',          nl: 'Ik luister en maak aantekeningen' },
      { p: 'challenger',   en: 'I am the one asking questions',    nl: 'Ik ben degene die vragen stelt' },
    ],
  },
  {
    pillar: { en: 'Discovery', nl: 'Ontdekken' },
    q: {
      en: 'The course material is difficult. What do you do?',
      nl: 'De lesstof is moeilijk. Wat doe je?',
    },
    options: [
      { p: 'challenger',   en: 'I find examples that make it clear', nl: 'Ik zoek voorbeelden die het duidelijk maken' },
      { p: 'analyst',      en: 'I deep-dive into research myself',   nl: 'Ik duik zelf de diepte in met onderzoek' },
      { p: 'collaborator', en: 'I ask others (teachers, students)',  nl: 'Ik vraag anderen (docenten, studenten)' },
    ],
  },
  {
    pillar: { en: 'Active engagement', nl: 'Betrokkenheid' },
    q: {
      en: "You have a project with a friend, but they aren't doing their part. What do you do?",
      nl: 'Je hebt een project met een vriend(in), maar die doet zijn/haar deel niet. Wat doe je?',
    },
    options: [
      { p: 'collaborator', en: 'I talk to my friend and try to convince them to work harder', nl: 'Ik praat met mijn vriend(in) en probeer ze te overtuigen harder te werken' },
      { p: 'challenger',   en: 'I raise the issue with the teacher', nl: 'Ik kaart het probleem aan bij de docent' },
      { p: 'analyst',      en: 'I do their work myself',             nl: 'Ik doe hun werk zelf' },
    ],
  },
  {
    pillar: { en: 'Discovery', nl: 'Ontdekken' },
    q: {
      en: 'How do you prepare for your exams?',
      nl: 'Hoe bereid je je voor op je tentamens?',
    },
    options: [
      { p: 'collaborator', en: 'I discuss the topics with peers',     nl: 'Ik bespreek de onderwerpen met medestudenten' },
      { p: 'analyst',      en: 'I study the course materials alone',   nl: 'Ik bestudeer de lesstof alleen' },
      { p: 'challenger',   en: 'I trust I learnt enough in class',     nl: 'Ik vertrouw erop dat ik genoeg heb geleerd in de les' },
    ],
  },
  {
    pillar: { en: 'Impact', nl: 'Impact' },
    q: {
      en: 'What excites you most about studying at university?',
      nl: 'Wat vind je het spannendst aan studeren aan een universiteit?',
    },
    options: [
      { p: 'collaborator', en: 'Getting to know new people',           nl: 'Nieuwe mensen leren kennen' },
      { p: 'analyst',      en: "Learning about things I'm interested in", nl: 'Leren over dingen die me interesseren' },
      { p: 'challenger',   en: 'Starting a new chapter',               nl: 'Een nieuw hoofdstuk beginnen' },
    ],
  },
];
