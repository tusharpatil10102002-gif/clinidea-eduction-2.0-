import React, { useEffect, useState } from 'react';
import CoursePageLayout from '../components/CoursePageLayout';
import { BASE_URL } from '../config';

const ClinicalResearchDataManagement = () => {
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/courses/clinical-research-data-management`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if(data && !data.error) {
           setCourseData(data);
        }
      })
      .catch(err => console.error('Error fetching course API:', err));
  }, []);

  const courseProps = {
  "seoTitle": "Clinical Research & Data Management Course | Clinidea Education",
  "seoDescription": "Learn Clinical Research & Data Management. Join Clinidea Education for a 6-month comprehensive online certification.",
  "pageUrl": "/clinical-research-data-management-course",
  "courseTitle": "Advanced Certification Course",
  "courseSubtitle": "Clinical Research & Data Management",
  "courseDescription": "Master the art of managing critical trial data with this comprehensive program. Learn EDC systems, data validation, and query management from industry experts. Become the backbone of clinical trials by ensuring data integrity and regulatory compliance.",
  "heroImage": "/Courses Images/Clinical Research & Data Management.avif",
  "youtubeUrl": "",
  "ctaCourseName": "Clinical Research & Data Management",
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

export default ClinicalResearchDataManagement;
