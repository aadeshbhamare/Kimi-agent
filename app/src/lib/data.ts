// ── Demo data layer ─────────────────────────────────────────────────────────
// Realistic seed data used throughout the platform. In production this layer
// is backed by PostgreSQL + FastAPI; the shapes below mirror that schema.

export type SectionKey =
  | 'login' | 'landing' | 'dashboard' | 'documents' | 'workflow' | 'templates'
  | 'research' | 'assistant' | 'projects' | 'collaboration'
  | 'history' | 'certificates' | 'results' | 'architecture' | 'admin'
  | 'workflow-upload' | 'workflow-analyze' | 'workflow-model'
  | 'workflow-editor' | 'workflow-generate' | 'workflow-validate' | 'workflow-export'

// ── Master document model (Universal Document Model, visualized) ────────────

export interface DocField {
  key: string
  label: string
  occurrences: number
  color: string // tailwind-ish hex for highlight
}

export const DOC_FIELDS: DocField[] = [
  { key: 'projectTitle', label: 'Project Title', occurrences: 18, color: '#ec4899' },
  { key: 'studentName', label: 'Primary Student Name', occurrences: 14, color: '#6366f1' },
  { key: 'rollNumber', label: 'Roll Number', occurrences: 12, color: '#0ea5e9' },
  { key: 'coAuthor1', label: 'Team Member 1', occurrences: 8, color: '#8b5cf6' },
  { key: 'coAuthor2', label: 'Team Member 2', occurrences: 8, color: '#a855f7' },
  { key: 'guide', label: 'Project Guide', occurrences: 9, color: '#f59e0b' },
  { key: 'hod', label: 'HOD', occurrences: 5, color: '#14b8a6' },
  { key: 'principal', label: 'Principal', occurrences: 4, color: '#06b6d4' },
  { key: 'college', label: 'College / Institute', occurrences: 16, color: '#d946ef' },
  { key: 'university', label: 'University (SPPU)', occurrences: 9, color: '#3b82f6' },
  { key: 'academicYear', label: 'Academic Year', occurrences: 8, color: '#10b981' },
  { key: 'semester', label: 'Semester', occurrences: 6, color: '#f97316' },
  { key: 'department', label: 'Department', occurrences: 12, color: '#64748b' },
  { key: 'date', label: 'Submission Date', occurrences: 4, color: '#84cc16' },
]

export type Block =
  | { type: 'h1' | 'h2' | 'h3' | 'p' | 'li' | 'center' | 'spacer'; text: string }
  | { type: 'table'; rows: string[][] }
  | { type: 'logo'; title?: string }
  | { type: 'figure'; figureId: string; figNum: string; title: string; kind: 'usecase' | 'flowchart' | 'login_screens' | 'booking_grid' | 'booking_receipt' | 'firebase_store'; caption: string }
  | { type: 'student_list'; items: { name: string; roll: string }[] }
  | { type: 'signatures'; items: { name: string; title: string; subtitle?: string }[] }
  | { type: 'reference_list'; items: { num: number; text: string; link: string }[] }

export interface DocPageModel {
  page: number
  label: string
  hasBorder?: boolean
  runningHeader?: string
  runningFooterLeft?: string
  runningFooterRight?: string
  blocks: Block[]
}

