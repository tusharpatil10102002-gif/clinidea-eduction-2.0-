import React, { useEffect, useState } from 'react';
import CoursePageLayout from '../components/CoursePageLayout';
import { BASE_URL } from '../config';

const ClinicalResearchPharmacovigilance = () => {
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/courses`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if(data && Array.isArray(data)) {
           const course = data.find(c => c.name === "Clinical Research & Pharmacovigilance");
           if (course) setCourseData(course);
        }
      })
      .catch(err => console.error('Error fetching course API:', err));
  }, []);

  const courseProps = {
  "seoTitle": "Clinical Research & Pharmacovigilance Course | Clinidea Education",
  "seoDescription": "Enroll in the Clinical Research & Pharmacovigilance course. Become a drug safety expert with our industry-aligned curriculum.",
  "pageUrl": "/clinical-research-pharmacovigilance-course",
  "courseTitle": "Advanced Certification Course",
  "courseSubtitle": "Clinical Research & Pharmacovigilance",
  "courseDescription": "Step into the fast-growing field of drug safety with our specialized program. Gain hands-on expertise in adverse event reporting, signal detection, and global PV regulations through live case studies. Equip yourself with the exact skills top pharmaceutical companies demand.",
  "heroImage": "/Courses Images/Clinical Research & Pharmacovigilance.jpg",
  "youtubeUrl": "",
  "ctaCourseName": "Clinical Research & Pharmacovigilance",
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
      }
  ]
};

  return <CoursePageLayout {...courseProps} courseData={courseData} />;
};

export default ClinicalResearchPharmacovigilance;
