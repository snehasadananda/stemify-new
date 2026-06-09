export const canResetPassword = (actorRole, targetRole) => {

  // 1. Nobody can touch SUPER_ADMIN
  if (targetRole === "SUPER_ADMIN") {
    return false;
  }

  const rules = {

    SUPER_ADMIN: [
      "SUB_ADMIN","MARKETING","ACCOUNTS",
      "SUPPORT","SCHOOL_ADMIN","STUDENT","TEACHER","PARENT"
    ],

    SUB_ADMIN: [
      "MARKETING","ACCOUNTS","SUPPORT",
      "SCHOOL_ADMIN","STUDENT","TEACHER","PARENT"
    ],

    SUPPORT: [
      "SCHOOL_ADMIN","STUDENT","TEACHER","PARENT"
    ],

    SCHOOL_ADMIN: [
      "STUDENT","TEACHER","PARENT"
    ]
  };

  return rules[actorRole]?.includes(targetRole) || false;
};
