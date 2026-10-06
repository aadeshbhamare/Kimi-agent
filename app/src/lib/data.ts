// ── Demo data layer ─────────────────────────────────────────────────────────
// Realistic seed data used throughout the platform. In production this layer
// is backed by PostgreSQL + FastAPI; the shapes below mirror that schema.

export type SectionKey =
  | 'landing' | 'dashboard' | 'documents' | 'workflow' | 'templates'
  | 'research' | 'assistant' | 'projects' | 'collaboration'
  | 'history' | 'certificates'
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

export const DOCUMENTS: DocumentRow[] = [
  { id: 'd1', name: 'Final Year Project Report — MailTrace AI', type: 'DOCX', modified: '2 hours ago', status: 'In Review', aiStatus: 'Analyzed', pages: 50, project: 'FYP MailTrace AI' },
  { id: 'd2', name: 'Research Paper — Phishing Detection Survey', type: 'PDF', modified: 'Yesterday', status: 'Final', aiStatus: 'Analyzed', pages: 12, project: 'FYP MailTrace AI' },
  { id: 'd3', name: 'Thesis — Adaptive Document Layouts', type: 'LaTeX', modified: '2 days ago', status: 'Draft', aiStatus: 'Analyzed', pages: 88, project: 'PG Thesis' },
  { id: 'd4', name: 'Assignment 4 — Operating Systems', type: 'Markdown', modified: '3 days ago', status: 'Final', aiStatus: 'Analyzed', pages: 6, project: 'Coursework' },
  { id: 'd5', name: 'Resume — Aadesh Bhamare', type: 'Typst', modified: '4 days ago', status: 'Final', aiStatus: 'Analyzed', pages: 2, project: 'Placement' },
  { id: 'd6', name: 'Internship Completion Letter', type: 'DOCX', modified: '5 days ago', status: 'Generated', aiStatus: 'Analyzed', pages: 1, project: 'Placement' },
  { id: 'd7', name: 'Lab Manual — Machine Learning', type: 'PDF', modified: '1 week ago', status: 'Draft', aiStatus: 'Queued', pages: 120, project: 'Coursework' },
  { id: 'd8', name: 'Proposal — Smart Campus Initiative', type: 'DOCX', modified: '1 week ago', status: 'In Review', aiStatus: 'Analyzing', pages: 18, project: 'Admin' },
]

export interface ProjectRow {
  id: string
  name: string
  docs: number
  members: number
  updated: string
  progress: number
  color: string
}

export const PROJECTS: ProjectRow[] = [
  { id: 'p1', name: 'Final Year Project — MailTrace AI', docs: 14, members: 4, updated: '2 hours ago', progress: 78, color: '#6366f1' },
  { id: 'p2', name: 'PG Thesis — Adaptive Layouts', docs: 6, members: 2, updated: '2 days ago', progress: 41, color: '#8b5cf6' },
  { id: 'p3', name: 'Coursework — Semester 8', docs: 9, members: 1, updated: '3 days ago', progress: 62, color: '#0ea5e9' },
  { id: 'p4', name: 'Placement Documents', docs: 5, members: 1, updated: '4 days ago', progress: 90, color: '#10b981' },
]

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
  { id: 'a1', icon: 'validate', text: 'AI validation completed — Final Year Project Report (2 warnings)', time: '18 min ago' },
  { id: 'a2', icon: 'generate', text: '4 personalized drafts generated from master document', time: '26 min ago' },
  { id: 'a3', icon: 'analyze', text: 'Document analyzed — 12 fields, 8 tables, 14 images detected', time: '41 min ago' },
  { id: 'a4', icon: 'certificate', text: 'Certificate batch generated — 100 certificates (TRINITY-2026)', time: '1 hour ago' },
  { id: 'a5', icon: 'edit', text: 'AI edit applied — “Convert references to IEEE”', time: '2 hours ago' },
  { id: 'a6', icon: 'export', text: 'Exported Research Paper — Phishing Detection Survey (PDF)', time: 'Yesterday' },
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
  { id: 'h1', action: 'AI validation run', target: 'Final Year Project Report', user: 'You', time: '18 min ago', kind: 'Validation', restorable: false },
  { id: 'h2', action: 'Generated 4 drafts', target: 'Student Name personalization', user: 'You', time: '26 min ago', kind: 'Generation', restorable: true },
  { id: 'h3', action: 'Version v14 saved', target: 'Final Year Project Report', user: 'You', time: '40 min ago', kind: 'Version', restorable: true },
  { id: 'h4', action: 'AI edit: headings bold', target: 'Chapter 1–7', user: 'You', time: '1 hour ago', kind: 'AI Action', restorable: true },
  { id: 'h5', action: 'Bulk certificate job', target: 'TRINITY-2026 batch (100)', user: 'You', time: '1 hour ago', kind: 'Bulk Job', restorable: true },
  { id: 'h6', action: 'Version v13 saved', target: 'Final Year Project Report', user: 'Rahul Patil', time: '3 hours ago', kind: 'Version', restorable: true },
  { id: 'h7', action: 'Exported PDF', target: 'Research Paper — Phishing Detection', user: 'You', time: 'Yesterday', kind: 'Export', restorable: false },
  { id: 'h8', action: 'Comment resolved', target: 'Abstract paragraph 2', user: 'Prof. S. Kulkarni', time: 'Yesterday', kind: 'Edit', restorable: false },
  { id: 'h9', action: 'Version v12 saved', target: 'Thesis — Adaptive Layouts', user: 'You', time: '2 days ago', kind: 'Version', restorable: true },
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
}