// {{token}} placeholders are resolved against the active record.
export const MASTER_PAGES: DocPageModel[] = [
  {
    page: 1,
    label: 'Cover Page',
    hasBorder: true,
    blocks: [
      { type: 'center', text: 'A' },
      { type: 'center', text: 'CEP PROJECT REPORT' },
      { type: 'center', text: 'ON' },
      { type: 'h1', text: '“{{projectTitle}}”' },
      { type: 'center', text: 'SUBMITTED TO THE {{university}},' },
      { type: 'center', text: 'IN PARTIAL FULFILMENT OF THE REQUIREMENTS' },
      { type: 'center', text: 'FOR THE AWARD OF THE DEGREE OF' },
      { type: 'h2', text: 'BACHELOR OF ENGINEERING' },
      { type: 'center', text: '(INFORMATION TECHNOLOGY)' },
      { type: 'spacer', text: '' },
      { type: 'center', text: 'SUBMITTED BY' },
      {
        type: 'student_list',
        items: [
          { name: '{{studentName}}', roll: '{{rollNumber}}' },
          { name: '{{coAuthor1}}', roll: '08' },
          { name: '{{coAuthor2}}', roll: '22' },
        ],
      },
      { type: 'logo', title: 'TRINITY' },
      { type: 'center', text: 'UNDER THE GUIDANCE OF' },
      { type: 'h3', text: '{{guide}}' },
      { type: 'spacer', text: '' },
      { type: 'center', text: '{{department}}' },
      { type: 'center', text: '{{college}}' },
      { type: 'center', text: 'KONDHWA ANNEX, PUNE - 411048.' },
      { type: 'center', text: '{{semester}} [AY: {{academicYear}}]' },
    ],
  },
  {
    page: 2,
    label: 'Certificate',
    hasBorder: true,
    blocks: [
      { type: 'center', text: '{{department}}' },
      { type: 'center', text: '{{college}}' },
      { type: 'center', text: '{{semester}} [{{academicYear}}]' },
      { type: 'logo', title: 'TRINITY' },
      { type: 'h1', text: 'C E R T I F I C A T E' },
      { type: 'center', text: 'This is to certify that the project work entitled' },
      { type: 'h2', text: '“{{projectTitle}}”' },
      { type: 'center', text: 'Submitted by' },
      {
        type: 'student_list',
        items: [
          { name: '{{studentName}}', roll: '{{rollNumber}}' },
          { name: '{{coAuthor1}}', roll: '08' },
          { name: '{{coAuthor2}}', roll: '22' },
        ],
      },
      {
        type: 'p',
        text: 'This is to certify that {{studentName}}, {{coAuthor1}}, {{coAuthor2}} has successfully completed project work entitled {{projectTitle}} under my supervision in the fulfilment of CEP Work in Second Year Engineering in Academic Year {{academicYear}} as prescribed by {{university}}.',
      },
      {
        type: 'signatures',
        items: [
          { name: '{{guide}}', title: 'Project Guide', subtitle: 'Date: {{date}} | Place: {{place}}' },
          { name: '{{coordinator}}', title: 'CEP Coordinator' },
          { name: '{{hod}}', title: 'HOD' },
          { name: '{{principal}}', title: 'Principal' },
        ],
      },
    ],
  },
  {
    page: 3,
    label: 'Acknowledgement',
    runningHeader: 'The Ultimate Smart Parking Token System',
    runningFooterLeft: 'TAE, Pune',
    runningFooterRight: 'Depart of Information Technology',
    blocks: [
      { type: 'h1', text: 'Acknowledgement' },
      {
        type: 'p',
        text: 'I would like to acknowledge all the people who have been of help and assisted me throughout my Project work. First of all, I would like to thank my respected guide {{guide}} for introducing me to all the features needed. The time-to-time guidance, encouragement, and valuable suggestions received from her are unforgettable in my life. This work would not have been possible without the enthusiastic response, insight, and new ideas from her. I would like to thank my Project Coordinator {{coordinator}} for continuous support and guidance during my project work.',
      },
      {
        type: 'p',
        text: 'Furthermore, I would like to thank {{hod}}, Head of Department of Information Technology, for the guidance provided by her during my project work. I am also grateful to all the faculty members of {{college}}, Pune, for their support and cooperation. I would like to thank my lovely parents for their time-to-time support, encouragement, and valuable suggestions, and I would especially like to thank all my friends for their valuable suggestions. The acknowledgement would be incomplete without mention of the blessing of the Almighty, which helped me in keeping high morale during the most difficult periods.',
      },
      { type: 'spacer', text: '' },
      {
        type: 'student_list',
        items: [
          { name: '{{studentName}}', roll: '{{rollNumber}}' },
          { name: '{{coAuthor1}}', roll: '08' },
          { name: '{{coAuthor2}}', roll: '22' },
        ],
      },
      { type: 'center', text: 'SE IT · Batch: {{batch}}' },
    ],
  },
  {
    page: 4,
    label: 'Abstract',
    runningHeader: 'The Ultimate Smart Parking Token System',
    runningFooterLeft: 'TAE, Pune',
    runningFooterRight: 'Depart of Information Technology',
    blocks: [
      { type: 'h1', text: 'Abstract' },
      {
        type: 'p',
        text: 'In today’s fast-paced world, efficient parking management is a growing challenge in urban and semi-urban areas. Traditional parking systems often result in congestion, inefficient space utilization, and delays for users.',
      },
      {
        type: 'p',
        text: 'This project presents a Smart Parking Token System, a web-based platform that leverages HTML, CSS, and JavaScript to provide a dynamic and user-friendly interface for parking management FIREBASE FOR Database Storing. The system allows users to register, view available parking slots, reserve spaces, and generate electronic tokens for entry and exit.',
      },
      {
        type: 'p',
        text: 'Using JavaScript, the platform dynamically updates parking availability in real-time, ensuring users can make informed decisions about slot reservations. The system handles token generation, slot reservations, and secure payment processing entirely through the web interface.',
      },
      {
        type: 'p',
        text: 'To enhance operational efficiency, the system automates parking processes, reducing manual intervention, minimizing errors, and optimizing the utilization of parking spaces. It is scalable for various applications, including commercial complexes, residential areas, and public parking zones.',
      },
      {
        type: 'p',
        text: 'Keywords: Smart Parking, Token System, Web-Based Parking Management, HTML, CSS, JavaScript, Automated Parking, Slot Reservation, Traffic Optimization, Grace Period.',
      },
    ],
  },
  {
    page: 5,
    label: 'Contents',
    runningHeader: 'The Ultimate Smart Parking Token System',
    runningFooterLeft: 'TAE, Pune',
    runningFooterRight: 'Depart of Information Technology',
    blocks: [
      { type: 'h1', text: 'Contents' },
      { type: 'li', text: 'Acknowledgement . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . i' },
      { type: 'li', text: 'Abstract . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ii' },
      { type: 'li', text: 'List of Figures . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . v' },
      { type: 'li', text: '1 Introduction . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1' },
      { type: 'li', text: '  1.1 Project Overview . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 2' },
      { type: 'li', text: '  1.2 Aim & Objectives . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3' },
      { type: 'li', text: '  1.4 Motivation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3' },
      { type: 'li', text: '  1.5 Problem Statement . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3' },
      { type: 'li', text: '2 Literature Survey . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4' },
      { type: 'li', text: '3 Software & Hardware Requirements Specification . . . . . . . . . . . . . . . . . . . 5' },
      { type: 'li', text: '4 System Design . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7' },
      { type: 'li', text: '5 System Implementation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9' },
      { type: 'li', text: '6 Results and Discussion . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13' },
      { type: 'li', text: '7 Advantages and Disadvantages . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 16' },
      { type: 'li', text: '8 Conclusion & Future Scope . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17' },
      { type: 'li', text: 'References . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 25' },
    ],
  },
  {
    page: 6,
    label: 'List of Figures',
    runningHeader: 'The Ultimate Smart Parking Token System',
    runningFooterLeft: 'TAE, Pune',
    runningFooterRight: 'Depart of Information Technology',
    blocks: [
      { type: 'h1', text: 'List of Figures' },
      { type: 'li', text: '4.1 Use Case Diagram of the System . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7' },
      { type: 'li', text: '4.2 Flow Chart of the System . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8' },
      { type: 'li', text: '6.1 Customer Login Screen . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13' },
      { type: 'li', text: '6.2 Admin Login Screen . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13' },
      { type: 'li', text: '6.3 Customer Booking Process (Kumar Pacific Mall) . . . . . . . . . . . . . . . . . . 14' },
      { type: 'li', text: '6.4 Booking Process & QR Token Confirmation . . . . . . . . . . . . . . . . . . . . . 14' },
      { type: 'li', text: '6.5 Firebase for DataStorage . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 15' },
    ],
  },
  {
    page: 7,
    label: 'Ch. 1 · Introduction',
    runningHeader: 'The Ultimate Smart Parking Token System',
    runningFooterLeft: 'TAE, Pune',
    runningFooterRight: 'Depart of Information Technology',
    blocks: [
      { type: 'h1', text: '1. Introduction' },
      {
        type: 'p',
        text: 'Efficient parking management is one of the major challenges in modern urban environments due to the rapid increase in vehicles, urban population growth, and limited infrastructure. Traditional parking systems in cities often lead to traffic congestion, delays, frustration for drivers, and inefficient utilization of available parking spaces.',
      },
      { type: 'h3', text: '1.1 Project Overview' },
      {
        type: 'p',
        text: 'The Ultimate Smart Parking Token System Online follows a structured and efficient flow designed to streamline the entire parking process — from user registration to token generation, payment, and slot management. The system ensures real-time synchronization and secure data handling using Firebase as its backend.',
      },
      { type: 'h3', text: '1.2 Aim & Objectives' },
      { type: 'li', text: '• Provide a centralized platform for users to view live spot availability and book a guaranteed spot online.' },
      { type: 'li', text: '• Implement a QR code-based system for rapid and secure verification, ensuring frictionless entry.' },
      { type: 'li', text: '• Develop a comprehensive admin dashboard for real-time monitoring of all parking spaces.' },
      { type: 'li', text: '• Integrate flexible and seamless cashless payment options including UPI.' },
    ],
  },
  {
    page: 8,
    label: 'Ch. 4 · System Design (Use Case)',
    runningHeader: 'The Ultimate Smart Parking Token System',
    runningFooterLeft: 'TAE, Pune',
    runningFooterRight: 'Depart of Information Technology',
    blocks: [
      { type: 'h2', text: '4 System Design' },
      { type: 'h3', text: '4.1 Use Case Diagram' },
      {
        type: 'figure',
        figureId: 'fig-4-1',
        figNum: 'Figure 4.1',
        title: 'Use Case Diagram of the System',
        caption: 'Use Case Diagram of the System',
        kind: 'usecase',
      },
      {
        type: 'p',
        text: 'The Use Case Diagram illustrates the interaction between users, administrators, and core system modules. Users can register, log in, view available slots, and book parking in real time through Firebase synchronization. Upon booking, a unique QR token is generated for contactless entry and exit, while digital payments ensure secure transactions.',
      },
    ],
  },
  {
    page: 9,
    label: 'Ch. 4 · System Design (Flowchart)',
    runningHeader: 'The Ultimate Smart Parking Token System',
    runningFooterLeft: 'TAE, Pune',
    runningFooterRight: 'Depart of Information Technology',
    blocks: [
      { type: 'h3', text: '4.2 Flow Chart Diagram' },
      {
        type: 'figure',
        figureId: 'fig-4-2',
        figNum: 'Figure 4.2',
        title: 'Flow Chart of the System',
        caption: 'Flow Chart of the System',
        kind: 'flowchart',
      },
      {
        type: 'p',
        text: 'The flowchart represents the workflow of The Ultimate Smart Parking Token System Online. It illustrates how different entities—User, Booking, Parking Slot, and Admin—interact within the system. The process begins with the User, who registers or logs in to the platform to book a parking slot.',
      },
    ],
  },
  {
    page: 10,
    label: 'Ch. 6 · Results (Login UI)',
    runningHeader: 'The Ultimate Smart Parking Token System',
    runningFooterLeft: 'TAE, Pune',
    runningFooterRight: 'Depart of Information Technology',
    blocks: [
      { type: 'h2', text: '6 Results and Discussion' },
      { type: 'h3', text: '6.1 Customer Login & 6.2 Admin Login' },
      {
        type: 'figure',
        figureId: 'fig-6-1',
        figNum: 'Figures 6.1 & 6.2',
        title: 'Customer & Admin Authentication Portals',
        caption: 'Customer and Admin Login interfaces with Firebase Auth',
        kind: 'login_screens',
      },
      {
        type: 'p',
        text: 'The user and administrator portals provide responsive authentication backed by Firebase. Role-based access directs drivers to live slot reservations and administrators to the monitoring console.',
      },
    ],
  },
  {
    page: 11,
    label: 'Ch. 6 · Results (Booking Grid & QR)',
    runningHeader: 'The Ultimate Smart Parking Token System',
    runningFooterLeft: 'TAE, Pune',
    runningFooterRight: 'Depart of Information Technology',
    blocks: [
      { type: 'h3', text: '6.3 Customer Booking & 6.4 QR Token' },
      {
        type: 'figure',
        figureId: 'fig-6-3',
        figNum: 'Figure 6.3',
        title: 'Kumar Pacific Mall Slot Matrix (120 spots)',
        caption: 'Real-time parking grid with dynamic slot occupancy',
        kind: 'booking_grid',
      },
      {
        type: 'figure',
        figureId: 'fig-6-4',
        figNum: 'Figure 6.4',
        title: 'Booking Confirmation & Digital QR Token',
        caption: 'Verified QR token receipt (SP-mhdot8r-B7X00, MH 12 DE 3537)',
        kind: 'booking_receipt',
      },
      {
        type: 'p',
        text: 'Drivers select desired slots directly from the interactive matrix. Once confirmed, a time-limited provisional token with embedded QR barcode is issued for seamless automated barrier entry.',
      },
    ],
  },
  {
    page: 12,
    label: 'Ch. 6 · Results (Firebase Database)',
    runningHeader: 'The Ultimate Smart Parking Token System',
    runningFooterLeft: 'TAE, Pune',
    runningFooterRight: 'Depart of Information Technology',
    blocks: [
      { type: 'h3', text: '6.5 Firebase for DataStorage' },
      {
        type: 'figure',
        figureId: 'fig-6-5',
        figNum: 'Figure 6.5',
        title: 'Cloud Firestore Document Tree',
        caption: 'Live database schema storing booking records and auto-cancellations',
        kind: 'firebase_store',
      },
      {
        type: 'p',
        text: 'The Firebase Realtime Database and Cloud Firestore collections record slot status, vehicle IDs, booking timestamps, and auto-cancel timers, synchronizing updates to all clients in milliseconds.',
      },
    ],
  },
  {
    page: 13,
    label: 'References (IEEE)',
    runningHeader: 'The Ultimate Smart Parking Token System',
    runningFooterLeft: 'TAE, Pune',
    runningFooterRight: 'Depart of Information Technology',
    blocks: [
      { type: 'h1', text: 'References' },
      {
        type: 'reference_list',
        items: [
          { num: 1, text: 'F. J. Enríquez, “Smart Parking: Enhancing Urban Mobility with Fog Computing and IoT-Based Architecture,” MDPI Sensors, vol. 24, no. 5, pp. 1–15, 2024.', link: 'https://doi.org/10.3390/s24052417' },
          { num: 2, text: 'J. A. Abdulsaheb, R. M. Nafea, W. A. M. Al-Jawher, and M. L. Hayyawi, “IoT Based Smart Parking System,” Journal Port Science Research, vol. 7, no. 3, pp. 196–203, 2024.', link: 'https://doi.org/10.36371/port.2024.3.4' },
          { num: 3, text: 'T. Singh, R. Rathore, K. Gupta, E. Vijay, and R. Harikrishnan, “Artificial Intelligence-Enabled Smart Parking System,” Lecture Notes in Electrical Engineering, vol. 1115, pp. 419–432, 2025.', link: 'https://doi.org/10.1007/978-981-99-9005-4_32' },
          { num: 4, text: 'W. A. Jabbar et al., “Internet-of-Things Enabled Parking Management System Using LPWAN Technologies,” Smart Cities and Internet of Things, vol. 2, no. 4, 2024.', link: 'https://doi.org/10.1016/j.iot.2024.100124' },
          { num: 5, text: 'R. Overko, R. Ordóñez-Hurtado, S. Zhuk, and R. Shorten, “Spatial Positioning Token (SPToken) for Smart Parking,” arXiv preprint arXiv:2206.13880, 2022.', link: 'https://arxiv.org/abs/2206.13880' },
          { num: 6, text: 'T. Aravinda Babu and K. S. R. S. Jyothsna, “IoT Based Smart Vehicle and Smart Parking System,” International Journal of Engineering and Technology, vol. 9, no. 3, pp. 015–026, 2021.', link: 'https://doi.org/10.14445/22315381/IJET-V69I3P103' },
          { num: 7, text: 'N. Kumar and R. Sharma, “IoT-Based Smart Parking System Using Cloud and Mobile Application,” IEEE Access, vol. 12, no. 8, pp. 10987–10995, 2023.', link: 'https://doi.org/10.1109/ACCESS.2023.1098795' },
        ],
      },
    ],
  },
]

