import React from 'react';
import styles from './ProjectDetails.module.css'; // Import your CSS module if needed

interface ProjectDetailsProps {
  projectName: string;
  projectDescription: string;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectName, projectDescription }) => {
  return (
    <div className={styles.projectDetails}>
      <h2>{projectName}</h2>
      <p>{projectDescription}</p>
      </div>


  );
};

export default ProjectDetails;