const FIRST = ['Aarav','Vivaan','Aditya','Sai','Krishna','Ishaan','Rohan','Om','Aadesh','Rahul','Ananya','Diya','Myra','Sara','Ira','Priya','Kavya','Anika','Navya','Aadhya','Vihaan','Arjun','Reyansh','Atharv','Advait','Kabir','Shaurya','Yash','Pranav','Harsh']
const LAST = ['Sharma','Patil','Jadhav','Shinde','Bhamare','Kulkarni','Deshpande','Mehta','Gupta','Iyer','Nair','Reddy','Chavan','Pawar','Bhosale','More','Kadam','Joshi','Verma','Singh']
const COLLEGES = ['Trinity College of Engineering','Pune Institute of Technology','Modern College of Arts & Science','Vishwakarma Institute','Sinhgad College of Engineering','MIT World Peace University','Fergusson College']
const ACHIEVE = ['First Rank — National Hackathon 2026','Best Project Award — Project Expo','Winner — Inter-College Coding Contest','Excellence in AI Research Symposium','First Runner-Up — TechFest Innovation Challenge','Outstanding Paper Presentation — ICONference 2026']

function seededRand(seed: number) {
  let s = seed
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
}

export function generateCertRecords(count = 100): CertRecord[] {
  const rand = seededRand(42)
  const out: CertRecord[] = []
  for (let i = 0; i < count; i++) {
    let name = `${FIRST[Math.floor(rand() * FIRST.length)]} ${LAST[Math.floor(rand() * LAST.length)]}`
    // Force a few long names to trigger adaptive fitting / manual review
    if (i === 17) name = 'Ananthakrishnan Venkatasubramanian'
    if (i === 52) name = 'Bhagyalakshmipriyadarshini Chandrasekharan'
    if (i === 63) name = 'Alexandrianathaniel Fitzwilliam-Longbottom'
    if (i === 81) name = 'Parangimalai Vijayalakshmi Shanmugasundaram'
    if (i === 5 || i === 33 || i === 70 || i === 91) name = `${name} ${LAST[Math.floor(rand() * LAST.length)]}`
    out.push({
      name,
      college: COLLEGES[Math.floor(rand() * COLLEGES.length)],
      achievement: ACHIEVE[Math.floor(rand() * ACHIEVE.length)],
      certNumber: `TRINITY-2026-${String(i + 1).padStart(3, '0')}`,
      date: '25 May 2026',
      rank: ['1st', '2nd', '3rd', 'Finalist', 'Participant'][Math.floor(rand() * 5)],
    })
  }
  return out
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
    if (chars > capacity && chars <= capacity * 1.5) {
      fontSize = Math.max(24, Math.floor(34 * (capacity / chars)))
      status = 'adaptive'
      lines = 1
    } else if (chars > capacity * 1.5 && chars <= capacity * 2) {
      fontSize = 26
      lines = 2
      status = 'adaptive'
    } else if (chars > capacity * 2) {
      fontSize = 24
      lines = 2
      status = 'review'
    }
    const risk = Math.min(1, chars / (capacity * 2.2))
    return { record, status, chars, words, fontSize, lines, risk }
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