export const TOTAL_PAGES = 25

export interface StudentRecord {
  studentName: string
  rollNumber: string
  coAuthor1: string
  coAuthor1Roll: string
  coAuthor2: string
  coAuthor2Roll: string
  projectTitle: string
  degree: string
  department: string
  college: string
  university: string
  guide: string
  coordinator: string
  hod: string
  principal: string
  academicYear: string
  semester: string
  batch: string
  date: string
  place: string
}

export const DEFAULT_RECORDS: StudentRecord[] = [
  {
    studentName: 'Aadesh Bhamare',
    rollNumber: '04',
    coAuthor1: 'Vikrant Borse',
    coAuthor1Roll: '08',
    coAuthor2: 'Shravan Kanade',
    coAuthor2Roll: '22',
    projectTitle: 'The Ultimate Smart Parking Token System',
    degree: 'BACHELOR OF ENGINEERING (INFORMATION TECHNOLOGY)',
    department: 'DEPARTMENT OF INFORMATION TECHNOLOGY',
    college: 'TRINITY ACADEMY OF ENGINEERING',
    university: 'SAVITRIBAI PHULE PUNE UNIVERSITY (SPPU)',
    guide: 'Mrs. Shweta Joshi',
    coordinator: 'Mrs. Shweta.A.Joshi',
    hod: 'Mrs. P.R. Patil',
    principal: 'Dr R.J. Patil',
    academicYear: '2025-26',
    semester: 'SEMESTER III',
    batch: '2025',
    date: '15/10/2025',
    place: 'Pune',
  },
  {
    studentName: 'Vikrant Borse',
    rollNumber: '08',
    coAuthor1: 'Aadesh Bhamare',
    coAuthor1Roll: '04',
    coAuthor2: 'Shravan Kanade',
    coAuthor2Roll: '22',
    projectTitle: 'The Ultimate Smart Parking Token System',
    degree: 'BACHELOR OF ENGINEERING (INFORMATION TECHNOLOGY)',
    department: 'DEPARTMENT OF INFORMATION TECHNOLOGY',
    college: 'TRINITY ACADEMY OF ENGINEERING',
    university: 'SAVITRIBAI PHULE PUNE UNIVERSITY (SPPU)',
    guide: 'Mrs. Shweta Joshi',
    coordinator: 'Mrs. Shweta.A.Joshi',
    hod: 'Mrs. P.R. Patil',
    principal: 'Dr R.J. Patil',
    academicYear: '2025-26',
    semester: 'SEMESTER III',
    batch: '2025',
    date: '15/10/2025',
    place: 'Pune',
  },
  {
    studentName: 'Shravan Kanade',
    rollNumber: '22',
    coAuthor1: 'Aadesh Bhamare',
    coAuthor1Roll: '04',
    coAuthor2: 'Vikrant Borse',
    coAuthor2Roll: '08',
    projectTitle: 'The Ultimate Smart Parking Token System',
    degree: 'BACHELOR OF ENGINEERING (INFORMATION TECHNOLOGY)',
    department: 'DEPARTMENT OF INFORMATION TECHNOLOGY',
    college: 'TRINITY ACADEMY OF ENGINEERING',
    university: 'SAVITRIBAI PHULE PUNE UNIVERSITY (SPPU)',
    guide: 'Mrs. Shweta Joshi',
    coordinator: 'Mrs. Shweta.A.Joshi',
    hod: 'Mrs. P.R. Patil',
    principal: 'Dr R.J. Patil',
    academicYear: '2025-26',
    semester: 'SEMESTER III',
    batch: '2025',
    date: '15/10/2025',
    place: 'Pune',
  },
  {
    studentName: 'Rahul Patil',
    rollNumber: '12',
    coAuthor1: 'Aadesh Bhamare',
    coAuthor1Roll: '04',
    coAuthor2: 'Vikrant Borse',
    coAuthor2Roll: '08',
    projectTitle: 'The Ultimate Smart Parking Token System',
    degree: 'BACHELOR OF ENGINEERING (INFORMATION TECHNOLOGY)',
    department: 'DEPARTMENT OF INFORMATION TECHNOLOGY',
    college: 'TRINITY ACADEMY OF ENGINEERING',
    university: 'SAVITRIBAI PHULE PUNE UNIVERSITY (SPPU)',
    guide: 'Mrs. Shweta Joshi',
    coordinator: 'Mrs. Shweta.A.Joshi',
    hod: 'Mrs. P.R. Patil',
    principal: 'Dr R.J. Patil',
    academicYear: '2025-26',
    semester: 'SEMESTER III',
    batch: '2025',
    date: '15/10/2025',
    place: 'Pune',
  },
]

