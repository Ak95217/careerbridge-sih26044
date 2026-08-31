import React from 'react';
import { ResumeContent, ResumeTemplateId } from '../../../types';
import { ATSClassicTemplate } from './templates/ATSClassicTemplate';
import { ModernProTemplate } from './templates/ModernProTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { DeveloperTemplate } from './templates/DeveloperTemplate';

interface DocumentPreviewProps {
  content: ResumeContent;
  template: ResumeTemplateId;
  zoomLevel?: number; // e.g. 80, 90, 100
}

export const ResumeDocumentPreview: React.FC<DocumentPreviewProps> = ({
  content,
  template,
  zoomLevel = 100,
}) => {
  const renderTemplate = () => {
    switch (template) {
      case 'modern-pro':
        return <ModernProTemplate content={content} />;
      case 'minimal':
        return <MinimalTemplate content={content} />;
      case 'developer':
        return <DeveloperTemplate content={content} />;
      case 'ats-classic':
      default:
        return <ATSClassicTemplate content={content} />;
    }
  };

  const scale = zoomLevel / 100;

  return (
    <div className="w-full flex justify-center overflow-x-auto py-4 px-2 print:p-0 print:m-0 print:overflow-visible">
      <div
        id="resume-print-container"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: '210mm',
          minHeight: '297mm',
        }}
        className="bg-white text-slate-900 shadow-2xl rounded-sm border border-slate-200 print:shadow-none print:border-none print:transform-none print:w-full print:min-h-0 print:m-0 transition-transform duration-150"
      >
        {renderTemplate()}
      </div>
    </div>
  );
};
