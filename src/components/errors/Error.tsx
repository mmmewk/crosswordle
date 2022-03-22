import React, { useEffect } from 'react';
import * as Sentry from '@sentry/react';

interface Props {
  error?: any;
}

const Error: React.FC<Props> = ({ error }) => {
  const errorTitle = 'Bug:%20App%20Crashed';
  const mailHref = `mailto:matthew.crosswordle@gmail.com?subject=${errorTitle}`;
  const githubHref = `https://github.com/mmmewk/crosswordle/issues/new?title=${errorTitle}`;

  useEffect(() => {
    Sentry.showReportDialog({ eventId: error.eventId });  
  }, [error.eventId]);

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      <p className="text-xl">Oops! Something went wrong.</p>
      <img src='/crossword-jumbo.gif' className="m-3 rounded-lg drop-shadow-lg max-h-[60%]" alt="ahh gif"/>
      <p className='mt-3 p-3'>
        Try refreshing the page, or Feel free to{' '}
        <a href={mailHref} target="_blank" rel="noreferrer" className='text-indigo-400'>email me</a>{' '}
        or submit a{' '}<a href={githubHref} target="_blank" rel="noreferrer" className='text-indigo-400'>bug report</a>.
      </p>
    </div>
  );
};

export default Error;