export type JobStatus = 'queued' | 'processing' | 'complete' | 'failed' | 'review'

export interface GeneratedDoc {
  id: string
  name: string
  record: StudentRecord
  pages: number
  status: JobStatus
  sizeKB: number
  createdAt: string
}

// ── Dashboard / global lists ────────────────────────────────────────────────

export interface DocumentRow {
  id: string
  name: string
  type: string
  modified: string
  status: 'Draft' | 'Final' | 'In Review' | 'Generated'
  aiStatus: 'Analyzed' | 'Analyzing' | 'Queued' | '—'
  pages: number
  project: string
}

export const DOCUMENTS: DocumentRow[] = []

export interface ProjectRow {
  id: string
  name: string
  docs: number
  members: number
  updated: string
  progress: number
  color: string
}

export const PROJECTS: ProjectRow[] = []

export interface TemplateRow {
  id: string
  name: string
  category: string
  fields: number
  used: number
  engine: string
}

export const TEMPLATES: TemplateRow[] = [
  { id: 't1', name: 'College Project Report', category: 'Academic', fields: 12, used: 248, engine: 'DOCX' },
  { id: 't2', name: 'IEEE Research Paper', category: 'Research Paper', fields: 8, used: 131, engine: 'LaTeX' },
  { id: 't3', name: 'PG Thesis (University)', category: 'Thesis', fields: 16, used: 87, engine: 'LaTeX' },
  { id: 't4', name: 'Lab Assignment', category: 'Assignment', fields: 6, used: 412, engine: 'Markdown' },
  { id: 't5', name: 'Modern Resume', category: 'Resume', fields: 14, used: 356, engine: 'Typst' },
  { id: 't6', name: 'Business Proposal', category: 'Business', fields: 10, used: 64, engine: 'Quarto' },
  { id: 't7', name: 'Company Profile', category: 'Business', fields: 9, used: 41, engine: 'HTML/CSS' },
  { id: 't8', name: 'Completion Certificate', category: 'Certificate', fields: 5, used: 1024, engine: 'HTML/CSS' },
  { id: 't9', name: 'Internship Letter', category: 'Business', fields: 7, used: 93, engine: 'DOCX' },
]

