import React, { useEffect, useState } from 'react';
import CoursePageLayout from '../components/CoursePageLayout';
import { BASE_URL } from '../config';

const ClinicalResearchCrPvDm = () => {
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/courses`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if(data && Array.isArray(data)) {
           const course = data.find(c => c.name === "Clinical Research, Pharmacovigilance & Data Management");
           if (course) setCourseData(course);
        }
      })
      .catch(err => console.error('Error fetching course API:', err));
  }, []);

  const courseProps = {
  "seoTitle": "Clinical Research, Pharmacovigilance & Data Management | Clinidea Education",
  "seoDescription": "Master Clinical Research, Pharmacovigilance & Data Management with our premium certification course.",
  "pageUrl": "/clinical-research-cr-pv-dm-course",
  "courseTitle": "Advanced Certification Course",
  "courseSubtitle": "Clinical Research, Pharmacovigilance & Data Management",
  "courseDescription": "Accelerate your healthcare career with our 6-month intensive, mentor-led program. Master real-world industry protocols through live interactive sessions, hands-on projects, and dedicated placement support. Become instantly job-ready for top-tier roles in global CROs, pharmaceutical giants, and leading hospitals.",
  "heroImage": "/Courses Images/Clinical Research, Pharmacovigilance & Data Management.jpg",
  "youtubeUrl": "",
  "ctaCourseName": "Clinical Research, Pharmacovigilance & Data Management",
  "details": {
      "duration": "6 Months Intensive Training",
      "mode": "Online (Live Interactive)",
      "eligibility": "B.Pharm, M.Pharm, PharmD, BSc, MSc, BTech/MTech (Biotech), BDS, MDS, BHMS, BAMS, MBBS & Life Science Aspirants."
  },
  "modules": [
      {
          "title": "Clinical Research",
          "items": [
              "Drug discovery process & clinical trial phases (Phase I–IV)",
              "ICH-GCP guidelines, FDA regulations & ethical compliance",
              "Clinical trial design, protocol development & amendments",
              "Essential documents: Protocol, Investigator Brochure (IB), ICF",
              "Clinical site selection, initiation & feasibility studies",
              "Trial monitoring, site management & patient recruitment",
              "Ethics committee submissions & regulatory approvals",
              "Trial documentation, TMF management & audit readiness"
          ]
      },
      {
          "title": "Pharmacovigilance",
          "items": [
              "Fundamentals of drug safety & adverse drug reactions (ADRs)",
              "Global regulatory guidelines: ICH, FDA, EMA, WHO",
              "Individual Case Safety Reports (ICSRs) processing & evaluation",
              "Narrative writing & causality assessment (WHO-UMC scale)",
              "Aggregate safety reports: PSUR, PBRER & DSUR preparation",
              "Risk management plans (RMP) & REMS implementation",
              "Signal detection, data mining & safety trend analysis",
              "PV audits, inspections & quality management systems (QMS)"
          ]
      },
      {
          "title": "Clinical Data Management (CDM)",
          "items": [
              "Clinical Data Management lifecycle & study setup",
              "Case Report Form (CRF) design & data capture systems (EDC)",
              "Data validation, discrepancy management & query resolution",
              "Edit checks, data cleaning & database integrity checks",
              "Medical coding using MedDRA & WHO Drug Dictionary",
              "SAE reconciliation & external data handling",
              "CDISC standards (SDTM, ADaM) & database lock process",
              "Regulatory compliance (21 CFR Part 11) & audit readiness"
          ]
      }
  ]
};

  return <CoursePageLayout {...courseProps} courseData={courseData} />;
};

export default ClinicalResearchCrPvDm;
