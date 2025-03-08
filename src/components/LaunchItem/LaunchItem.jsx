import React from 'react';
import './LaunchItem.scss';

const LaunchItem = ({ launch }) => {
  const {
    mission_name,
    launch_date_utc,
    rocket,
    links,
    launch_success,
    details
  } = launch;

  const launchDate = new Date(launch_date_utc).toLocaleDateString();
  
  return (
    <div className="launch-item">
      <div className="launch-item__header">
        <div className="launch-item__mission">
          <h3>{mission_name}</h3>
          <span className={`launch-status ${launch_success ? 'success' : 'failed'}`}>
            {launch_success ? 'Success' : 'Failed'}
          </span>
        </div>
        <div className="launch-item__date">{launchDate}</div>
      </div>
      
      <div className="launch-item__content">
        <div className="launch-item__patch">
          <span className="rocket-emoji" role="img" aria-label="rocket">🚀</span>
        </div>
        
        <div className="launch-item__details">
          <p><strong>Rocket:</strong> {rocket.rocket_name}</p>
          {details && <p className="launch-item__description">{details}</p>}
          {!details && <p className="launch-item__description">No details available for this mission.</p>}
        </div>
      </div>
      
      {links.article_link && (
        <div className="launch-item__footer">
          <a 
            href={links.article_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="launch-item__link"
          >
            Read Article
          </a>
          
          {links.video_link && (
            <a 
              href={links.video_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="launch-item__link"
            >
              Watch Video
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default LaunchItem; 