export const TEMPLATE_CATEGORIES = [
  'All', 'Academic', 'Thesis', 'Research Paper', 'Assignment', 'Resume', 'Business', 'Certificate', 'Custom',
]

export interface ActivityItem {
  id: string
  icon: 'analyze' | 'generate' | 'validate' | 'certificate' | 'edit' | 'export'
  text: string
  time: string
}

export const INITIAL_ACTIVITY: ActivityItem[] = [
  { id: 'a1', icon: 'validate', text: 'System ready: AI Document Engineering & Certificate Studio online', time: 'Just now' },
  { id: 'a2', icon: 'certificate', text: 'Canvas engine initialized with 0% layout distortion guarantee', time: '5 min ago' },
]

export interface HistoryItem {
  id: string
  action: string
  target: string
  user: string
  time: string
  kind: 'AI Action' | 'Version' | 'Generation' | 'Edit' | 'Export' | 'Validation' | 'Bulk Job'
  restorable: boolean
}

export const HISTORY: HistoryItem[] = [
  { id: 'h1', action: 'System initialized', target: 'Universal Document & Certificate Studio', user: 'System', time: 'Just now', kind: 'AI Action', restorable: false },
]

export interface ResearchDoc {
  id: string
  title: string
  authors: string
  year: number
  chunks: number
  status: 'Indexed' | 'Indexing'
}

