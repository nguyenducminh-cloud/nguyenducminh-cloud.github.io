/* Edit this file to update the public portfolio. No build step is required.
 * Sources: Mario_Nguyen.pdf and the supplied portfolio's education timeline.
 * The CV takes precedence where dates differ between the two sources.
 */
window.PORTFOLIO_CONFIG = {
  name: "Minh Nguyen",
  fullName: "Nguyễn Đức Minh",
  alternateName: "Mario Nguyen",
  role: "Data Science & Business Intelligence",
  email: "minhm4003@gmail.com",
  phone: "0405 484 968",
  location: "Melbourne, Australia",
  github: "https://github.com/nguyenducminh-cloud",
  linkedin: null,
  summary: "I turn complex data into useful insights, clear reporting and thoughtful visual experiences.",
  about: [
    "I’m Minh, also known as Mario Nguyen. I’m studying a Master of Data Science at the University of Melbourne, building on a background in information technology and computer science at VNUHCM – University of Science.",
    "My experience connects data collection, analysis and business intelligence. At Siemens, I supported financial reporting with Power BI; at OCB, I worked with external data and the retail banking team. Beyond data, I make time for music and volunteer as a live musician at the Royal Melbourne Hospital."
  ],
  skills: [
    { name: "Programming", items: ["Python", "SQL", "C/C++"] },
    { name: "Data & machine learning", items: ["Pandas", "NumPy", "scikit-learn", "Matplotlib", "Seaborn"] },
    { name: "Business intelligence", items: ["Power BI", "Tableau", "Microsoft Excel"] },
    { name: "Data collection", items: ["Selenium", "Web scraping", "Regular expressions"] },
    { name: "Everyday tools", items: ["Git", "Jupyter Notebook", "Visual Studio Code"] }
  ],
  experience: [
    {
      id: "rmh",
      kind: "volunteering",
      org: "The Royal Melbourne Hospital",
      role: "Live Music Volunteer",
      period: "Sep 2026 — Present",
      start: "2026-09",
      logo: "rmh.png",
      mark: "RMH",
      place: "",
      summary: "Making space for music alongside my work in data.",
      bullets: ["Volunteer with the hospital’s live music program."],
      tags: ["Music", "Volunteering"]
    },
    {
      id: "unimelb",
      kind: "education",
      org: "University of Melbourne",
      role: "Master of Data Science",
      period: "Mar 2025 — Present",
      start: "2025-03",
      logo: "unimelb.png",
      mark: "UoM",
      place: "Melbourne, Australia",
      summary: "Developing statistical, analytical and machine learning skills through postgraduate study.",
      bullets: ["Capstone project exploring factors associated with regional longevity.", "Working across data preprocessing, modelling, interpretation and business intelligence outputs."],
      tags: ["Data science", "Statistics", "Machine learning"]
    },
    {
      id: "siemens",
      kind: "work",
      org: "Siemens",
      role: "Business Intelligence Analyst Apprentice",
      period: "Nov 2024 — Feb 2025",
      start: "2024-11",
      logo: "siemens.png",
      mark: "SIEMENS",
      place: "",
      summary: "Connected Finance reporting needs with clear, practical analytical outputs.",
      bullets: ["Partnered with Finance stakeholders to support annual financial reporting and business analysis.", "Gathered and documented requirements, translating reporting needs into analytical requirements.", "Developed Power BI reporting and visualisations to support financial analysis for the Head of Finance.", "Communicated findings to non-technical stakeholders to support financial decision-making."],
      tags: ["Power BI", "Financial reporting", "Stakeholder communication"]
    },
    {
      id: "ocb",
      kind: "work",
      org: "Orient Commercial Joint Stock Bank (OCB)",
      role: "Data Science Intern",
      period: "May 2024 — Jul 2024",
      start: "2024-05",
      logo: "ocb.png",
      mark: "OCB",
      place: "",
      summary: "Prepared external data and analytical insights for the retail banking team.",
      bullets: ["Supported data-driven initiatives for priority and premium retail banking customers.", "Provided analytical insights to help identify and evaluate potential business partners.", "Collected external data using Python, Selenium and web scraping techniques.", "Cleaned and standardised data using regular expressions, filtering and mapping."],
      tags: ["Python", "Selenium", "Data preprocessing"]
    },
    {
      id: "hcmus",
      kind: "education",
      org: "VNUHCM – University of Science",
      role: "Bachelor of Information Technology & Computer Science",
      period: "Oct 2020 — Nov 2024",
      start: "2020-10",
      logo: "hcmus.png",
      mark: "HCMUS",
      place: "",
      summary: "An undergraduate foundation in computing, with a minor in Data Science.",
      bullets: ["Minor in Data Science.", "GPA: 3.48 / 4.00."],
      tags: ["Computer science", "Data science", "GPA 3.48/4.00"]
    },
    {
      id: "social-work",
      kind: "volunteering",
      org: "Le Hong Phong High School for the Gifted — Social Work Team (CTXH)",
      role: "Logistics Team",
      period: "Sep 2018 — Dec 2019",
      start: "2018-09",
      logo: "ctxh.png",
      mark: "SW",
      place: "",
      summary: "Contributed to the logistics team for school social work activities.",
      bullets: [],
      tags: ["Logistics", "Volunteering"]
    },
    {
      id: "lhp",
      kind: "education",
      org: "Le Hong Phong High School for the Gifted",
      role: "Natural Sciences Specialisation (A)",
      period: "Aug 2017 — Jul 2020",
      start: "2017-08",
      logo: "lhp.png",
      mark: "LHP",
      place: "",
      summary: "Studied in the natural sciences specialisation.",
      bullets: [],
      tags: ["Natural sciences"]
    },
    {
      id: "nvt",
      kind: "education",
      org: "Nguyen Van To Secondary School",
      role: "Secondary education",
      period: "Aug 2013 — Jun 2017",
      start: "2013-08",
      logo: "nvt.png",
      mark: "NVT",
      place: "",
      summary: "An earlier chapter in my education.",
      bullets: [],
      tags: []
    },
    {
      id: "dmc",
      kind: "education",
      org: "Duong Minh Chau Primary School",
      role: "Primary education",
      period: "Aug 2007 — May 2013",
      start: "2007-08",
      logo: "dmc.png",
      mark: "DMC",
      place: "",
      summary: "Where my school journey began.",
      bullets: [],
      tags: []
    },
    {
      id: "mn1q10",
      kind: "education",
      org: "Mang Non 1 Kindergarten – District 10",
      role: "Early education",
      period: "Aug 2004 — May 2007",
      start: "2004-08",
      logo: "mn1q10.png",
      mark: "MN1",
      place: "",
      summary: "The first chapter of my learning journey.",
      bullets: [],
      tags: []
    }
  ],
  projects: [
    {
      id: "longevity-capstone",
      title: "Understanding regional longevity",
      category: "Capstone project",
      summary: "A four-member University of Melbourne capstone investigating factors associated with regional longevity, from data preparation and modelling to interactive business intelligence outputs.",
      tags: ["Statistical modelling", "Machine learning", "Visualisation"],
      href: null,
      icon: "chart"
    },
    {
      id: "finance-reporting",
      title: "From finance questions to clear reporting",
      category: "Experience · Siemens",
      summary: "Gathered Finance requirements and developed Power BI reports to make financial analysis easier to communicate to business stakeholders.",
      tags: ["Power BI", "Requirements gathering", "Business analysis"],
      href: null,
      icon: "layers"
    },
    {
      id: "banking-data",
      title: "Building useful data from external sources",
      category: "Experience · OCB",
      summary: "Collected, cleaned and standardised external data with Python and Selenium to support retail banking analysis and potential partner evaluation.",
      tags: ["Python", "Selenium", "Data preparation"],
      href: null,
      icon: "code"
    }
  ]
};
