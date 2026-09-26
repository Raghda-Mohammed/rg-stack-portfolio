import heroImage from "@/assets/hero.jpg";
import aboutImage from "@/assets/about.jpg";
import project1Image from "@/assets/project-1.jpg";
import project2Image from "@/assets/project-2.jpg";
import project3Image from "@/assets/project-3.jpg";
import project4Image from "@/assets/project-4.jpg";
import project5Image from "@/assets/project-5.jpg";
import project6Image from "@/assets/project-6.jpg";

export const images = {
  hero: heroImage,
  about: aboutImage,
  projects: {
    project1: project1Image,
    project2: project2Image,
    project3: project3Image,
    project4: project4Image,
    project5: project5Image,
    project6: project6Image,
  },
} as const;

export default images;