export const RESEARCH_DOCS: ResearchDoc[] = [
  { id: 'r1', title: 'A Survey of Phishing Detection Techniques', authors: 'Gupta et al.', year: 2023, chunks: 214, status: 'Indexed' },
  { id: 'r2', title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', year: 2019, chunks: 388, status: 'Indexed' },
  { id: 'r3', title: 'Email Forensics: Header Analysis at Scale', authors: 'Patil & Deshmukh', year: 2024, chunks: 96, status: 'Indexed' },
  { id: 'r4', title: 'Adversarial Attacks on Text Classifiers', authors: 'Zhang et al.', year: 2022, chunks: 167, status: 'Indexing' },
]

export const CITATION_STYLES = ['IEEE', 'APA', 'MLA', 'Harvard', 'Chicago'] as const

// ── Certificate automation ──────────────────────────────────────────────────

export interface CertRecord {
  name: string
  college: string
  achievement: string
  certNumber: string
  date: string
  rank: string
  email: string
}

export interface CertTemplate {
  id: string
  name: string
  category: string
  badge: string
  primaryColor: string
  borderStyle: 'double' | 'classic' | 'modern' | 'gold'
  bgGradient: string
  previewThumb: string
}

export const CERT_TEMPLATES: CertTemplate[] = [
  {
    id: 'academic',
    name: 'Trinity Academic Honor',
    category: 'University & College',
    badge: 'Official SPPU',
    primaryColor: '#4f46e5',
    borderStyle: 'double',
    bgGradient: 'from-white via-indigo-50/40 to-violet-50/60',
    previewThumb: 'Academic border · Crest emblem · Dual signatories',
  },
  {
    id: 'hackathon',
    name: 'National Hackathon 2026',
    category: 'Tech & Competitions',
    badge: 'TechFest Verified',
    primaryColor: '#0284c7',
    borderStyle: 'modern',
    bgGradient: 'from-slate-900 via-indigo-950 to-slate-950 text-white',
    previewThumb: 'Cyber neon frame · QR verification · Sponsor seals',
  },
  {
    id: 'executive',
    name: 'Executive Leadership Award',
    category: 'Corporate & Industry',
    badge: 'Enterprise Gold',
    primaryColor: '#d97706',
    borderStyle: 'gold',
    bgGradient: 'from-amber-50/50 via-white to-amber-50/30',
    previewThumb: 'Gold metallic fillet · Embossed laurel · Foil stamp',
  },
  {
    id: 'research',
    name: 'IEEE Research Excellence',
    category: 'Conferences & Publications',
    badge: 'Peer-Reviewed',
    primaryColor: '#059669',
    borderStyle: 'classic',
    bgGradient: 'from-emerald-50/40 via-white to-teal-50/30',
    previewThumb: 'Serif formal layout · DOI notation · Citation link',
  },
]

export interface DetectedBoundingBox {
  id: string
  fieldKey: string
  label: string
  confidence: number
  bbox: { x: number; y: number; width: number; height: number }
  sampleText: string
  color: string
}

export const DETECTED_CERT_BOUNDING_BOXES: DetectedBoundingBox[] = [
  {
    id: 'b-inst',
    fieldKey: 'college',
    label: 'Institution / College',
    confidence: 99.4,
    bbox: { x: 15, y: 11, width: 70, height: 7 },
    sampleText: 'TRINITY ACADEMY OF ENGINEERING',
    color: '#0ea5e9',
  },
  {
    id: 'b-title',
    fieldKey: 'title',
    label: 'Certificate Header (Static)',
    confidence: 99.9,
    bbox: { x: 20, y: 20, width: 60, height: 10 },
    sampleText: 'CERTIFICATE OF ACHIEVEMENT',
    color: '#94a3b8',
  },
  {
    id: 'b-name',
    fieldKey: 'name',
    label: 'Recipient Name (Dynamic)',
    confidence: 99.7,
    bbox: { x: 12, y: 39, width: 76, height: 14 },
    sampleText: 'Aadesh Bhamare',
    color: '#6366f1',
  },
  {
    id: 'b-achieve',
    fieldKey: 'achievement',
    label: 'Achievement / Award Title',
    confidence: 98.8,
    bbox: { x: 15, y: 55, width: 70, height: 9 },
    sampleText: 'First Rank — National Hackathon 2026',
    color: '#8b5cf6',
  },
  {
    id: 'b-rank',
    fieldKey: 'rank',
    label: 'Rank / Distinction',
    confidence: 97.2,
    bbox: { x: 38, y: 65, width: 24, height: 6 },
    sampleText: 'Rank: 1st',
    color: '#ec4899',
  },
  {
    id: 'b-num',
    fieldKey: 'certNumber',
    label: 'Certificate Identifier',
    confidence: 99.5,
    bbox: { x: 6, y: 88, width: 28, height: 6 },
    sampleText: 'TRINITY-2026-001',
    color: '#f59e0b',
  },
  {
    id: 'b-date',
    fieldKey: 'date',
    label: 'Issue Date',
    confidence: 99.1,
    bbox: { x: 70, y: 88, width: 24, height: 6 },
    sampleText: 'Date: 25 May 2026',
    color: '#10b981',
  },
]

const FIRST = ['Aarav','Vivaan','Aditya','Sai','Krishna','Ishaan','Rohan','Om','Aadesh','Rahul','Ananya','Diya','Myra','Sara','Ira','Priya','Kavya','Anika','Navya','Aadhya','Vihaan','Arjun','Reyansh','Atharv','Advait','Kabir','Shaurya','Yash','Pranav','Harsh']
const LAST = ['Sharma','Patil','Jadhav','Shinde','Bhamare','Kulkarni','Deshpande','Mehta','Gupta','Iyer','Nair','Reddy','Chavan','Pawar','Bhosale','More','Kadam','Joshi','Verma','Singh']
const COLLEGES = ['Trinity College of Engineering','Pune Institute of Technology','Modern College of Arts & Science','Vishwakarma Institute','Sinhgad College of Engineering','MIT World Peace University','Fergusson College']
const ACHIEVE = ['First Rank — National Hackathon 2026','Best Project Award — Project Expo','Winner — Inter-College Coding Contest','Excellence in AI Research Symposium','First Runner-Up — TechFest Innovation Challenge','Outstanding Paper Presentation — ICONference 2026']

function seededRand(seed: number) {
  let s = seed
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
}

export function generateCertRecords(count = 5): CertRecord[] {
  const rand = seededRand(42)
  const out: CertRecord[] = []
  for (let i = 0; i < count; i++) {
    const f = FIRST[Math.floor(rand() * FIRST.length)]
    const l = LAST[Math.floor(rand() * LAST.length)]
    let name = `${f} ${l}`
    // Force a few long names to trigger adaptive fitting / manual review
    if (i === 17) name = 'Ananthakrishnan Venkatasubramanian'
    if (i === 52) name = 'Bhagyalakshmipriyadarshini Chandrasekharan'
    if (i === 63) name = 'Alexandrianathaniel Fitzwilliam-Longbottom'
    if (i === 81) name = 'Parangimalai Vijayalakshmi Shanmugasundaram'
    if (i === 5 || i === 33 || i === 70 || i === 91) name = `${name} ${LAST[Math.floor(rand() * LAST.length)]}`

    const cleanEmail = name.toLowerCase().replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.')
    out.push({
      name,
      college: COLLEGES[Math.floor(rand() * COLLEGES.length)],
      achievement: ACHIEVE[Math.floor(rand() * ACHIEVE.length)],
      certNumber: `TRINITY-2026-${String(i + 1).padStart(3, '0')}`,
      date: '25 May 2026',
      rank: ['1st', '2nd', '3rd', 'Finalist', 'Participant'][Math.floor(rand() * 5)],
      email: `${cleanEmail}@university.edu.in`,
    })
  }
  return out
}

export function parseCsvData(csvText: string): CertRecord[] {
  const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length < 2) return []

  const parseLine = (line: string): string[] => {
    const result: string[] = []
    let cur = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"') {
        inQuotes = !inQuotes
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim().replace(/^"|"$/g, ''))
        cur = ''
      } else {
        cur += c
      }
    }
    result.push(cur.trim().replace(/^"|"$/g, ''))
    return result
  }

  const headers = parseLine(lines[0]).map((h) => h.toLowerCase())

  const nameIdx = headers.findIndex((h) => h.includes('name') || h.includes('student') || h.includes('recipient'))
  const collegeIdx = headers.findIndex((h) => h.includes('college') || h.includes('inst') || h.includes('univ'))
  const achieveIdx = headers.findIndex((h) => h.includes('achieve') || h.includes('award') || h.includes('event') || h.includes('title'))
  const certIdx = headers.findIndex((h) => h.includes('cert') || h.includes('number') || h.includes('id') || h.includes('serial'))
  const dateIdx = headers.findIndex((h) => h.includes('date') || h.includes('time') || h.includes('year'))
  const rankIdx = headers.findIndex((h) => h.includes('rank') || h.includes('grade') || h.includes('score'))
  const emailIdx = headers.findIndex((h) => h.includes('email') || h.includes('mail'))

  return lines.slice(1).map((line, i) => {
    const cols = parseLine(line)
    const name = (nameIdx >= 0 && cols[nameIdx]) ? cols[nameIdx] : `Recipient ${i + 1}`
    const college = (collegeIdx >= 0 && cols[collegeIdx]) ? cols[collegeIdx] : 'Trinity Academy of Engineering'
    const achievement = (achieveIdx >= 0 && cols[achieveIdx]) ? cols[achieveIdx] : 'Certificate of Merit & Achievement'
    const certNumber = (certIdx >= 0 && cols[certIdx]) ? cols[certIdx] : `CERT-2026-${String(i + 1).padStart(3, '0')}`
    const date = (dateIdx >= 0 && cols[dateIdx]) ? cols[dateIdx] : '25 May 2026'
    const rank = (rankIdx >= 0 && cols[rankIdx]) ? cols[rankIdx] : 'Distinction'
    const email = (emailIdx >= 0 && cols[emailIdx]) ? cols[emailIdx] : `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`

    return { name, college, achievement, certNumber, date, rank, email }
  })
}

export type FitStatus = 'normal' | 'adaptive' | 'review'

