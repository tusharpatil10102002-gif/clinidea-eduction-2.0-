import React, { useEffect, useState } from 'react';
import CoursePageLayout from '../components/CoursePageLayout';
import { BASE_URL } from '../config';

const ClinicalResearchRegulatoryAffairs = () => {
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/courses/clinical-research-regulatory-affairs`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if(data && !data.error) {
           setCourseData(data);
        }
      })
      .catch(err => console.error('Error fetching course API:', err));
  }, []);

  const courseProps = {
  "seoTitle": "Clinical Research & Regulatory Affairs | Clinidea Education",
  "seoDescription": "Advance your career with our Clinical Research & Regulatory Affairs course. Master global regulatory guidelines and compliance.",
  "pageUrl": "/clinical-research-regulatory-affairs-course",
  "courseTitle": "Advanced Certification Course",
  "courseSubtitle": "Clinical Research & Regulatory Affairs",
  "courseDescription": "Navigate the complex landscape of global pharmaceutical regulations. This intensive course empowers you with the knowledge to manage NDA/ANDA submissions, ensure compliance, and bridge the gap between science and market approval.",
  "heroImage": "/Courses Images/Clinical Research & Regulatory Affairs.jpg",
  "youtubeUrl": "",
  "ctaCourseName": "Clinical Research & Regulatory Affairs",
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
          "title": "Regulatory Affairs (RA)",
          "items": [
              "Overview of global regulatory authorities (USFDA, EMA, CDSCO, ICH)",
              "Drug development lifecycle & approval pathways",
              "CTD/eCTD dossier structure & compilation",
              "IND, NDA, ANDA & ANDS submission processes",
              "Regulatory strategy planning & product registration",
              "Post-approval changes, variations & lifecycle management",
              "Labelling, packaging & artwork compliance requirements",
              "Regulatory documentation, tracking & submission management"
          ]
      }
  ]
};

  return <CoursePageLayout {...courseProps} courseData={courseData} />;
};

export default ClinicalResearchRegulatoryAffairs;
