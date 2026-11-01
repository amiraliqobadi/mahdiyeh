export const site = {
    name: "Mahdiyeh Valian",
    role: "Data Scientist",
    location: "Tehran, Iran",
    email: "mahdiyeh.valian@gmail.com",
    phone: "+98 911 224 5580",
    linkedin: "https://www.linkedin.com/in/mahdiyeh-valian/", // TODO: paste your LinkedIn profile URL
    availability: "Open to data science & research roles",
    summary:
        "Entry-level data scientist with a strong commitment to learning and developing skills in machine learning and deep learning.",
};

export const nav = [
    { id: "about", label: "About" },
    { id: "research", label: "Research" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
];

export const heroStats = [
    { value: 3.19, decimals: 2, suffix: "", label: "MSc GPA / 4.0" },
    { value: 4.0, decimals: 1, suffix: "", label: "Thesis grade / 4.0" },
    { value: 7, decimals: 0, suffix: "+", label: "Research & course projects" },
    { value: 7, decimals: 0, suffix: "", label: "Years in AI · since 2019" },
];

export const focusAreas = [
    "Time-Series Analysis",
    "Signal Processing",
    "Deep Learning",
    "Human Activity Recognition",
    "Machine Learning",
    "Neural Networks",
];

export const aboutParagraphs = [
    "I graduated with a Master's in Computer Engineering (Artificial Intelligence) from Alzahra University, where I worked as a member of the Data Mining Lab. My research lives at the intersection of deep learning and the physical world — turning raw sensor readings into something a model can understand.",
    "My background centers on time-series and motion-sensor signal processing: my MSc thesis used deep learning to recognize human activities from wearable accelerometer and gyroscope data (graded 4.0/4.0). More recently I've been exploring hardware security — side-channel analysis attacks on FPGA-based multi-tenant servers using deep neural networks, at Shahid Beheshti University.",
];

export const research = [
    {
        id: "R.01",
        tone: "dark",
        tag: "Deep Neural Networks · Security",
        period: "Summer 2023 — Jan 2025",
        title: "Remote Side-Channel Analysis Attacks on FPGA-based Multi-tenant Servers",
        org: "Shahid Beheshti University",
        supervisor: "Dr. Ali Jahanian",
        description:
            "Investigating how deep neural networks can be used for remote side-channel analysis attacks against FPGA-based multi-tenant servers — at the intersection of AI and hardware security.",
        chips: ["Deep Neural Networks", "FPGA", "Side-Channel Attacks", "Cloud Security"],
    },
    {
        id: "R.02",
        tone: "light",
        tag: "MSc Thesis · Deep Learning",
        period: "Feb 2020 — Mar 2023",
        title: "Wearable Sensor-based Human Activity Recognition using Deep Learning",
        org: "Alzahra University",
        supervisor: "Dr. Mohammad Reza Keyvanpour",
        grade: "4.0 / 4.0",
        description:
            "Analyzing time-series signals obtained from accelerometer and gyroscope sensors for categorizing different human activities with deep learning models.",
        chips: ["Time Series", "Accelerometer", "Gyroscope", "HAR", "Deep Learning"],
    },
    {
        id: "R.03",
        tone: "light",
        tag: "BSc Project · Graph Theory",
        period: "Jun 2016 — Sep 2017",
        title: "Calculation of Additive Spanners for Graphs",
        org: "Babol Noshirvani University of Technology",
        supervisor: "Dr. Ali Gholami Rudi",
        description:
            "Implemented additive spanner computation in C++ across directed, isomorphic, complete, k-regular and bipartite graphs — using algorithms from Dijkstra and Floyd to Kruskal, Prim and Ford–Fulkerson.",
        chips: ["C++", "Graph Theory", "Dijkstra", "Floyd–Warshall", "Kruskal", "MapReduce"],
    },
];

export const courseProjects = [
    {
        id: "C.01",
        course: "Machine Learning · MSc",
        title: "DBScan × Genetic Algorithm",
        blurb: "Improved the DBScan clustering algorithm using a genetic algorithm with tournament selection, implemented and evaluated on the Iris dataset.",
        chips: ["Python", "DBScan", "Genetic Algorithm", "Iris Dataset"],
    },
    {
        id: "C.02",
        course: "Natural Language Processing · MSc",
        title: "WordNet Similarity Engine",
        blurb: "Calculated the semantic similarity between words and sentences using the WordNet lexical database.",
        chips: ["NLP", "WordNet", "Semantic Similarity"],
    },
    {
        id: "C.03",
        course: "Speech & Speaker Recognition · MSc",
        title: "SleepEEGNet — Sleep Stage Scoring",
        blurb: "Implemented SleepEEGNet, a sequence-to-sequence deep learning method for automatic sleep stage scoring from EEG signals.",
        chips: ["Deep Learning", "Seq2Seq", "EEG"],
    },
    {
        id: "C.04",
        course: "Evolutionary Computing · MSc",
        title: "GSFLA Text Clustering",
        blurb: "Applied the Genetic Shuffled Frog-Leaping Algorithm to cluster text documents on the 20 Newsgroups dataset.",
        chips: ["Evolutionary Algorithms", "Clustering", "20 Newsgroups"],
    },
];

export const experience = [
    {
        period: "2021 — 2022",
        role: "Microcontroller Programming Intern",
        company: "Speed Energy Aryanic",
        points: [
            "C/C++ programming in the Microcontroller Programming Department.",
            "Developed a chained UART serial interface among multiple Arduino Mini Pro development boards.",
        ],
        chips: ["C/C++", "UART", "Arduino Mini Pro"],
    },
    {
        period: "2016",
        role: "Network Management Intern",
        company: "Telecommunication Company",
        points: [
            "Hands-on work in the switch room and the operation & maintenance room.",
            "Experience with Main Distribution Unit (MDF) and Digital Distribution Unit (DDF).",
        ],
        chips: ["Network Operations", "MDF", "DDF"],
    },
];

export const education = [
    {
        period: "Sep 2019 — Mar 2022",
        degree: "MSc, Computer Engineering — Artificial Intelligence",
        school: "Alzahra University",
        location: "Tehran, Iran",
        gpa: 3.19,
        gpaLabel: "GPA 3.19 / 4.0 (Total)",
        advisor: "Advisor: Dr. Mohammad Reza Keyvanpour",
        notes: [
            "Research areas: signal & image processing, human activity recognition, neural networks and machine learning.",
            'Thesis: "Wearable sensor-based human activity recognition using deep learning" — graded 4.0 / 4.0.',
        ],
    },
    {
        period: "Sep 2012 — Mar 2017",
        degree: "BSc, Computer Engineering — Hardware Engineering",
        school: "Babol Noshirvani University of Technology",
        location: "Mazandaran, Iran",
        gpa: 3.0,
        gpaLabel: "GPA 3.0 / 4.0 (last two years)",
        notes: ["Graduation project on additive spanners of graphs, implemented in C++."],
    },
];

export const skillGroups = [
    { title: "Data & Machine Learning", items: ["Python", "Data Analysis", "Machine Learning", "Deep Learning", "Neural Networks"] },
    { title: "Signals & Research", items: ["Time-Series Analysis", "Signal Processing", "Image Processing", "Human Activity Recognition", "Wearable Sensors"] },
    { title: "Systems & Hardware", items: ["C / C++", "C#", "VHDL", "Verilog", "Microcontrollers · UART"] },
    { title: "Languages", items: ["Persian — Native", "English — Fluent"] },
];

export const references = [
    {
        name: "Dr. Mohammad Reza Keyvanpour",
        org: "Alzahra University, Iran",
        initials: "MK",
        links: [
            { label: "Scholar page", href: "https://scholar.google.com/citations?user=DERIoGYAAAAJ&hl=en" }, // TODO: add real URL
            { label: "Home page", href: "https://alzahra.ac.ir/~keyvanpour" },    // TODO: add real URL
        ],
    },
    {
        name: "Dr. Hesam Omranpour",
        org: "Babol Noshirvani University of Technology, Iran",
        initials: "HO",
        links: [
            { label: "Scholar page", href: "https://scholar.google.com/citations?user=0CBvqa8AAAAJ&hl=en" }, // TODO: add real URL
            { label: "Home page", href: "https://faculty.nit.ac.ir/faculty391011/fa" },    // TODO: add real URL
        ],
    },
];

export const marqueeItems = [
    "Machine Learning", "Deep Learning", "Time-Series Analysis", "Signal Processing",
    "Human Activity Recognition", "FPGA Security", "Python", "Neural Networks",
];