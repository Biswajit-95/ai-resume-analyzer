export const parseResumeSections = (text: string) => {

    const lower = text.toLowerCase();
  
    const sections = {
      skills: "",
      experience: "",
      education: "",
      projects: "",
    };
  
    const skillIndex = lower.indexOf("skills");
    const expIndex = lower.indexOf("experience");
    const eduIndex = lower.indexOf("education");
    const projIndex = lower.indexOf("projects");
  
    if (skillIndex !== -1) {
      sections.skills = text.slice(skillIndex, expIndex || undefined);
    }
  
    if (expIndex !== -1) {
      sections.experience = text.slice(expIndex, eduIndex || undefined);
    }
  
    if (eduIndex !== -1) {
      sections.education = text.slice(eduIndex);
    }
  
    if (projIndex !== -1) {
      sections.projects = text.slice(projIndex);
    }
  
    return sections;
  };