export const generateTeacherCode = async (TeacherModel) => {
  let code;
  let isExist = true;

  while (isExist) {
    code = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const teacher = await TeacherModel.findOne({ code });
    if (!teacher) isExist = false;
  }

  return code;
};
