export interface CollegeRecord {
  id: string;
  name: string;
  code: string;
  type: 'NIT' | 'IIT' | 'IIIT' | 'Central University' | 'State University' | 'Autonomous Engineering College' | 'Deemed / Private University' | 'Engineering College / Institute';
  location: string;
  city?: string;
  state: string;
  nirfRank?: number;
  accreditation: string;
  website: string;
  btechAvailable?: boolean;
  programs?: string[];
  establishedYear?: number;
  affiliation?: string;
}

export const COLLEGES_DATA: CollegeRecord[] = [
  // =========================================================================
  // JAIPUR B.TECH COLLEGES & INSTITUTIONS DATASET (PLATFORM DATA)
  // =========================================================================
  {
    id: 'col-jecrc-foundation',
    name: 'Jaipur Engineering College and Research Centre (JECRC Foundation)',
    code: 'JECRC-3020',
    type: 'Autonomous Engineering College',
    location: 'Sitapura Industrial Area, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'Information Technology (IT)',
      'Artificial Intelligence and Data Science (AI/DS)',
      'Electronics and Communication Engineering (ECE)',
      'Electrical Engineering (EE)',
      'Mechanical Engineering (ME)',
      'Civil Engineering'
    ],
    establishedYear: 2000,
    affiliation: 'Rajasthan Technical University (RTU), Kota',
    accreditation: 'NAAC Accredited | NBA Accredited Branches | RTU Affiliated | AICTE Approved',
    website: 'https://jecrcfoundation.com'
  },
  {
    id: 'col-jecrc-univ',
    name: 'JECRC University, Jaipur',
    code: 'JU-3030',
    type: 'Deemed / Private University',
    location: 'Plot IS-2036 to 2039, Ramchandrapura Industrial Area, Vidhani, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    btechAvailable: true,
    programs: [
      'B.Tech Computer Science and Engineering (CSE)',
      'B.Tech AI & Machine Learning',
      'B.Tech Cloud Computing & DevOps',
      'B.Tech Cyber Security',
      'B.Tech Mechanical Engineering',
      'B.Tech Civil Engineering'
    ],
    establishedYear: 2012,
    accreditation: 'NAAC Accredited | UGC Recognized | AICTE Approved',
    website: 'https://jecrcuniversity.edu.in'
  },
  {
    id: 'col-poornima-pce',
    name: 'Poornima College of Engineering (PCE)',
    code: 'PCE-3020',
    type: 'Autonomous Engineering College',
    location: 'ISI-6, RIICO Institutional Area, Sitapura, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'Artificial Intelligence & Data Science (AI/DS)',
      'Information Technology (IT)',
      'Electronics and Communication Engineering (ECE)',
      'Electrical Engineering (EE)',
      'Mechanical Engineering (ME)',
      'Civil Engineering'
    ],
    establishedYear: 2000,
    affiliation: 'Rajasthan Technical University (RTU), Kota',
    accreditation: 'NAAC A Accredited | NBA Accredited | RTU Affiliated | AICTE Approved',
    website: 'https://pce.poornima.org'
  },
  {
    id: 'col-poornima-piet',
    name: 'Poornima Institute of Engineering & Technology (PIET)',
    code: 'PIET-3020',
    type: 'Autonomous Engineering College',
    location: 'ISI-2, RIICO Institutional Area, Sitapura, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'CSE (Artificial Intelligence)',
      'CSE (Data Science)',
      'CSE (Internet of Things)',
      'Information Technology (IT)'
    ],
    establishedYear: 2007,
    affiliation: 'Rajasthan Technical University (RTU), Kota',
    accreditation: 'NAAC A Grade Accredited | NBA Accredited (CSE & IT) | RTU Affiliated | AICTE Approved',
    website: 'https://piet.poornima.org'
  },
  {
    id: 'col-poornima-univ',
    name: 'Poornima University, Jaipur',
    code: 'PU-3030',
    type: 'Deemed / Private University',
    location: 'IS-2027 to 2031, Ramchandrapura, P.O. Vidhani Vatika, Sitapura Extension, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    btechAvailable: true,
    programs: [
      'B.Tech Computer Engineering (CSE)',
      'B.Tech AI & Data Science',
      'B.Tech Cloud Technology',
      'B.Tech Cyber Security',
      'B.Tech Civil Engineering',
      'B.Tech Mechanical Engineering'
    ],
    establishedYear: 2012,
    accreditation: 'NAAC Accredited | UGC Recognized | AICTE Approved',
    website: 'https://poornima.edu.in'
  },
  {
    id: 'col-skit-jaipur',
    name: 'Swami Keshvanand Institute of Technology, Management & Gramothan (SKIT)',
    code: 'SKIT-3025',
    type: 'Autonomous Engineering College',
    location: 'Ramnagaria, Jagatpura, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'CSE (Artificial Intelligence & Machine Learning)',
      'CSE (Data Science)',
      'CSE (IoT)',
      'Information Technology (IT)',
      'Electronics and Communication Engineering (ECE)',
      'Electrical Engineering (EE)',
      'Mechanical Engineering (ME)',
      'Civil Engineering'
    ],
    establishedYear: 2000,
    affiliation: 'Rajasthan Technical University (RTU), Kota (Rank 1)',
    accreditation: 'NAAC A++ Accredited | NBA Tier-1 Accredited | RTU Affiliated Rank 1 | AICTE Approved',
    website: 'https://www.skit.ac.in'
  },
  {
    id: 'col-lnmiit-jaipur',
    name: 'The LNM Institute of Information Technology (LNMIIT)',
    code: 'LNMIIT-3020',
    type: 'Deemed / Private University',
    location: 'Rupa ki Nangal, Post-Sumel, Via-Jamdoli, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'Communication and Computer Engineering (CCE)',
      'Electronics and Communication Engineering (ECE)',
      'Mechanical Engineering (ME)',
      'B.Tech (Hons.) with AI & Data Science'
    ],
    establishedYear: 2002,
    accreditation: 'NAAC A Grade Accredited | Deemed-to-be-University | AICTE Approved | Public-Private Joint Venture with Govt. of Rajasthan',
    website: 'https://www.lnmiit.ac.in'
  },
  {
    id: 'col-mnit-jaipur',
    name: 'Malaviya National Institute of Technology Jaipur (MNIT)',
    code: 'MNIT-3020',
    type: 'NIT',
    location: 'Jawahar Lal Nehru Marg, Jhalana Doongri, Malviya Nagar, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    nirfRank: 37,
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'Artificial Intelligence and Data Engineering',
      'Electronics and Communication Engineering (ECE)',
      'Electrical Engineering (EE)',
      'Mechanical Engineering (ME)',
      'Civil Engineering',
      'Chemical Engineering',
      'Metallurgical & Materials Engineering'
    ],
    establishedYear: 1963,
    accreditation: 'Institute of National Importance (INI) | NAAC A++ | NBA Tier-1 Accredited',
    website: 'https://mnit.ac.in'
  },
  {
    id: 'col-muj-jaipur',
    name: 'Manipal University Jaipur (MUJ)',
    code: 'MUJ-3030',
    type: 'Deemed / Private University',
    location: 'Dehmi Kalan, Jaipur-Ajmer Expressway, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    nirfRank: 64,
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'CSE (AI & ML)',
      'CSE (Data Science)',
      'CSE (IoT & Intelligent Systems)',
      'Information Technology (IT)',
      'Electronics & Communication Engineering (ECE)',
      'Electrical and Computer Engineering',
      'Mechanical Engineering',
      'Mechatronics Engineering',
      'Civil Engineering',
      'Automobile Engineering'
    ],
    establishedYear: 2011,
    accreditation: 'NAAC A+ Accredited (CGPA 3.28) | UGC Recognized | AICTE Approved',
    website: 'https://jaipur.manipal.edu'
  },
  {
    id: 'col-iiit-kota',
    name: 'Indian Institute of Information Technology Kota (IIIT Kota)',
    code: 'IIITK-3020',
    type: 'IIIT',
    location: 'MNIT Jaipur Transit Campus / Ranpur, Rajasthan (Jaipur Transit Hub)',
    city: 'Jaipur / Kota',
    state: 'Rajasthan',
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'Electronics and Communication Engineering (ECE)',
      'Artificial Intelligence and Data Engineering'
    ],
    establishedYear: 2013,
    accreditation: 'Institute of National Importance | Ministry of Education, Govt. of India',
    website: 'https://iiitkota.ac.in'
  },
  {
    id: 'col-arya-aceit',
    name: 'Arya College of Engineering & Information Technology (ACEIT)',
    code: 'ACEIT-3020',
    type: 'Autonomous Engineering College',
    location: 'SP-42, RIICO Industrial Area, Kukas, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'Artificial Intelligence & Data Science (AI/DS)',
      'Information Technology (IT)',
      'Electronics & Communication (ECE)',
      'Electrical Engineering (EE)',
      'Mechanical Engineering (ME)'
    ],
    establishedYear: 2000,
    affiliation: 'Rajasthan Technical University (RTU), Kota',
    accreditation: 'RTU Affiliated | AICTE Approved | NBA Accredited | NAAC Accredited',
    website: 'https://www.aryacollege.in'
  },
  {
    id: 'col-arya-aiet',
    name: 'Arya Institute of Engineering & Technology (AIET)',
    code: 'AIET-3020',
    type: 'Autonomous Engineering College',
    location: 'SP-40, RIICO Industrial Area, Delhi Road, Kukas, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'CSE (Cyber Security)',
      'Artificial Intelligence & Machine Learning',
      'Electronics & Communication (ECE)',
      'Electrical Engineering'
    ],
    establishedYear: 2005,
    affiliation: 'Rajasthan Technical University (RTU), Kota',
    accreditation: 'NAAC Accredited | RTU Affiliated | AICTE Approved',
    website: 'https://www.aryainstitutejpr.com'
  },
  {
    id: 'col-anand-ice',
    name: 'Anand International College of Engineering (Anand-ICE)',
    code: 'AICE-3030',
    type: 'Autonomous Engineering College',
    location: 'Near Kanota, Agra Road, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'CSE (Artificial Intelligence)',
      'CSE (Cyber Security)',
      'CSE (Data Science)',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering'
    ],
    establishedYear: 2010,
    affiliation: 'Rajasthan Technical University (RTU), Kota',
    accreditation: 'RTU Affiliated | AICTE Approved | Institution of Engineers (IEI) Accredited',
    website: 'https://anandice.ac.in'
  },
  {
    id: 'col-git-jaipur',
    name: 'Global Institute of Technology (GIT Jaipur)',
    code: 'GIT-3020',
    type: 'Autonomous Engineering College',
    location: 'ITS-1, IT Park, EPIP, Sitapura, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'CSE (Artificial Intelligence & Data Science)',
      'Information Technology (IT)',
      'Electronics & Communication (ECE)',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering'
    ],
    establishedYear: 2002,
    affiliation: 'Rajasthan Technical University (RTU), Kota',
    accreditation: 'NAAC A+ Grade Accredited | RTU Affiliated | AICTE Approved',
    website: 'https://gitjaipur.com'
  },
  {
    id: 'col-jnu-jaipur',
    name: 'Jaipur National University (School of Engineering & Technology)',
    code: 'JNU-3020',
    type: 'Deemed / Private University',
    location: 'Jaipur-Agra Bypass, Near New RTO Office, Jagatpura, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    btechAvailable: true,
    programs: [
      'B.Tech Computer Science and Engineering',
      'B.Tech AI & Machine Learning',
      'B.Tech Information Technology',
      'B.Tech Food Technology',
      'B.Tech Biotechnology',
      'B.Tech Mechanical Engineering',
      'B.Tech Civil Engineering'
    ],
    establishedYear: 2007,
    accreditation: 'NAAC Accredited | UGC Recognized | AICTE Approved',
    website: 'https://www.jnujaipur.ac.in'
  },
  {
    id: 'col-uem-jaipur',
    name: 'University of Engineering & Management (UEM Jaipur)',
    code: 'UEMJ-3030',
    type: 'Deemed / Private University',
    location: 'Gurukul Campus, Sikar Road, Near Udaipuria Mod, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    btechAvailable: true,
    programs: [
      'B.Tech Computer Science and Engineering (CSE)',
      'B.Tech CSE with AI & ML',
      'B.Tech CSE with IoT & Cyber Security',
      'B.Tech Electronics and Communication (ECE)',
      'B.Tech Electrical Engineering',
      'B.Tech Mechanical Engineering',
      'B.Tech Civil Engineering'
    ],
    establishedYear: 2011,
    accreditation: 'NAAC Accredited | UGC Recognized | AICTE Approved | AIU Member',
    website: 'https://uem.edu.in/uem-jaipur'
  },
  {
    id: 'col-apex-iet',
    name: 'Apex Institute of Engineering & Technology (Apex University)',
    code: 'APEX-3020',
    type: 'Autonomous Engineering College',
    location: 'ISI-5, RIICO Institutional Area, Sitapura, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'CSE (AI & Data Science)',
      'Mechanical Engineering',
      'Electrical Engineering',
      'Civil Engineering'
    ],
    establishedYear: 2004,
    affiliation: 'RTU Affiliated / Apex University',
    accreditation: 'RTU Affiliated / Apex University | AICTE Approved',
    website: 'https://www.apexedu.org'
  },
  {
    id: 'col-vit-jaipur',
    name: 'Vivekananda Institute of Technology (VIT Campus Jaipur / VGU)',
    code: 'VITJ-3025',
    type: 'Autonomous Engineering College',
    location: 'Sector 36, Sisyawas, NRI Road, Jagatpura, Jaipur, Rajasthan',
    city: 'Jaipur',
    state: 'Rajasthan',
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'CSE (AI & DS)',
      'Information Technology',
      'Civil Engineering',
      'Mechanical Engineering',
      'Electrical Engineering'
    ],
    establishedYear: 2008,
    affiliation: 'Rajasthan Technical University / VGU Jaipur',
    accreditation: 'NAAC A+ Accredited (VGU) | RTU Affiliated | AICTE Approved',
    website: 'https://vitj.ac.in'
  },
  {
    id: 'col-banasthali',
    name: 'Banasthali Vidyapith (Faculty of Engineering & Technology)',
    code: 'BV-3040',
    type: 'Deemed / Private University',
    location: 'Banasthali Vidyapith, Rajasthan (Jaipur Region Hub)',
    city: 'Jaipur Region / Tonk',
    state: 'Rajasthan',
    nirfRank: 58,
    btechAvailable: true,
    programs: [
      'B.Tech Computer Science and Engineering (CSE)',
      'B.Tech Information Technology (IT)',
      'B.Tech Electronics and Communication (ECE)',
      'B.Tech Electrical & Electronics (EEE)',
      'B.Tech Chemical Engineering',
      'B.Tech Biotechnology'
    ],
    establishedYear: 1935,
    accreditation: 'NAAC A++ Accredited (Highest Grade) | Premier Women\'s University | AICTE Approved',
    website: 'https://banasthali.org'
  },

  // =========================================================================
  // NATIONAL INSTITUTIONS OF EXCELLENCE
  // =========================================================================
  {
    id: 'col-1',
    name: 'National Institute of Technology, New Delhi',
    code: 'NITD-1100',
    type: 'NIT',
    location: 'New Delhi, Delhi (NCR)',
    city: 'New Delhi',
    state: 'Delhi',
    nirfRank: 28,
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'Artificial Intelligence and Data Science',
      'Electronics and Communication (ECE)',
      'Electrical Engineering (EE)',
      'Mechanical Engineering (ME)',
      'Civil Engineering'
    ],
    accreditation: 'NAAC A++ | NBA Tier-1 | Institute of National Importance',
    website: 'https://nitdelhi.ac.in'
  },
  {
    id: 'col-2',
    name: 'National Institute of Technology Karnataka (NITK)',
    code: 'NITK-5750',
    type: 'NIT',
    location: 'Surathkal, Karnataka',
    city: 'Surathkal',
    state: 'Karnataka',
    nirfRank: 12,
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'Information Technology (IT)',
      'Artificial Intelligence',
      'Electronics and Communication (ECE)',
      'Electrical and Electronics (EEE)',
      'Mechanical Engineering',
      'Civil Engineering'
    ],
    accreditation: 'NAAC A++ | NBA Tier-1 | Institute of National Importance',
    website: 'https://nitk.ac.in'
  },
  {
    id: 'col-3',
    name: 'Indian Institute of Technology Bombay (IITB)',
    code: 'IITB-4000',
    type: 'IIT',
    location: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    nirfRank: 3,
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Aerospace Engineering',
      'Chemical Engineering'
    ],
    accreditation: 'Institute of Eminence (IoE) | NAAC A++',
    website: 'https://iitb.ac.in'
  },
  {
    id: 'col-4',
    name: 'Indian Institute of Technology Delhi (IITD)',
    code: 'IITD-1100',
    type: 'IIT',
    location: 'New Delhi, Delhi (NCR)',
    city: 'New Delhi',
    state: 'Delhi',
    nirfRank: 2,
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Mathematics & Computing',
      'Chemical Engineering'
    ],
    accreditation: 'Institute of Eminence (IoE) | NAAC A++',
    website: 'https://iitd.ac.in'
  },
  {
    id: 'col-5',
    name: 'Indian Institute of Technology Madras (IITM)',
    code: 'IITM-6000',
    type: 'IIT',
    location: 'Chennai, Tamil Nadu',
    city: 'Chennai',
    state: 'Tamil Nadu',
    nirfRank: 1,
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'Data Science and AI',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Aerospace Engineering'
    ],
    accreditation: 'Institute of Eminence (IoE) | NIRF #1 Overall',
    website: 'https://iitm.ac.in'
  },
  {
    id: 'col-6',
    name: 'Delhi Technological University (DTU)',
    code: 'DTU-1100',
    type: 'State University',
    location: 'New Delhi, Delhi (NCR)',
    city: 'New Delhi',
    state: 'Delhi',
    nirfRank: 29,
    btechAvailable: true,
    programs: [
      'Computer Engineering (COE)',
      'Information Technology (IT)',
      'Software Engineering (SE)',
      'Mathematics and Computing (MCE)',
      'Electronics and Communication (ECE)',
      'Electrical Engineering (EE)'
    ],
    accreditation: 'NAAC A+ | NBA Tier-1 Accredited',
    website: 'https://dtu.ac.in'
  },
  {
    id: 'col-7',
    name: 'College of Engineering, Pune (COEP Technological University)',
    code: 'COEP-4110',
    type: 'Autonomous Engineering College',
    location: 'Pune, Maharashtra',
    city: 'Pune',
    state: 'Maharashtra',
    nirfRank: 49,
    btechAvailable: true,
    programs: [
      'Computer Engineering',
      'Artificial Intelligence and Robotics',
      'Electronics and Telecommunication',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering'
    ],
    accreditation: 'NAAC A++ | NBA Tier-1 Accredited',
    website: 'https://coep.org.in'
  },
  {
    id: 'col-8',
    name: 'Vellore Institute of Technology (VIT)',
    code: 'VIT-6320',
    type: 'Deemed / Private University',
    location: 'Vellore, Tamil Nadu',
    city: 'Vellore',
    state: 'Tamil Nadu',
    nirfRank: 11,
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'CSE with Information Security',
      'CSE with AI & Machine Learning',
      'Electronics and Communication (ECE)',
      'Mechanical Engineering'
    ],
    accreditation: 'NAAC A++ (CGPA 3.66) | IoE Recognized',
    website: 'https://vit.ac.in'
  },
  {
    id: 'col-9',
    name: 'BITS Pilani (Birla Institute of Technology and Science)',
    code: 'BITS-3330',
    type: 'Deemed / Private University',
    location: 'Pilani, Rajasthan',
    city: 'Pilani',
    state: 'Rajasthan',
    nirfRank: 20,
    btechAvailable: true,
    programs: [
      'B.E. Computer Science',
      'B.E. Electrical and Electronics',
      'B.E. Electronics and Instrumentation',
      'B.E. Mechanical Engineering',
      'B.E. Chemical Engineering',
      'B.E. Civil Engineering'
    ],
    accreditation: 'Institute of Eminence (IoE) | NAAC A',
    website: 'https://bits-pilani.ac.in'
  },
  {
    id: 'col-10',
    name: 'International Institute of Information Technology Hyderabad (IIITH)',
    code: 'IIITH-5000',
    type: 'IIIT',
    location: 'Hyderabad, Telangana',
    city: 'Hyderabad',
    state: 'Telangana',
    nirfRank: 55,
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'Electronics and Communication Engineering (ECE)',
      'Computer Science and Human Sciences (CSD)'
    ],
    accreditation: 'NAAC A++ | AI & CS Center of Excellence',
    website: 'https://iiit.ac.in'
  },
  {
    id: 'col-11',
    name: 'College of Engineering, Guindy (Anna University)',
    code: 'CEG-6000',
    type: 'State University',
    location: 'Chennai, Tamil Nadu',
    city: 'Chennai',
    state: 'Tamil Nadu',
    nirfRank: 13,
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'Information Technology (IT)',
      'Electronics and Communication (ECE)',
      'Electrical and Electronics (EEE)',
      'Mechanical Engineering'
    ],
    accreditation: 'NAAC A++ | NBA Tier-1 Accredited',
    website: 'https://annauniv.edu'
  },
  {
    id: 'col-12',
    name: 'National Institute of Technology, Tiruchirappalli (NITT)',
    code: 'NITT-6200',
    type: 'NIT',
    location: 'Tiruchirappalli, Tamil Nadu',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    nirfRank: 9,
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'Electronics and Communication (ECE)',
      'Electrical and Electronics (EEE)',
      'Mechanical Engineering',
      'Civil Engineering',
      'Chemical Engineering'
    ],
    accreditation: 'Institute of National Importance | NAAC A++',
    website: 'https://nitt.edu'
  },
  {
    id: 'col-13',
    name: 'National Institute of Technology, Rourkela (NITR)',
    code: 'NITR-7690',
    type: 'NIT',
    location: 'Rourkela, Odisha',
    city: 'Rourkela',
    state: 'Odisha',
    nirfRank: 16,
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'Electronics and Communication (ECE)',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Biomedical Engineering'
    ],
    accreditation: 'Institute of National Importance | NAAC A++',
    website: 'https://nitrkl.ac.in'
  },
  {
    id: 'col-14',
    name: 'Netaji Subhas University of Technology (NSUT)',
    code: 'NSUT-1100',
    type: 'State University',
    location: 'New Delhi, Delhi (NCR)',
    city: 'New Delhi',
    state: 'Delhi',
    nirfRank: 60,
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'Information Technology (IT)',
      'Mathematics and Computing (MAC)',
      'Electronics and Communication (ECE)',
      'Electrical Engineering'
    ],
    accreditation: 'NAAC A | NBA Tier-1 Accredited',
    website: 'https://nsut.ac.in'
  },
  {
    id: 'col-15',
    name: 'Thapar Institute of Engineering and Technology',
    code: 'TIET-1470',
    type: 'Deemed / Private University',
    location: 'Patiala, Punjab',
    city: 'Patiala',
    state: 'Punjab',
    nirfRank: 22,
    btechAvailable: true,
    programs: [
      'Computer Science and Engineering (CSE)',
      'Computer Engineering (COE)',
      'Electronics and Communication (ECE)',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering'
    ],
    accreditation: 'NAAC A+ | ABET Accredited',
    website: 'https://thapar.edu'
  }
];
