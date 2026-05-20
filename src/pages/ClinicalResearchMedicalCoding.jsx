import React, { useEffect, useState } from 'react';
import CoursePageLayout from '../components/CoursePageLayout';
import { BASE_URL } from '../config';

const ClinicalResearchMedicalCoding = () => {
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/courses`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if(data && Array.isArray(data)) {
           const course = data.find(c => c.name === "Clinical Research and Medical Coding");
           if (course) setCourseData(course);
        }
      })
      .catch(err => console.error('Error fetching course API:', err));
  }, []);

  const courseProps = {
  "seoTitle": "Clinical Research & Medical Coding Course | Clinidea Education",
  "seoDescription": "Master Medical Coding and Clinical Research with our comprehensive certification program.",
  "pageUrl": "/clinical-research-medical-coding-course",
  "courseTitle": "Advanced Certification Course",
  "courseSubtitle": "Clinical Research and Medical Coding",
  "courseDescription": "Bridge the gap between healthcare and data. This unique program trains you in both the fundamentals of clinical trials and the precision of medical coding. Gain dual expertise to maximize your career opportunities in the life sciences sector.",
  "heroImage": "/Courses Images/Clinical Research and Medical Coding.jpg",
  "youtubeUrl": "",
  "ctaCourseName": "Clinical Research and Medical Coding",
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
          "title": "Medical Coding",
          "items": [
              "Introduction to medical coding in clinical research & pharmacovigilance",
              "Medical terminology standards & clinical documentation understanding",
              "Coding dictionaries: MedDRA (adverse events) & WHO Drug Dictionary (drugs)",
              "Coding of adverse events, diseases & medical history terms",
              "Concomitant medications coding & reconciliation process",
              "SAE (Serious Adverse Event) coding & consistency checks",
              "Query management & discrepancy resolution in coding activities",
              "Coding quality control (QC) & audit readiness",
              "Role of medical coding in CDM, PV & regulatory submissions",
              "Regulatory compliance & standard coding guidelines adherence"
          ]
      }
  ]
};

  return <CoursePageLayout {...courseProps} courseData={courseData} />;
};

export default ClinicalResearchMedicalCoding;
