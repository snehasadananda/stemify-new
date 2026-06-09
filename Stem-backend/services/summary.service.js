export const generateStudentSummary = async (data) => {

  // MOCK AI MODE
  return `
Student Progress Summary:

• Assignments submitted: ${data.assignments.submitted}/${data.assignments.total}
• Average Marks: ${data.assignments.avg_marks || 0}
• Questions Asked: ${data.chat.questions}
• Total Interactions: ${data.chat.total_messages}
• Abuse Flags: ${data.abuse.abuse_count}

Insights:
- Student shows ${
    data.chat.questions > 10 ? "high curiosity" : "low interaction"
  } in learning.
- ${
    data.assignments.avg_marks >= 7
      ? "Good conceptual understanding."
      : "Needs improvement in fundamentals."
  }
`;
};
