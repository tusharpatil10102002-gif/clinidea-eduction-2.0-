import React, { useEffect, useState } from 'react';
import CoursePageLayout from '../components/CoursePageLayout';
import { BASE_URL } from '../config';

const ClinicalResearchMedicalWriting = () => {
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/courses/clinical-research-medical-writing`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if(data && !data.error) {
           setCourseData(data);
        }
      })
      .catch(err => console.error('Error fetching course API:', err));
  }, []);

  const courseProps = {
  "seoTitle": "Clinical Research & Medical Writing Course | Clinidea Education",
  "seoDescription": "Become an expert Medical Writer with our Clinical Research & Medical Writing certification course.",
  "pageUrl": "/clinical-research-medical-writing-course",
  "courseTitle": "Advanced Certification Course",
  "courseSubtitle": "Clinical Research & Medical Writing",
  "courseDescription": "Transform complex clinical data into clear, regulatory-compliant scientific documents. Learn to draft protocols, clinical study reports, and manuscripts through hands-on practice, preparing you for a rewarding career as a professional medical writer.",
  "heroImage": "/Courses Images/Clinical Research & Medical Writing.jpg",
  "youtubeUrl": "",
  "ctaCourseName": "Clinical Research & Medical Writing",
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
          "title": "Medical Writing",
          "items": [
              "Principles of scientific writing & medical communication",
              "Literature search, referencing tools & plagiarism control",
              "Clinical trial documents: Protocol, CSR, IB, ICF writing",
              "Pharmacovigilance documents: RMP, DSUR, PBRER preparation",
              "Regulatory writing for submissions & regulatory summaries",
              "Publication writing: manuscripts, abstracts & posters",
              "Medical editing, QC process & style guide adherence",
              "Tools used in medical writing (EndNote, referencing software)"
          ]
      }
  ]
};

  return <CoursePageLayout {...courseProps} courseData={courseData} />;
};

export default ClinicalResearchMedicalWriting;