export interface FitResult {
  record: CertRecord
  status: FitStatus
  chars: number
  words: number
  fontSize: number
  lines: number
  risk: number // 0..1 overflow risk
  letterSpacing?: number
}

// Name field box: 520px wide at 34px serif ≈ 28 chars per line, max 2 lines.
export function analyzeFit(records: CertRecord[]): FitResult[] {
  return records.map((record) => {
    const chars = record.name.length
    const words = record.name.split(/\s+/).length
    const capacity = 28
    let fontSize = 34
    let lines = 1
    let status: FitStatus = 'normal'
    let letterSpacing = 0

    if (chars <= capacity) {
      fontSize = 34
      lines = 1
      status = 'normal'
      letterSpacing = 0
    } else if (chars > capacity && chars <= capacity * 1.45) {
      fontSize = Math.max(24, Math.floor(34 * (capacity / chars)))
      status = 'adaptive'
      lines = 1
      letterSpacing = -0.5
    } else if (chars > capacity * 1.45 && chars <= capacity * 2.2) {
      fontSize = 26
      lines = 2
      status = 'adaptive'
      letterSpacing = 0
    } else {
      fontSize = 22
      lines = 2
      status = 'review'
      letterSpacing = -0.8
    }

    const risk = Math.min(1, chars / (capacity * 2.1))
    return { record, status, chars, words, fontSize, lines, risk, letterSpacing }
  })
}

export const CERT_FIELDS = [
  { key: 'name', label: 'Name', area: 'Center, 42% from top', color: '#6366f1' },
  { key: 'college', label: 'College', area: 'Center, 54% from top', color: '#0ea5e9' },
  { key: 'achievement', label: 'Achievement', area: 'Center, 62% from top', color: '#8b5cf6' },
  { key: 'certNumber', label: 'Certificate Number', area: 'Bottom-left', color: '#f59e0b' },
  { key: 'date', label: 'Date', area: 'Bottom-right', color: '#10b981' },
  { key: 'rank', label: 'Rank', area: 'Center, 70% from top', color: '#ec4899' },
]

// ── DocuGenius AI: Architecture & Experimental Evaluation Models ────────────

export interface TestCaseItem {
  no: number
  feature: string
  expected: string
  status?: 'Passed' | 'Verified' | 'Benchmarked'
  latency?: string
  confidence?: string
}

export const M1_TEST_CASES: TestCaseItem[] = [
  {
    no: 1,
    feature: 'Document Upload & Processing',
    expected: 'Supported formats upload successfully.',
    status: 'Verified',
    latency: '1.2s',
    confidence: '100%',
  },
  {
    no: 2,
    feature: 'AI Field Detection',
    expected: 'Relevant fields are identified accurately.',
    status: 'Verified',
    latency: '840ms',
    confidence: '98.4%',
  },
  {
    no: 3,
    feature: 'Data Mapping',
    expected: 'Excel/CSV data maps to correct fields.',
    status: 'Verified',
    latency: '310ms',
    confidence: '99.1%',
  },
  {
    no: 4,
    feature: 'Bulk Generation',
    expected: 'Multiple personalized documents are generated.',
    status: 'Verified',
    latency: '2.4s (batch of 10)',
    confidence: '100%',
  },
  {
    no: 5,
    feature: 'Validation',
    expected: 'Missing values and incorrect mappings are flagged.',
    status: 'Verified',
    latency: '450ms',
    confidence: '99.5%',
  },
  {
    no: 6,
    feature: 'Preview & Export',
    expected: 'Document formatting is preserved and export works correctly.',
    status: 'Verified',
    latency: '620ms',
    confidence: '100%',
  },
]

export const M2_TEST_CASES: TestCaseItem[] = [
  {
    no: 1,
    feature: 'Recipient Mapping',
    expected: 'Correct names and email addresses identified.',
    status: 'Verified',
    latency: '290ms',
    confidence: '99.7%',
  },
  {
    no: 2,
    feature: 'Certificate Generation',
    expected: 'Personalized certificate for each recipient.',
    status: 'Verified',
    latency: '1.8s (100 certs)',
    confidence: '100%',
  },
  {
    no: 3,
    feature: 'Email Attachment',
    expected: 'Correct certificate attached to the right email.',
    status: 'Verified',
    latency: '120ms / mail',
    confidence: '100%',
  },
  {
    no: 4,
    feature: 'Email Personalization',
    expected: 'Recipient-specific subject and message content.',
    status: 'Verified',
    latency: '85ms / mail',
    confidence: '99.8%',
  },
  {
    no: 5,
    feature: 'Approval Workflow',
    expected: 'Emails sent only after organizer approval.',
    status: 'Verified',
    latency: 'Instant gate',
    confidence: '100% Guarded',
  },
  {
    no: 6,
    feature: 'Delivery Tracking',
    expected: 'Sent / failed / pending status with timestamps.',
    status: 'Verified',
    latency: 'Real-time telemetry',
    confidence: '100% Tracked',
  },
  {
    no: 7,
    feature: 'Retry Handling',
    expected: 'Failed deliveries identified and retried where supported.',
    status: 'Verified',
    latency: 'Auto/Manual retry queue',
    confidence: '100% Resilient',
  },
]

export interface ModuleStepSpec {
  step: number
  title: string
  subtitle: string
  desc: string
  iconName: string
  badge?: string
  inputs: string[]
  outputs: string[]
}

