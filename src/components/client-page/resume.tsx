// components/ResumePDF.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2 solid #2c3e50",
    paddingBottom: 15,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginTop: 8,
  },
  contactItem: {
    fontSize: 10,
    color: "#555",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: "1 solid #ecf0f1",
  },
  label: {
    fontSize: 10,
    color: "#7f8c8d",
    marginBottom: 2,
  },
  value: {
    fontSize: 11,
    color: "#2c3e50",
    marginBottom: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    width: "50%",
    paddingRight: 10,
    marginBottom: 4,
  },
  educationItem: {
    marginBottom: 10,
  },
  educationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  educationSchool: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  educationDate: {
    fontSize: 10,
    color: "#7f8c8d",
  },
  educationDetail: {
    fontSize: 10,
    color: "#555",
    marginTop: 1,
  },
  employmentItem: {
    marginBottom: 10,
  },
  employmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  employmentCompany: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  employmentDate: {
    fontSize: 10,
    color: "#7f8c8d",
  },
  employmentType: {
    fontSize: 10,
    color: "#555",
    marginTop: 1,
  },
  statusBadge: {
    fontSize: 9,
    color: "#fff",
    padding: "2 8",
    borderRadius: 12,
    alignSelf: "flex-start",
    backgroundColor: "#27ae60",
  },
  coverLetter: {
    fontSize: 10,
    color: "#2c3e50",
    lineHeight: 1.5,
  },
});

interface ResumePDFProps {
  applicant: {
    id: number;
    name: string;
    address?: string | null;
    date_of_birth?: string | null;
    gender?: string | null;
    nationality?: string | null;
    visa_type?: string | null;
    visa_expiry_date?: string | null;
    japanese_level?: string | null;
    desired_job?: string | null;
    desired_location?: string | null;
    available_from?: string | null;
    resume_file?: string | null;
    notes?: string | null;
    status?: string | null;
    placement_status?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    education?: Array<{
      id: number;
      jobseeker_id: number;
      enrollment_date?: string | null;
      graduation_date?: string | null;
      school_type?: string | null;
      school?: string | null;
      major?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    }>;
    employment_history?: Array<{
      id: number;
      jobseeker_id: number;
      start_date?: string | null;
      end_date?: string | null;
      employment_type?: string | null;
      company_name?: string | null;
      created_at?: string | null;
      updated_at?: string | null;
    }>;
  };
  applicationStatus?: string;
  coverLetter?: string | null;
}

const ResumePDF: React.FC<ResumePDFProps> = ({
  applicant,
  applicationStatus,
  coverLetter,
}) => {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{applicant.name || "Applicant"}</Text>

          <View style={styles.contactRow}>
            {applicant.address && (
              <Text style={styles.contactItem}>📍 {applicant.address}</Text>
            )}
            {applicant.nationality && (
              <Text style={styles.contactItem}>🌍 {applicant.nationality}</Text>
            )}
            {applicant.date_of_birth && (
              <Text style={styles.contactItem}>
                🎂 {formatDate(applicant.date_of_birth)}
              </Text>
            )}
            {applicant.gender && (
              <Text style={styles.contactItem}>⚤ {applicant.gender}</Text>
            )}
          </View>
        </View>

        {/* Status Badges */}
        <View style={{ marginBottom: 12, flexDirection: "row", gap: 8 }}>
          {applicationStatus && (
            <Text style={styles.statusBadge}>Status: {applicationStatus}</Text>
          )}
          {applicant.status && (
            <Text style={[styles.statusBadge, { backgroundColor: "#3498db" }]}>
              {applicant.status}
            </Text>
          )}
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.grid}>
            {applicant.japanese_level && (
              <View style={styles.gridItem}>
                <Text style={styles.label}>Japanese Level</Text>
                <Text style={styles.value}>{applicant.japanese_level}</Text>
              </View>
            )}
            {applicant.visa_type && (
              <View style={styles.gridItem}>
                <Text style={styles.label}>Visa Type</Text>
                <Text style={styles.value}>{applicant.visa_type}</Text>
              </View>
            )}
            {applicant.visa_expiry_date && (
              <View style={styles.gridItem}>
                <Text style={styles.label}>Visa Expiry</Text>
                <Text style={styles.value}>
                  {formatDate(applicant.visa_expiry_date)}
                </Text>
              </View>
            )}
            {applicant.available_from && (
              <View style={styles.gridItem}>
                <Text style={styles.label}>Available From</Text>
                <Text style={styles.value}>
                  {formatDate(applicant.available_from)}
                </Text>
              </View>
            )}
            {applicant.desired_job && (
              <View style={styles.gridItem}>
                <Text style={styles.label}>Desired Job</Text>
                <Text style={styles.value}>{applicant.desired_job}</Text>
              </View>
            )}
            {applicant.desired_location && (
              <View style={styles.gridItem}>
                <Text style={styles.label}>Desired Location</Text>
                <Text style={styles.value}>{applicant.desired_location}</Text>
              </View>
            )}
            {applicant.placement_status && (
              <View style={styles.gridItem}>
                <Text style={styles.label}>Placement Status</Text>
                <Text style={styles.value}>{applicant.placement_status}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Education */}
        {applicant.education && applicant.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {applicant.education.map((edu) => (
              <View key={edu.id} style={styles.educationItem}>
                <View style={styles.educationHeader}>
                  <Text style={styles.educationSchool}>
                    {edu.school || "School"}
                  </Text>
                  <Text style={styles.educationDate}>
                    {formatDate(edu.enrollment_date)} -{" "}
                    {formatDate(edu.graduation_date)}
                  </Text>
                </View>
                {edu.school_type && (
                  <Text style={styles.educationDetail}>
                    Type: {edu.school_type}
                  </Text>
                )}
                {edu.major && (
                  <Text style={styles.educationDetail}>Major: {edu.major}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Employment History */}
        {applicant.employment_history &&
          applicant.employment_history.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Employment History</Text>
              {applicant.employment_history.map((emp) => (
                <View key={emp.id} style={styles.employmentItem}>
                  <View style={styles.employmentHeader}>
                    <Text style={styles.employmentCompany}>
                      {emp.company_name || "Company"}
                    </Text>
                    <Text style={styles.employmentDate}>
                      {formatDate(emp.start_date)} - {formatDate(emp.end_date)}
                    </Text>
                  </View>
                  {emp.employment_type && (
                    <Text style={styles.employmentType}>
                      Type: {emp.employment_type}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

        {/* Cover Letter */}
        {coverLetter && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cover Letter</Text>
            <Text style={styles.coverLetter}>{coverLetter}</Text>
          </View>
        )}

        {/* Notes */}
        {applicant.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <Text style={styles.value}>{applicant.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumePDF;