export const M1_PIPELINE_STEPS: ModuleStepSpec[] = [
  {
    step: 1,
    title: 'Upload Document',
    subtitle: 'Multi-format ingestion',
    desc: 'Upload files in supported formats (PDF, DOCX, TXT, etc.).',
    iconName: 'UploadCloud',
    badge: 'PDF / DOCX / TXT',
    inputs: ['Document File (.pdf, .docx, .txt, .tex)'],
    outputs: ['Raw Stream & Document Metadata'],
  },
  {
    step: 2,
    title: 'Document Processing',
    subtitle: 'Layout & OCR analysis',
    desc: 'Extract text, structure and layout using OCR and document analysis.',
    iconName: 'ScanText',
    badge: 'LayoutLM + Vision',
    inputs: ['Raw Document Stream'],
    outputs: ['Extracted Text Blocks', 'Borders', 'Figures', 'Signatures'],
  },
  {
    step: 3,
    title: 'AI Field Detection',
    subtitle: 'Semantic entity extraction',
    desc: 'Identify key fields (names, dates, numbers, etc.) using AI and NLP.',
    iconName: 'ScanSearch',
    badge: 'NLP Entity Tagger',
    inputs: ['Normalized Content Stream'],
    outputs: ['Dynamic Field Keys', 'Bounding Coordinates', 'Confidence Scores'],
  },
  {
    step: 4,
    title: 'Editing & Refinement',
    subtitle: 'Natural language edits',
    desc: 'Edit manually or use AI-assisted suggestions to improve content.',
    iconName: 'PenLine',
    badge: 'Copilot Assistant',
    inputs: ['Natural Language Prompt', 'Universal Document Model'],
    outputs: ['Refined Model State', 'Updated Document Blocks'],
  },
  {
    step: 5,
    title: 'Data Mapping',
    subtitle: 'Excel/CSV column alignment',
    desc: 'Import Excel/CSV data and map columns to identified fields.',
    iconName: 'FileSpreadsheet',
    badge: 'Auto-Column Match',
    inputs: ['Excel/CSV Records', 'Detected Document Fields'],
    outputs: ['Column-to-Field Mapping Matrix', 'Sanitized Record Pool'],
  },
  {
    step: 6,
    title: 'Bulk Generation',
    subtitle: 'Multi-draft variant engine',
    desc: 'Create personalized documents for multiple recipients.',
    iconName: 'Layers3',
    badge: 'High-Throughput',
    inputs: ['Mapping Matrix', 'Master Template Model'],
    outputs: ['N Complete Distinct Documents with Formatting Intact'],
  },
  {
    step: 7,
    title: 'Validation & Preview',
    subtitle: 'Audit & quality check',
    desc: 'Check missing values, incorrect mappings and formatting issues.',
    iconName: 'ShieldCheck',
    badge: '18 Automated Rules',
    inputs: ['Generated Document Stream'],
    outputs: ['Validation Matrix', 'Quality Score', 'Auto-Correction Fixes'],
  },
  {
    step: 8,
    title: 'Download / Export',
    subtitle: 'Multi-engine delivery',
    desc: 'Get personalized documents in your preferred format (PDF / DOCX / TXT / etc.).',
    iconName: 'DownloadCloud',
    badge: 'PDF / DOCX / TXT',
    inputs: ['Validated Document Artifacts'],
    outputs: ['Downloadable ZIP Bundles', 'Individual Multi-Format Files'],
  },
]

export const M2_PIPELINE_STEPS: ModuleStepSpec[] = [
  {
    step: 1,
    title: 'Upload / Create Template',
    subtitle: 'Design or ingest certificate',
    desc: 'Upload an existing template or design a new certificate.',
    iconName: 'Award',
    badge: 'Vector & Raster',
    inputs: ['Certificate Template Canvas', 'Design Elements'],
    outputs: ['Base Template Layout', 'Visual Layers'],
  },
  {
    step: 2,
    title: 'Template Processing',
    subtitle: 'Layout decomposition',
    desc: 'Analyze layout, background and text elements.',
    iconName: 'LayoutGrid',
    badge: 'Layer Segmentation',
    inputs: ['Base Template Canvas'],
    outputs: ['Background Layer', 'Static Typography', 'Logos & Borders'],
  },
  {
    step: 3,
    title: 'AI Field Detection',
    subtitle: 'Recipient & award areas',
    desc: 'Identify recipient names, awards, dates and other details.',
    iconName: 'ScanSearch',
    badge: 'Spatial Bounding Boxes',
    inputs: ['Segmented Layers'],
    outputs: ['Detected Recipient Box', 'Award Title Area', 'Date Coordinates'],
  },
  {
    step: 4,
    title: 'Recipient Data Import',
    subtitle: 'CSV/Excel participant list',
    desc: 'Import Excel/CSV and map recipient fields to the template.',
    iconName: 'FileSpreadsheet',
    badge: 'Smart Field Match',
    inputs: ['Participant Roster (.csv, .xlsx)'],
    outputs: ['Mapped Recipient Dataset', 'Recipient Emails & Names'],
  },
  {
    step: 5,
    title: 'Personalization & Text Fitting',
    subtitle: 'Adaptive capacity analysis',
    desc: 'Insert recipient information and adjust text to fit the design and layout.',
    iconName: 'Ruler',
    badge: 'Zero-Overflow Lock',
    inputs: ['Recipient Records', 'Spatial Box Constraints'],
    outputs: ['Computed Font Sizes', 'Adaptive Letter Spacing', '2-Line Wraps'],
  },
  {
    step: 6,
    title: 'Bulk Generation',
    subtitle: 'Parallel batch rendering',
    desc: 'Generate individual certificates for all recipients.',
    iconName: 'Layers3',
    badge: '1000+ Certs in Secs',
    inputs: ['Fitted Records', 'Locked Template Canvas'],
    outputs: ['Hi-Res PDF / PNG Files', 'Numbered Certificate Series'],
  },
  {
    step: 7,
    title: 'Validation & Preview',
    subtitle: 'Pixel & metadata inspection',
    desc: 'Verify details, check alignment, missing values and layout.',
    iconName: 'ShieldCheck',
    badge: 'Visual Audit',
    inputs: ['Generated Certificate Stream'],
    outputs: ['Alignment Pass Report', 'Boundary Safe Verification'],
  },
  {
    step: 8,
    title: 'Export & Distribute',
    subtitle: 'Verified email dispatch',
    desc: 'Download as PDF/PNG, get ZIP bundle or send via email (optional).',
    iconName: 'Send',
    badge: 'Delivery Telemetry',
    inputs: ['Signed Approval Gate', 'Organizer Authorization'],
    outputs: ['PDF/PNG Downloads', 'ZIP Bundle', 'Automated Email Dispatch with Tracking'],
  },
]

export const COMMON_PLATFORM_FEATURES = [
  {
    title: 'Shared AI Core & Universal Document Model (UDM)',
    desc: 'Unified semantic AST separating document content, layout, styling, and rendering logic.',
    icon: 'BrainCircuit',
  },
  {
    title: 'Semantic Field Detection & Flexible Mapping',
    desc: 'Automated entity discovery with fuzzy column matching for any custom CSV or Excel dataset.',
    icon: 'ScanSearch',
  },
  {
    title: 'Preview, Validation & Correction',
    desc: 'Live high-fidelity preview with 18 automated compliance rules and one-click remediation.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Document / Certificate Generation & Download',
    desc: 'Multi-engine compilation producing print-ready PDFs, Word DOCX, text files, and PNG batches.',
    icon: 'DownloadCloud',
  },
  {
    title: 'History & Status Tracking (where implemented)',
    desc: 'Comprehensive audit log, delivery telemetry, retry handling, and verifiable timestamps.',
    icon: 'History',
  },
]
